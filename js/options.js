"use strict";

(function () {

  var _settings = {};

  chrome.runtime.sendMessage({
    message: "send settings"
  }, function (response) {
    if (response.message === "setting sent") {
      _settings = response.data;
      loadSettingObject();
      loadButtonObject();
    } else {
      console.error("Setting not available");
    }
  });

  var loadSettingObject = function () {
    console.log('Loading settings on website');
    console.log(JSON.stringify(_settings));
    var html = '';
    html += '<h1>Settings</h1>';
    for (var elements in _settings) {
      if (_settings.hasOwnProperty(elements)) {
        for (var key in _settings[elements]) {
          if (_settings[elements].hasOwnProperty(key)) {
            if (key === "name") {
              html += '<div id=' + elements + '><b>' + _settings[elements][key] + '</b>';
              console.log(_settings[elements][key]);
            } else if (key === "elements") {
              html += "<p>" + _settings[elements][key].join(", ") + "</p>";
            } else if (key === "font-family") {
              html += '<label> Font Family: ' + _settings[elements][key] + '</label><br>';
            } else if (key === "background-color") {
              html += '<label> Background Color: <input type="color" id="' + elements + '-bg-color' + '" value="' + _settings[elements][key] + '"></label><br>';
            } else if (key === "color") {
              html += '<label> Text Color: <input type="color" id="' + elements + '-text-color' + '" value="' + _settings[elements][key] + '"></label><br>';
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
    ga("send", "event", "Settings", "Updated", "Save", "");
    _settings.blockElements.backgroundColor = $("#block-elements-bg-color").val();
    _settings.blockElements.color = $("#block-elements-text-color").val();

    _settings.anchorElements.backgroundColor = $("#anchor-elements-bg-color").val();
    _settings.anchorElements.color = $("#anchor-elements-text-color").val();

    _settings.headerElements.color = $("#header-elements-text-color").val();

    chrome.runtime.sendMessage({
      message: "update settings",
      data: _settings
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
    ga("send", "event", "Settings", "Reset", "Reset", "");
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