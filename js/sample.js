alert('This is sample.js');

//"content_security_policy": "script-src 'self' https://www.google-analytics.com; object-src 'self'",

/*
chrome.browserAction.onClicked.addListener(function(tab) {
  if (activeTabs.length === 0) {
    console.log(tab);
    activeTabs.push(tab.title);
    ga("send", "event", "Icon", "Activated", "", "1");
    //chrome.tabs.executeScript(tab.id, {file:"js/action.js"});
    executeScripts(null, [
      {
        file: "third-party/jquery.min.js"
      },
      {
        file: "third-party/ga.js"
      },
      {
        file: "js/content.js"
      }
      //{ file: "helper.js" },
      //{ code: "transformPage();" }
    ]);
    chrome.browserAction.setIcon({
      path: "icons/icon_on_16.png",
      tabId: tab.id
    });
    extensionActive = true;
  } else {
    var tabIndex = activeTabs.indexOf(tab.title);
    if (tabIndex >= 0) {
      activeTabs = activeTabs.filter(item => item !== tab.title);
      ga("send", "event", "Icon", "Deactivated", "", "1");
      chrome.tabs.executeScript(tab.id, {
          file: "js/no-action.js"
      });
      executeScripts(null, [
        {
          file: "third-party/jquery.min.js"
        },
        {
          file: "js/no-action.js"
        }
      ]);
      chrome.browserAction.setIcon({
        path: "icons/icon_16.png",
        tabId: tab.id
      });
      extensionActive = false;
    } else {
      activeTabs.push(tab.title);
      ga("send", "event", "Icon", "Activated", "", "1");
      chrome.tabs.executeScript(tab.id, {
          file: "js/action.js"
      });
      executeScripts(null, [
        {
          file: "third-party/jquery.min.js"
        },
        {
          file: "third-party/ga.js"
        },
        {
          file: "js/content.js"
        }
      ]);
      chrome.browserAction.setIcon({
        path: "icons/icon_on_16.png",
        tabId: tab.id
      });
      extensionActive = true;
    }
  }
});

*/

/* 
function formatPage() {
  var _settings = {};

  chrome.runtime.sendMessage(
    {
      message: "send settings"
    },
    function(response) {
      if (response.message === "setting sent") {
        _settings = response.data;
        console.log("settings available: " + JSON.stringify(_settings));

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
        }
      } else {
        console.error("Settings unavailable. Try again");
        chrome.runtime.sendMessage(
          {
            message: "settings unavailable"
          },
          function(response) {
            console.log(response.message);
          }
        );
      }
    }
  );
}
 */
/* 
           var webDetails = function() {
              var web = {};
              web.title =
                $("title").text() ||
                $("meta[name='title']").attr("content") ||
                $("meta[property='og:title']").attr("content") ||
                "";
              web.author =
                $("meta[name='author']").attr("content") || "";
              web.url =
                $("meta[property='og:url']").attr("content") || "";
              web.sitename =
                $("meta[property='og:site_name']").attr(
                  "content"
                ) || "";
              if (web.url !== "") {
                web.domain = new URL(web.url).hostname;
              }
              web.type =
                $("meta[property='og:type']").attr("content") || "";
              web.description =
                $('meta[name="description"]').attr("content") ||
                $("meta[property='og:description']").attr(
                  "content"
                ) ||
                "";
              web.date_published =
                Date.parse(
                  $("meta[property='article:published_time']").attr(
                    "content"
                  )
                ) || "";
              web.lead_image_url =
                $("meta[property='og:image']").attr("content") ||
                "";
              web.next_page_url = null;
              web.rendered_pages = 1;
              web.total_pages = 1;
              return web;
            };

            //console.log(webDetails());

$("#tts-btn").hover(function () {
            $(this).attr('src', chrome.runtime.getURL("images/speak_grayed.png"));
          }, function () {
            $(this).attr('src', chrome.runtime.getURL("images/speak.png"));
          });

 */

//"content_scripts": [{
//"matches": ["*://*/*"],
//"exclude_globs": ["*://*facebook.com/*", "https://www.reddit.*/*", "https://twitter.*/*"],
//"js": ["third-party/jquery.min.js", "third-party/ga.js", "third-party/readability.js", "js/content.js"]
//}],

/*  //window.open(chrome.runtime.getURL("html/welcome.html"));
  var _settings = JSON.parse(localStorage.getItem("clear-page-settings"));
  if (_settings === null || _settings === {}) {
    console.log("local settings not available. Importing from external source.");
    $.getJSON(chrome.runtime.getURL("json/settings.json"), function (data) {
      localStorage.setItem("clear-page-settings", JSON.stringify(data));
    });
  } else {
    console.log("local settings available. Importing from local source.");
  }
 */

/* 
  $.each(voices, function() {
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
      console.log(
        "Default voice: " +
          this.name +
          " , language: " +
          this.lang
      );
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
 */


/* var sadHorn = this.createElement({
        type: 'DIV',
        id: 'readability-message',
        innerHTML: `<div>Sorry but we couldn't parse this page :( - Rocket Readability</div>`
      }); */

/* $("#read-container").append(
              "<div id='read-option'></div>"
            );
            $("#read-option").append(
              "<img id='read-option-btn' title='option' src='" + chrome.runtime.getURL("images/option.png") + "'/>"
            );
            $("#read-option-btn").click(openOptionBox);
            $("#read-option-btn").css({
              width: "30px",
              height: "30px",
              display: "block",
              cursor: "pointer",
              marginBottom: "15px"
            });

            var openOptionBox = function () {
              $("#read-option").append(
                "<div id='read-option-box'></div>"
              );
              $("#read-option-box").append(
                "<button id='toggle-theme' class='toggle-off'>Theme</button>"
              );
              $("toggle-theme").click(function () {
                if($("toggle-theme").hasClass("toggle-off")) {
                  $("toggle-theme").removeClass("toggle-off").addClass("toggle-on");
                  $("#read-container").css({backgroundColor: "black"});
                } else {
                  $("toggle-theme")
                    .removeClass("toggle-on")
                    .addClass("toggle-off");
                  $("#read-container").css({
                    backgroundColor: "#333"
                  });
                }
              });
            }; */