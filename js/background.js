"use strict";
//ga('send','event','category','action','label','value');

var _activeTabs = [];
var _extensionActive = false;
var _exitURL = "https://nids0810.github.io/clear-page/exit.html";

chrome.browserAction.onClicked.addListener(function (tab) {
  if (!_extensionActive && _activeTabs.length === 0) {
    console.log(tab);
    _extensionActive = true;
    _activeTabs.push(tab);
    ga("send", "event", "Icon", "Activated", "", "1");
    //chrome.tabs.executeScript(tab.id, {file:"js/content.js"});
    executeScripts(tab.id, [{
        file: "third-party/jquery.min.js"
      },
      {
        file: "third-party/ga.js"
      },
      {
        file: "third-party/readability.js"
      },
      {
        file: "js/content.js"
      }
    ]);
    chrome.browserAction.setIcon({
        path: "icons/icon_on_161.png",
        tabId: tab.id
      },
      extensionCallback
    );
    /* chrome.browserAction.setBadgeText({
      text: "on"
    }, function () {
      console.log("Badge On");
    }); */
  } else {
    //var tabIndex = _activeTabs.title.indexOf(tab.title);
    var _newTab = _activeTabs.find(o => o.id === tab.id);
    if (!$.isEmptyObject(_newTab)) {
      _activeTabs = _activeTabs.filter(
        item => item.id !== tab.id
      );
      //if (_activeTabs.indexOf(tab.title) >= 0) {_activeTabs = _activeTabs.filter(item => item !== tab.title);}
      _extensionActive = false;
      ga("send", "event", "Icon", "Deactivated", "", "1");
      chrome.tabs.executeScript(
        tab.id, {
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
      chrome.browserAction.setIcon({
          path: "icons/icon_16.png",
          tabId: tab.id
        },
        extensionCallback
      );
      /* chrome.browserAction.setBadgeText({
        text: ""
      }, function () {
        console.log("Badge Off");
      }); */
    } else {
      _activeTabs.push(tab);
      ga("send", "event", "Icon", "Activated", "", "1");
      _extensionActive = true;
      executeScripts(tab.id, [{
          file: "third-party/jquery.min.js"
        },
        {
          file: "third-party/ga.js"
        },
        {
          file: "third-party/readability.js"
        },
        {
          file: "js/content.js"
        }
      ]);
      chrome.browserAction.setIcon({
        path: "icons/icon_on_161.png",
        tabId: tab.id
      });
    }
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

  /* if (chrome.runtime.lastError) {
    console.log(chrome.runtime.lastError.message);
  } else {
    // Tab exists
  } */

  for (var i = injectDetailsArray.length - 1; i >= 0; --i)
    callback = createCallback(tabId, injectDetailsArray[i], callback);

  if (callback !== null)
    callback(); // execute outermost function
}

chrome.runtime.onInstalled.addListener(function () {
  console.log("Welcome to Clear Page!");
  ga("send", "event", "Extension", "Installed", "", "10");
  _extensionActive = false;

  var _savedlinks = JSON.parse(localStorage.getItem("clear-page-saved-links"));

  if (_savedlinks === null || _savedlinks === "") {
    console.log("Saved links list not available. Reset the list");
    localStorage.setItem("clear-page-saved-links", JSON.stringify([]));
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(
    sender.tab ?
    "from a content script:" + sender.tab.url :
    "from the extension"
  );
  //Test message
  if (request.grettings == "hello") {
    sendResponse({
      farewell: "goodbye"
    });
  }

  if (request.message == "Extension Active?") {
    console.log("Extension Active? " + _extensionActive);
    if (_extensionActive) {
      chrome.browserAction.setIcon({
        path: "icons/icon_on_161.png",
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

  //Add a new link
  if (request.message == "save link") {
    if (!($.isEmptyObject(sender.tab))) {
      var _savedLink = {};
      //var url = new URL(sender.tab.url);
      _savedLink.title = sender.tab.title;
      _savedLink.domain = new URL(sender.tab.url).hostname;
      _savedLink.url = sender.tab.url;
      _savedLink.favIconUrl = sender.tab.favIconUrl;
      _savedLink.dateSaved = Date.now();
      console.log("Saved Link: " + JSON.stringify(_savedLink));
      if (pushUniqueLinks(_savedLink)) {
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
        message: "error: no url available"
      });
    }
  }

  //Delete a saved link
  if (request.message == "delete link") {
    //_savedlinks = JSON.parse(request.data);
    _savedlinks = request.data;
    if (Array.isArray(_savedlinks)) {
      console.log("List updated." + JSON.stringify(_savedlinks));
      localStorage.setItem(
        "clear-page-saved-links",
        JSON.stringify(_savedlinks)
      );
      sendResponse({
        message: "Success"
      });
    } else {
      sendResponse({
        message: "Error"
      });
    }
  }

  //Send the saved links
  if (request.message == "send links") {
    var _savedlinks = JSON.parse(
      localStorage.getItem("clear-page-saved-links")
    );
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

  //Open Saved links page
  if (request.message == "open links page") {
    var _savedlinks = JSON.parse(
      localStorage.getItem("clear-page-saved-links")
    );
    if (_extensionActive) {
      if (_savedlinks.length !== 0) {
        window.open(chrome.runtime.getURL("html/savedlinks.html"));
        sendResponse({
          message: "success: page opened"
        });
      } else {
        console.warn("No links available");
        sendResponse({
          message: "error: links empty"
        });
      }
    } else {
      console.warn("extension inactive");
      sendResponse({
        message: "error: extension inacive"
      });
    }
  }
});

//function when chrome is uninstalled
/* chrome.runtime.setUninstallURL(_exitURL, function () {
  console.log("extention uninstalled.");
  _extensionActive = false;
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
    console.warn("List not updated. " + _savedlinks);
    return false;
  }
}

function extensionCallback() {
  if (chrome.runtime.lastError) {
    console.log(chrome.runtime.lastError.message);
  } else {
    // Tab exists
  }
}