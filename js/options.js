"use strict";

(function(){

  var settingsObject;
  
  if (localStorage.getItem("clear-page-settings") === null) {
    console.log("Local Storage - settings not available");
    $.getJSON(chrome.runtime.getURL("json/data.json"), function(data) {
      localStorage.setItem("clear-page-settings", JSON.stringify(data));
      settingsObject = JSON.parse(localStorage.getItem("clear-page-settings"));
    });
  } else {
    console.log("Local Storage - settings available");
    settingsObject = JSON.parse(localStorage.getItem("clear-page-settings"));
  }

  var loadSettingObject = function(){
    console.log('Load Setting Object');
    var html = '';
    html += '<h1>Clear Page - Options</h1>';
    //console.log(settingsObject);
    for (var elements in settingsObject) {
      if (settingsObject.hasOwnProperty(elements)) {
        //console.log(elements + " -> " + settingsObject[elements]);
        for (var key in settingsObject[elements]) {
          if (settingsObject[elements].hasOwnProperty(key)) {
            if(key === "name"){
              html += '<div id=' + elements + '><b>' + settingsObject[elements][key] + '</b>';
            } else if (key === "elements") {
              html += '<p>All the elements below are cover under this scope.</p>';
              html += "<p>" + settingsObject[elements][key].join(", ") + "</p>";
            } else if (key === "background-color") {
                html += '<label> Background Color: <input type="text" id="'+ elements+'-bg-color' +'" value="'+ settingsObject[elements][key] +'"></label>';
            } else if (key === "color") {
                html += '<label> Text Color: <input type="text" id="'+ elements+'-text-color' +'" value="'+ settingsObject[elements][key] +'"></label>';
            } else if (key === "font-family") {
                html += '<label> Font Family: <input type="text" id="'+ elements+'-font' +'" value="'+ settingsObject[elements][key] +'"></label>';
            }
          }
        }
        html += '</div>';
        html += '<br>';
      }
    }
    $("#settings-object").append(html);
  }

  var loadButtonObject = function(){
    console.log('Load Button Object');
    var html = '';
    html += '<div id="status"></div><br>';
    html += '<button id="save">Save</button>';
    html += '<button id="reset">Reset</button>';
    
    $("#settings-object").append(html);
    $("#save").click(save_options);
    $("#reset").click(reset_options);
  }

  loadSettingObject();
  loadButtonObject();

  // Saves settings to local.storage
  function save_options() {
    console.log('Save button clicked');
    settingsObject['block-elements']['background-color'] = $("#block-elements-bg-color").val();
    settingsObject['block-elements']['color'] = $("#block-elements-text-color").val();
    settingsObject['block-elements']['font-family'] = $("#block-elements-font").val();

    settingsObject['anchor-elements']['background-color'] = $("#anchor-elements-bg-color").val();
    settingsObject['anchor-elements']['color'] = $("#anchor-elements-text-color").val();
    settingsObject['anchor-elements']['font-family'] = $("#anchor-elements-font").val();

    settingsObject['header-elements']['color'] = $("#header-elements-text-color").val();
    settingsObject['header-elements']['font-family'] = $("#header-elements-font").val();

    localStorage.setItem("clear-page-settings", JSON.stringify(settingsObject));
    
    // Update status to let user know options were saved.
    $("#status").css({opacity: "1.0"}); 
    $('#status').text("Options saved.");
    $("#status").animate({opacity: "0.0"},"slow");
  }

  // Reset settings in local.storage
  function reset_options() {
    console.log("Reset button clicked");
    localStorage.removeItem("clear-page-settings");

    $("#status").css({ opacity: "1.0" }); 
    $("#status").text("Options reset.");
    $("#status").animate({ opacity: "0.0" }, "slow");
  }
})();

//document.addEventListener("DOMContentLoaded", restore_options);