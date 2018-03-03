"use strict";
var _AnalyticsCode = 'UA-115013413-1';

var _gaq = _gaq || [];
_gaq.push(['_setAccount', _AnalyticsCode]);
_gaq.push(['_trackPageview']);
(function() {
  var ga = document.createElement('script');
  ga.type = 'text/javascript';
  ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(ga, s);
})();


var activeTabs = [];
chrome.browserAction.onClicked.addListener(function(tab) {
    _gaq.push(['_trackEvent', tab.id, 'clicked']);
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