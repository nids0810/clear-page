"use strict";

(function () {

    var settingsObject = {};

    chrome.runtime.sendMessage({ message: "send settings" }, function(
      response
    ) {
      console.log(response.message);
      settingsObject = response.message;

      // Block Element Action
      var blockElementsAction = function(element) {
        element.style.background = "none";
        element.style.backgroundImage = "none";
        element.style.backgroundColor = "#f9f9f9";
        element.style.fontFamily = "sans-serif";
        element.style.color = "#333";
        element.style.border = "none";
      };
      // Heading Action
      var headingAction = function(element) {
        element.style.background = "none";
        element.style.fontFamily = "sans-serif";
        element.style.color = "#333";
      };
      // Anchor Action
      var anchorAction = function(element) {
        element.style.background = "none";
        element.style.backgroundColor = "#f9f9f9";
        element.style.fontFamily = "sans-serif";
        element.style.fontWeight = "bold";
        element.style.textDecoration = "underline";
        element.style.color =
          settingsObject["anchor-elements"] === undefined
            ? "yellow"
            : settingsObject["anchor-elements"]["color"];
        element.style.border = "none";
        if (element.hasAttribute("target")) {
          element.setAttribute("target", "_blank");
        }
      };

      // Images Action
      var imgAction = function(element) {
        element.style.display = "none";
      };

      // Frame Action
      var frameAction = function(element) {
        element.style.display = "none";
      };

      // Program Action
      var programAction = function(element) {
        element.style.display = "none";
      };

      //Format the text
      var blocks = document.querySelectorAll(
        "body,div,table,tr,td,header,footer,section,aside,p,ul,li,span,main,article,details,dialog,summary,data,cite,pre,code,form"
      );
      for (var i = 0; i < blocks.length; i++) {
        blockElementsAction(blocks[i]);
      }

      var anchors = document.querySelectorAll("a,link,nav");
      for (var i = 0; i < anchors.length; i++) {
        anchorAction(anchors[i]);
      }

      var media = document.querySelectorAll(
        "img,source,picture,svg,map,area,canvas,figure,figcaption,audio,source,track,video,textarea,i"
      );
      for (var i = 0; i < media.length; i++) {
        imgAction(media[i]);
      }

      var heads = document.querySelectorAll("h1,h2,h3,h4,h5,h6");
      for (var i = 0; i < heads.length; i++) {
        headingAction(heads[i]);
      }

      var frames = document.querySelectorAll(
        "frame,frameset,noframes,iframe"
      );
      for (var i = 0; i < frames.length; i++) {
        frameAction(frames[i]);
      }

      var programs = document.querySelectorAll(
        "script,noscript,applet,embed,object,param"
      );
      for (var i = 0; i < programs.length; i++) {
        programAction(programs[i]);
      }

      //Create Tool Option
      var createToolOptions = function() {
        //Create tool options
        var toolOpt = document.createElement("div");
        toolOpt.setAttribute("id", "tool-option");
        document.body.appendChild(toolOpt);
        $("#tool-option").css({
          backgroundColor: "#F9CA0C",
          position: "fixed",
          top: "30%",
          right: "6px",
          padding: "15px 15px 0 15px",
          borderRadius: "5px 0px 0px 5px"
        });

        //Create Edit Button
        var editBtn = document.createElement("img");
        editBtn.setAttribute("id", "edit-btn");
        editBtn.setAttribute(
          "src",
          chrome.runtime.getURL("images/edit.png")
        );
        editBtn.onclick = editWebPage;
        document.getElementById("tool-option").appendChild(editBtn);
        $("#edit-btn").css({
          width: "30px",
          height: "33px",
          display: "block",
          cursor: "pointer",
          marginBottom: "15px"
        });

        //Create Highlight Button
        var highlightBtn = document.createElement("img");
        highlightBtn.setAttribute("id", "highlight-btn");
        highlightBtn.setAttribute(
          "src",
          chrome.runtime.getURL("images/highlight.png")
        );
        highlightBtn.onclick = highlightText;
        document.getElementById("tool-option").appendChild(highlightBtn);
        $("#highlight-btn").css({
          width: "30px",
          height: "30px",
          display: "block",
          cursor: "pointer",
          marginBottom: "15px"
        });

        //Create Save as PDF Button
        var pdfBtn = document.createElement("img");
        pdfBtn.setAttribute("id", "pdf-btn");
        pdfBtn.setAttribute("src", chrome.runtime.getURL("images/pdf.png"));
        pdfBtn.onclick = convertToPDF;
        document.getElementById("tool-option").appendChild(pdfBtn);
        $("#pdf-btn").css({
          width: "30px",
          height: "30px",
          display: "block",
          cursor: "pointer",
          marginBottom: "15px"
        });

        var helpBtn = document.createElement("img");
        helpBtn.setAttribute("id", "help-btn");
        helpBtn.setAttribute(
          "src",
          chrome.runtime.getURL("images/help.png")
        );
        helpBtn.onclick = openHelpOption;
        document.getElementById("tool-option").appendChild(helpBtn);
        $("#help-btn").css({
          width: "30px",
          height: "30px",
          display: "block",
          cursor: "pointer",
          marginBottom: "15px"
        });

        var optionBtn = document.createElement("img");
        optionBtn.setAttribute("id", "option-btn");
        optionBtn.setAttribute(
          "src",
          chrome.runtime.getURL("images/option.png")
        );
        optionBtn.onclick = openSettingOption;
        document.getElementById("tool-option").appendChild(optionBtn);
        $("#option-btn").css({
          width: "30px",
          height: "30px",
          display: "block",
          cursor: "pointer",
          marginBottom: "15px"
        });
      };

      //Edit Button Function
      var editMode = false;
      var editWebPage = function() {
        if (highlightMode) {
          alert("Turn off Highlight Mode!");
        } else if (!editMode) {
          console.log("Edit Mode Activated");
          editMode = true;
          $("body").append("<div id='edit-mode'></div>");
          $("#tool-option").hide();
          $("body").append("<div id='dialog-box'><button id='apply-btn'>Apply Changes</button><button id='cancel-btn'>Cancel</button></div>");
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
          //Add a new clas drives customers to engages "web-edited"
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

          /* $(".web-edited").css({
                'opacity': '1.0',
                'filter' : 'alpha(opacity=50)',
                'font-size' : 'small'
                });
                $(".web-deleted").css({
                'opacity': '0.0',
                'filter' : 'alpha(opacity=0)'
                });
                $(".link-disabled").css({
                'pointer-events' : 'none',
                'cursor' : 'default'
                }); */

          // make all links unclickable
          $("a").each(function() {
            //console.log(this);
            //$(this).preventDefault();
            $(this).addClass("link-disabled");
          });

          // Click elements in edit mode
          $(document).click(function(event) {
            if (editMode) {
              if (
                event.target.id === "tool-option" ||
                event.target.id === "edit-btn" ||
                event.target.id === "highlight-btn" ||
                event.target.id === "pdf-btn" ||
                event.target.id === "help-btn" ||
                event.target.id === "edit-mode" ||
                event.target.id === "highlight-mode" ||
                event.target.id === "help-mode"
              ) {
                //Don't delete extension elements
                //console.log($(event.target).text().trim() + " cannot be deleted");
              } else if ($(event.target).hasClass("web-edited")) {
                //Don't delete already deleted elements
                $(event.target).removeClass("web-edited");
              } else {
                //Delete other deleted elements
                console.log(
                  $(event.target)
                    .text()
                    .trim() + " deleted"
                );
                $(event.target).addClass("web-edited");
              }
            }
          });
        } else {
          console.log("Edit Mode Deactivated");
          $(".web-edited").each(function() {
            //you can use this to access the current item
            $(this)
              .removeClass("web-edited")
              .addClass("web-deleted");
          });
          $("a").each(function() {
            $(this).removeClass("link-disabled");
          });
          $("#edit-mode").text("Edit Mode Off!");
          $("#edit-mode").animate(
            {
              opacity: "0.0"
            },
            "slow"
          );
          $("#edit-btn").css("background-color", "yellow");
          //$('#edit-mode').remove();
          editMode = false;
        }
      };

      //Highlight Button Function
      var highlightMode = false;
      var highlightText = function() {
        if (editMode) {
          alert("Turn off Edit Mode!");
        } else if (!highlightMode) {
          console.log("Highlight Mode Activated");
          highlightMode = true;
          $("body").append("<div id='highlight-mode'></div>");
          $("body").append("<button id='hg-cancel-btn'>Cancel</button>");
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
          $("#hg-cancel-btn").css({
            position: "fixed",
            top: "11%",
            left: "57%",
            border: "0",
            background: "#CE5061",
            color: "#fff",
            padding: "9px",
            cursor: "pointer",
            fontSize: "17px",
            borderRadius: "5px",
          });
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
        } else {
          console.log("Highlight Mode Deactivated");
          $("<style>")
            .prop("type", "text/css")
            .html(
              "\
                        ::-moz-selection {}\
                        ::selection {}"
            )
            .appendTo("head");
          $("#highlight-mode").text("Highlight Mode Off!");
          $("#highlight-mode").animate(
            {
              opacity: "0.0"
            },
            "slow"
          );
          //$('#highlight-mode').remove();
          highlightMode = false;
        }
      };

      //Save as PDF Button Function
      var convertToPDF = function() {
        if (editMode) {
          alert("Turn off Edit Mode!");
        } else if (highlightMode) {
          alert("Turn off Highlight Mode!");
        } else {
          console.log("Save as PDF Activated");
          var mediaQueryList = window.matchMedia("print");
          mediaQueryList.addListener(function(mql) {
            if (mql.matches) {
              console.log("tool-option hidden before print dialog open");
              $("#tool-option").css("visibility", "hidden");
            } else {
              console.log("tool-option visible after print dialog closed");
              $("#tool-option").css("visibility", "visible");
            }
          });
          window.print();
        }
      };

      //Help Button Function
      var helpMode = false;
      var openHelpOption = function() {
        if (!helpMode) {
          console.log("Help Function Activated");
          helpMode = true;
          if ($("#help-mode").length) {
            $("#help-mode").css({ opacity: "1.0", "z-index": "3000" });
          } else {
            $("body").append("<div id='help-mode'></div>");
            $("#help-mode").append(
              "\<div id='cross-btn'>X</div>\
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
              right: "5.5%"
            });
            $("#help-triangle").css({
              position: "relative",
              bottom: "51px",
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
          }
        } else {
          $("#help-mode").animate(
            {
              opacity: "0.0"
            },
            "slow"
          );
          $("#help-mode").css("z-index", -10);
          helpMode = false;
        }
      };

      var openSettingOption = function() {
        console.log("Option Mode Activated");
        if (chrome.runtime.openOptionsPage) {
          chrome.runtime.openOptionsPage();
        } else {
          window.open(chrome.runtime.getURL("html/options.html"));
        }
      };

      createToolOptions();
    });
})();