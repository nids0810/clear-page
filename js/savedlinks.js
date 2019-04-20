"use strict";

(function () {

  var savedLinksArray = [];

  chrome.runtime.sendMessage({
    message: "send links"
  }, function (response) {
    if (response.message === "links sent") {
      console.log("links loaded in local" + JSON.stringify(response.data));
      savedLinksArray = response.data;
      loadSavedLinksObject(true);
    } else if (response.message === "links empty") {
      console.log("links empty" + JSON.stringify(response.data));
      savedLinksArray = response.data;
      loadSavedLinksObject(false);
    } else {
      console.log(response.message);
    }
  });

  var loadSavedLinksObject = function (status) {
    console.log('Loading link elements');
    var html = '';
    html += '<h1>Saved Links</h1>';
    if(status){
      for (var link of savedLinksArray) {
        console.log(JSON.stringify(link));
        html += "<div class='links'>";
        if (link.url !== "") {
          html += '<img src=' + link.favIconUrl + ' alt=' + link.title + '></img>';
          html += '<span>' + link.title + '</span>';
          html += "<a href='" + link.url + "' target='_blank'>" + link.url + "</a>";
          html += "<span>" + Date(link.date) + "</span>";
        } else {
          html += '<img src=' + link.favIconUrl + ' alt=' + link.title + '></img>';
          html += '<span>' + link.title + '</span>';
          html += "<a href='" + link.url + "'>" + link.url + "</a>";
          html += "<span>" + Date(link.date) + "</span>";
        }
        html += "</div>";
      }
    } else {
      html += "<p>" + "No links available." + "</p>";
    }
    
    $("#saved-links-list").append(html);
  };

  var loadButtonObject = function () {
    console.log('Buttons loaded');
    var html = '';
    html += '<div id="status"></div>';
    html += '<button id="save">Save</button>';
    html += '<button id="reset">Reset</button>';

    $("#saved-links-object").append(html);
    $("#save").click(save_options);
    $("#reset").click(reset_options);
  };

  // Saves settings to local.storage
  function save_options() {
    console.log('Save button clicked');
  }

  // Reset settings in local.storage
  function reset_options() {
    console.log("Reset button clicked");
  }
})();