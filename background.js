"use strict";

var activeTabs = [];
chrome.browserAction.onClicked.addListener(function(tab) {
    if(activeTabs.length===0){
        activeTabs.push(tab.title);
        chrome.tabs.executeScript(tab.id, {file:"js/action.js"});
        chrome.browserAction.setIcon({path: "icons/icon_on_16.png", tabId:tab.id});
    }
    else {
        var tabIndex = activeTabs.indexOf(tab.title);
        if(tabIndex >= 0){
            activeTabs = activeTabs.filter(item => item !== tab.title);
            chrome.tabs.executeScript(tab.id, {file:"js/no-action.js"});
            chrome.browserAction.setIcon({path: "icons/icon_16.png", tabId:tab.id});
        }
        else {
            activeTabs.push(tab.title);
            chrome.tabs.executeScript(tab.id, {file:"js/action.js"});
            chrome.browserAction.setIcon({path: "icons/icon_on_16.png", tabId:tab.id});
        }
    }
});