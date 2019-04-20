"use strict";
//ga('send','event','category','action','label','value');

var activeTabs = [];
var settingsLoaded = false;
var settingsObject = {};
var exitURL = "https://nids0810.github.io/clear-page/exit.html";

chrome.browserAction.onClicked.addListener(function (tab) {
    if (activeTabs.length === 0) {
      console.log(tab);
      activeTabs.push(tab.title);
      ga("send", "event", "Icon", "Activated", "", "1");
      //chrome.tabs.executeScript(tab.id, {file:"js/action.js"});
      executeScripts(null, [{
              file: "third-party/jquery.min.js"
          }, {
              file: "third-party/ga.js"
          }, {
              file: "js/action.js"
          }
          //{ file: "helper.js" },
          //{ code: "transformPage();" }
      ]);
      chrome.browserAction.setIcon({
          path: "icons/icon_on_16.png",
          tabId: tab.id
      });
    } else {
        var tabIndex = activeTabs.indexOf(tab.title);
        if (tabIndex >= 0) {
            activeTabs = activeTabs.filter(item => item !== tab.title);
            ga("send", "event", "Icon", "Deactivated", "", "1");
            chrome.tabs.executeScript(tab.id, {
                file: "js/no-action.js"
            });
            chrome.browserAction.setIcon({
                path: "icons/icon_16.png",
                tabId: tab.id
            });
        } else {
            activeTabs.push(tab.title);
            ga("send", "event", "Icon", "Activated", "", "1");
            /* chrome.tabs.executeScript(tab.id, {
                file: "js/action.js"
            }); */
            executeScripts(null, [{
                file: "third-party/jquery.min.js"
            }, {
                file: "third-party/ga.js"
            }, {
                file: "js/action.js"
            }]);
            chrome.browserAction.setIcon({
                path: "icons/icon_on_16.png",
                tabId: tab.id
            });
        }
    }
});

function executeScripts(tabId, injectDetailsArray) {
    function createCallback(tabId, injectDetails, innerCallback) {
        return function () {
            chrome.tabs.executeScript(tabId, injectDetails, innerCallback);
        };
    }

    var callback = null;

    for (var i = injectDetailsArray.length - 1; i >= 0; --i)
        callback = createCallback(tabId, injectDetailsArray[i], callback);

    if (callback !== null)
        callback(); // execute outermost function
}

chrome.runtime.onInstalled.addListener(function () {
    console.log("Welcome to Clear Page!");
    ga("send", "event", "Extension", "Installed", "", "10");
    //window.open(chrome.runtime.getURL("html/welcome.html"));
    if (localStorage.getItem("clear-page-settings") === null || localStorage.getItem("clear-page-settings") === "{}") {
      console.log("local settings not available. Importing from external source.");
      $.getJSON(chrome.runtime.getURL("json/settings.json"), function(data) {
        localStorage.setItem("clear-page-settings", JSON.stringify(data));
        settingsObject = JSON.parse(
          localStorage.getItem("clear-page-settings", function() {
            console.log("settings retrived.");
          })
        );
        settingsLoaded = true;
      });
    } else {
      console.log("local settings available. Importing from local source.");
      settingsObject = JSON.parse(
        localStorage.getItem("clear-page-settings", function(params) {
          console.log("settings retrived.");
        })
      );
      settingsLoaded = true;
    }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
    //Test message
    if (request.grettings == "hello") {
        sendResponse({farewell: "goodbye"});
    }
    
    //send settings object
    if (request.message == "send settings") {
      if (settingsLoaded){
        sendResponse({ message: settingsObject });
      } else {
        loadSettingsObject();
        sendResponse({ message: settingsObject });
      }
    }

    //update settings object
    if (request.message == "update settings"){
        settingsObject = request.data;
        localStorage.setItem(
          "clear-page-settings",
          JSON.stringify(settingsObject)
        );
        sendResponse({ message: "settings updated." });
    }

    //open settings
    if (request.message == "open settings") {
      if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
      } else {
        window.open(chrome.runtime.getURL("html/options.html"));
      }
      sendResponse({ message: "settings opened" });
     }

     //settings unavailable
    if (request.message == "settings unavailable") {
      loadSettingsObject();
      sendResponse({ message: "settings loaded" });
    }

});

function loadSettingsObject(){
  console.log("load settings again");
}

chrome.runtime.setUninstallURL(exitURL, function (){
  console.log("extention uninstalled.");
  localStorage.removeItem("clear-page-settings");
  ga('send', 'event', 'Extension', 'Uninstalled', '', '');  
});