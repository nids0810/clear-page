"use strict";
//ga('send','event','category','action','label','value');

var _activeTabs = [];
var _exitURL = "https://nids0810.github.io/clear-page/exit.html";

chrome.browserAction.onClicked.addListener(function (tab) {
  // Browser icon clicked first in browser
  if (_activeTabs.length === 0) {
    console.log(tab);
    _activeTabs.push(tab);
    executeScripts(tab.id, [
      { file: "third-party/jquery.min.js" },
      { file: "third-party/readability.js" },
      { file: "js/content.js" }
    ]);
    chrome.browserAction.setIcon({ path: "icons/icon_on_161.png", tabId: tab.id });
    chrome.browserAction.setBadgeText({ text: "on", tabId: tab.id }, function() { console.log("Badge On"); });
  } else {
    // Browser icon is clicked again in the same tab
    if (isTabActive(tab)) {
      //Delete tab from the _activeTabs list
      _activeTabs = _activeTabs.filter(item => item.id !== tab.id);
      chrome.tabs.executeScript( tab.id, { file: "js/no-action.js" }, result => {
        const lastErr = chrome.runtime.lastError;
        if (lastErr) console.log( "tab: " + tab.id + " lastError: " + JSON.stringify(lastErr));
      });
      chrome.browserAction.setIcon({ path: "icons/icon_16.png", tabId: tab.id});
      chrome.browserAction.setBadgeText({ text: "" , tabId: tab.id}, function() { console.log("Badge Off"); });
    } else {
      _activeTabs.push(tab);
      executeScripts(tab.id, [
        { file: "third-party/jquery.min.js" },
        { file: "third-party/readability.js" },
        { file: "js/content.js" }
      ]);
      chrome.browserAction.setIcon({ path: "icons/icon_on_161.png", tabId: tab.id });
      chrome.browserAction.setBadgeText({ text: "on" , tabId: tab.id}, function() { console.log("Badge On"); });
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

  for (var i = injectDetailsArray.length - 1; i >= 0; --i)
    callback = createCallback(tabId, injectDetailsArray[i], callback);

  if (callback !== null)
    callback(); // execute outermost function
}

chrome.runtime.onInstalled.addListener(function () {
  console.log("Welcome to Clear Page!");
  //Clear the active tab on extension installed
  _activeTabs = [];

  var _savedlinks = JSON.parse(localStorage.getItem("clear-page-saved-links"));
  if (_savedlinks === null || _savedlinks === "") {
    console.log("Saved links list not available. Reset the list");
    localStorage.setItem("clear-page-saved-links", JSON.stringify([]));
  }

  //window.open(chrome.runtime.getURL("html/welcome.html"));
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
  //Test message
  if (request.grettings == "hello") {
    sendResponse({
      farewell: "goodbye"
    });
  } else if (request.message == "Extension Active?") {  //check if extension is active
    var _extensionActive = isTabActive(sender.tab);
    console.log("Extension Active: " + _extensionActive);
    sendResponse({ message: _extensionActive });
  } else if (request.message == "save link") { //save a new link
    if (!($.isEmptyObject(sender.tab))) {
      var _savedLink = {};
      _savedLink.title = sender.tab.title;
      _savedLink.domain = new URL(sender.tab.url).hostname;
      _savedLink.url = sender.tab.url;
      _savedLink.favIconUrl = sender.tab.favIconUrl;
      _savedLink.dateSaved = Date.now();
      console.log("Saved Link: " + JSON.stringify(_savedLink));
      if (pushUniqueLinks(_savedLink)) {
        console.log("Link saved");
        sendResponse({ message: "link saved" });
      } else {
        console.log("Link duplicate");
        sendResponse({ message: "link duplicate" });
      }
    } else {
      sendResponse({ message: "error: no url available" });
    }
  } else if (request.message == "delete link") {  //Delete a saved link
    _savedlinks = request.data;
    if (Array.isArray(_savedlinks)) {
      console.log("List updated." + JSON.stringify(_savedlinks));
      localStorage.setItem("clear-page-saved-links", JSON.stringify(_savedlinks));
      sendResponse({ message: "Success" });
    } else {
      sendResponse({ message: "Error" });
    }
  } else if (request.message == "send links") {  //Send the saved links array
    var _savedlinks = JSON.parse(localStorage.getItem("clear-page-saved-links"));
    if (_savedlinks === null || _savedlinks === "" || _savedlinks === []) {
      console.log("links sent");
      sendResponse({ message: "links empty", data: JSON.parse([]) });
    } else {
      console.log("links sent");
      sendResponse({ message: "links sent", data: _savedlinks });
    }
  } else if (request.message == "open links page") {  //Open Saved links page
    var _savedlinks = JSON.parse(localStorage.getItem("clear-page-saved-links"));
    if (_savedlinks.length !== 0) {
      window.open(chrome.runtime.getURL("html/savedlinks.html"));
      sendResponse({ message: "success: page opened"});
    } else {
      console.warn("No links available");
      sendResponse({ message: "error: links empty" });
    }
  }
});

//function when chrome is uninstalled
/* chrome.runtime.setUninstallURL(_exitURL, function () {
  console.log("extention uninstalled.");
  localStorage.removeItem("clear-page-saved-links");
}); */

chrome.tabs.onUpdated.addListener(function(tabid, changeInfo, tab) {
  //If chrome extension was reloaded
  var _newTab = getTabActive(tabid);
  if (!$.isEmptyObject(_newTab)) {
    if(tab.url === _newTab.url) {
      if (!changeInfo.hasOwnProperty("title")){
        _activeTabs = _activeTabs.filter(item => item.id !== tabid);
        chrome.browserAction.setIcon({ path: "icons/icon_16.png", tabId: tab.id});
        chrome.browserAction.setBadgeText({ text: "" , tabId: tab.id}, function() { console.log("Badge Off"); });
        console.log("An extension active tab " + tabid + " was reloaded");
      }      
    }
  }
});

chrome.tabs.onRemoved.addListener(function (tabid, removed) {
  //Check if the removed tab had extension active before
  if (isTabIdActive(tabid)) {
    _activeTabs = _activeTabs.filter(item => item.id !== tabid);
    console.log("An extension active tab " + tabid + " was closed " + removed);
  }
});

chrome.windows.onRemoved.addListener(function(windowId) {
  //Check if the removed tab had extension active before
  _activeTabs = _activeTabs.filter(item => item.windowId !== windowId);
  console.log("An extension active window " + windowId + " was closed ");
});


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

var isTabActive = function(tab) {
  var _newTab = _activeTabs.find(o => o.id === tab.id);
  if (!$.isEmptyObject(_newTab)) {
    return true;
  } else {
    return false;
  }
};

var isTabIdActive = function(tabid) {
  var _newTab = _activeTabs.find(o => o.id === tabid);
  if (!$.isEmptyObject(_newTab)) {
    return true;
  } else {
    return false;
  }
};

var getTabActive = function(tabid) {
  var _newTab = _activeTabs.find(o => o.id === tabid);
  if (!$.isEmptyObject(_newTab)) {
    return _newTab;
  } else {
    return null;
  }
};