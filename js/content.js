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
          if ($("#tool-option").length !== 0) {
            $("#tool-option").remove();
          }

          // Add content.css file
          if ($("#content-css").length === 0) {
            $("head").append('<link rel="stylesheet" href="' +
            chrome.runtime.getURL("css/content.css") +
            '" type="text/css" id="content-css"/>');
          }

          // Add sweet-alert-js file
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

          $('#read-btn').attr('src', '').promise().done(function () {
            $(this).attr('src', chrome.runtime.getURL("images/book-green.png"));
          });
          $("#read-btn").hover(function () { return true;});

          $("#tts-btn").hover(function () {
            $(this).attr('src', chrome.runtime.getURL("images/speak-green.png"));
          }, function () {
            $(this).attr('src', chrome.runtime.getURL("images/speak-white.png"));
          });

          $("#erase-btn").hover(function () {
            $(this).attr('src', chrome.runtime.getURL("images/erase-green.png"));
          }, function () {
            $(this).attr('src', chrome.runtime.getURL("images/erase-white.png"));
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
          
        };

        var _oldHead, _oldBody;
        var readMode = false;
        //Read Mode Button Function
        var readModeFunction = function () {
          console.log("Reading Mode On");
          chrome.runtime.sendMessage({ message: "open read mode" });

          if (!readMode) {

            if ($("#help-container").length !== 0) {
              helpMode = false;
              $("#help-container").remove();
            }
            removeExtensionElements();
            $("#read-text-icon, #read-text-domain, #read-text-words, #read-text-eta, #read-text-author, #read-text-published").remove();

            if ($("head").length !== 0) {
              _oldHead = $("head").html();
            }
            if ($("body").length !== 0) {
              _oldBody = $("body").html();
            }

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

            var dayOrNightFunction = function() {
              var curHours = new Date().getHours();
              if (curHours > 7 && curHours < 18) {
                return "day";
              } else {
                return "night";
              }
            };

            var cleanArticleContent = function (content) {
              var wrapper = document.createElement("div");
              wrapper.innerHTML = content;
              var node = wrapper.firstChild;

              //Programming tags - script, noscript, applet, embed, object, param
              $(node).find("script").remove();
              $(node).find("noscript").remove();
              $(node).find("applet").remove();
              $(node).find("embed").remove();
              $(node).find("object").remove();
              $(node).find("param").remove();

              //Other Tags - style, meta, link, comments
              $(node).find("style").remove();
              $(node).find("meta").remove();
              $(node).find("link").remove();

              //Frames tags	- frame, frameset, noframes, iframe
              $(node).find("frame").remove();
              $(node).find("iframe").remove();
              $(node).find("frameset").remove();
              $(node).find("noframes").remove();

              //Audio and Video tags - figure, audio, video, picture, source, track
              $(node).find("figure:has(video, audio)").each(function(){ this.remove(); });
              $(node).find("figure:has(img):has(source)").find("source").each(function(){ this.remove(); });
              $(node).find("video:has(source), video").each(function(){ this.remove(); });
              $(node).find("audio:has(source), audio").each(function(){ this.remove(); });
              $(node).find("track").remove();
              
              //Block elements
              $(node).find("header").remove();
              $(node).find("footer").remove();
              $(node).find("nav").remove();
              $(node).find("aside").remove();
              $(node).find("progress").remove();
              $(node).find("hr").remove();
              
              //Images tags	- map, area, canvas, svg, -- img, figcaption, figure, picture
              $(node).find("map").remove();
              $(node).find("area").remove();
              $(node).find("canvas").remove();
              $(node).find("svg").remove();

              //Forms and Input tags - form, input, select, textarea
              $(node).find("form").remove();
              $(node).find("input").remove();
              $(node).find("select").remove();
              $(node).find("label").remove();
              $(node).find("textarea").remove();
              $(node).find("legend").remove();
              $(node).find("button").remove();
              $(node).find("output").remove();
              $(node).find("option").remove();
              $(node).find("datalist").remove();
              $(node).find("fieldset").remove();
              $(node).find("optgroup").remove();
              //https://developer.mozilla.org/en-US/docs/Web/HTML/Element

              //Remove Twitter Widget
              $(node).find("twitter-widget").remove();

              //Remove all amp elements
              $(node).find("amp-iframe, amp-img, amp-sticky-ad, amp-ad, amp-analytics").each(function(){ this.remove(); });
              $(node).find('#S1_box').parent().remove();

              //Remove all comments
              $(node).contents().filter(function(){
                return this.nodeType === 8;
              }).each(function(){ this.remove(); });

              // Remove all data-attributes
              $(node).find("*").filter(function() {
                var dataset = this.dataset;
                 if($.isEmptyObject(dataset))
                   return false;
                else
                  return true;
              }).each(function(){
                var dataset = this.dataset;
                for (var key in dataset) {
                  this.removeAttribute("data-" + key.split(/(?=[A-Z])/).join("-").toLowerCase());
                }
              });

              //filter all images with conditions
              $(node).find('img').filter(function() {
                if(this.src.match(/.*\.svg$/)) //find all SVG files.
                  return true;
                else if (this.src.match(/.*\.gif$/)) //find all GIF files
                  return true;
                else if(this.width <= 100 && this.height <= 100)
                  return true;
                else if (this.typeof === "foaf:Image")
                  return true;
                else
                  return false; 
              }).each(function(){
                this.remove();
              });
              //img - src & srcset

              //Only show unique images - keep first and remove all other images
              var img_array_length = $(node).find('img').length;
              var img_array = $(node).find('img').map(function() { return $(this).attr("src"); });
              img_array = $.unique(img_array);
              if (img_array_length !== img_array.length){
                img_array.each(function(index, value) {
                  var sel = 'img[src="' + value + '"]';
                  $(node).find(sel).not($(node).find(sel + ":first")).remove();
                  console.log("Removed duplicate images");
                });
              }
              //https://stackoverflow.com/questions/8415910/filtering-duplicate-img-src-with-jquery-unique-or-remove

              $(node).find("figure:not(:has(img)):has(figcaption)").each(function(){ this.remove(); });

              // Add prettify class
              $(node).find("pre").each(function () {
                if($(this).hasClass("prettyprint")) {
                  //do nothing
                }else {
                  $(this).addClass("prettyprint");
                }
              });

              $(node).find("p").filter(function() {
                if (this.innerHTML.match(/\w+/g) === null) {
                  return true;
                } else {
                  return false;
                }
              }).each(function(){ this.remove(); });

              //$(node).find(":empty").each(function(){ this.remove(); });

              //Remove wrapper
              wrapper.remove();

              return node.outerHTML;
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

            var article = new Readability(uri, document).parse();

            if ($("html").length !== 0) {
              // Remove all head elements
              if ($("head").length !== 0) {
                $("head").html("");
              } else {
                var newHead = document.createElement("head");
                $(newHead).html("");
                $("html").append(newHead);
              }

              // Remove all body elements
              if ($("body").length !== 0) {
                $("body").html("");
                $("body").css({
                  margin: "0"
                });
              } else {
                var newbody = document.createElement("body");
                $(newbody).html("");
                $("html").append(newbody);
                $("body").css({
                  margin: "0"
                });
              }
            } else {
              var dom = document;
              if(dom === null) {
                document = new Document();
                dom = document.implementation.createHTMLDocument();
                var srcNode = dom.documentElement;
                var newNode = document.importNode(srcNode, true);
                document.replaceChild(newNode, document.documentElement);
              }
              var html = dom.createElement("html");
              var head = dom.createElement("head");
              var body = dom.createElement("body");
              head.innerHTML = "";
              body.innerHTML = "";
              dom.appendChild(html);
              html.appendChild(head);
              html.appendChild(body);
              $("body").css({
                margin: "0"
              });
            }

            addScripts();
            
            addFonts();
            
            // Add Read Container
            if ($("#read-container").length === 0) {
              $("body").append("<div id='read-container'></div>");
            }

            // Add Read Option
            if ($("#read-option").length === 0) {
              $("#read-container").append(
                "<div id='read-option'></div>"
              );
            }
            if ($("#read-option-btn").length === 0) {
              $("#read-option").append(
                "<div id='read-option-btn'><img id='read-option-btn-icon' title='option' src='" +
                chrome.runtime.getURL("images/option-blue.png") +
                "'/></div>"
              );
            }

            var dayOrNight = dayOrNightFunction();

            var _optionClicked = false;
            // Read Option Button Clicked
            $("#read-option-btn").click(function () {
              if (!_optionClicked) {
                _optionClicked = true;
                if ($("#read-option-box").length === 0) {
                  $("#read-option").append(
                    "<div id='read-option-box'></div>"
                  );
                } else {
                  $("#read-option-box").show();
                }

                //Font Size toggle button
                if ($("#read-font-size").length === 0) {
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
                if ($("#read-font-family").length === 0) {
                  $("#read-option-box").append(
                    "<div id='read-font-family'>\
                    <Label>Typography:</Label>\
                    <input type='radio' id='font-sans-serif' name='sans-serif' value='sans-serif' checked> Sans-Serif\
                    <input type='radio' id='font-verdana' name='verdana' value='Verdana'> Verdana\
                    <input type='radio' id='font-georgia' name='georgia' value='Georgia'> Georgia\
                    <input type='radio' id='font-lucida-sans' name='lucida-sans' value='Lucida Sans'> Lucida Sans\
                    <input type='radio' id='font-literata' name='literata' value='Literata-Regular'> Literata\
                    <input type='radio' id='font-bookerly' name='bookerly' value='Bookerly-Regular'> Bookerly\
                    <input type='radio' id='font-open-dyslexic' name='open-dyslexic' value='OpenDyslexic-Regular'> Open Dyslexic\
                    </div>"
                  );
                }
                //Color Theme toggle button
                if ($("#read-color-theme").length === 0) {
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
                  if (this.value === "small") {
                    $("#read-text").removeClass('small').removeClass('medium').removeClass('large').addClass('small');
                  } else if (this.value === "medium") {
                    $("#read-text").removeClass('small').removeClass('medium').removeClass('large').addClass('medium');
                  } else if (this.value === "large") {
                    $("#read-text").removeClass('small').removeClass('medium').removeClass('large').addClass('large');
                  }
                  $("#read-font-size")
                    .find('input[type="radio"]:not(#' + this.id + ")")
                    .prop("checked", false);
                });

                $("#read-font-family :input").change(function () {
                  $("#read-text-title, #read-text-words, #read-text-eta, #read-text-author, #read-text-published, #read-text-domain, #read-text-content").css({
                    fontFamily: this.value
                  });
                  $("#read-font-family")
                  .find('input[type="radio"]:not(#' + this.id + ")")
                  .prop("checked", false);
                });

                $("#read-color-theme :input").change(
                  function () {
                    if (this.value === "day") {
                      $("#read-container").removeClass("night").addClass("day");
                      $("#read-text").removeClass("night").addClass("day");
                    } else if (this.value === "night") {
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

            //Create Read Text
            if ($("#read-text").length === 0) {
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
              if ($("#read-text-error").length === 0) {
                $("#read-text").append(
                  "<div id='read-text-error'><img src='" +
                    chrome.runtime.getURL("icons/icon_128.png") +
                    "'/>" + "<h1>Sorry! this page is unreadable.</h1></div>"
                );
              }
              $("#read-text-error img").addClass("animated hinge delay-2s");
              $("#read-option").hide();
              console.log("Article is not readable");
            } else {
              if ($("title").length === 0) {
                var title = document.createElement("title");
                title.text = "Read Pro: " + article.title;
                $("head").append(title);
              } else {
                $("title").text = "Read Pro: " + article.title;
              }
              $("head").append('<link id="read-favicon" rel="shortcut icon" type="image/png" href="' + articleInfo.favicon + '" />');

              if ($("#read-text-icon").length === 0) {
                $("#read-text").append("<img id='read-text-icon'></img>");
              }
              if ($("#read-text-domain").length === 0) {
                $("#read-text").append("<span id='read-text-domain'></span>");
              }
              if ($("#read-text-title").length === 0) {
                $("#read-text").append("<h1 id='read-text-title'></h1>");
              }
              if ($("#read-text-words").length === 0) {
                $("#read-text").append("<span id='read-text-words'></span>");
              }
              if ($("#read-text-eta").length === 0) {
                $("#read-text").append("<span id='read-text-eta'></span>");
              }
              if ($("#read-text-author").length === 0) {
                $("#read-text").append("<span id='read-text-author'></span>");
              }
              if ($("#read-text-published").length === 0) {
                $("#read-text").append("<time id='read-text-published'></time>");
              }
              if ($("#read-text-content").length === 0) {
                $("#read-text").append("<div id='read-text-content'></div>");
              }

              $("#read-text-icon").attr("src", articleInfo.favicon);
              $("#read-text-domain").text(article.uri.host);
              $("#read-text-title").text(article.title);
              $("#read-text-content").html(cleanArticleContent(article.content));
              var _articleWCount = wordCount(article.textContent);
              var _articleETA = estimatedReadingTime(_articleWCount);
              $("#read-text-words").text("Total words: " + _articleWCount);
              $("#read-text-eta").text("Reading time: " + _articleETA + " mins");
              if(article.byline !== null && article.byline !== "") {
                $("#read-text-author").text("Author: " + article.byline);
              }
              if(articleInfo.date_published !== null && articleInfo.date_published !== "") {
                $("#read-text-published").text("Published: " + new Date(articleInfo.date_published)
                .customFormat("#DDD# #DD# #MMM# #YYYY# #h#:#mm# #AMPM#"));
              }
              // Add prevent default to all click event
              $("#read-text-content").find("a").each(function () {
                $(this).click(function (event) {
                  event.preventDefault();
                  event.stopPropagation();
                });
              });

              if ($("#read-text-footer").length === 0) {
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
            if ($('#read-btn').length !== 0) {
              $('#read-btn').attr('src', '').promise().done(function () {
                $(this).attr('src', chrome.runtime.getURL("images/book-green.png"));
              });
            }
          } else {
            readMode = false;
            $("#read-container").remove();
            removeExtensionElements();
            location.reload(false);
            //document.head.innerHTML = _oldHead;
            //document.body.innerHTML = _oldBody;            
            //createToolOptions();
          }
        };

        var addFonts = function () {
          $("<style>")
            .prop("type", "text/css")
            .prop("id", "font-style")
            .html(
              "@font-face {" +
                "font-family: 'OpenDyslexic-Regular';" +
                "src: url('" + chrome.runtime.getURL('fonts/OpenDyslexic-Regular.otf') + "');}" +
              "@font-face {" +
                "font-family: 'Literata-Regular';" +
                "src: url('" + chrome.runtime.getURL('fonts/Literata-Regular.otf') + "');}" + 
              "@font-face {" +
                "font-family: 'Bookerly-Regular';" +
                "src: url('" + chrome.runtime.getURL('fonts/Bookerly-Regular.ttf') + "');}"
            ).appendTo("head");
        };

        var addScripts = function () {
          var s = document.createElement("script");
          s.type = "text/javascript";
          s.id = "prettify-script";
          s.src =
            "https://cdn.jsdelivr.net/gh/google/code-prettify@master/loader/run_prettify.js?autoload=true";
          $("head").append(s);
        };

        var observeBodyChanges = function() {
          // Select the node that will be observed for mutations
          var targetNode = document.getElementsByTagName("body")[0];
          
          // Options for the observer (which mutations to observe)
          var config = { attributes: false, childList: true, subtree: false };

          // Callback function to execute when mutations are observed
          var callback = function(mutations, observer) {
            for(var mutation of mutations) {
              var newNodes = mutation.addedNodes; // DOM NodeList
              if( newNodes !== null  && newNodes.length > 0) { // If there are new nodes added
                var $nodes = $(newNodes); // jQuery set
                $nodes.each(function() {
                  var $node = $(this);
                  if ($node.hasClass("swal-overlay") ||
                      $node.is("#tool-option") ||
                      $node.is("#read-container") ||
                      $node.is("#help-container") ||
                      $node.is("#dialog-box") ||
                      $node.is("#tts-mode")) {
                    //console.log("Extension element " + this.tagName + "#" + this.id + " inserted");
                  } else {
                    console.log("Unknown element " + this.tagName + "#" + this.id + " inserted in body");
                    this.remove();
                  }
                });
              }
            }
           }

          var observer = new MutationObserver(callback);
          // Start observing the target node for configured mutations
          observer.observe(targetNode, config);
          setTimeout( function() { 
              console.log("Body Observer disconnected");
              // Later, you can stop observing
              cleanWebsite();
              observer.disconnect();
            }, 30000);
        };

        var observeHtmlChanges = function() {
          // Select the node that will be observed for mutations
          var targetNode = document.getElementsByTagName("html")[0];
          
          // Options for the observer (which mutations to observe)
          var config = { attributes: false, childList: true, subtree: false };

          // Callback function to execute when mutations are observed
          var callback = function(mutations, observer) {
            for(var mutation of mutations) {
              var newNodes = mutation.addedNodes; // DOM NodeList
              if( newNodes !== null && newNodes.length > 0) { // If there are new nodes added
                var $nodes = $(newNodes); // jQuery set
                $nodes.each(function() {
                  var $node = $(this);
                  if ($node.is("body") || $node.is("head")) {
                  } else {
                    console.log("Unknown element " + this.tagName + "#" + this.id + " inserted in html");
                    this.remove();
                  }
                });
              }
            }
           }

          var observer = new MutationObserver(callback);
          // Start observing the target node for configured mutations
          observer.observe(targetNode, config);
          setTimeout(function() { 
              console.log("Head Observer disconnected");
              // Later, you can stop observing
              observer.disconnect();
            }, 30000);
        };

        var removeAttr = function(elem) {
          elem.className = '';
          while (elem.attributes.length > 0)
            elem.removeAttribute(elem.attributes[0].name);
        };

        var cleanWebsite = function () {
          removeAttr($("html").get(0)); //remove all html attributes
          removeAttr($("head").get(0)); //remove all head attributes
          removeAttr($("body").get(0)); //remove all body attributes
          $(document, "html", "head", "body").contents().filter(function() { return this.nodeType === 8; }).remove(); //remove all comments

          $("span.gr__tooltip").remove();  //remove span.gr__tooltip
          $("body").nextAll("div, iframe, link, span, p, a").remove(); //remove all elements after body
          console.log("Website cleaned!");
        };

        //Text to Speech Mode Button Function
        var ttsModeFunction = function () {
          console.log("Text to Speech mode is on");
          chrome.runtime.sendMessage({ message: "open speak mode" });
          var ttsMode = true;
          var selectedVoice = {};
          var voiceChangedIndex = -1;
          var synth = window.speechSynthesis;
          $("#tool-option").hide();

          if ($("#help-container").length !== 0) {
            helpMode = false;
            $("#help-container").remove();
          }

          if ($("#tts-mode").length === 0) {
            //tts-mode doesn't exist
            $("body").append("<div id='tts-mode'></div>");
            $("#tts-mode").text("Speech to Text Mode");
            $("#tts-mode").fadeToggle();
          } else {
            //tts-mode exist
            $("#tts-mode").text("Speech to Text Mode");
            $("#tts-mode").fadeToggle();
          }

          if ($("#dialog-box").length === 0) {
            //dialog-box doesn't exist
            $("body").append(
              "<div id='dialog-box'><select id='speech-voices'></select><div id='speech-inner'><button id='apply-btn'>Speak</button><button id='cancel-btn'>Cancel</button></div></div>"
            );
          } else {
            if ($("#speech-voices").length === 0) {
              $("#dialog-box").prepend("<select id='speech-voices'></select>");
              $("#speech-voices").after("<div id='speech-inner'></div>");
              $("#speech-inner").append($("#apply-btn"));
              $("#speech-inner").append($("#cancel-btn"));
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
              button: "Damn",
              timer: 2000
            });
          } else {
            loadVoiceList();
            if (synth.onvoiceschanged !== undefined) {
              synth.onvoiceschanged = loadVoiceList;
            }
          }

          function loadVoiceList() {
            var voices = synth.getVoices();
            if ($("#speech-voices option").length === 0) {
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

              if ($("#speech-voices option").length === 0) {
                $("#speech-voices").hide();
              } else {
                $("#speech-voices").show();
              }

              $("#speech-voices").on("change", function () {
                var voiceIndex = this.value;
                if (voices.length !== 0) {
                  selectedVoice = voices[voiceIndex];
                  voiceChangedIndex = voiceIndex;
                }
              });

              if (voices.length > 0 && synth.onvoiceschanged !== undefined) {
                // unregister event listener (it is fired multiple times)
                synth.onvoiceschanged = null;
              }
            }
          }

          var text2Speech = [];
          var textArray = "";
          var speaker;
          var speakDefault = false;

          synth.cancel();

          $(document).click(function (event) {
            if (ttsMode) {
              if (event.target.id === "apply-btn" && event.target.innerText === "Speak") {
                //apply button clicked
                console.log("Speaks all selected text");
                if (synth.speaking) {
                  console.log("Synth speaking");
                  synth.cancel();
                }

                if(textArray.length === 0 && readMode === true) {
                  var _articleContent = $("#read-text-content").text();
                  textArray = chuckText(_articleContent);
                  textArray.unshift($("#read-text-eta").text());
                  textArray.unshift("Title - " + $("#read-text-title").text());
                  textArray.push("This article is powered by Read Pro.");
                  speakDefault = true;
                }

                if (textArray.length !== 0) {
                  $.each(textArray, function () {
                    speaker = new SpeechSynthesisUtterance(this.trim());
                    if (!$.isEmptyObject(selectedVoice)) {
                      speaker.voice = selectedVoice;
                    }
                    synth.speak(speaker);

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
                //Pause button clicked
                console.log("Speech paused");
                synth.pause();
                $("#tts-mode").text("Speech Paused");
                $("#tts-mode").fadeToggle();
                $("#apply-btn").html("Resume");
              } else if (event.target.id === "apply-btn" && event.target.innerText === "Resume") {
                //Resume button clicked
                console.log("Speech resumed");
                synth.resume();
                $("#tts-mode").text("Speaking in " + speaker.voice.name + " ...");
                $("#tts-mode").fadeToggle();
                $("#apply-btn").html("Pause");
              } else if (event.target.id === "cancel-btn") {
                //cancel button clicked
                console.log("Cancel Text to Speech mode");
                $("#tts-mode").text("Text to Speech mode off!");
                $("#tts-mode").fadeToggle();
                $("#apply-btn").html("Apply Changes");
                synth.cancel();
                text2Speech = "";
                textArray = [];
                selectedVoice = {};
                ttsMode = false;
                removeExtensionElements();
                createToolOptions();
              } else {
                text2Speech = window.getSelection().toString();
                textArray = chuckText(text2Speech);
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
            .replace(/[^\w\s.,'!?&<=>%;$]/g, ""); //all non-words & non-space
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

          if ($("#help-container").length !== 0) {
            helpMode = false;
            $("#help-container").remove();
          }

          if ($("#dialog-box").length === 0) {
            //dialog-box doesn't exist
            $("body").append("<div id='dialog-box'><button id='apply-btn'>Apply Changes</button><button id='cancel-btn'>Cancel</button></div>");
          } else {
            $("#dialog-box").show();
          }

          // Click an element in erase mode
          $(document).click(function (event) {
            if (eraseMode) {
              //console.log(event.target);
              if (
                $('#tool-option').has($(event.target)).length > 0 || // All Tool Option Elements
                event.target.id === "dialog-box" ||
                event.target.id === "speech-voices" ||
                event.target.id === "read-container" || // All Read Mode Elements
                $('#read-option').has($(event.target)).length > 0 || // All Read Option Elements
                $('#read-text-footer').has($(event.target)).length > 0 || // All Read Text Footer Elements
                event.target.id === "read-text" ||
                event.target.id === "read-text-content" ||
                event.target.id === "tts-mode" ||
                $('#help-container').has($(event.target)).length > 0 || // All Help Mode Elements
                event.target.tagName === "BODY"
              ) {
                // Don't select extension elements
              } else if (event.target.id === "apply-btn") {
                //apply button clicked
                console.log("Erased all selected elements");
                $(".web-edited").each(function() {
                  $(this).removeClass("web-edited");
                  $(this).addClass("web-deleted");
                });
                swal({
                  title: "Read Pro",
                  text: "All selected elemenst are erased!",
                  icon: "success",
                  button: "Kewl",
                  timer: 2000
                });
                removeExtensionElements();
                createToolOptions();
                eraseMode = false;
              } else if (event.target.id === "cancel-btn") {
                //cancel button clicked
                console.log("Canceled erasing all selected elements");
                $(".web-edited").each(function() {
                  $(this).removeClass("web-edited");
                });
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

          if ($("#help-container").length !== 0) {
            helpMode = false;
            $("#help-container").remove();
          }

          if ($("#dialog-box").length === 0) {
            //dialog-box doesn't exist
            $("body").append(
              "<div id='dialog-box'><button id='apply-btn'>Save Highlights</button><button id='cancel-btn'>Cancel</button></div>"
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
            var s = new Array(0), rs = new Array(0);
            if (dangerous.startContainer != a)
              for (var i = dangerous.startContainer; i != a; i = i.parentNode)
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
              for (var i = dangerous.endContainer; i != a; i = i.parentNode)
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
                lightMode = false;
                removeExtensionElements();
                createToolOptions();
              } else if (event.target.id === "cancel-btn") {
                //cancel button clicked
                console.log("Cancel highlight from all selected elements");
                $(".manual-highlight").each(function () {
                  $(this).removeClass("manual-highlight");
                });
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
        //Save Link Button Function
        var saveLinksFunction = function () {
          console.log("Save link mode is on");
          saveLinkMode = true;

          if (saveLinkMode) {
            chrome.runtime.sendMessage({
                message: "save link"
              },
              function (response) {
                if (response.message === "link saved") {
                  swal({
                    title: "Read Pro",
                    text: "Link Saved!",
                    icon: "success",
                    button: "Kewl",
                    timer: 2000
                  });
                } else if (response.message === "link duplicate") {
                  swal({
                    title: "Read Pro",
                    text: "Links Already Saved!",
                    icon: "warning",
                    button: "Kewl",
                    timer: 2000
                  });
                } else {
                  swal({
                    title: "Read Pro",
                    text: "Error: Please Try again!",
                    icon: "error",
                    button: "Kewl",
                    timer: 2000
                  });
                }
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
            if ($("#help-container").length !== 0) {
              helpMode = false;
              $("#help-container").remove();
            }
            mediaQueryList.addListener(function (mql) {
              if (mql.matches) {
                console.log("Hide unnecesary elements");
                $("#tool-option").hide();
                $("#dialog-box").hide();
                if(readMode){
                  $("#read-option").hide();
                  $("#read-text").css({
                    width: "100%"
                  });
                  cleanWebsite();
                }
              } else {
                console.log("Show all elements");
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
            if ($("#help-container").length === 0) {
              $("body").append("<div id='help-container'></div>");
              var helpHtml =
                "<div id='cross-btn'>X</div>\
                <div id='help-title'>Read Pro: Help Doc</div>\
                <div id='help-content'>\
                  <div>\
                  <p>Use this powerful tool by either clicking the icon <img src='" + chrome.runtime.getURL("icons/icon_16.png") + "'/> or pressing the '<i>Ctrl+Shift+L</i>' key.</p>\
                  <p>Want to learn more? Check out the Read Pro extension <a href='https://sites.google.com/view/readpro/home' title='Read Pro' target='_blank'>website</a>.</p>\
                  </div>\
                  <div><span>Read Mode (default):</span><p>Transform the website into a clean readable page with various styling options.</p></div>\
                  <div><span>Text to Speak Mode:</span><p>Read out loud any selected text from the web page. Choose voices from various voice options.</p></div>\
                  <div><span>Erase Mode:</span><p>Erases any unnecessary element from the web page on a single click. Select the element and use Apply button to erase. Use Cancel button to Undo any changes.</p></div>\
                  <div><span>Highlight Mode:</span><p>Use the inbuilt Highlighter to highlight any text on the web page. Remove all highlights using the cancel button.</p></div>\
                  <div><span>Save Page for Later:</span><p>Save favorite web pages in a reading queue for a later read. Detect any previously saved pages.</p></div>\
                  <div><span>Open Reading Queue:</span><p>View the Read for Later list. Sort the list using various options as well as delete the unwanted web page.</p></div>\
                  <div><span>Save as PDF:</span><p>One click to save the web page into PDF file locally. See empty pages? Try unselecting Headers & Footers options.</p></div>\
                </div>\
                ";
              $("#help-container").append($.parseHTML(helpHtml));
            } else {
              $("#help-container").show();
            }
          } else {
            console.log("Help mode off");
            helpMode = false;
            $("#help-container").remove();
          }

          $("#cross-btn").click(function (event) {
            if (helpMode) {
              helpMode = false;
              $("#help-container").remove();
              console.log("Help mode off");
            } else {
              console.warn("Help mode is already off");
            }
          });
        };
        removeExtensionElements();
        readModeFunction();
        cleanWebsite();
        observeBodyChanges();
        observeHtmlChanges();
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
    if ($("#tool-option").length !== 0) {
      $("#tool-option").remove();
    }

    if ($("#dialog-box").length !== 0) {
      $("#dialog-box").remove();
    }

    if ($("#tts-mode").length !== 0) {
      $("#tts-mode").remove();
    }

    if ($("#help-container").length !== 0) {
      $("#help-container").remove();
    }
  };
})();