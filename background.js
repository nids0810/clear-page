/*chrome.browserAction.onClicked.addListener(function(tab) {
   chrome.tabs.executeScript(null, {file: "action.js"});
});*/

var toggle = false;
chrome.browserAction.onClicked.addListener(function(tab) {
    if(tab.active) {
  toggle = !toggle;
  if(toggle){
      chrome.browserAction.setIcon({path: "icons/icon_on_16.png", tabId:tab.id});
      chrome.tabs.executeScript(tab.id, {file:"js/action.js"});
  }
  else{
    chrome.browserAction.setIcon({path: "icons/icon_16.png", tabId:tab.id});
    chrome.tabs.executeScript(tab.id, {file:"js/no-action.js"});
  }
    }
    else {
        toggle = false;
    }
});