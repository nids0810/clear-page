"use strict";
//ga('send','event','category','action','label','value'); //ga syntax
ga('send', 'pageview', '/background.html', 'clicked');

var activeTabs = [];
chrome.browserAction.onClicked.addListener(function(tab) {
    if(activeTabs.length===0){
        activeTabs.push(tab.title);
        ga('send', 'event', 'Extension', 'Activated', 'One Page', activeTabs.length);
        chrome.tabs.executeScript(tab.id, {file:"js/action.js"});
        chrome.browserAction.setIcon({path: "icons/icon_on_16.png", tabId:tab.id});
    }
    else {
        var tabIndex = activeTabs.indexOf(tab.title);
        if(tabIndex >= 0){
            activeTabs = activeTabs.filter(item => item !== tab.title);
            ga('send', 'event', 'Extension', 'Deactivated', 'Pages', activeTabs.length);
            chrome.tabs.executeScript(tab.id, {file:"js/no-action.js"});
            chrome.browserAction.setIcon({path: "icons/icon_16.png", tabId:tab.id});
        }
        else {
            activeTabs.push(tab.title);
            ga('send', 'event', 'Extension', 'Activated', 'More Pages', activeTabs.length);
            chrome.tabs.executeScript(tab.id, {file:"js/action.js"});
            chrome.browserAction.setIcon({path: "icons/icon_on_16.png", tabId:tab.id});
        }
    }
});