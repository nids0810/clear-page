"use strict";

(function () {

  chrome.runtime.sendMessage({
      message: "Extension Active?"
    },
    function (response) {
      if (response.message) {
        console.log("Extension Active: " + response.message);
        //Create Tool Option
        var createToolOptions = function () {
          //Tool options box
          if ($("#tool-option").length != 0) {
            $("#tool-option").remove();
          }

          $("body").append("<div id='tool-option'></div>");
          $("#tool-option").css({
            backgroundColor: "#0f999e",
            position: "fixed",
            top: "30%",
            right: "14px",
            padding: "15px 15px 0 15px",
            borderRadius: "5px 0px 0px 5px",
            zIndex: "300"
          });

          //Read Mode Button
          $("#tool-option").append(
            "<img id='read-btn' title='Read Mode' src='" + 
            chrome.runtime.getURL("images/book-white.png") + 
            "'/>");
          $("#read-btn").click(readMode);

          //Text to Speak Mode Button
          $("#tool-option").append(
            "<img id='tts-btn' title='Text to Speech Mode' src='" +
            chrome.runtime.getURL("images/speak-white.png") +
            "'/>"
          );
          $("#tts-btn").click(ttsMode);

          //Edit Mode Button
          $("#tool-option").append(
            "<img id='edit-btn' title='Edit Mode' src='" +
            chrome.runtime.getURL("images/edit-white.png") +
            "'/>"
          );
          $("#edit-btn").click(editMode);

          //Highlight Mode Button
          $("#tool-option").append(
            "<img id='highlight-btn' title='Highlight Mode' src='" +
            chrome.runtime.getURL("images/highlight-white.png") +
            "'/>"
          );
          $("#highlight-btn").click(highlightMode);

          //Save page for later Button
          $("#tool-option").append(
            "<img id='save-btn' title='Save page for Later' src='" +
            chrome.runtime.getURL("images/save-white.png") +
            "'/>"
          );
          $("#save-btn").click(saveLinks);

          //Open saved links Button
          $("#tool-option").append(
            "<img id='open-btn' title='Open Reading Queue' src='" +
            chrome.runtime.getURL("images/open-white.png") +
            "'/>"
          );
          $("#open-btn").click(openLinks);

          //Save as PDF Button
          $("#tool-option").append(
            "<img id='pdf-btn' title='Save as PDF' src='" +
            chrome.runtime.getURL("images/pdf-white.png") +
            "'/>"
          );
          $("#pdf-btn").click(saveAsPDF);

          //Help Button
          $("#tool-option").append(
            "<img id='help-btn' title='Help Mode' src='" +
            chrome.runtime.getURL("images/help-white.png") +
            "'/>"
          );
          $("#help-btn").click(openHelp);

          $("#read-btn").hover(function () {
            $(this).attr('src', chrome.runtime.getURL("images/book-green.png"));
          }, function () {
            $(this).attr('src', chrome.runtime.getURL("images/book-white.png"));
          });

          $("#tts-btn").hover(function () {
            $(this).attr('src', chrome.runtime.getURL("images/speak-green.png"));
          }, function () {
            $(this).attr('src', chrome.runtime.getURL("images/speak-white.png"));
          });

          $("#edit-btn").hover(function () {
            $(this).attr('src', chrome.runtime.getURL("images/edit-green.png"));
          }, function () {
            $(this).attr('src', chrome.runtime.getURL("images/edit-white.png"));
          });

          $("#highlight-btn").hover(function () {
            $(this).attr('src', chrome.runtime.getURL("images/highlight-green.png"));
          }, function () {
            $(this).attr('src', chrome.runtime.getURL("images/highlight-white.png"));
          });

          $("#save-btn").hover(function () {
            $(this).attr('src', chrome.runtime.getURL("images/save-green.png"));
          }, function () {
            $(this).attr('src', chrome.runtime.getURL("images/save-white.png"));
          });

          $("#open-btn").hover(function () {
            $(this).attr('src', chrome.runtime.getURL("images/open-green.png"));
          }, function () {
            $(this).attr('src', chrome.runtime.getURL("images/open-white.png"));
          });

          $("#pdf-btn").hover(function () {
            $(this).attr('src', chrome.runtime.getURL("images/pdf-green.png"));
          }, function () {
            $(this).attr('src', chrome.runtime.getURL("images/pdf-white.png"));
          });

          $("#help-btn").hover(function () {
            $(this).attr('src', chrome.runtime.getURL("images/help-green.png"));
          }, function () {
            $(this).attr('src', chrome.runtime.getURL("images/help-white.png"));
          });

          $("#read-btn, #tts-btn, #edit-btn, #highlight-btn, #save-btn, #open-btn, #pdf-btn, #help-btn").css({
            width: "30px",
            height: "30px",
            display: "block",
            cursor: "pointer",
            marginBottom: "15px"
          });
        };

        var _oldHead, _oldBody;
        var readingMode = false;
        //Read Mode Button Function
        var readMode = function () {
          console.log("Reading Mode On");
          chrome.runtime.sendMessage({ message: "open read mode" });

          if (!readingMode) {

            if ($("#help-mode").length != 0) {
              helpMode = false;
              $("#help-mode").remove();
            }
            removeExtensionElements();
            $("#read-text-domain, #read-text-words, #read-text-eta, #read-text-author").text("");

            _oldBody = document.body.innerHTML;
            _oldHead = document.head.innerHTML;

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
                ),
            };

            var wordCount = function (str) {
              var _commonWords = [
                "a", "an", "the", "am", "is", "are", "was", "have", "has", "has", "did", "do", //verbs
                "and", "or", "not", "no", //logical
                "of", "by", "for", "in", "on", "as", "to", "at", "with", //prepositions
                "i", "my", "me", "you", "we", "he", "she", "it", "her", "his" //pronouns
              ];

              str = str.replace(/[\W_]+/g, " ");
              _commonWords.forEach(function (word, index) {
                str = str.replace(
                  new RegExp("\\b(" + word + ")\\b", "gi"),
                  ""
                );
              });
              var words = str.trim().split(/\s+/g);
              var _totalWords = words.length;
              return _totalWords;
            };

            var estimatedReadingTime = function (wordCount) {
              var _wordsPerMinute = 200, //Hard coded word per mintues
                _wordsPerSecond,
                _totalReadingTimeSeconds,
                _readingTimeMinutes;
              if (wordCount > 0) {
                _wordsPerSecond = _wordsPerMinute / 60;
                _totalReadingTimeSeconds = wordCount / _wordsPerSecond;
                _readingTimeMinutes = Math.ceil(
                  _totalReadingTimeSeconds / 60
                );
                return _readingTimeMinutes;
              } else {
                return 0;
              }
            };

            //console.log(uri);
            var article = new Readability(uri, document).parse();

            // Remove alll or most stylesheets.
            //document.head.outerHTML = "";            
            document.head.innerHTML = "";

            // Remove everything.
            //document.body.outerHTML = "";
            document.body.innerHTML = "";
            $("body").css({
              margin: "0"
            });

            var s = document.createElement("script");
            s.type = "text/javascript";
            s.id = "prettify-script"
            s.src = "https://cdn.jsdelivr.net/gh/google/code-prettify@master/loader/run_prettify.js?autoload=true";
            // Use any selector
            $("head").append(s);
            
            $("<style>")
            .prop("type", "text/css")
            .prop("id", "font-style")
            .html(
              "@font-face {" +
                "font-family: 'OpenDyslexic-Regular';" +
                "src: url('" + chrome.runtime.getURL('fonts/OpenDyslexic-Regular.otf') + "');}"
            ).appendTo("head");
            
            if ($("#read-container").length == 0) {
              //read-container will replace body
              $("body").append("<div id='read-container'></div>");
              $("#read-container").css({
                width: "100%",
                background: "#111",
                color: "#333 !important",
                padding: "50px 0",
                fontFamily: "arial, sans-serif"
              });
            }

            if ($("#read-mode").length == 0) {
              //read-mode doesn't exist
              $("#read-container").append(
                "<div id='read-mode'></div>"
              );
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
              $("#read-mode").animate({ opacity: "0.0" }, 1200);
            } else {
              //read-mode exist
              $("#read-mode").text("Reading Mode On");
              $("#read-mode").css({ opacity: 1, zIndex: "20" });
              $("#read-mode").animate({ opacity: "0.0" }, 1200);
            }

            if ($("#read-option").length == 0) {
              $("#read-container").append(
                "<div id='read-option'></div>"
              );
            }
            if ($("#read-option-btn").length == 0) {
              $("#read-option").append(
                "<div id='read-option-btn'><img id='read-option-btn-icon' title='option' src='" +
                chrome.runtime.getURL("images/option-blue.png") +
                "'/></div>"
              );
            }
            $("#read-option-btn").css({
              textAlign: "right",
              width: "60%",
              margin: "0px auto",
              cursor: "pointer",
              marginBottom: "5px",
              boxSizing: "border-box"
            });
            $("#read-option-btn img").css({
              width: "25px"
            });

            var _optionClicked = false;
            $("#read-option-btn").click(function () {
              if (!_optionClicked) {
                _optionClicked = true;
                //Read Option Box
                if ($("#read-option-box").length == 0) {
                  $("#read-option").append(
                    "<div id='read-option-box'></div>"
                  );
                  $("#read-option-box").css({
                    backgroundColor: "#4A7C87",
                    color: 'white',
                    padding: "20px",
                    width: "60%",
                    margin: "0 auto",
                    fontFamily: "arial,sans-serif",
                    fontSize: "13px",
                    boxSizing: "border-box"
                  });
                } else {
                  $("#read-option-box").show();
                }

                //Font Size toggle button
                if ($("#read-font-size").length == 0) {
                  $("#read-option-box").append(
                    "<div id='read-font-size'>\
                    <Label>Text Size:</Label>\
                    <input type='radio' id='font-small' name='small' value='small'> Small\
                    <input type='radio' id='font-medium' name='medium' value='medium' checked> Medium\
                    <input type='radio' id='font-large' name='large' value='large'> Large\
                    </div>"
                  );
                }
                //Font toggle button
                if ($("#read-font-family").length == 0) {
                  $("#read-option-box").append(
                    "<div id='read-font-family'>\
                    <Label>Typography:</Label>\
                    <input type='radio' id='font-sans-serif' name='sans-serif' value='sans-serif' checked> Sans-Serif\
                    <input type='radio' id='font-verdana' name='verdana' value='Verdana'> Verdana\
                    <input type='radio' id='font-georgia' name='georgia' value='Georgia'> Georgia\
                    <input type='radio' id='font-lucida-sans' name='lucida-sans' value='Lucida Sans'> Lucida Sans\
                    <input type='radio' id='font-open-dyslexic' name='open-dyslexic' value='OpenDyslexic-Regular'> Open Dyslexic\
                    </div>"
                  );
                }
                //Color Theme toggle button
                if ($("#read-color-theme").length == 0) {
                  $("#read-option-box").append(
                    "<div id='read-color-theme'>\
                    <Label>Theme:</Label>\
                    <input type='radio' id='theme-light' name='light' value='light'> Light\
                    <input type='radio' id='theme-dark' name='dark' value='dark' checked> Dark\
                    </div>"
                  );
                }
                $("#read-font-size :input").change(function () {
                  if (this.value == "small") {
                    $("#read-text-content").css({
                      fontSize: "13px"
                    });
                    $("#read-text-words, #read-text-eta, #read-text-author, #read-text-domain").css({
                      fontSize: "12px"
                    });
                    $("#read-text-title").css({
                      fontSize: "30px",
                      lineHeight: "35px"
                    });
                  } else if (this.value == "medium") {
                    $("#read-text-content").css({
                      fontSize: "15px"
                    });
                    $("#read-text-words, #read-text-eta, #read-text-author, #read-text-domain").css({
                      fontSize: "13px"
                    });
                    $("#read-text-title").css({
                      fontSize: "32px",
                      lineHeight: "35px"
                    });
                  } else if (this.value == "large") {
                    $("#read-text-content").css({
                      fontSize: "17px"
                    });
                    $("#read-text-words, #read-text-eta, #read-text-author, #read-text-domain").css({
                      fontSize: "14px"
                    });
                    $("#read-text-title").css({
                      fontSize: "34px",
                      lineHeight: "43px"
                    });
                  }
                  $("#read-font-size")
                    .find('input[type="radio"]:not(#' + this.id + ")")
                    .prop("checked", false);
                });
                $("#read-font-family :input").change(function () {
                  console.log("New font: " + this.value);
                  $("#read-text-content, #read-text-words, #read-text-eta, #read-text-author, #read-text-domain").css({
                    fontFamily: this.value
                  });
                  $("#read-font-family")
                  .find('input[type="radio"]:not(#' + this.id + ")")
                  .prop("checked", false);
                });
                $("#read-color-theme :input").change(
                  function () {
                    if (this.value == "light") {
                      $("#read-container").css({
                        background: "#e9e9e9"
                      });
                      $("#read-text").css({
                        backgroundColor: "#fff",
                        color: "#333",
                        border: "#dbdbdb"
                      });
                      $("#read-text #read-text-content a").css({
                        color: "#333"
                      });
                      $("#read-text #read-text-content pre").css({
                        backgroundColor: "#EFF0F1"
                      });
                      $("#read-text-domain").css({
                        color: "#104b4e"
                      });
                      $("#read-text-content").css({
                        borderColor: "#eee"
                      });
                    } else if (this.value == "dark") {
                      $("#read-container").css({
                        background: "#111"
                      });
                      $("#read-text").css({
                        backgroundColor: "#222",
                        color: "#aaa",
                        border: "#222"
                      });
                      $("#read-text #read-text-content a").css({
                        color: "#aaa"
                      });
                      $("#read-text #read-text-content pre").css({
                        backgroundColor: "#ccc",
                      });
                      $("#read-text-domain").css({
                        color: "#11ABB0"
                      });
                      $("#read-text-content").css({
                        borderColor: "#444"
                      });
                    }
                    $("#read-color-theme")
                      .find('input[type="radio"]:not(#' + this.id + ")")
                      .prop("checked", false);
                  });
              } else {
                _optionClicked = false;
                $("#read-option-box").hide();
              }
            });

            //create a element to display article
            if ($("#read-text").length == 0) {
              $("#read-container").append(
                "<div id='read-text'></div>"
              );
            }
            $("#read-text").css({
              background: "#222",
              color: "#aaa",
              padding: "45px 70px",
              width: "60%",
              margin: "0 auto",
              //fontFamily: '"Trebuchet MS", "Lucida Grande", "Lucida Sans Unicode", "Lucida Sans", Tahoma, sans-serif',
              lineHeight: "28px",
              border: "1px solid #222",
              fontSize: "15px",
              boxSizing: "border-box"
            });

            if (article === null) {
              if ($("#read-text-error").length == 0) {
                $("#read-text").append(
                  "<div id='read-text-error'><img src='" +
                    chrome.runtime.getURL("icons/icon_128.png") +
                    "'/>" + "<h1>Sorry! this page is unreadable.</h1></div>"
                );
              }
              $("#read-text-error").css({
                color: "red",
                textAlign: "center"
              });
              $("#read-option").hide();
              console.warn("Article is not readable");
            } else {
              if ($("#read-text-domain").length == 0) {
                $("#read-text").append("<span id='read-text-domain'></span>");
              }
              if ($("#read-text-title").length == 0) {
                $("#read-text").append("<h1 id='read-text-title'></h1>");
              }
              if ($("#read-text-words").length == 0) {
                $("#read-text").append("<span id='read-text-words'></span>");
              }
              if ($("#read-text-eta").length == 0) {
                $("#read-text").append("<span id='read-text-eta'></span>");
              }
              if ($("#read-text-author").length == 0) {
                $("#read-text").append("<span id='read-text-author'></span>");
              }
              if ($("#read-text-content").length == 0) {
                $("#read-text").append("<p id='read-text-content'></p>");
              }

              $("#read-text-domain").text(article.uri.host);
              $("#read-text-title").text(article.title);
              $("#read-text-content").html(article.content);
              var _articleWCount = wordCount(article.textContent);
              var _articleETA = estimatedReadingTime(_articleWCount);
              $("#read-text-words").text("Total words: " + _articleWCount);
              $("#read-text-eta").text("Reading time: " + _articleETA + " mins");
              if(article.byline !== null) {
                $("#read-text-author").text("Author: " + article.byline);
              }
              $("#read-text-title").css({
                lineHeight: "35px"
              });
              $("#read-text-domain").css({
                color: "#11ABB0",
                fontSize: "13px",
                fontStyle: "oblique"
              });
              $("#read-text-words, #read-text-eta, #read-text-author").css({
                color: "#777",
                fontSize: "13px",
                fontStyle: "oblique",
                marginRight: "13px"
              });
              $("#read-text-content").css({
                borderTop: "2px solid #444",
                overflow: "auto"
              });
              $("#read-text #read-text-content a").css({
                color: "#aaa",
                textDecoration: "none",
                cursor: "default"
              });
              $("#read-text #read-text-content a").each(function () {
                $(this).click(function (event) {
                  event.preventDefault();
                });
              });
              $("#read-text #read-text-content img").each(function () {
                var _boxDim = $("#read-text-content").width();
                var _maxDim = Math.max(this.width, this.height);
                //var ratio;
                if (_maxDim > _boxDim) {
                  //ratio = parseFloat(_maxDim/_boxDim);
                  //this.width = parseInt(this.width/ratio);
                  $(this).width("90%");
                  $(this).css({
                    height: "auto",
                    display: "block"
                  });
                } else {
                  $(this).css({
                    height: "auto",
                    display: "block"
                  });
                }
              });
              /* $("#read-text #read-text-content img").css({
                height: "auto"
              }); */
              if (!$("#read-text #read-text-content pre").hasClass("prettyprint")) {
                $("#read-text #read-text-content pre").addClass("prettyprint");
              }
              $("#read-text #read-text-content pre").css({
                backgroundColor: "#ccc",
                border: "none",
                overflow: "auto"
              });
              $("#read-text #read-text-content video").css({
                display: "none",
              });
              if ($("#read-text-footer").length == 0) {
                $("#read-container").append($.parseHTML(
                  "<div id='read-text-footer'>" +
                  "<span>This page is powered by <b>Read Pro</b></span>" + 
                  "<img src='" + chrome.runtime.getURL("icons/icon_48.png") + "'/>"  + 
                  "</div>"
                ));
                $("#read-text-footer").css({
                  textAlign: "center",
                  color: "#aaa",
                  lineHeight: "35px",
                  margin: "10px auto"
                });
                $("#read-text-footer img").css({
                  position: "relative",
                  top: "15px",
                  left: "10px"
                });
              }
            }

            readingMode = true;
            createToolOptions();
            $("tool-option").nextAll("div, iframe").css({display: "none"});
            if ($('#read-btn').length !== 0) {
              //console.log("Reading Icon changed");
              $('#read-btn').attr('src', '').promise().done(function () {
                $(this).attr('src', chrome.runtime.getURL("images/book-green.png"));
                $("#read-btn").hover(function () {
                  $(this).attr('src', chrome.runtime.getURL("images/book-green.png"));
                }, function () {
                  $(this).attr('src', chrome.runtime.getURL("images/book-green.png"));
                });
              });
            }
          } else {
            $("#read-mode").text("Reading Mode Off");
            $("#read-mode").css({ opacity: 1, zIndex: "20" });
            $("#read-mode").animate({ opacity: "0.0" }, 1200);
            readingMode = false;
            $("#read-container").remove();
            removeExtensionElements();
            //window.location.reload();
            document.head.innerHTML = _oldHead;
            document.body.innerHTML = _oldBody;
            createToolOptions();
          }
        };

        //Text to Speech Mode Button Function
        var ttsMode = function () {
          console.log("Text to Speech mode is on");
          chrome.runtime.sendMessage({ message: "open speak mode" });
          var ttsMode = true;
          var selectedVoice = {};
          $("#tool-option").hide();

          if ($("#help-mode").length != 0) {
            helpMode = false;
            $("#help-mode").remove();
          }

          if ($("#tts-mode").length == 0) {
            //tts-mode doesn't exist
            $("body").append("<div id='tts-mode'></div>");
            $("#tts-mode").text("Speech to Text Mode");
            $("#tts-mode").css({
              position: "fixed",
              top: "11%",
              left: "44.5%",
              backgroundColor: "#333",
              color: "#fff",
              padding: "10px",
              opacity: "1.0"
            });
            $("#tts-mode").animate({ opacity: "0.0" }, 1200);
          } else {
            //tts-mode exist
            $("#tts-mode").text("Speech to Text Mode");
            $("#tts-mode").css({ opacity: "1.0" });
            $("#tts-mode").animate({ opacity: "0.0" }, 1200);
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
              background: "#4A7C87",
              color: "#fff",
              cursor: "pointer",
              fontSize: "17px",
              borderRadius: "5px",
              marginLeft: "10px",
              height: "38px"
            });
          } else {
            if ($("#speech-voices").length == 0) {
              $("#dialog-box").append("<select id='speech-voices'></select>");
              $("#speech-voices").css({
                border: "0",
                background: "4A7C87",
                color: "#fff",
                cursor: "pointer",
                fontSize: "17px",
                borderRadius: "5px",
                marginLeft: "10px",
                height: "38px"
              });
              $("#apply-btn").html("Speak");
            }
            $("#dialog-box").show();
          }

          // check if speech synthesis is supported
          if (!("speechSynthesis" in window)) {
            console.warn("browser don't support.");
            $("#tts-mode").text("browser don't support Text to Speech");
            $("#tts-mode").css({ opacity: "1.0" });
            $("#tts-mode").animate({ opacity: "0.0" }, 1200);
          } else {
            loadVoiceList();
            if (speechSynthesis.onvoiceschanged !== undefined) {
              speechSynthesis.onvoiceschanged = loadVoiceList;
            }
          }

          function loadVoiceList() {
            var voices = speechSynthesis.getVoices();
            if ($("#speech-voices option").length == 0) {
              var language = window.navigator.userLanguage || window.navigator.language; //en-US
              voices.forEach(function (voice, index) {
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

              $("#speech-voices").on("change", function () {
                var voiceIndex = this.value;
                if (voices.length !== 0) {
                  selectedVoice = voices[voiceIndex];
                  console.log("New voice: " + selectedVoice.name + " , language: " + selectedVoice.lang);
                }
              });

              if (voices.length > 0 && speechSynthesis.onvoiceschanged !== undefined) {
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
                    if (!$.isEmptyObject(selectedVoice)) {
                      speaker.voice = selectedVoice;
                      console.log("Current voice: " + selectedVoice.name);
                    }
                    window.speechSynthesis.speak(speaker);

                    speaker.onstart = function () {
                      $("#tts-mode").text("Speaking in " + speaker.voice.name + " ...");
                      $("#tts-mode").css({ opacity: "1.0" });
                      $("#apply-btn").html("Pause");
                      console.log("Speech started.");
                    };

                    speaker.onerror = function (event) {
                      $("#tts-mode").text("Error! Try again");
                      $("#tts-mode").css({ opacity: "1.0" });
                      $("#apply-btn").html("Speak");
                      console.log("Error occured " + event.message);
                    };

                    speaker.onend = function (event) {
                      $("#tts-mode").text("Select Text to Speech.");
                      $("#tts-mode").css({ opacity: "1.0" });
                      //$("#tts-mode").animate({ opacity: "0.0" }, 1200);
                      $("#apply-btn").html("Speak");
                      console.log("Speach finished in " + event.elapsedTime + " seconds.");
                    };

                    speaker.onpause = function (event) {
                      console.log("Speech paused after " + event.elapsedTime + " milliseconds.");
                    };

                    speaker.onresume = function (event) {
                      console.log("Speech resumed after " + event.elapsedTime + " milliseconds.");
                    };
                  });
                } else {
                  $("#tts-mode").text("No text available. Select Text.");
                  $("#tts-mode").css({ opacity: "1.0" });
                  $("#tts-mode").animate({ opacity: "0.0" }, 1200);
                  console.log("No text available");
                }
              } else if (event.target.id === "apply-btn" && event.target.innerText === "Pause") {
                console.log("Speech paused");
                window.speechSynthesis.pause();
                $("#tts-mode").text("Speech Paused");
                $("#tts-mode").css({ opacity: "1.0" });
                $("#apply-btn").html("Resume");
              } else if (event.target.id === "apply-btn" && event.target.innerText === "Resume") {
                console.log("Speech resumed");
                window.speechSynthesis.resume();
                $("#tts-mode").text("Speaking in " + speaker.voice.name + " ...");
                $("#tts-mode").css({ opacity: "1.0" });
                $("#apply-btn").html("Pause");
              } else if (event.target.id === "cancel-btn") {
                //cancel button clicked
                console.log("Cancel Text to Speech mode");
                $("#tts-mode").text("Text to Speech mode off!");
                $("#tts-mode").css({ opacity: "1.0" });
                $("#tts-mode").animate({ opacity: "0.0" }, 1200);
                $("#apply-btn").html("Apply Changes");
                window.speechSynthesis.cancel();
                text2Speech = "";
                textArray = [];
                selectedVoice = {};
                ttsMode = false;
                removeExtensionElements();
                createToolOptions();
              } else {
                text2Speech = window.getSelection().toString();
                textArray = chuckText(text2Speech);
                //console.log(textArray);
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
          while (text.length > 0) {
            arr.push(text.match(pattRegex)[0]);
            text = text.substring(arr[arr.length - 1].length);
          }
          return arr;
        }

        //Edit Mode Button Function
        var editMode = function () {
          console.log("Edit mode is on");
          chrome.runtime.sendMessage({ message: "open edit mode" });
          var editMode = true;
          $("#tool-option").hide();

          if ($("#help-mode").length != 0) {
            helpMode = false;
            $("#help-mode").remove();
          }

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
            $("#edit-mode").animate({opacity: "0.0"}, 1200);
          } else {
            //edit-mode exist
            $("#edit-mode").text("Edit Mode On!");
            $("#edit-mode").css({opacity: "1.0"});
            $("#edit-mode").animate({ opacity: "0.0" }, 1200);
          }

          if ($("#dialog-box").length == 0) {
            //dialog-box doesn't exist
            $("body").append("<div id='dialog-box'><button id='apply-btn'>Apply Changes</button><button id='cancel-btn'>Cancel</button></div>");
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
            .prop("id", "edit-mode-css")
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
            $(this).click(function (event) {
              event.preventDefault();
            });
            $(this).addClass("link-disabled");
          });

          // Click an element in edit mode
          $(document).click(function (event) {
            if (editMode) {
              if (
                event.target.id === "tool-option" ||
                event.target.id === "read-btn" ||
                event.target.id === "tts-btn" ||
                event.target.id === "edit-btn" ||
                event.target.id === "highlight-btn" ||
                event.target.id === "save-btn" ||
                event.target.id === "pdf-btn" ||
                event.target.id === "open-btn" ||
                event.target.id === "help-btn" ||
                event.target.id === "dialog-box" ||
                event.target.id === "speech-voices" ||
                event.target.id === "read-mode" ||
                event.target.id === "read-container" || // All Read-mode IDs
                event.target.id === "read-option" ||
                event.target.id === "read-option-btn" ||
                event.target.id === "read-option-box" ||
                event.target.id === "read-option-btn-icon" ||
                event.target.id === "read-font-family" ||
                event.target.id === "read-color-theme" ||
                event.target.id === "read-font-size" ||
                event.target.id === "read-text" ||
                event.target.id === "read-text-content" ||
                event.target.id === "tts-mode" ||
                event.target.id === "edit-mode" ||
                event.target.id === "highlight-mode" ||
                event.target.id === "save-mode" ||
                event.target.id === "help-mode" ||
                event.target.id === "cross-btn" ||
                event.target.id === "help-title" ||
                event.target.id === "help-content"
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
                $("#edit-mode").text("Changes are applied!");
                $("#edit-mode").css({
                  opacity: "1.0"
                });
                $("#edit-mode").animate({
                    opacity: "0.0"
                  },
                  "slow"
                );
                //$("#dialog-box").hide();
                //$("#tool-option").show();
                removeExtensionElements();
                createToolOptions();
                editMode = false;
              } else if (event.target.id === "cancel-btn") {
                //cancel button clicked
                console.log(
                  "Cancel edits from all selected elements"
                );
                $(".web-edited").each(function () {
                  $(this).removeClass("web-edited");
                });
                $("a").each(function () {
                  $(this).removeClass("link-disabled");
                });
                $("#edit-mode").text("Changes are cancelled!");
                $("#edit-mode").css({ opacity: "1.0" });
                $("#edit-mode").animate({ opacity: "0.0" }, 1200);
                //$("#dialog-box").remove();
                //$("#tool-option").show();
                removeExtensionElements();
                createToolOptions();
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

        var lightMode = false;
        //Highlight Button Function
        var highlightMode = function () {
          console.log("Highlight mode is on");
          chrome.runtime.sendMessage({ message: "open highlight mode" });
          lightMode = true;

          $("#tool-option").hide();
          if ($("#help-mode").length != 0) {
            helpMode = false;
            $("#help-mode").remove();
          }

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
            $("#highlight-mode").animate({ opacity: "0.0" }, 1200);
          } else {
            //edit-mode exist
            $("#highlight-mode").text("Highlight Mode On!");
            $("#highlight-mode").css({ opacity: "1.0" });
            $("#highlight-mode").animate({ opacity: "0.0" }, 1200);
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

          //Add new class "manual-highlight" and push in the css
          $("<style>")
            .prop("type", "text/css")
            .prop("id", "highlight-mode-css")
            .html(
              ".manual-highlight {background-color: yellow; color: #000 !important; display: inline;" +
              ".manual-highlight a, .manual-highlight span, .manual-highlight p {color: #000 !important; text-decoration: none}"
            )
            .appendTo("head");

          function highlightRange(range) {
            if (range.toString() !== "" && range.toString().match(/\w+/g) !== null) {
              var newNode = document.createElement("span");
              newNode.setAttribute("class", "manual-highlight");
              range.surroundContents(newNode);
            }
          }

          function getSafeRanges(dangerous) {
            var a = dangerous.commonAncestorContainer;
            // Starts -- Work inward from the start, selecting the largest safe range
            var s = new Array(0),
              rs = new Array(0);
            if (dangerous.startContainer != a)
              for (
                var i = dangerous.startContainer; i != a; i = i.parentNode
              )
                s.push(i);
            if (0 < s.length)
              for (var i = 0; i < s.length; i++) {
                var xs = document.createRange();
                if (i) {
                  xs.setStartAfter(s[i - 1]);
                  xs.setEndAfter(s[i].lastChild);
                } else {
                  xs.setStart(s[i], dangerous.startOffset);
                  xs.setEndAfter(
                    s[i].nodeType == Node.TEXT_NODE ?
                    s[i] :
                    s[i].lastChild
                  );
                }
                rs.push(xs);
              }

            // Ends -- basically the same code reversed
            var e = new Array(0),
              re = new Array(0);
            if (dangerous.endContainer != a)
              for (
                var i = dangerous.endContainer; i != a; i = i.parentNode
              )
                e.push(i);
            if (0 < e.length)
              for (var i = 0; i < e.length; i++) {
                var xe = document.createRange();
                if (i) {
                  xe.setStartBefore(e[i].firstChild);
                  xe.setEndBefore(e[i - 1]);
                } else {
                  xe.setStartBefore(
                    e[i].nodeType == Node.TEXT_NODE ?
                    e[i] :
                    e[i].firstChild
                  );
                  xe.setEnd(e[i], dangerous.endOffset);
                }
                re.unshift(xe);
              }

            // Middle -- the uncaptured middle
            if (0 < s.length && 0 < e.length) {
              var xm = document.createRange();
              xm.setStartAfter(s[s.length - 1]);
              xm.setEndBefore(e[e.length - 1]);
            } else {
              return [dangerous];
            }

            // Concat
            rs.push(xm);
            response = rs.concat(re);

            // Send to Console
            return response;
          };

          $(document).click(function (event) {
            if (lightMode) {
              if (event.target.id === "apply-btn") {
                //apply button clicked
                console.log("Apply highlights on all selected elements");
                $("#highlight-mode").text("Changes are applied!");
                $("#highlight-mode").css({ opacity: "1.0" });
                $("#highlight-mode").animate({ opacity: "0.0" }, 1200);
                //$("#dialog-box").hide();
                //$("#tool-option").show();
                lightMode = false;
                removeExtensionElements();
                createToolOptions();
              } else if (event.target.id === "cancel-btn") {
                //cancel button clicked
                console.log("Cancel highlight from all selected elements");
                $(".manual-highlight").each(function () {
                  $(this).removeClass("manual-highlight");
                });
                $("#highlight-mode").text("Changes are cancelled!");
                $("#highlight-mode").css({ opacity: "1.0" });
                $("#highlight-mode").animate({ opacity: "0.0" }, 1200);
                //$("#highlight-mode-css").remove(); //delete the highlight-mode-css from head
                //$("#dialog-box").remove();
                //$("#tool-option").show();
                lightMode = false;
                removeExtensionElements();
                createToolOptions();
              } else {
                var sel = window.getSelection && window.getSelection();
                if (sel && sel.rangeCount > 0) {
                  var userSelection = sel.getRangeAt(0);
                  var safeRanges = getSafeRanges(userSelection);
                  for (var i = 0; i < safeRanges.length; i++) {
                    highlightRange(safeRanges[i]);
                  }
                }
              }
            }
          });
        };

        var saveLinkMode = false;
        var saveLinks = function () {
          console.log("Save link mode is on");
          saveLinkMode = true;

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
            $("#save-mode").css({ opacity: "0.0"});
          }

          if (saveLinkMode) {
            chrome.runtime.sendMessage({
                message: "save link"
              },
              function (response) {
                console.log(response.message);
                if (response.message === "link saved") {
                  $("#save-mode").text("Link saved.");
                } else if (response.message === "link duplicate") {
                  $("#save-mode").text(
                    "Duplicate link."
                  );
                } else {
                  $("#save-mode").text("Error: Try again.");
                }
                $("#save-mode").animate({ opacity: "1.0" }, 'fast');
                $("#save-mode").animate({ opacity: "0.0" }, 1200);
              }
            );
          } else {
            console.warn("Save link mode is off");
          }
        };

        var openLinksMode = false;
        //Open saved links Button Function
        var openLinks = function () {
          console.log("Open reading queue mode is on");
          openLinksMode = true;
          if (openLinksMode) {
            chrome.runtime.sendMessage({ 
                message: "open links page" 
              },
              function (response) {
                console.log(response.message);
              }
            );
          } else {
            console.warn("Open reading queue mode is off");
          }
        };

        var saveAsPDFMode = false;
        //Save as PDF Button Function
        var saveAsPDF = function () {
          console.log("Save as PDF mode is on");
          chrome.runtime.sendMessage({ message: "open print mode" });
          saveAsPDFMode = true;

          if (saveAsPDFMode) {
            var mediaQueryList = window.matchMedia("print");
            mediaQueryList.addListener(function (mql) {
              if (mql.matches) {
                console.log("Hide tool-option");
                $("#tool-option").hide();
                $("#help-mode").hide();
                $("#read-option").hide();
                $("#read-text").css({
                  width: "100%"
                });
              } else {
                console.log("Show tool-option");
                $("#tool-option").show();
                $("#help-mode").show();
                $("#read-option").show();
                $("#read-text").css({
                  width: "60%"
                });
              }
            });
            window.print();
          } else {
            console.warn("Save as PDF mode is off");
          }
        };

        var helpMode = false;
        //Help Mode Button Function
        var openHelp = function () {
          console.log("Help mode on");
          chrome.runtime.sendMessage({ message: "open help mode" });
          if (!helpMode) {
            helpMode = true;
            $("#help-btn").attr('src', chrome.runtime.getURL("images/help-green.png"));
            if ($("#help-mode").length == 0) {
              $("body").append("<div id='help-mode'></div>");
              var helpHtml =
                "<div id='cross-btn'>X</div>\
                <div id='help-title'>Clear Page: Help Doc</div>\
                <div id='help-content'>\
                  <div><p>Use this powerful tool by either clicking the icon <img src='" + chrome.runtime.getURL("icons/icon_16.png") + "'/> or pressing the '<i>Ctrl+Shift+L</i>' key.</p></div>\
                  <div><span>Read Mode:</span><p>Transform the website into a clean readable page with various styling options.</p></div>\
                  <div><span>Text to Speak Mode:</span><p>Read out loud any selected text from the web page. Choose voices from various voice options.</p></div>\
                  <div><span>Edit Mode:</span><p>Hide any unnecessary element from the web page on a single click. Select the element and use Apply button to hide. Use Cancel button to Undo any changes.</p></div>\
                  <div><span>Highlight Mode:</span><p>Use the inbuilt Highlighter to highlight any text on the web page. Remove all highlights using the cancel button.</p></div>\
                  <div><span>Save Page for Later:</span><p>Save favorite web pages in a reading queue for a later read. Detect any previously saved pages.</p></div>\
                  <div><span>Open Reading Queue:</span><p>View the Read for Later list. Sort the list using various options as well as delete the unwanted web page.</p></div>\
                  <div><span>Save as PDF:</span><p>One click to save the web page into PDF file locally.</p></div>\
                  <div><p>Want to learn more? Please check out the clear page extension <a href='https://nids0810.github.io/clear-page/' title='Clear Page' target='_blank'>website</a>.</p></div>\
                </div>\
                ";
              $("#help-mode").append($.parseHTML(helpHtml));
              $("#help-mode").css({
                position: "fixed",
                top: "30%",
                backgroundColor: "#fff",
                color: "#333",
                padding: "15px",
                width: "48%",
                right: "5.5%",
                overflow: "auto",
                zIndex: "300",
                borderRadius: "20px",
                height: '355px',
                boxShadow: '2px 2px 10px 0px #000'
              });
              $('#help-title').css({
                textAlign: 'center',
                fontSize: '20px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                marginBottom: "15px"
              });
              $('#help-content div').css({
                background: '#f1f1f1',
                border: '1px solid# eee',
                backgroundColor: '#f1f2f2',
                padding: '10px',
                borderRadius: '7px',
                marginBottom: '15px',
                marginBottom: '10px'
              });
              $('#help-content div span').css({
                fontSize: '14px',
                fontWeight: 'bolder',
                marginBottom: "11px",
                display: "block"
              });
              $('#help-content div p').css({
                fontSize: '13px'
              });
              $('#help-content div p a').css({
                color: "#000",
                textDecoration: "none",
                fontWeight: "bold"
              });
              $("#help-content div p img").css({
                position: "relative",
                top: "5px"
              });
              $("#cross-btn").css({
                background: '#333',
                fontSize: '20px',
                color: '#fff',
                float: 'right',
                borderRadius: '50%',
                padding: '5px 12px',
                cursor: 'pointer',
                top: '-8px',
                right: '-14px',
                zIndex: '10',
                position: 'sticky'
              });
            } else {
              $("#help-mode").show();
              $("#help-mode").css({ opacity: 1, zIndex: "300" });
            }
          } else {
            console.log("Help mode off");
            helpMode = false;
            $("#help-mode").remove();
          }

          $("#cross-btn").click(function (event) {
            if (helpMode) {
              helpMode = false;
              $("#help-mode").animate({ opacity: "0.0" }, 1200 );
              $("#help-mode").remove();
              $("#help-mode").css({ zIndex: "-20" });
              console.log("Help mode off");
            } else {
              console.warn("Help mode is already off");
            }
          });
        };

        removeExtensionElements();
        createToolOptions();
      } else {
        console.log("Extension Active? " + response.message);
        removeExtensionElements();
      }
    });

  var removeExtensionElements = function () {
    console.log("Remove all extension elements.");
    //remove the tool options if available
    if ($("#tool-option").length != 0) {
      $("#tool-option").remove();
    }

    if ($("#dialog-box").length != 0) {
      $("#dialog-box").remove();
    }

    if ($("#read-mode").length != 0) {
      $("#read-mode").remove();
    }

    if ($("#tts-mode").length != 0) {
      $("#tts-mode").remove();
    }

    if ($("#edit-mode").length != 0) {
      $("#edit-mode").remove();
    }

    if ($("#highlight-mode").length != 0) {
      $("#highlight-mode").remove();
    }

    if ($("#save-mode").length != 0) {
      $("#save-mode").remove();
    }

    if ($("#help-mode").length != 0) {
      $("#help-mode").remove();
    }
  };
})();