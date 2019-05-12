"use strict";
//ga('send','event','category','action','label','value');
ga("send", "pageview", { 'page': '/read-pro', 'title': 'Read Pro'});

var _activeTabs = [];
//var _exitURL = "https://nids0810.github.io/clear-page/exit.html";

chrome.browserAction.onClicked.addListener(function (tab) {
  // Browser icon clicked first in browser
  var _tabURL = new URL(tab.url);
    if (_tabURL.protocol === "http:" || _tabURL.protocol === "https:") {
      if(!checkBlockedSites(_tabURL.host)) {
        if (_activeTabs.length === 0) {
          ga('send', 'event', 'Extension', 'Activated', '');
          _activeTabs.push(tab);
          executeScripts(tab.id, [
            { file: "third-party/jquery-3.4.1.min.js" },
            { file: "third-party/readability.js" },
            { file: "third-party/sweetalert.min.js" },
            { file: "js/content.js" }
          ]);
          chrome.browserAction.setIcon({ path: "icons/icon_on_16.png", tabId: tab.id}, extensionCallback(tab.id));
          chrome.browserAction.setBadgeText({ text: "on", tabId: tab.id }, extensionCallback(tab.id));
        } else {
          // Browser icon is clicked again in the same tab
          if (isTabActive(tab)) {
            //Delete tab from the _activeTabs list
            ga("send", "event", "Extension", "Deactivated", "");
            _activeTabs = _activeTabs.filter(item => item.id !== tab.id);
            chrome.tabs.executeScript( tab.id, { file: "js/no-action.js" }, extensionCallback(tab.id));
            chrome.browserAction.setIcon({ path: "icons/icon_16.png", tabId: tab.id}, extensionCallback(tab.id));
            chrome.browserAction.setBadgeText({ text: "", tabId: tab.id }, extensionCallback(tab.id));
          } else {
            ga("send", "event", "Extension", "Activated", "");
            _activeTabs.push(tab);
            executeScripts(tab.id, [
              { file: "third-party/jquery-3.4.1.min.js" },
              { file: "third-party/readability.js" },
              { file: "js/content.js" }
            ]);
            chrome.browserAction.setIcon({ path: "icons/icon_on_16.png", tabId: tab.id}, extensionCallback(tab.id));
            chrome.browserAction.setBadgeText({ text: "on", tabId: tab.id}, extensionCallback(tab.id));
          }
        }
      } else {
        alert("This extension currently blocked on site: \n" + _tabURL.host);
        console.log("This extension currently blocked on site: " + _tabURL.host);
      }
    } else {
      console.log("This extension can't run on non http(s) pages");
    }
});

// fucntion to execute multiple files in a row
function executeScripts(tabId, injectDetailsArray) {
  function createCallback(tabId, injectDetails, innerCallback) {
    return function () {
      chrome.tabs.executeScript(tabId, injectDetails, innerCallback);
    };
  }

/*   function createCallback(tabId, injectDetails, innerCallback) {
    return function() {
      try {
        chrome.tabs.executeScript(tabId, injectDetails, innerCallback);
      } catch (error) {
        extensionCallback(error, tabId);
      }
    };
  } */

  var callback = null;

  for (var i = injectDetailsArray.length - 1; i >= 0; --i)
    callback = createCallback(tabId, injectDetailsArray[i], callback);

  if (callback !== null)
    callback(); // execute outermost function
}

chrome.runtime.onInstalled.addListener(function () {
  console.log("Welcome to Clear Page!");
  //Clear the active tab on extension installed
  ga("send", "event", "Extension", "Installed", "");
  _activeTabs = [];

  var _savedlinks = JSON.parse(localStorage.getItem("clear-page-saved-links"));
  if (_savedlinks === null || _savedlinks === "") {
    console.log("Saved links list not available. Reset the list");
    localStorage.setItem("clear-page-saved-links", JSON.stringify([]));
  }

  //window.open(chrome.runtime.getURL("html/welcome.html"));
  //window.open("https://sites.google.com/view/readpro/home");
  
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  //console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
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
      ga("send", "event", "Save Link", "Clicked", "");
      var _savedLink = {};
      _savedLink.title = sender.tab.title;
      _savedLink.domain = new URL(sender.tab.url).hostname;
      _savedLink.url = sender.tab.url;
      _savedLink.favIconUrl = sender.tab.favIconUrl;
      _savedLink.dateSaved = Date.now();
      //console.log("Saved Link: " + JSON.stringify(_savedLink));
      if (pushUniqueLinks(_savedLink)) {
        console.log("Link saved");
        sendResponse({ message: "link saved", data: _savedLink });
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
      ga("send", "event", "Delete Link", "Clicked", "");
      //console.log("List updated." + JSON.stringify(_savedlinks));
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
      ga("send", "event", "Reading Queue", "Opened", "");
      window.open(chrome.runtime.getURL("html/savedlinks.html"));
      sendResponse({ message: "success: page opened"});
    } else {
      console.warn("No links available");
      sendResponse({ message: "error: links empty" });
    }
  } else if(request.message == "open read mode") {
    ga("send", "event", "Read Mode", "Activated", "");
  } else if(request.message == "open speak mode") {
    ga("send", "event", "Speak Mode", "Activated", "");
  } else if(request.message == "open erase mode") {
    ga("send", "event", "Erase Mode", "Activated", "");
  } else if(request.message == "open highlight mode") {
    ga("send", "event", "Highlight Mode", "Activated", "");
  } else if(request.message == "open print mode") {
    ga("send", "event", "Print Mode", "Activated", "");
  } else if(request.message == "open help mode") {
    ga("send", "event", "Help Mode", "Activated", "");
  }
});

//function when chrome is uninstalled
/* chrome.runtime.setUninstallURL(_exitURL, function () {
  console.log("extention uninstalled.");
  ga("send", "event", "Extension", "Uninstalled", "");
  localStorage.removeItem("clear-page-saved-links");
}); */

chrome.tabs.onUpdated.addListener(function(tabid, changeInfo, tab) {
  //If chrome extension was reloaded
  var _newTab = getTabActive(tabid);
  if (!$.isEmptyObject(_newTab)) {
    if(tab.url === _newTab.url) {
      if (!changeInfo.hasOwnProperty("title")){
        _activeTabs = _activeTabs.filter(item => item.id !== tabid);
        chrome.browserAction.setIcon({ path: "icons/icon_16.png", tabId: tab.id}, extensionCallback(tab.id));
        chrome.browserAction.setBadgeText({ text: "" , tabId: tab.id}, extensionCallback(tab.id));
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
    //console.log("List updated. " + JSON.stringify(_savedlinks));
    localStorage.setItem("clear-page-saved-links", JSON.stringify(_savedlinks));
    return true;
  } else if (_savedlinks === []) {
    _savedlinks.push(newLink);
    //console.log("List updated. " + JSON.stringify(_savedlinks));
    localStorage.setItem("clear-page-saved-links", JSON.stringify(_savedlinks));
    return true;
  } else if (Array.isArray(_savedlinks)) {
    for (var item of _savedlinks) {
      if (item.url === newLink.url) {
        return false;
      }
    }
    _savedlinks.push(newLink);
    //console.log("List updated. " + JSON.stringify(_savedlinks));
    localStorage.setItem("clear-page-saved-links", JSON.stringify(_savedlinks));
    return true;
  } else {
    console.warn("List not updated. " + _savedlinks);
    return false;
  }
}

function extensionCallback(tabid) {
  const lastErr = chrome.runtime.lastError;
  if (lastErr)
    console.log("tab: " + tabid + " lastError: " + JSON.stringify(lastErr));
};

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

var _blockedSites = [
  "www.facebook.com",
  "www.youtube.com",
  "www.instagram.com",
  "qzone.qq.com",
  "www.weibo.com",
  "twitter.com",
  "www.reddit.com",
  "www.pinterest.com",
  "ask.fm",
  //"plus.google.com",
  "www.tumblr.com",
  "www.flickr.com",
  "www.linkedin.com",
  "vk.com",
  "ok.ru"
];

var checkBlockedSites = function(url) {
  var _index = _blockedSites.indexOf(url);
   if(_index < 0){
     return false;
   } else {
     return true;
   }
};