"use strict";

(function () {

  chrome.runtime.sendMessage({
      message: "Extension Active?"
    },
    function (response) {
      if (response.message) {
        console.log("Extension Active? " + response.message);
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
            borderRadius: "5px 0px 0px 5px",
            zIndex: "300"
          });

          //Edit Mode Button
          $("#tool-option").append(
            "<img id='edit-btn' title='Edit Mode' src='" +
            chrome.runtime.getURL("images/edit.png") +
            "'/>"
          );
          $("#edit-btn").click(editMode);

          //Read Mode Button
          $("#tool-option").append(
            "<img id='read-btn' title='Read Mode' src='" +
            chrome.runtime.getURL("images/book.png") +
            "'/>"
          );
          $("#read-btn").click(readMode);

          //Highlight Mode Button
          $("#tool-option").append(
            "<img id='highlight-btn' title='Highlight Mode' src='" +
            chrome.runtime.getURL("images/highlight.png") +
            "'/>"
          );
          $("#highlight-btn").click(highlightMode);

          //Text to Speak Mode Button
          $("#tool-option").append(
            "<img id='tts-btn' title='Test to Speech Mode' src='" +
            chrome.runtime.getURL("images/speak.png") +
            "'/>"
          );
          $("#tts-btn").click(ttsMode);

          //Save page for later Button
          $("#tool-option").append(
            "<img id='save-btn' title='Save page for Later' src='" +
            chrome.runtime.getURL("images/save.png") +
            "'/>"
          );
          $("#save-btn").click(saveLinks);

          //Open saved links Button
          $("#tool-option").append(
            "<img id='open-btn' title='Open Saved Links' src='" +
            chrome.runtime.getURL("images/open.png") +
            "'/>"
          );
          $("#open-btn").click(openLinks);

          //Save as PDF Button
          $("#tool-option").append(
            "<img id='pdf-btn' title='Save as PDF' src='" +
            chrome.runtime.getURL("images/pdf.png") +
            "'/>"
          );
          $("#pdf-btn").click(saveAsPDF);

          //Help Button
          $("#tool-option").append(
            "<img id='help-btn' title='Help Mode' src='" +
            chrome.runtime.getURL("images/help.png") +
            "'/>"
          );
          $("#help-btn").click(openHelp);

          $(
            "#edit-btn, #read-btn, #highlight-btn, #tts-btn, #save-btn, #open-btn, #pdf-btn, #help-btn"
          ).css({
            width: "30px",
            height: "30px",
            display: "block",
            cursor: "pointer",
            marginBottom: "15px"
          });
        };

        //Edit Mode Button Function
        var editMode = function () {
          console.log("Edit mode is on");
          ga("send", "event", "Edit Mode", "Clicked", "Main Button", "");
          var editMode = true;
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
              right: "4%",
              zIndex: "300"
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
                event.target.id === "tts-btn" ||
                event.target.id === "save-btn" ||
                event.target.id === "pdf-btn" ||
                event.target.id === "dialog-box" ||
                event.target.id === "speech-voices" ||
                event.target.id === "edit-mode" ||
                event.target.id === "read-mode" ||
                event.target.id === "highlight-mode" ||
                event.target.id === "tts-mode" ||
                event.target.id === "save-mode" ||
                event.target.id === "help-mode"
              ) {
                //Don't select hidden elements
              } else if (event.target.tagName === "BODY") {
                //Can't delete body
              } else if (event.target.id === "apply-btn") {
                //apply button clicked
                console.log(
                  "Apply edits on all selected elements"
                );
                ga(
                  "send",
                  "event",
                  "Edit Mode",
                  "Clicked",
                  "Apply Changes",
                  ""
                );
                $(".web-edited").each(function() {
                  $(this)
                    .removeClass("web-edited")
                    .addClass("web-deleted");
                });
                $("a").each(function() {
                  $(this).removeClass("link-disabled");
                });
                $("#edit-mode").text("Changes are applied!");
                $("#edit-mode").animate(
                  {
                    opacity: "0.0"
                  },
                  "slow"
                );
                $("#dialog-box").hide();
                $("#tool-option").show();
                editMode = false;
              } else if (event.target.id === "cancel-btn") {
                //cancel button clicked
                console.log(
                  "Cancel edits from all selected elements"
                );
                ga(
                  "send",
                  "event",
                  "Edit Mode",
                  "Clicked",
                  "Cancel Changes",
                  ""
                );
                $(".web-edited").each(function() {
                  $(this).removeClass("web-edited");
                });
                $("a").each(function() {
                  $(this).removeClass("link-disabled");
                });
                $("#edit-mode").text("Changes are cancelled!");
                $("#edit-mode").animate(
                  {
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

        var readingMode = true;
        //Read Mode Button Function
        var readMode = function () {

          console.log('Reading Mode On');

          if (readingMode) {

            var loc = document.location;
            var uri = {
              spec: loc.href,
              host: loc.host,
              prePath: loc.protocol + "//" + loc.host,
              scheme: loc.protocol.substr(0, loc.protocol.indexOf(":")),
              pathBase: loc.protocol +
                "//" +
                loc.host +
                loc.pathname.substr(
                  0,
                  loc.pathname.lastIndexOf("/") + 1
                )
            };

            //console.log(uri);
            var article = new Readability(uri, document).parse();

            // Remove everything.
            document.body.outerHTML = "";
            // Remove alll or most stylesheets.
            document.head.outerHTML = "";

            if ($("#read-mode").length == 0) {
              //read-mode doesn't exist
              $("body").append("<div id='read-mode'></div>");
              $("#read-mode").text("Reading Mode On");
              $("#read-mode").css({
                position: "fixed",
                top: "6%",
                left: "44.5%",
                backgroundColor: "#333",
                color: "#fff",
                padding: "10px",
                opacity: "1.0",
                zIndex: "20"
              });
            } else {
              //read-mode exist
              $("#read-mode").text("Reading Mode On");
              $("#read-mode").css({
                opacity: "1.0"
              });
            }

            //create a element to display article
            $("body").append("<div id='read-text'></div>");
            $("#read-text").css({
              background: "#fff",
              color: "#000",
              padding: "10px 60px 10px 10px",
              width: "55%",
              margin: "0 auto",
              fontFamily: '"Trebuchet MS", "Lucida Grande", "Lucida Sans Unicode", "Lucida Sans", Tahoma, sans-serif',
              lineHeight: "35px"
            });

            if (article === null) {
              $("#read-text").text("<h1 id='read-text-error'>Sorry! Couldn't make this page readable</h1>");
              console.warn("Article is not readable");
            } else {
              $("#read-text").append("<h1 id='read-text-title'></h1>");
              $("#read-text").append(
                "<p id='read-text-content'></p>"
              );
              $("#read-text-title").text(article.title);
              $("#read-text-content").html(article.content);
              console.log(
                $("#read-text").html()
              );
            }
            readingMode = false;
            createToolOptions();
          } else {
            $("#read-mode").text("Reading Mode Off");
            $("#read-mode").animate({
                opacity: "0.0"
              },
              "slow"
            );
            window.location.reload();
            createToolOptions();
          }

        };

        //Highlight Button Function
        var highlightMode = function () {
          console.log("Highlight mode is on");
          ga("send", "event", "Highlight Mode", "Clicked", "Main Button", "");
          var highlightMode = true;

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
              right: "4%",
              zIndex: "300"
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

          //Add style for highlight
          /* $("<style>")
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
            .appendTo("head"); */

          $(document).click(function (event) {
            if (highlightMode) {
              if (event.target.id === "apply-btn") {
                //apply button clicked
                console.log("Apply highlights on all selected elements");
                ga(
                  "send",
                  "event",
                  "Highlight Text",
                  "Clicked",
                  "Apply Changes",
                  ""
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
                ga(
                  "send",
                  "event",
                  "Highlight Text",
                  "Clicked",
                  "Cancel Changes",
                  ""
                );
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

        //Text to Speech Mode Button Function
        var ttsMode = function () {
          console.log("Text to Speech mode is on");
          ga("send", "event", "Speak Mode", "Clicked", "Main Button", "");

          var ttsMode = true;
          var selectedVoice = {};
          $("#tool-option").hide();

          if ($("#tts-mode").length == 0) {
            //tts-mode doesn't exist
            $("body").append("<div id='tts-mode'></div>");
            $("#tts-mode").text("Select text to speech.");
            $("#tts-mode").css({
              position: "fixed",
              top: "11%",
              left: "44.5%",
              backgroundColor: "#333",
              color: "#fff",
              padding: "10px",
              opacity: "1.0"
            });
          } else {
            //tts-mode exist
            $("#tts-mode").text("Select text to speech.");
            $("#tts-mode").css({
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
              right: "4%",
              zIndex: "300"
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

          // check if speech synthesis is supported
          if (!("speechSynthesis" in window)) {
            console.warn("browser don't support.");
            $("#tts-mode").text("browser don't support Text to Speech");
          } else {
            loadVoiceList();
            if (speechSynthesis.onvoiceschanged !== undefined) {
              speechSynthesis.onvoiceschanged = loadVoiceList;
            }
          }     

          function loadVoiceList() {
            var voices = speechSynthesis.getVoices();
            if ($("#speech-voices option").length == 0) {
              var language =
                window.navigator.userLanguage || window.navigator.language; //en-US
              voices.forEach(function(voice, index) {
                if (voice.lang === language) {
                  selectedVoice = voice;
                  var option = $("<option>")
                    .val(index)
                    .html(voice.name + "--DEFAULT")
                    .prop("selected", true);
                  $("#speech-voices").append(option);
                } else {
                  var option = $("<option>")
                    .val(index)
                    .html(voice.name);
                  $("#speech-voices").append(option);
                }
              });

              if ($("#speech-voices option").length == 0) {
                $("#speech-voices").hide();
              } else {
                $("#speech-voices").show();
              }

              $("#speech-voices").on("change", function() {
                var voiceIndex = this.value;
                if (voices.length !== 0) {
                  selectedVoice = voices[voiceIndex];
                  console.log(
                    "New voice: " +
                      selectedVoice.name +
                      " , language: " +
                      selectedVoice.lang
                  );
                }             
              });

              if (
                voices.length > 0 &&
                speechSynthesis.onvoiceschanged !== undefined
              ) {
                // unregister event listener (it is fired multiple times)
                speechSynthesis.onvoiceschanged = null;
              }
            }
          }

          var text2Speech = [];
          var textArray = "";
          var speaker;

          window.speechSynthesis.cancel();

          $(document).click(function (event) {
            if (ttsMode) {
              if (
                event.target.id === "apply-btn" &&
                event.target.innerText === "Speak"
              ) {
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
                    if (!$.isEmptyObject(selectedVoice)) {
                      speaker.voice = selectedVoice;
                      console.log(
                        "Current voice: " +
                          selectedVoice.name
                      );
                    }
                    window.speechSynthesis.speak(speaker);

                    speaker.onstart = function () {
                      $("#tts-mode").text(
                        "Speaking in " +
                          speaker.voice.name +
                          " ..."
                      );
                      $("#apply-btn").html("Pause");
                      console.log("Speech started.");
                    };

                    speaker.onerror = function (event) {
                      $("#tts-mode").text("Error! Try again");
                      $("#apply-btn").html("Speak");
                      console.log("Error occured " + event.message);
                    };

                    speaker.onend = function (event) {
                      $("#tts-mode").text("Select Text to Speech.");
                      $("#apply-btn").html("Speak");
                      console.log(
                        "Speach finished in " +
                        event.elapsedTime +
                        " seconds."
                      );
                      console.log("Speach finished.");
                    };

                    speaker.onpause = function (event) {
                      console.log(
                        "Speech paused after " +
                        event.elapsedTime +
                        " milliseconds."
                      );
                    };

                    speaker.onresume = function (event) {
                      console.log(
                        "Speech resumed after " +
                        event.elapsedTime +
                        " milliseconds."
                      );
                    };
                  });
                } else {
                  $("#tts-mode").text("No text available. Select Text.");
                  console.log("No text available");
                }
              } else if (
                event.target.id === "apply-btn" &&
                event.target.innerText === "Pause"
              ) {
                console.log("Speech paused");
                window.speechSynthesis.pause();
                $("#tts-mode").text("Speech Paused");
                $("#apply-btn").html("Resume");
              } else if (
                event.target.id === "apply-btn" &&
                event.target.innerText === "Resume"
              ) {
                console.log("Speech resumed");
                window.speechSynthesis.resume();
                $("#tts-mode").text(
                  "Speaking in " + speaker.voice.name + " ..."
                );
                $("#apply-btn").html("Pause");
              } else if (event.target.id === "cancel-btn") {
                //cancel button clicked
                console.log("Cancel Text to Speech mode");
                $("#tts-mode").text("Text to Speech mode off!");
                $("#tts-mode").animate({
                    opacity: "0.0"
                  },
                  "slow"
                );
                $("#apply-btn").html("Apply Changes");
                $("#dialog-box").remove();
                $("#tool-option").show();
                window.speechSynthesis.cancel();
                text2Speech = "";
                textArray = [];
                selectedVoice = {};
                ttsMode = false;
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
            .replace(
              /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi,
              "url"
            ) //http and other inks
            .replace(/(\/).+/g, "") //folder structure
            .replace(/(\r\n|\n|\r)/g, " ")
            .replace(/\s\s+/g, " ") //multiple spaces
            .replace(/[^\w\s.,!?]/g, ""); //all non-words & non-space
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

        //Open saved linksButton Function
        var openLinks = function () {
          console.log("Setting mode is on");
          ga("send", "event", "Open Links", "Clicked", "Main Button", "");

          chrome.runtime.sendMessage({
              message: "open links page"
            },
            function (response) {
              console.log(response.message);
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
              console.log("Hide tool-option before the print dialog opened");
              $("#tool-option").hide();
            } else {
              console.log("Show tool-option after the print dialog closed");
              $("#tool-option").show();
            }
          });
          window.print();
        };

        //Help Mode Button Function
        var openHelp = function () {
          var helpMode = true;
          console.log("Help mode on");
          ga("send", "event", "Help Mode", "Clicked", "Main Button", "");
          if ($("#help-mode").length == 0) {
            $("body").append("<div id='help-mode'></div>");
            var helpHtml = (
              "<div id='cross-btn'>X</div>\
          <h1>Help Doc</h1>\
          <ul>\
            <li><b>Edit Mode: </b><p>Under Edit mode one can delete unnecesary web elements. Click on a element to select it. Click again to unselect it. Once all elements are selected, click on edit icon to delete the selected elements from the webpage.</p><br></li>\
            <li><b>Read Mode: </b><p>Under Read mode one can delete unnecesary web elements. Click on a element to select it. Click again to unselect it. Once all elements are selected, click on edit icon to delete the selected elements from the webpage.</p><br></li>\
            <li><b>Highlight Mode:</b><p><br></p></li>\
            <li><b>Text to Speak Mode:</b><p><br></p></li>\
            <li><b>Save Page for Later:</b><p><br></p></li>\
            <li><b>Open Saved Links:</b><p><br></p></li>\
            <li><b>Save as PDF:</b><p><br></p></li>\
          </ul>\
          <div id='help-triangle'></div>\
          "
            );
            $("#help-mode").append($.parseHTML(helpHtml));
            $("#help-mode").css({
              position: "fixed",
              top: "30%",
              backgroundColor: "#333",
              color: "#fff",
              padding: "10px",
              width: "48%",
              right: "5.5%",
              overflow: "auto",
              zIndex: "300"
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
              zIndex: "300"
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
                zIndex: "-20"
              });
              helpMode = false;
              console.log("Help mode off");
            }
          });
        };

        createToolOptions();
      } else {
        console.log("Extension Active? " + response.message);
        var removeExtensionElements = function() {
          console.log("Remove all extension elements.");
          //remove the tool options if available
          if ($("#tool-option").length != 0) {
            $("#tool-option").remove();
          }

          if ($("#dialog-box").length != 0) {
            $("#dialog-box").remove();
          }

          if ($("#edit-mode").length != 0) {
            $("#edit-mode").remove();
          }

          if ($("#read-mode").length != 0) {
            $("#read-mode").remove();
          }

          if ($("#highlight-mode").length != 0) {
            $("#highlight-mode").remove();
          }

          if ($("#tts-mode").length != 0) {
            $("#tts-mode").remove();
          }

          if ($("#save-mode").length != 0) {
            $("#save-mode").remove();
          }

          if ($("#help-mode").length != 0) {
            $("#help-mode").remove();
          }
        };
        removeExtensionElements();
      }
    });
})();