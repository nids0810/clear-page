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

          // Add content.css file
          if ($("#content-css").length === 0) {
            $("head").append('<link rel="stylesheet" href="' +
            chrome.runtime.getURL("css/content.css") +
            '" type="text/css" id="content-css"/>');
          }

          // Add sweet-alert-js file
          //$("head").append('<script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js" />');
          if ($("#sweet-alert-js").length === 0) {
            $("head").append('<script src = "' + chrome.runtime.getURL("third-party/sweetalert.min.js") + '" id="sweet-alert-js" />');
          }

          // Add animate.css file
          if ($("#animate-css").length === 0) {
            $("head").append('<link rel="stylesheet" href="' + 
            chrome.runtime.getURL("css/animate.min.css") + 
            '" type="text/css" id="animate-css"/>');
          }

          $("body").append("<div id='tool-option'></div>");

          //Read Mode Button
          $("#tool-option").append(
            "<img id='read-btn' title='Read Mode' src='" + 
            chrome.runtime.getURL("images/book-white.png") + 
            "'/>");
          $("#read-btn").click(readModeFunction);

          //Text to Speak Mode Button
          $("#tool-option").append(
            "<img id='tts-btn' title='Text to Speech Mode' src='" +
            chrome.runtime.getURL("images/speak-white.png") +
            "'/>"
          );
          $("#tts-btn").click(ttsModeFunction);

          //Erase Mode Button
          $("#tool-option").append(
            "<img id='erase-btn' title='Erase Mode' src='" +
            chrome.runtime.getURL("images/erase-white.png") +
            "'/>"
          );
          $("#erase-btn").click(eraseModeFunction);

          //Highlight Mode Button
          $("#tool-option").append(
            "<img id='highlight-btn' title='Highlight Mode' src='" +
            chrome.runtime.getURL("images/highlight-white.png") +
            "'/>"
          );
          $("#highlight-btn").click(highlightModeFunction);

          //Save page for later Button
          $("#tool-option").append(
            "<img id='save-btn' title='Save page for Later' src='" +
            chrome.runtime.getURL("images/save-white.png") +
            "'/>"
          );
          $("#save-btn").click(saveLinksFunction);

          //Open saved links Button
          $("#tool-option").append(
            "<img id='open-btn' title='Open Reading Queue' src='" +
            chrome.runtime.getURL("images/open-white.png") +
            "'/>"
          );
          $("#open-btn").click(openLinksFunction);

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
          $("#help-btn").click(helpModeFunction);

          $("#read-btn").hover(function () {
            $(this).attr('src', chrome.runtime.getURL("images/book-green.png"));
            $(this).addClass("animated swing");
          }, function () {
            $(this).attr('src', chrome.runtime.getURL("images/book-white.png"));
            $(this).removeClass("animated swing");
          });

          $("#tts-btn").hover(function () {
            $(this).attr('src', chrome.runtime.getURL("images/speak-green.png"));
            $(this).addClass("animated swing");
          }, function () {
            $(this).attr('src', chrome.runtime.getURL("images/speak-white.png"));
            $(this).removeClass("animated swing");
          });

          $("#erase-btn").hover(function () {
            $(this).attr('src', chrome.runtime.getURL("images/erase-green.png"));
            $(this).addClass("animated swing");
          }, function () {
            $(this).attr('src', chrome.runtime.getURL("images/erase-white.png"));
            $(this).removeClass("animated wobble");
          });

          $("#highlight-btn").hover(function () {
            $(this).attr('src', chrome.runtime.getURL("images/highlight-green.png"));
            $(this).addClass("animated swing");
          }, function () {
            $(this).attr('src', chrome.runtime.getURL("images/highlight-white.png"));
            $(this).removeClass("animated swing");
          });

          $("#save-btn").hover(function () {
            $(this).attr('src', chrome.runtime.getURL("images/save-green.png"));
            $(this).addClass("animated swing");
          }, function () {
            $(this).attr('src', chrome.runtime.getURL("images/save-white.png"));
            $(this).removeClass("animated swing");
          });

          $("#open-btn").hover(function () {
            $(this).attr('src', chrome.runtime.getURL("images/open-green.png"));
            $(this).addClass("animated swing");
          }, function () {
            $(this).attr('src', chrome.runtime.getURL("images/open-white.png"));
            $(this).removeClass("animated swing");
          });

          $("#pdf-btn").hover(function () {
            $(this).attr('src', chrome.runtime.getURL("images/pdf-green.png"));
            $(this).addClass("animated swing");
          }, function () {
            $(this).attr('src', chrome.runtime.getURL("images/pdf-white.png"));
            $(this).removeClass("animated swing");
          });

          $("#help-btn").hover(function () {
            $(this).attr('src', chrome.runtime.getURL("images/help-green.png"));
            $(this).addClass("animated swing");
          }, function () {
            $(this).attr('src', chrome.runtime.getURL("images/help-white.png"));
            $(this).removeClass("animated swing");
          });
          
        };

        var _oldHead, _oldBody;
        var readMode = false;
        //Read Mode Button Function
        var readModeFunction = function () {
          console.log("Reading Mode On");
          chrome.runtime.sendMessage({ message: "open read mode" });

          if (!readMode) {

            if ($("#help-mode").length != 0) {
              helpMode = false;
              $("#help-mode").remove();
            }
            removeExtensionElements();
            $("#read-text-icon, #read-text-domain, #read-text-words, #read-text-eta, #read-text-author, #read-text-published").remove();

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

            var webDetails = function webDetails () {
              var web = {};

              web.title = $("title").text() || $("meta[name='title']").attr("content") || $("meta[property='og:title']").attr("content") || "";
              web.url = $("meta[property='og:url']").attr("content") || "";
              if (web.url !== "") {
                web.domain = new URL(web.url).hostname;
              }
              web.sitename = $("meta[property='og:site_name']").attr("content") || "";
              web.type = $("meta[property='og:type']").attr("content") || "";
              web.favicon = $("link[rel='shortcut icon']").attr("href") || $("link[rel='icon']").attr("href") || "";
              web.date_published = Date.parse($("meta[property='article:published_time']").attr("content")) || "";
              web.date_modified = Date.parse($("meta[property='article:modified_time']").attr("content")) || "";
              web.lead_image_url = $("meta[property='og:image']").attr("content") || "";
              web.short_url = web.url;
              return web;
            };

            var articleInfo = webDetails();

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
            }

            if ($("#read-mode").length == 0) {
              //read-mode doesn't exist
              $("#read-container").append(
                "<div id='read-mode'></div>"
              );
              $("#read-mode").text("Reading Mode On");
              $("#read-mode").fadeToggle();
            } else {
              //read-mode exist
              $("#read-mode").text("Reading Mode On");
              $("#read-mode").fadeToggle();
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

            var dayOrNight;
            var curHours = new Date().getHours();
            if (curHours > 7 && curHours < 18){
              dayOrNight = "day";
            } else {
              dayOrNight = "night";
            }

            var _optionClicked = false;
            $("#read-option-btn").click(function () {
              if (!_optionClicked) {
                _optionClicked = true;
                //Read Option Box
                if ($("#read-option-box").length == 0) {
                  $("#read-option").append(
                    "<div id='read-option-box'></div>"
                  );
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
                  if(dayOrNight === "day") {
                    $("#read-option-box").append(
                      "<div id='read-color-theme'>\
                      <Label>Theme:</Label>\
                      <input type='radio' id='theme-day' name='day' value='day' checked> Day\
                      <input type='radio' id='theme-night' name='night' value='night'> Night\
                    </div>"
                  );
                  } else if (dayOrNight === "night") {
                    $("#read-option-box").append(
                      "<div id='read-color-theme'>\
                      <Label>Theme:</Label>\
                      <input type='radio' id='theme-day' name='day' value='day'> Day\
                      <input type='radio' id='theme-night' name='night' value='night' checked> Night\
                    </div>"
                    );
                  }
                }
                $("#read-font-size :input").change(function () {
                  if (this.value == "small") {
                    $("#read-text").removeClass('small').removeClass('medium').removeClass('large').addClass('small');
                  } else if (this.value == "medium") {
                    $("#read-text").removeClass('small').removeClass('medium').removeClass('large').addClass('medium');
                  } else if (this.value == "large") {
                    $("#read-text").removeClass('small').removeClass('medium').removeClass('large').addClass('large');
                  }
                  $("#read-font-size")
                    .find('input[type="radio"]:not(#' + this.id + ")")
                    .prop("checked", false);
                });
                $("#read-font-family :input").change(function () {
                  $("#read-text-words, #read-text-eta, #read-text-author, #read-text-published, #read-text-domain, #read-text-content").css({
                    fontFamily: this.value
                  });
                  $("#read-font-family")
                  .find('input[type="radio"]:not(#' + this.id + ")")
                  .prop("checked", false);
                });
                $("#read-color-theme :input").change(
                  function () {
                    if (this.value == "day") {
                      $("#read-container").removeClass("night").addClass("day");
                      $("#read-text").removeClass("night").addClass("day");
                    } else if (this.value == "night") {
                      $("#read-container").removeClass("day").addClass("night");
                      $("#read-text").removeClass("day").addClass("night");                    
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

            if (dayOrNight === "day") {
              $("#read-container").removeClass("night").removeClass("day").addClass("day");
              $("#read-text").removeClass("night").removeClass("day").addClass("day");
              $("#read-text").removeClass('small').removeClass('medium').removeClass('large').addClass('medium');
            } else if (dayOrNight === "night") {
              $("#read-container").removeClass("day").removeClass("night").addClass("night");
              $("#read-text").removeClass("day").removeClass("night").addClass("night");
              $("#read-text").removeClass('small').removeClass('medium').removeClass('large').addClass('medium');
            }

            if (article === null) {
              if ($("#read-text-error").length == 0) {
                $("#read-text").append(
                  "<div id='read-text-error'><img src='" +
                    chrome.runtime.getURL("icons/icon_128.png") +
                    "'/>" + "<h1>Sorry! this page is unreadable.</h1></div>"
                );
              }
              $("#read-text-error img").addClass("animated hinge delay-2s");
              $("#read-option").hide();
              console.warn("Article is not readable");
            } else {
              if ($("#read-text-icon").length == 0) {
                $("#read-text").append("<img id='read-text-icon'></img>");
              }
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
              if ($("#read-text-published").length == 0) {
                $("#read-text").append("<span id='read-text-published'></span>");
              }
              if ($("#read-text-content").length == 0) {
                $("#read-text").append("<p id='read-text-content'></p>");
              }

              $("#read-text-icon").attr("src", articleInfo.favicon);
              $("#read-text-domain").text(articleInfo.domain);
              $("#read-text-title").text(article.title);
              $("#read-text-content").html(article.content);
              var _articleWCount = wordCount(article.textContent);
              var _articleETA = estimatedReadingTime(_articleWCount);
              $("#read-text-words").text("Total words: " + _articleWCount);
              $("#read-text-eta").text("Reading time: " + _articleETA + " mins");
              if(article.byline !== null || article.byline !== "") {
                $("#read-text-author").text("Author: " + article.byline);
              }
              if(articleInfo.date_published !== null || articleInfo.date_published !== "") {
                $("#read-text-published").text("Published: " + new Date(articleInfo.date_published)
                .customFormat("#DDD# #DD# #MMM# #YYYY# #h#:#mm# #AMPM#"));
              }
              // Add prevent default to all click event
              $("#read-text-content a").each(function () {
                $(this).click(function (event) {
                  event.preventDefault();
                  event.stopPropagation();
                });
              });

              // remove all imgs with typeof
              $("#read-text #read-text-content img").each(function () {
                if($(this).attr("typeof") === "foaf:Image"){
                  $(this).addClass("hideElement");
                }
                if(this.width <= 100 && this.height <= 100) {
                  $(this).addClass("hideElement");
                }
                /* var _boxDim = $("#read-text-content").width();
                var _maxDim = Math.max(this.width, this.height);
                var ratio;
                if (_maxDim > _boxDim) {
                  ratio = parseFloat(_maxDim/_boxDim);
                  this.width = parseInt(this.width/ratio);
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
                }  */
              });
              $("li").parents("ul").css({
                listStyleType: "none",
                overflow: "hidden",
                display: "block"
              });
              if (!$("#read-text #read-text-content pre").hasClass("prettyprint")) {
                $("#read-text #read-text-content pre").addClass("prettyprint");
              }
              if ($("#read-text-footer").length == 0) {
                $("#read-container").append($.parseHTML(
                  "<div id='read-text-footer'>" +
                  "<span>This page is powered by <b>Read Pro</b></span>" + 
                  "<img src='" + chrome.runtime.getURL("icons/icon_48.png") + "'/>"  + 
                  "</div>"
                ));
              }
            }

            readMode = true;
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
            $("#read-mode").fadeToggle();
            readMode = false;
            $("#read-container").remove();
            removeExtensionElements();
            //window.location.reload();
            document.head.innerHTML = _oldHead;
            document.body.innerHTML = _oldBody;
            createToolOptions();
          }
        };

        //Text to Speech Mode Button Function
        var ttsModeFunction = function () {
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
            $("#tts-mode").fadeToggle();
          } else {
            //tts-mode exist
            $("#tts-mode").text("Speech to Text Mode");
            $("#tts-mode").fadeToggle();
          }

          if ($("#dialog-box").length == 0) {
            //dialog-box doesn't exist
            $("body").append(
              "<div id='dialog-box'><button id='apply-btn'>Speak</button><button id='cancel-btn'>Cancel</button><select id='speech-voices'></select></div>"
            );
          } else {
            if ($("#speech-voices").length == 0) {
              $("#dialog-box").append("<select id='speech-voices'></select>");
              $("#apply-btn").html("Speak");
            }
            $("#dialog-box").show();
          }

          // check if speech synthesis is supported
          if (!("speechSynthesis" in window)) {
            console.warn("browser don't support.");
            swal({
              title: "Read Pro",
              text: "Browser don't support Text to Speech",
              icon: "error",
              button: "Damn"
            });
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
                  //console.log("New voice: " + selectedVoice.name + " , language: " + selectedVoice.lang);
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
                  console.log("speechSynthesis.speaking");
                  //return;
                  window.speechSynthesis.cancel();
                }

                if (textArray.length != 0) {
                  $.each(textArray, function () {
                    speaker = new SpeechSynthesisUtterance(this.trim());
                    if (!$.isEmptyObject(selectedVoice)) {
                      speaker.voice = selectedVoice;
                      //console.log("Current voice: " + selectedVoice.name);
                    }
                    window.speechSynthesis.speak(speaker);

                    speaker.onstart = function () {
                      $("#tts-mode").text("Speaking in " + speaker.voice.name + " ...");
                      $("#tts-mode").fadeToggle();
                      $("#apply-btn").html("Pause");
                      console.log("Speech started.");
                    };

                    speaker.onerror = function (event) {
                      $("#tts-mode").text("Error! Try again");
                      $("#tts-mode").fadeToggle();
                      $("#apply-btn").html("Speak");
                      console.log("Error occured " + event.message);
                    };

                    speaker.onend = function (event) {
                      $("#tts-mode").text("Select Text to Speech.");
                      $("#tts-mode").fadeToggle();
                      $("#apply-btn").html("Speak");
                    };

                    speaker.onpause = function (event) { };
                    speaker.onresume = function (event) { };

                  });
                } else {
                  $("#tts-mode").text("No text available. Select Text.");
                  $("#tts-mode").fadeToggle();
                  console.log("No text available");
                }
              } else if (event.target.id === "apply-btn" && event.target.innerText === "Pause") {
                console.log("Speech paused");
                window.speechSynthesis.pause();
                $("#tts-mode").text("Speech Paused");
                $("#tts-mode").fadeToggle();
                $("#apply-btn").html("Resume");
              } else if (event.target.id === "apply-btn" && event.target.innerText === "Resume") {
                console.log("Speech resumed");
                window.speechSynthesis.resume();
                $("#tts-mode").text("Speaking in " + speaker.voice.name + " ...");
                $("#tts-mode").fadeToggle();
                $("#apply-btn").html("Pause");
              } else if (event.target.id === "cancel-btn") {
                //cancel button clicked
                console.log("Cancel Text to Speech mode");
                $("#tts-mode").text("Text to Speech mode off!");
                $("#tts-mode").fadeToggle();
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

        //Erase Mode Button Function
        var eraseModeFunction = function () {
          console.log("Erase mode is on");
          chrome.runtime.sendMessage({ message: "open erase mode" });
          var eraseMode = true;
          $("#tool-option").hide();

          if ($("#help-mode").length != 0) {
            helpMode = false;
            $("#help-mode").remove();
          }

          if ($("#erase-mode").length == 0) {
            //erase-mode doesn't exist
            $("body").append("<div id='erase-mode'></div>");
            $("#erase-mode").text("Erase Mode On!");
            $("#erase-mode").fadeToggle();
          } else {
            //erase-mode exist
            $("#erase-mode").text("Erase Mode On!");
            $("#erase-mode").fadeToggle();
          }

          if ($("#dialog-box").length == 0) {
            //dialog-box doesn't exist
            $("body").append("<div id='dialog-box'><button id='apply-btn'>Apply Changes</button><button id='cancel-btn'>Cancel</button></div>");
          } else {
            $("#dialog-box").show();
          }

          // transform all links as unclickable
          $("a").each(function () {
            $(this).addClass("link-disabled");
            if(!readMode){
              $(this).click(function(event) {
                event.preventDefault();
                event.stopPropagation();
              });
            }            
          });

          // Click an element in erase mode
          $(document).click(function (event) {
            if (eraseMode) {
              if (
                event.target.id === "tool-option" ||
                event.target.id === "read-btn" ||
                event.target.id === "tts-btn" ||
                event.target.id === "erase-btn" ||
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
                event.target.id === "erase-mode" ||
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
                console.log("Erases all selected elements");
                $(".web-edited").each(function () {
                  $(this).removeClass("web-edited");
                  $(this).addClass("web-deleted");
                });
                $(".link-disabled").each(function() {
                  $(this).removeClass("link-disabled");
                  if (!readMode) {
                    $(this).click(function(event) {
                      return true;
                    });
                  }
                });
                $("#erase-mode").text("Changes are applied!");
                $("#erase-mode").fadeToggle();
                removeExtensionElements();
                createToolOptions();
                eraseMode = false;
              } else if (event.target.id === "cancel-btn") {
                //cancel button clicked
                console.log("Canceled all erased elements");
                $(".web-edited").each(function () {
                  $(this).removeClass("web-edited");
                });
                $(".link-disabled").each(function() {
                  $(this).removeClass("link-disabled");
                  if (!readMode) {
                    $(this).click(function(event) {
                      return true;
                    });
                  }
                });
                $("#erase-mode").text("Changes are cancelled!");
                $("#erase-mode").fadeToggle();
                removeExtensionElements();
                createToolOptions();
                eraseMode = false;
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
        var highlightModeFunction = function () {
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
            $("#highlight-mode").fadeToggle();
          } else {
            //highligh-mode exist
            $("#highlight-mode").text("Highlight Mode On!");
            $("#highlight-mode").fadeToggle();
          }

          if ($("#dialog-box").length == 0) {
            //dialog-box doesn't exist
            $("body").append(
              "<div id='dialog-box'><button id='apply-btn'>Apply Changes</button><button id='cancel-btn'>Cancel</button></div>"
            );
          } else {
            $("#dialog-box").show();
          }

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
                $("#highlight-mode").fadeToggle();
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
                $("#highlight-mode").fadeToggle();
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
        var saveLinksFunction = function () {
          console.log("Save link mode is on");
          saveLinkMode = true;

          if ($("#save-mode").length == 0) {
            //save-mode doesn't exist
            $("body").append("<div id='save-mode'></div>");
          } else {
            //save-mode exist
            $("#save-mode").fadeToggle();
          }

          if (saveLinkMode) {
            chrome.runtime.sendMessage({
                message: "save link"
              },
              function (response) {
                //console.log(response.message);
                if (response.message === "link saved") {
                  $("#save-mode").text("Link saved.");
                  swal({
                    title: "Read Pro",
                    text: response.data.title + " link is saved!",
                    icon: "success",
                    button: "Kewl"
                  });
                } else if (response.message === "link duplicate") {
                  $("#save-mode").text(
                    "Duplicate link."
                  );
                } else {
                  $("#save-mode").text("Error: Try again.");
                }
                $("#save-mode").fadeToggle();
              }
            );
          } else {
            console.warn("Save link mode is off");
          }
        };

        var openLinksMode = false;
        //Open saved links Button Function
        var openLinksFunction = function () {
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
            if ($("#help-mode").length != 0) {
              helpMode = false;
              $("#help-mode").remove();
            }
            mediaQueryList.addListener(function (mql) {
              if (mql.matches) {
                console.log("Hide tool-option");
                $("#tool-option").hide();
                $("#dialog-box").hide();
                if(readMode){
                  $("#read-option").hide();
                  $("#read-text").css({
                    width: "100%"
                  });
                }
              } else {
                console.log("Show tool-option");
                $("#tool-option").show();
                $("#dialog-box").hide(); 
                if (readMode) {
                  $("#read-option").show();
                  $("#read-text").css({
                    width: "60%"
                  });
                }
              }
            });
            window.print();
          } else {
            console.warn("Save as PDF mode is off");
          }
        };

        var helpMode = false;
        //Help Mode Button Function
        var helpModeFunction = function () {
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
                  <div><span>Erase Mode:</span><p>Erases any unnecessary element from the web page on a single click. Select the element and use Apply button to erase. Use Cancel button to Undo any changes.</p></div>\
                  <div><span>Highlight Mode:</span><p>Use the inbuilt Highlighter to highlight any text on the web page. Remove all highlights using the cancel button.</p></div>\
                  <div><span>Save Page for Later:</span><p>Save favorite web pages in a reading queue for a later read. Detect any previously saved pages.</p></div>\
                  <div><span>Open Reading Queue:</span><p>View the Read for Later list. Sort the list using various options as well as delete the unwanted web page.</p></div>\
                  <div><span>Save as PDF:</span><p>One click to save the web page into PDF file locally.</p></div>\
                  <div><p>Want to learn more? Please check out the clear page extension <a href='https://sites.google.com/view/readpro/home' title='Clear Page' target='_blank'>website</a>.</p></div>\
                </div>\
                ";
              $("#help-mode").append($.parseHTML(helpHtml));
            } else {
              $("#help-mode").show();
            }
          } else {
            console.log("Help mode off");
            helpMode = false;
            $("#help-mode").remove();
          }

          $("#cross-btn").click(function (event) {
            if (helpMode) {
              helpMode = false;
              $("#help-mode").remove();
              console.log("Help mode off");
            } else {
              console.warn("Help mode is already off");
            }
          });
        };
        removeExtensionElements();
        createToolOptions();
      } else {
        console.log("Extension Active: " + response.message);
        removeExtensionElements();
      }
    });

  Date.prototype.customFormat = function(formatString){
    var YYYY,YY,MMMM,MMM,MM,M,DDDD,DDD,DD,D,hhhh,hhh,hh,h,mm,m,ss,s,ampm,AMPM,dMod,th;
    YY = ((YYYY=this.getFullYear())+"").slice(-2);
    MM = (M=this.getMonth()+1)<10?('0'+M):M;
    MMM = (MMMM=["January","February","March","April","May","June","July","August","September","October","November","December"][M-1]).substring(0,3);
    DD = (D=this.getDate())<10?('0'+D):D;
    DDD = (DDDD=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][this.getDay()]).substring(0,3);
    th=(D>=10&&D<=20)?'th':((dMod=D%10)==1)?'st':(dMod==2)?'nd':(dMod==3)?'rd':'th';
    formatString = formatString.replace("#YYYY#",YYYY).replace("#YY#",YY).replace("#MMMM#",MMMM).replace("#MMM#",MMM).replace("#MM#",MM).replace("#M#",M).replace("#DDDD#",DDDD).replace("#DDD#",DDD).replace("#DD#",DD).replace("#D#",D).replace("#th#",th);
    h=(hhh=this.getHours());
    if (h==0) h=24;
    if (h>12) h-=12;
    hh = h<10?('0'+h):h;
    hhhh = hhh<10?('0'+hhh):hhh;
    AMPM=(ampm=hhh<12?'am':'pm').toUpperCase();
    mm=(m=this.getMinutes())<10?('0'+m):m;
    ss=(s=this.getSeconds())<10?('0'+s):s;
    return formatString.replace("#hhhh#",hhhh).replace("#hhh#",hhh).replace("#hh#",hh).replace("#h#",h).replace("#mm#",mm).replace("#m#",m).replace("#ss#",ss).replace("#s#",s).replace("#ampm#",ampm).replace("#AMPM#",AMPM);
    //https://stackoverflow.com/questions/4673527/converting-milliseconds-to-a-date-jquery-javascript
  };

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

    if ($("#erase-mode").length != 0) {
      $("#erase-mode").remove();
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