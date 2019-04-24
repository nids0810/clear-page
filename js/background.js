"use strict";
//ga('send','event','category','action','label','value');

var _activeTabs = [];
var _extensionActive = false;
var exitURL = "https://nids0810.github.io/clear-page/exit.html";

chrome.browserAction.onClicked.addListener(function (tab) {
  if (!_extensionActive) {
    console.log(tab);
    _activeTabs.push({
      "tab": tab
    });
    ga("send", "event", "Icon", "Activated", "", "1");
    //chrome.tabs.executeScript(tab.id, {file:"js/action.js"});
    executeScripts(null, [{
      file: "third-party/jquery.min.js"
    }, {
      file: "third-party/ga.js"
    }, {
      file: "js/content.js"
    }]);
    chrome.browserAction.setIcon({
      path: "icons/icon_on_16.png",
      tabId: tab.id
    });
    chrome.browserAction.setBadgeText({
      text: "on"
    }, function () {
      console.log("Badge On");
    });
    _extensionActive = true;
  } else {
    //if (_activeTabs.indexOf(tab.title) >= 0) {_activeTabs = _activeTabs.filter(item => item !== tab.title);}
    ga("send", "event", "Icon", "Deactivated", "", "1");
    _activeTabs.forEach(function (items) {
      console.log(items.tab.title + " - off");
      chrome.tabs.executeScript(
        items.tab.id, {
          file: "js/no-action.js"
        },
        result => {
          const lastErr = chrome.runtime.lastError;
          if (lastErr)
            console.log(
              "tab: " + tab.id + " lastError: " + JSON.stringify(lastErr)
            );
        }
      );
      _activeTabs = [];
      chrome.browserAction.setIcon({
        path: "icons/icon_16.png",
        tabId: items.id
      });
    });
    chrome.browserAction.setBadgeText({
      text: "Off"
    }, function () {
      console.log("Badge Off");
    });
    _extensionActive = false;
  }
});

// fucntion to execute multiple files in a row
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
  _extensionActive = false;

  //window.open(chrome.runtime.getURL("html/welcome.html"));
  var _settings = JSON.parse(localStorage.getItem("clear-page-settings"));
  if (_settings === null || _settings === {}) {
    console.log("local settings not available. Importing from external source.");
    $.getJSON(chrome.runtime.getURL("json/settings.json"), function (data) {
      localStorage.setItem("clear-page-settings", JSON.stringify(data));
    });
  } else {
    console.log("local settings available. Importing from local source.");
  }

  var _savedlinks = JSON.parse(localStorage.getItem("clear-page-saved-links"));

  if (_savedlinks === null || _savedlinks === "") {
    console.log("Saved links list not available. Reset the list");
    localStorage.setItem("clear-page-saved-links", JSON.stringify([]));
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
  //Test message
  if (request.grettings == "hello") {
    sendResponse({
      farewell: "goodbye"
    });
  }

  if (request.message == "extension active?") {
    console.log("context script - answer: " + _extensionActive);
    if (_extensionActive) {
      chrome.browserAction.setIcon({
        path: "icons/icon_on_16.png",
        tabId: sender.tab.id
      });
      _activeTabs.push({
        tab: sender.tab
      });
    } else {
      chrome.browserAction.setIcon({
        path: "icons/icon_16.png",
        tabId: sender.tab.id
      });
    }
    sendResponse({
      message: _extensionActive
    });
  }

  //send settings object
  if (request.message == "send settings") {
    var _settings = JSON.parse(localStorage.getItem("clear-page-settings"));
    if (_settings !== null || _settings !== {}) {
      sendResponse({
        message: "setting sent",
        data: _settings
      });
    } else {
      loadSettingsObject();
      var _settings = JSON.parse(
        localStorage.getItem("clear-page-settings")
      );
      sendResponse({
        message: "setting sent",
        data: _settings
      });
    }
  }

  //update settings object
  if (request.message == "update settings") {
    if (request.data === null || request.data === "" || request.data === {}) {
      localStorage.setItem(
        "clear-page-settings",
        JSON.stringify(request.data)
      );
      sendResponse({
        message: "settings updated."
      });
    } else {
      sendResponse({
        message: "settings invalid."
      });
    }
  }

  //open settings
  if (request.message == "open settings") {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL("html/options.html"));
    }
    sendResponse({
      message: "settings opened"
    });
  }

  //settings unavailable
  if (request.message == "settings unavailable") {
    loadSettingsObject();
    var _settings = JSON.parse(localStorage.getItem("clear-page-settings"));
    sendResponse({
      message: "settings reloaded",
      data: _settings
    });
  }

  if (request.message == "save link") {
    if (!($.isEmptyObject(sender.tab))) {
      var savedLink = {};
      //var url = new URL(sender.tab.url);
      savedLink.title = sender.tab.title;
      savedLink.domain = new URL(sender.tab.url).hostname;
      savedLink.url = sender.tab.url;
      savedLink.favIconUrl = sender.tab.favIconUrl;
      savedLink.dateSaved = Date.now();
      console.log("Saved Link: " + JSON.stringify(savedLink));
      if (pushUniqueLinks(savedLink)) {
        console.log("Link saved");
        sendResponse({
          message: "link saved"
        });
      } else {
        console.log("Link duplicate");
        sendResponse({
          message: "link duplicate"
        });
      }
    } else {
      sendResponse({
        message: "error"
      });
    }
  }

  if (request.message == "delete link") {
    //_savedlinks = JSON.parse(request.data);
    _savedlinks = request.data;
    if (Array.isArray(_savedlinks)) {
      console.log("List updated." + JSON.stringify(_savedlinks));
      localStorage.setItem("clear-page-saved-links", JSON.stringify(_savedlinks));
      sendResponse({
        message: "Success"
      });
    } else {
      sendResponse({
        message: "Error"
      });
    }
  }

  if (request.message == "send links") {
    var _savedlinks = JSON.parse(localStorage.getItem("clear-page-saved-links"));
    if (_savedlinks === null || _savedlinks === "" || _savedlinks === []) {
      console.log("links sent");
      sendResponse({
        message: "links empty",
        data: JSON.parse([])
      });
    } else {
      console.log("links sent");
      sendResponse({
        message: "links sent",
        data: _savedlinks
      });
    }
  }

  if (request.message == "open links page") {
    var _savedlinks = JSON.parse(localStorage.getItem("clear-page-saved-links"));
    if (_savedlinks.length !== 0) {
      window.open(chrome.runtime.getURL("html/savedlinks.html"));
      sendResponse({
        message: "opened page"
      });
    } else {
      console.error("No links available");
      sendResponse({
        message: "error: links empty"
      });
    }
  }

});

function loadSettingsObject() {
  console.log("load settings again");
}

//function when chrome is uninstalled
/* chrome.runtime.setUninstallURL(exitURL, function () {
  console.log("extention uninstalled.");
  _extensionActive = false;
  localStorage.removeItem("clear-page-settings");
  localStorage.removeItem("clear-page-saved-links");
  ga('send', 'event', 'Extension', 'Uninstalled', '', '');
}); */

function pushUniqueLinks(newLink) {
  var _savedlinks = JSON.parse(localStorage.getItem("clear-page-saved-links"));

  if (_savedlinks === null || _savedlinks === "") {
    _savedlinks = [];
    _savedlinks.push(newLink);
    console.log("List updated. " + JSON.stringify(_savedlinks));
    localStorage.setItem("clear-page-saved-links", JSON.stringify(_savedlinks));
    return true;
  } else if (_savedlinks === []) {
    _savedlinks.push(newLink);
    console.log("List updated. " + JSON.stringify(_savedlinks));
    localStorage.setItem("clear-page-saved-links", JSON.stringify(_savedlinks));
    return true;
  } else if (Array.isArray(_savedlinks)) {
    for (var item of _savedlinks) {
      if (item.url === newLink.url) {
        return false;
      }
    }
    _savedlinks.push(newLink);
    console.log("List updated. " + JSON.stringify(_savedlinks));
    localStorage.setItem("clear-page-saved-links", JSON.stringify(_savedlinks));
    return true;
  } else {
    console.error("List not updated. " + _savedlinks);
    return false;
  }
}