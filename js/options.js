"use strict";

(function () {

  var settingsObject = {};

  chrome.runtime.sendMessage({
    message: "send settings"
  }, function (response) {
    if (response.message !== "{}") {
      settingsObject = response.message;
      loadSettingObject();
      loadButtonObject();
    } else {
      console.log(response.message);
    }
  });

  var loadSettingObject = function () {
    console.log('Setting loaded');
    var html = '';
    html += '<h1>Settings</h1>';
    for (var elements in settingsObject) {
      if (settingsObject.hasOwnProperty(elements)) {
        for (var key in settingsObject[elements]) {
          if (settingsObject[elements].hasOwnProperty(key)) {
            if (key === "name") {
              html += '<div id=' + elements + '><b>' + settingsObject[elements][key] + '</b>';
            } else if (key === "elements") {
              html += "<p>" + settingsObject[elements][key].join(", ") + "</p>";
            } else if (key === "font-family") {
              html += '<label> Font Family: ' + settingsObject[elements][key] + '</label><br>';
            } else if (key === "background-color") {
              html += '<label> Background Color: <input type="color" id="' + elements + '-bg-color' + '" value="' + settingsObject[elements][key] + '"></label><br>';
            } else if (key === "color") {
              html += '<label> Text Color: <input type="color" id="' + elements + '-text-color' + '" value="' + settingsObject[elements][key] + '"></label><br>';
            }
          }
        }
        html += '</div>';
        html += '<br>';
      }
    }
    $("#settings-object").append(html);
  }

  var loadButtonObject = function () {
    console.log('Buttons loaded');
    var html = '';
    html += '<div id="status"></div>';
    html += '<button id="save">Save</button>';
    html += '<button id="reset">Reset</button>';

    $("#settings-object").append(html);
    $("#save").click(save_options);
    $("#reset").click(reset_options);
  }

  // Saves settings to local.storage
  function save_options() {
    console.log('Save button clicked');
    settingsObject['block-elements']['background-color'] = $("#block-elements-bg-color").val();
    settingsObject['block-elements']['color'] = $("#block-elements-text-color").val();

    settingsObject['anchor-elements']['background-color'] = $("#anchor-elements-bg-color").val();
    settingsObject['anchor-elements']['color'] = $("#anchor-elements-text-color").val();

    settingsObject['header-elements']['color'] = $("#header-elements-text-color").val();

    chrome.runtime.sendMessage({
      message: "update settings",
      data: settingsObject
    }, function (response) {
      console.log(response.message);
    });

    // Update status to let user know options were saved.
    $("#status").css({
      opacity: "1.0"
    });
    $('#status').text("Settings updated.");
    $("#status").animate({
      opacity: "0.0"
    }, "slow");
  }

  // Reset settings in local.storage
  function reset_options() {
    console.log("Reset button clicked");
    localStorage.removeItem("clear-page-settings");

    $("#status").css({
      opacity: "1.0"
    });
    $("#status").text("Settings reset.");
    $("#status").animate({
      opacity: "0.0"
    }, "slow");
  }
})();

//document.addEventListener("DOMContentLoaded", restore_options);
/* w3color.js functions
if (color == "") {
        validateColor();
        return;
}
color = color.toLowerCase();
c = w3color(color);
if (c.valid) {
  console.log(c.toRgbaString());
  if (c.toName() != "") {
    console.log(c.toName());
  }
  console.log(c.toHexString());
}
 */