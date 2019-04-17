"use strict";
//ga('send','event','category','action','label','value'); //ga syntax
ga('send', 'pageview', '/background.html', 'clicked');

var activeTabs = [];
chrome.browserAction.onClicked.addListener(function (tab) {
    if (activeTabs.length === 0) {
        activeTabs.push(tab.title);
        ga('send', 'event', 'Extension', 'Activated', 'One Page', activeTabs.length);
        //chrome.tabs.executeScript(tab.id, {file:"js/action.js"});
        executeScripts(null, [{
                file: "third-party/jquery.min.js"
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
            ga('send', 'event', 'Extension', 'Deactivated', 'Pages', activeTabs.length);
            chrome.tabs.executeScript(tab.id, {
                file: "js/no-action.js"
            });
            chrome.browserAction.setIcon({
                path: "icons/icon_16.png",
                tabId: tab.id
            });
        } else {
            activeTabs.push(tab.title);
            ga('send', 'event', 'Extension', 'Activated', 'More Pages', activeTabs.length);
            /* chrome.tabs.executeScript(tab.id, {
                file: "js/action.js"
            }); */
            executeScripts(null, [{
                file: "third-party/jquery.min.js"
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

chrome.runtime.onInstalled.addListener(function (){
    console.log('Extension Installed - Welcome Page');
    //window.open(chrome.runtime.getURL("html/welcome.html"));
});