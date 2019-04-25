alert('This is sample.js')

//function for Save as PDF
/* 
var convertToPDF = function (quality = 1) {
    console.log('Convert to PDF');
    const filename = 'new-file.pdf';

    html2canvas(document.querySelector('#myheading'), {scale: quality})
    .then(canvas => {
        let pdf = new jsPDF('p', 'mm', 'a4');
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 211, 298);
        pdf.save(filename);
    });
}
*/

//function for highlighting
/* 
var getRangeObject = function (selectionObject) {
    try {
        if (selectionObject.getRangeAt)
            return selectionObject.getRangeAt(0);
    } catch (ex) {
        console.log(ex);
    }
} 

document.onmousedown = function (e) {
    var text;
    if (window.getSelection) {
        // get the Selection object
        userSelection = window.getSelection()

        // get the innerText (without the tags)
        text = userSelection.toString();

        // Creating Range object based on the userSelection object
        var rangeObject = getRangeObject(userSelection);

        // This extracts the contents from the DOM literally, inclusive of the tags. 
        // The content extracted also disappears from the DOM 
        contents = rangeObject.extractContents();

        var span = document.createElement("span");
        span.className = "highlight";
        span.appendChild(contents);

        //Insert your new span element in the same position from where the selected text was extracted
        rangeObject.insertNode(span);

    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
};
*/


//CSS for highlight
/*
    :: -moz - selection { // Code for Firefox
    color: red;
    background: yellow;
}

:: selection {
    color: red;
    background: yellow;
} 

chrome.browserAction.onClicked.addListener(function(tab) {
  if (activeTabs.length === 0) {
    console.log(tab);
    activeTabs.push(tab.title);
    ga("send", "event", "Icon", "Activated", "", "1");
    //chrome.tabs.executeScript(tab.id, {file:"js/action.js"});
    executeScripts(null, [
      {
        file: "third-party/jquery.min.js"
      },
      {
        file: "third-party/ga.js"
      },
      {
        file: "js/content.js"
      }
      //{ file: "helper.js" },
      //{ code: "transformPage();" }
    ]);
    chrome.browserAction.setIcon({
      path: "icons/icon_on_16.png",
      tabId: tab.id
    });
    extensionActive = true;
  } else {
    var tabIndex = activeTabs.indexOf(tab.title);
    if (tabIndex >= 0) {
      activeTabs = activeTabs.filter(item => item !== tab.title);
      ga("send", "event", "Icon", "Deactivated", "", "1");
      chrome.tabs.executeScript(tab.id, {
          file: "js/no-action.js"
      });
      executeScripts(null, [
        {
          file: "third-party/jquery.min.js"
        },
        {
          file: "js/no-action.js"
        }
      ]);
      chrome.browserAction.setIcon({
        path: "icons/icon_16.png",
        tabId: tab.id
      });
      extensionActive = false;
    } else {
      activeTabs.push(tab.title);
      ga("send", "event", "Icon", "Activated", "", "1");
      chrome.tabs.executeScript(tab.id, {
          file: "js/action.js"
      });
      executeScripts(null, [
        {
          file: "third-party/jquery.min.js"
        },
        {
          file: "third-party/ga.js"
        },
        {
          file: "js/content.js"
        }
      ]);
      chrome.browserAction.setIcon({
        path: "icons/icon_on_16.png",
        tabId: tab.id
      });
      extensionActive = true;
    }
  }
});

*/

/* 
function formatPage() {
  var _settings = {};

  chrome.runtime.sendMessage(
    {
      message: "send settings"
    },
    function(response) {
      if (response.message === "setting sent") {
        _settings = response.data;
        console.log("settings available: " + JSON.stringify(_settings));

        if (
          jQuery.isEmptyObject(_settings) ||
          _settings.blockElements.elements !== undefined
        ) {
          //Format Block Elements
          $(_settings.blockElements.elements.join(",")).css({
            background: "none",
            backgroundImage: "none",
            fontFamily: "sans-serif",
            border: "none",
            backgroundColor: _settings.blockElements.backgroundColor,
            color: _settings.blockElements.color
          });

          //Format Header Elements
          $(_settings.headerElements.elements.join(",")).css({
            background: "none",
            fontFamily: "sans-serif",
            color: _settings.headerElements.color
          });

          //Format Anchor Elements
          $(_settings.anchorElements.elements.join(",")).css({
            background: "none",
            backgroundImage: "none",
            fontFamily: "sans-serif",
            border: "none",
            fontWeight: "bold",
            textDecoration: "underline",
            backgroundColor: _settings.anchorElements.backgroundColor,
            color: _settings.anchorElements.color
          });

          //Format Media Elements
          $(_settings.mediaElements.elements.join(",")).css({
            display: "none"
          });

          //Format Frame Elements
          $(_settings.frameElements.elements.join(",")).css({
            display: "none"
          });

          //Format Program Elements
          $(_settings.programElements.elements.join(",")).css({
            display: "none"
          });
        }
      } else {
        console.error("Settings unavailable. Try again");
        chrome.runtime.sendMessage(
          {
            message: "settings unavailable"
          },
          function(response) {
            console.log(response.message);
          }
        );
      }
    }
  );
}
 */
/* 
var webElement = function () {
  var web = {};
  web.title =
    $("title").text() ||
    $("meta[name='title']").attr("content") ||
    $("meta[property='og:title']").attr("content") ||
    "";
  web.author = $("meta[name='author']").attr("content") || "";
  web.url = $("meta[property='og:url']").attr("content") || "";
  web.sitename = $("meta[property='og:site_name']").attr("content") || "";
  if (web.url !== "") {
    web.domain = new URL(web.url).hostname;
  }
  web.content = "";
  web.type = $("meta[property='og:type']").attr("content") || "";
  web.description =
    $('meta[name="description"]').attr("content") ||
    $("meta[property='og:description']").attr("content") ||
    "";
  web.date_published = Date.parse($("meta[property='article:published_time']").attr("content")) ||
    "";
  web.lead_image_url = $("meta[property='og:image']").attr("content") ||
    "";
  web.next_page_url = null;
  web.rendered_pages = 1;
  web.total_pages = 1;
  web.word_count = 465;
  console.log(web);
};
//webElement();
 */



