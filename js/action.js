"use strict";

(function () {

  var settingsObject = {};

  chrome.runtime.sendMessage({
    message: "send settings"
  }, function (response) {
     if (response.message !== "{}"){
      settingsObject = response.message;
     } else {
      console.log(response.message);
     } 

    var formatElements = function () {

      if (settingsObject["header-elements"] !== undefined) {

        //Format Block Elements
        $(settingsObject["block-elements"]["elements"].join(","))
          .css({
            background: "none",
            "background-image": "none",
            "font-family": "sans-serif",
            border: "none",
            "background-color": settingsObject["block-elements"]["background-color"],
            "color": settingsObject["block-elements"]["color"]
          });

        //Format Header Elements
        $(settingsObject["header-elements"]["elements"].join(","))
          .css({
            background: "none",
            "font-family": "sans-serif",
            color: settingsObject["header-elements"]["color"]
          });

        //Format Anchor Elements
        $(settingsObject["anchor-elements"]["elements"].join(","))
          .css({
            background: "none",
            "background-image": "none",
            "font-family": "sans-serif",
            border: "none",
            "font-weight": "bold",
            "text-decoration": "underline",
            "background-color": settingsObject["anchor-elements"]["background-color"],
            "color": settingsObject["anchor-elements"]["color"]
          });
        /* .attr("target",function(){
          this.attr("target", "_blank");
        }); */

        //Format Media Elements
        $(settingsObject["media-elements"]["elements"].join(",")).css({
          display: "none"
        });

        //Format Frame Elements
        $(settingsObject["frame-elements"]["elements"].join(",")).css({
          display: "none"
        });

        //Format Program Elements
        $(settingsObject["program-elements"]["elements"].join(",")).css({
          display: "none"
        });
      } else {
        chrome.runtime.sendMessage({
          message: "settings unavailable"
        }, function (response) {
          console.log(response.message);
        });
      }
    };

    formatElements();

    //Create Tool Option
    var createToolOptions = function () {
      //tool options
      $("body").append("<div id='tool-option'></div>");
      $("#tool-option").css({
        backgroundColor: "#F9CA0C",
        position: "fixed",
        top: "30%",
        right: "6px",
        padding: "15px 15px 0 15px",
        borderRadius: "5px 0px 0px 5px"
      });

      //Edit Button
      $("#tool-option").append("<img id='edit-btn' title='Edit Page' src='" + chrome.runtime.getURL("images/edit.png") + "'/>");
      $("#edit-btn").click(editPage);

      //Highlight Button
      $("#tool-option").append("<img id='highlight-btn' title='Highlight Text' src='" + chrome.runtime.getURL("images/highlight.png") + "'/>");
      $("#highlight-btn").click(highlightText);

      //Save as PDF Button
      $("#tool-option").append("<img id='pdf-btn' title='Save as PDF' src='" + chrome.runtime.getURL("images/pdf.png") + "'/>");
      $("#pdf-btn").click(saveAsPDF);

      //Settings Button
      $("#tool-option").append("<img id='option-btn' title='Settings' src='" + chrome.runtime.getURL("images/option.png") + "'/>");
      $("#option-btn").click(openSettings);

      //Help Button
      $("#tool-option").append("<img id='help-btn' title='Help' src='" + chrome.runtime.getURL("images/help.png") + "'/>");
      $("#help-btn").click(openHelp);

      $("#edit-btn, #highlight-btn, #pdf-btn, #option-btn, #help-btn").css({
        width: "30px",
        height: "30px",
        display: "block",
        cursor: "pointer",
        marginBottom: "15px"
      });
    };

    //Edit Page Button Function
    var editPage = function () {
      console.log("Edit mode is on");
      var editMode = true;
      if ($("#help-mode").css("opacity") == 1) {
        $("#help-mode").css({
          opacity: 0,
          "z-index": -20
        });
      }

      $("#tool-option").hide();

      if ($("#edit-mode").length == 0) {
        //edit-mode doesn't exist
        $("body").append("<div id='edit-mode'></div>");
        $("#edit-mode").text("Edit Mode On!");
        $("#edit-mode").css({
          position: "fixed",
          top: "11%",
          left: "44.5%",
          "background-color": "#333",
          color: "#fff",
          padding: "10px",
          opacity: "1.0"
        });
      } else {
        //edit-mode exist
        $("#edit-mode").text("Edit Mode On!");
        $("#edit-mode").css({
          opacity: "1.0"
        });
      }

      if ($("#dialog-box").length == 0) {
        //dialog-box doesn't exist
        $("body").append(
          "<div id='dialog-box'><button id='apply-btn'>Apply Changes</button><button id='cancel-btn'>Cancel</button></div>"
        );
        $("#dialog-box").css({
          position: "fixed",
          top: "11%",
          right: "4%"
        });
        $("#apply-btn").css({
          border: "0",
          background: "#4CA1B6",
          color: "#fff",
          padding: "9px",
          cursor: "pointer",
          fontSize: "17px",
          borderRadius: "5px"
        });
        $("#cancel-btn").css({
          border: "0",
          background: "#CE5061",
          color: "#fff",
          padding: "9px",
          cursor: "pointer",
          fontSize: "17px",
          borderRadius: "5px",
          marginLeft: "10px"
        });
      } else {
        $("#dialog-box").show();
      }

      //Add new class "web-edited", "web-deleted", "link-disabled" and push in the css
      $("<style>")
        .prop("type", "text/css")
        .html(
          "\
          .web-edited {\
              opacity: 0.4;\
              filter: alpha(opacity=50);\
              font-size: small;\
          }\
          .web-deleted {\
              opacity: 0.0;\
              filter: alpha(opacity=0);\
          }\
          .link-disabled {\
              pointer-events: none;\
              cursor: default;\
          }"
        )
        .appendTo("head");

      // transform all links as unclickable
      $("a").each(function () {
        //$(this).preventDefault();
        $(this).addClass("link-disabled");
      });

      // Click an element in edit mode
      $(document).click(function (event) {
        if (editMode) {
          if (
            event.target.id === "tool-option" ||
            event.target.id === "edit-btn" ||
            event.target.id === "highlight-btn" ||
            event.target.id === "pdf-btn" ||
            event.target.id === "option-btn" ||
            event.target.id === "edit-mode" ||
            event.target.id === "highlight-mode" ||
            event.target.id === "help-mode" ||
            event.target.id === "dialog-box"
          ) {
            //Don't select hidden elements
          } else if (event.target.tagName === "BODY") {
            //Can't delete body
          } else if (event.target.id === "apply-btn") {
            //apply button clicked
            console.log("Apply edits on all selected elements");
            $(".web-edited").each(function () {
              $(this)
                .removeClass("web-edited")
                .addClass("web-deleted");
            });
            $("a").each(function () {
              $(this).removeClass("link-disabled");
            });
            $("#edit-mode").text("Changes are applied!");
            $("#edit-mode").animate({
                opacity: "0.0"
              },
              "slow"
            );
            $("#dialog-box").hide();
            $("#tool-option").show();
            editMode = false;
          } else if (event.target.id === "cancel-btn") {
            //cancel button clicked
            console.log("Cancel edits from all selected elements");
            $(".web-edited").each(function () {
              $(this).removeClass("web-edited");
            });
            $("a").each(function () {
              $(this).removeClass("link-disabled");
            });
            $("#edit-mode").text("Changes are cancelled!");
            $("#edit-mode").animate({
                opacity: "0.0"
              },
              "slow"
            );
            $("#dialog-box").hide();
            $("#tool-option").show();
            editMode = false;
          } else if ($(event.target).hasClass("web-edited")) {
            //Unselect already selected elements
            $(event.target).removeClass("web-edited");
          } else {
            //Select any other elements
            $(event.target).addClass("web-edited");
          }
        }
      });
    };

    //Highlight Button Function
    var highlightText = function () {
      console.log("Highlight mode is on");
      var highlightMode = true;
      if ($("#help-mode").css("opacity") == 1) {
        $("#help-mode").css({
          opacity: 0,
          'z-index': -20
        });
      }

      $("#tool-option").hide();

      if ($("#highlight-mode").length == 0) {
        //highlight-mode doesn't exist
        $("body").append("<div id='highlight-mode'></div>");
        $("#highlight-mode").text("Highlight Mode On!");
        $("#highlight-mode").css({
          position: "fixed",
          top: "11%",
          left: "44.5%",
          "background-color": "#333",
          color: "#fff",
          padding: "10px",
          opacity: "1.0"
        });
      } else {
        //edit-mode exist
        $("#highlight-mode").text("Highlight Mode On!");
        $("#highlight-mode").css({
          opacity: "1.0"
        });
      }

      if ($("#dialog-box").length == 0) {
        //dialog-box doesn't exist
        $("body").append(
          "<div id='dialog-box'><button id='apply-btn'>Apply Changes</button><button id='cancel-btn'>Cancel</button></div>"
        );
        $("#dialog-box").css({
          position: "fixed",
          top: "11%",
          right: "4%"
        });
        $("#apply-btn").css({
          border: "0",
          background: "#4CA1B6",
          color: "#fff",
          padding: "9px",
          cursor: "pointer",
          fontSize: "17px",
          borderRadius: "5px"
        });
        $("#cancel-btn").css({
          border: "0",
          background: "#CE5061",
          color: "#fff",
          padding: "9px",
          cursor: "pointer",
          fontSize: "17px",
          borderRadius: "5px",
          marginLeft: "10px"
        });
      } else {
        $("#dialog-box").show();
      }

      $("<style>")
        .prop("type", "text/css")
        .html(
          "\
          ::-moz-selection {\
              color: red;\
              background: yellow;\
          }\
          ::selection {\
              color: red;\
              background: yellow;\
          }"
        )
        .appendTo("head");

      $(document).click(function (event) {
        if (highlightMode) {
          if (event.target.id === "apply-btn") {
            //apply button clicked
            console.log(
              "Apply highlights on all selected elements"
            );
            $("#highlight-mode").text("Changes are applied!");
            $("#highlight-mode").animate({
                opacity: "0.0"
              },
              "slow"
            );
            $("#dialog-box").hide();
            $("#tool-option").show();
            highlightMode = false;
          } else if (event.target.id === "cancel-btn") {
            //cancel button clicked
            console.log("Cancel highlight from all selected elements");
            $("#highlight-mode").text("Changes are cancelled!");
            $("#highlight-mode").animate({
                opacity: "0.0"
              },
              "slow"
            );
            $("#dialog-box").hide();
            $("#tool-option").show();
            highlightMode = false;
          }
        }
      });
    };

    //Save as PDF Button Function
    var saveAsPDF = function () {
      console.log("Save as PDF is on");

      if ($("#help-mode").css("opacity") == 1) {
        $("#help-mode").css({
          opacity: 0,
          "z-index": -20
        });
      }

      var mediaQueryList = window.matchMedia("print");
      mediaQueryList.addListener(function (mql) {
        if (mql.matches) {
          console.log(
            "Hide tool-option before the print dialog opened"
          );
          $("#tool-option").hide();
        } else {
          console.log("Show tool-option after the print dialog closed");
          $("#tool-option").show();
        }
      });
      window.print();
    };

    //Help Button Function
    var openHelp = function () {
      var helpMode = true;
      console.log("Help mode is on");
      if ($("#help-mode").length == 0) {
        $("body").append("<div id='help-mode'></div>");
        $("#help-mode").append(
          "<div id='cross-btn'>X</div>\
            <h1>Help Doc</h1>\
            <ul>\
              <li><b>Edit Mode: </b><p>Under edit mode one can delete unnecesary web elements. Click on a element to select it. Click again to unselect it. Once all elements are selected, click on edit icon to delete the selected elements from the webpage.</p><br></li>\
              <li><b>Highlight Mode:</b><p><br></p></li>\
              <li><b>Save as PDF:</b><p><br></p></li>\
              </ul><div id='help-triangle'></div>\
            "
        );
        $("#help-mode").css({
          position: "fixed",
          top: "30%",
          backgroundColor: "#333",
          color: "#fff",
          padding: "10px",
          width: "48%",
          right: "5.5%",
          "z-index": 300
        });
        $("#help-triangle").css({
          position: "relative",
          bottom: "0px",
          left: "34px",
          float: "right",
          borderColor: "transparent transparent transparent #333",
          borderStyle: "solid",
          borderWidth: "12px",
          height: "0px",
          width: "0px"
        });
        $("#cross-btn").css({
          background: "#fff",
          fontSize: "20px",
          color: "#000",
          position: "relative",
          float: "right",
          borderRadius: "50%",
          padding: "5px 10px",
          cursor: "pointer"
        });
      } else {
        $("#help-mode").css({
          opacity: 1,
          "z-index": 300
        });
      }

      $("#cross-btn").click(function (event) {
        if (helpMode) {
          $("#help-mode").animate({
              opacity: "0.0"
            },
            "slow"
          );
          $("#help-mode").css({
            "z-index": -20
          });
          helpMode = false;
        }
      });
    };

    var openSettings = function () {
      console.log("Setting mode is on");

      if ($("#help-mode").css("opacity") == 1) {
        $("#help-mode").css({
          opacity: 0,
          "z-index": -20
        });
      }

      chrome.runtime.sendMessage({
        message: "open settings"
      }, function (
        response
      ) {
        console.log(response.message);
      });
    };

    createToolOptions();

  });
})();