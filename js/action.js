"use strict";

(function () {

  //Create Tool Option
  var createToolOptions = function () {
    //tool options
    if ($("#tool-option").length != 0) {
      $("#tool-option").remove();
    }
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

    //Clear Button
    $("#tool-option").append("<img id='clear-btn' title='Clear Page' src='" + chrome.runtime.getURL("images/clear.png") + "'/>");
    $("#clear-btn").click(clearPage);

    //Highlight Button
    $("#tool-option").append("<img id='highlight-btn' title='Highlight Text' src='" + chrome.runtime.getURL("images/highlight.png") + "'/>");
    $("#highlight-btn").click(highlightText);

    //Speak Button
    $("#tool-option").append("<img id='speak-btn' title='Speak Text' src='" + chrome.runtime.getURL("images/speak.png") + "'/>");
    $("#speak-btn").click(speakText);

    //Save for later Button
    $("#tool-option").append("<img id='save-btn' title='Save for Later' src='" + chrome.runtime.getURL("images/save.png") + "'/>");
    $("#save-btn").click(saveLinks);

    //Save as PDF Button
    $("#tool-option").append("<img id='pdf-btn' title='Save as PDF' src='" + chrome.runtime.getURL("images/pdf.png") + "'/>");
    $("#pdf-btn").click(saveAsPDF);

    //Settings Button
    $("#tool-option").append("<img id='option-btn' title='Settings' src='" + chrome.runtime.getURL("images/option.png") + "'/>");
    $("#option-btn").click(openSettings);

    //Help Button
    $("#tool-option").append("<img id='help-btn' title='Help' src='" + chrome.runtime.getURL("images/help.png") + "'/>");
    $("#help-btn").click(openHelp);

    $("#edit-btn, #clear-btn, #highlight-btn, #speak-btn, #save-btn, #pdf-btn, #option-btn, #help-btn").css({
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
    ga("send", "event", "Edit Mode", "Clicked", "Main Button", "");
    var editMode = true;
    if ($("#help-mode").css("opacity") == 1) {
      $("#help-mode").css({
        opacity: 0,
        zIndex: -20
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
        backgroundColor: "#333",
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
    $("a").each(function() {
      //$(this).preventDefault();
      $(this).addClass("link-disabled");
    });
    
/*     $("link, nav, img").each(function() {
      $(this).click(function (e) {
        e.preventDefault();
      });
    }); */

    // Click an element in edit mode
    $(document).click(function (event) {
      if (editMode) {
        if (
          event.target.id === "tool-option" ||
          event.target.id === "edit-btn" ||
          event.target.id === "highlight-btn" ||
          event.target.id === "speak-btn" ||
          event.target.id === "save-btn" ||
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
          ga(
            "send",
            "event",
            "Edit Mode",
            "Clicked",
            "Apply Changes",
            ""
          );
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
          ga(
            "send",
            "event",
            "Edit Mode",
            "Clicked",
            "Cancel Changes",
            ""
          );
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
          $("#dialog-box").remove();
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

  //Clear Page Button Function
  var clearPage = function () {
    var _settings = {};

    chrome.runtime.sendMessage({
        message: "send settings"
      },
      function (response) {
        if (response.message === "setting sent") {
          _settings = response.data;
          console.log(
            "settings available: " + JSON.stringify(_settings)
          );

          if (
            jQuery.isEmptyObject(_settings) ||
            _settings.blockElements.elements !== undefined
          ) {
            //Format Block Elements
            $(_settings.blockElements.elements.join(",")).css({
              background: "none",
              backgroundImage: "none",
              fontFamily: "sans-serif",
              border: "none",
              backgroundColor: _settings.blockElements.backgroundColor,
              color: _settings.blockElements.color
            });

            //Format Header Elements
            $(_settings.headerElements.elements.join(",")).css({
              background: "none",
              fontFamily: "sans-serif",
              color: _settings.headerElements.color
            });

            //Format Anchor Elements
            $(_settings.anchorElements.elements.join(",")).css({
              background: "none",
              backgroundImage: "none",
              fontFamily: "sans-serif",
              border: "none",
              fontWeight: "bold",
              textDecoration: "underline",
              backgroundColor: _settings.anchorElements.backgroundColor,
              color: _settings.anchorElements.color
            });

            //Format Media Elements
            $(_settings.mediaElements.elements.join(",")).css({
              display: "none"
            });

            //Format Frame Elements
            $(_settings.frameElements.elements.join(",")).css({
              display: "none"
            });

            //Format Program Elements
            $(_settings.programElements.elements.join(",")).css({
              display: "none"
            });

            createToolOptions();

            if ($("#clear-mode").length == 0) {
              //clear-mode doesn't exist
              $("body").append("<div id='clear-mode'></div>");
              $("#clear-mode").text("The page has been cleared!");
              $("#clear-mode").css({
                position: "fixed",
                top: "11%",
                left: "44.5%",
                backgroundColor: "#333",
                color: "#fff",
                padding: "10px",
                opacity: "1.0"
              });
            } else {
              //clear-mode exist
              $("#clear-mode").text("The page has been cleared!");
              $("#edit-mode").css({
                opacity: "1.0"
              });
            }

            $("#clear-mode").animate({
                opacity: "0.0"
              },
              "slow"
            );
          }
        } else {
          console.error("Settings unavailable. Try again");
          chrome.runtime.sendMessage({
              message: "settings unavailable"
            },
            function (response) {
              console.log(response.message);
            }
          );
        }
      }
    );
  };

  //Highlight Button Function
  var highlightText = function () {
    console.log("Highlight mode is on");
    ga("send", "event", "Highlight Mode", "Clicked", "Main Button", "");
    var highlightMode = true;
    if ($("#help-mode").css("opacity") == 1) {
      $("#help-mode").css({
        opacity: 0,
        zIndex: -20
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
        backgroundColor: "#333",
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
          console.log("Apply highlights on all selected elements");
          ga("send", "event", "Highlight Text", "Clicked", "Apply Changes", "");
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
          ga("send", "event", "Highlight Text", "Clicked", "Cancel Changes", "");
          $("#highlight-mode").text("Changes are cancelled!");
          $("#highlight-mode").animate({
              opacity: "0.0"
            },
            "slow"
          );
          $("#dialog-box").remove();
          $("#tool-option").show();
          highlightMode = false;
        }
      }
    });
  };

  //Speak Text Button Function
  var speakText = function () {
    console.log("Speak mode is on");
    ga("send", "event", "Speak Mode", "Clicked", "Main Button", "");

    // check if speech synthesis is supported
    if (!("speechSynthesis" in window)) {
      console.warn("browser don't support.");
      return;
    }

    var speakMode = true;
    $("#tool-option").hide();

    if ($("#speak-mode").length == 0) {
      //speak-mode doesn't exist
      $("body").append("<div id='speak-mode'></div>");
      $("#speak-mode").text("Select text to speak.");
      $("#speak-mode").css({
        position: "fixed",
        top: "11%",
        left: "44.5%",
        backgroundColor: "#333",
        color: "#fff",
        padding: "10px",
        opacity: "1.0"
      });
    } else {
      //speak-mode exist
      $("#speak-mode").text("Select text to speak.");
      $("#speak-mode").css({
        opacity: "1.0"
      });
    }

    if ($("#dialog-box").length == 0) {
      //dialog-box doesn't exist
      $("body").append(
        "<div id='dialog-box'><button id='apply-btn'>Speak</button><button id='cancel-btn'>Cancel</button><select id='speech-voices'></select></div>"
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
      $("#speech-voices").css({
        border: "0",
        background: "#0e8c41",
        color: "#fff",
        padding: "9px",
        cursor: "pointer",
        fontSize: "17px",
        borderRadius: "5px",
        marginLeft: "10px"
      });
    } else {
      if ($("#speech-voices").length == 0) {
        $("#dialog-box").append("<select id='speech-voices'></select>");
        $("#speech-voices").css({
          border: "0",
          background: "#0e8c41",
          color: "#fff",
          padding: "9px",
          cursor: "pointer",
          fontSize: "17px",
          borderRadius: "5px",
          marginLeft: "10px"
        });
        $("#apply-btn").html("Speak");
      }
      $("#dialog-box").show();
    }

    var selectedVoice = {};

    if (typeof window.speechSynthesis !== 'undefined' && window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoiceList();
    }

    function loadVoiceList() {
      var voices = window.speechSynthesis.getVoices();
      if ($("#speech-voices option").length == 0) {
        var language = window.navigator.userLanguage || window.navigator.language; //en-US
        $.each(voices, function () {
          if (this.lang === language) {
            selectedVoice = this;
            $("#speech-voices").append(
              $("<option>")
              .attr({
                dataLang: this.lang,
                "data-name": this.name,
                value: this.name
              })
              .text(this.name + "--DEFAULT")
            );
            $("#speech-voices").val(this.name);
            console.log("Default voice: " + this.name + " , language: " + this.lang);
          } else {
            $("#speech-voices").append(
              $("<option>")
              .attr({
                dataLang: this.lang,
                "data-name": this.name,
                value: this.name
              })
              .text(this.name)
            );
          }
        });

        if ($("#speech-voices option").length == 0) {
          $("#speech-voices").hide();
        } else {
          $("#speech-voices").show();
        }

        $("#speech-voices").on("change", function () {
          var newVal = this.value;
          selectedVoice = voices.find(voice => voice.name === newVal);
          console.log("New voice: " + selectedVoice.name + " , language: " + selectedVoice.lang);
        });
      }
    }

    var text2Speech = [];
    var textArray = "";
    var speaker;

    window.speechSynthesis.cancel();

    $(document).click(function (event) {
      if (speakMode) {
        if (event.target.id === "apply-btn" && event.target.innerText === "Speak") {
          //apply button clicked
          console.log("Speaks all selected text");
          if (window.speechSynthesis.speaking) {
            console.error("speechSynthesis.speaking");
            //return;
            window.speechSynthesis.cancel();
          }

          if (textArray.length != 0) {
            $.each(textArray, function () {
              speaker = new SpeechSynthesisUtterance(this.trim());
              if (!($.isEmptyObject(selectedVoice))) {
                speaker.voice = selectedVoice;
              }
              window.speechSynthesis.speak(speaker);

              speaker.onstart = function () {
                $("#speak-mode").text("Speaking ...");
                $("#apply-btn").html("Pause");
                console.log("Speech started.");
              };

              speaker.onerror = function (event) {
                $("#speak-mode").text("Error! Try again");
                $("#apply-btn").html("Speak");
                console.log("Error occured " + event.message);
              };

              speaker.onend = function (event) {
                $("#speak-mode").text("Select text to speak.");
                $("#apply-btn").html("Speak");
                console.log('Speach finished in ' + event.elapsedTime + ' seconds.');
                console.log("Speach finished.");
              };

              speaker.onpause = function (event) {
                console.log('Speech paused after ' + event.elapsedTime + ' milliseconds.');
              };

              speaker.onresume = function (event) {
                console.log('Speech resumed after ' + event.elapsedTime + ' milliseconds.');
              };
            });
          } else {
            $("#speak-mode").text("No text available. Select Text.");
            console.log("No text available");
          }
        } else if (event.target.id === "apply-btn" && event.target.innerText === "Pause") {
          console.log("Speech paused");
          window.speechSynthesis.pause();
          $("#speak-mode").text("Paused!");
          $("#apply-btn").html("Resume");
        } else if (event.target.id === "apply-btn" && event.target.innerText === "Resume") {
          console.log("Speech resumed");
          window.speechSynthesis.resume();
          $("#speak-mode").text("Speaking ...");
          $("#apply-btn").html("Pause");
        } else if (event.target.id === "cancel-btn") {
          //cancel button clicked
          console.log("Cancel speak mode");
          $("#speak-mode").text("Speak mode off!");
          $("#speak-mode").animate({
              opacity: "0.0"
            },
            "slow"
          );
          $("#apply-btn").html("Apply Changes");
          $("#speech-voices").remove();
          $("#dialog-box").hide();
          $("#tool-option").show();
          window.speechSynthesis.cancel();
          text2Speech = "";
          textArray = [];
          var selectedVoice = {};
          speakMode = false;
        } else {
          text2Speech = window.getSelection().toString();
          textArray = chuckText(text2Speech);
          console.log(textArray);
        }
      }
    });
  };

  function chuckText(text) {
    var arr = [];
    var chunkLength = 120;
    var pattRegex = new RegExp(
      "^[\\s\\S]{" +
      Math.floor(chunkLength / 2) +
      "," +
      chunkLength +
      "}[.!?,]{1}|^[\\s\\S]{1," +
      chunkLength +
      "}$|^[\\s\\S]{1," +
      chunkLength +
      "} "
    );

    text = text
      .replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi, "url") //http and other inks
      .replace(/(\/).+/g, "") //folder structure
      .replace(/(\r\n|\n|\r)/g, " ")
      .replace(/\s\s+/g, " ") //multiple spaces
      .replace(/[^\w\s.,!?]/g, ""); //all non-words & non-space
    ;
    while (text.length > 0) {
      arr.push(text.match(pattRegex)[0]);
      text = text.substring(arr[arr.length - 1].length);
    }
    return arr;
  }

  var saveLinks = function () {
    console.log("Save link mode is on");
    ga("send", "event", "Save Link", "Clicked", "Main Button", "");

    if ($("#save-mode").length == 0) {
      //save-mode doesn't exist
      $("body").append("<div id='save-mode'></div>");
      $("#save-mode").css({
        position: "fixed",
        top: "11%",
        left: "44.5%",
        backgroundColor: "#333",
        color: "#fff",
        padding: "10px",
        opacity: "0.0"
      });
    } else {
      //save-mode exist
      $("#save-mode").css({
        opacity: "0.0"
      });
    }

    chrome.runtime.sendMessage({
        message: "save link"
      },
      function (response) {
        console.log(response.message);
        if (response.message === "link saved") {
          $("#save-mode").text("Link saved.");
        } else if (response.message === "link duplicate") {
          $("#save-mode").text("Duplicate link aren't Saved.");
        } else {
          $("#save-mode").text("Error: Try again.");
        }
        $("#save-mode").animate({
            opacity: "1.0"
          },
          "slow"
        );
        $("#save-mode").animate({
            opacity: "0.0"
          },
          "slow"
        );
      }
    );
  };

  //Save as PDF Button Function
  var saveAsPDF = function () {
    console.log("Save as PDF is on");
    ga("send", "event", "Save as PDF", "Clicked", "Main Button", "");

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
    ga("send", "event", "Help Mode", "Clicked", "Main Button", "");
    if ($("#help-mode").length == 0) {
      $("body").append("<div id='help-mode'></div>");
      $("#help-mode").append(
        "<div id='cross-btn'>X</div>\
            <h1>Help Doc</h1>\
            <ul>\
              <li><b>Edit Mode: </b><p>Under edit mode one can delete unnecesary web elements. Click on a element to select it. Click again to unselect it. Once all elements are selected, click on edit icon to delete the selected elements from the webpage.</p><br></li>\
              <li><b>Highlight Mode:</b><p><br></p></li>\
              <li><b>Save as PDF:</b><p><br></p></li>\
              <li><b>All Saved Link:</b><p><button id='show-links'>Show Saved Links</button><br></p></li>\
            </ul>\
            <div id='help-triangle'></div>\
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
        zIndex: 300
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
        zIndex: 300
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
          zIndex: -20
        });
        helpMode = false;
      }
    });

    $("#show-links").click(function (event) {
      if (helpMode) {
        $("#help-mode").animate({
            opacity: "0.0"
          },
          "slow"
        );
        $("#help-mode").css({
          zIndex: -20
        });
        helpMode = false;

        chrome.runtime.sendMessage({
            message: "open links page"
          },
          function (response) {
            console.log(response.message);
          }
        );
      }
    });
  };

  var openSettings = function () {
    console.log("Setting mode is on");
    ga("send", "event", "Settings", "Clicked", "Main Button", "");

    chrome.runtime.sendMessage({
      message: "open settings"
    }, function (
      response
    ) {
      console.log(response.message);
    });
  };

  createToolOptions();

})();