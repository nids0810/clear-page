"use strict";

(function () {

  var savedLinksArray = [];

  chrome.runtime.sendMessage({
    message: "send links"
  }, function (response) {
    if (response.message === "links sent") {
      console.log("links loaded in local" + JSON.stringify(response.data));
      savedLinksArray = response.data.reverse();
      loadSavedLinksObject(savedLinksArray);
      loadButtonFunctions();
    } else if (response.message === "links empty") {
      console.log("links empty" + JSON.stringify(response.data));
      savedLinksArray = response.data;
      loadSavedLinksObject(savedLinksArray);
      loadButtonFunctions();
    } else {
      console.log(response.message);
    }
  });

  //compare array by domain name
  function compareDomain(a, b) {
    if (a.domain < b.domain) return -1;
    if (a.domain > b.domain) return 1;
    return 0;
  }

  //compare array by date
  function compareDate(a, b) {
      if (a.date < b.date) return -1;
      if (a.date > b.date) return 1;
      return 0;
  }

  //compare array by title
  function compareTitle(a, b) {
    if (a.title < b.title) return -1;
    if (a.title > b.title) return 1;
    return 0;
  }

  //provide days ago
  function daysAgo(_linkDate) {
    var today = new Date();
    var date = new Date(_linkDate);
    var diff = Math.floor((today - date) / 86400000);
    if(diff === NaN) {
      return "";
    } else if(diff === 0){
      return "Today";
    } else if (diff === 1) {
      return "Yesterday";
    } else {
      return diff + "days ago";
    }
  }

  //add onclick function to all buttons
  function loadButtonFunctions(){
     $("#sort-date").click(function (event) {
       var _newArray = savedLinksArray.sort(compareDate);
       loadSavedLinksObject(_newArray);
     });
     $("#sort-title").click(function(event) {
       var _newArray = savedLinksArray.sort(compareTitle);
       loadSavedLinksObject(_newArray);
     });

     $("#sort-origin").click(function(event) {
       var _newArray = savedLinksArray.sort(compareDomain);
       loadSavedLinksObject(_newArray);
     });
  }

  var loadSavedLinksObject = function (_linksArray) {
    console.log('Loading saved links');
    console.log(_linksArray);
    var html = '';
    $("#saved-links-list").empty();
    if (_linksArray.length !== 0) {
      html += "<div class='links'>";
      html += '<span>Icon</span>';
      html += "<span>Domain Name</span>";
      html += "<span>Link Title</span>";
      html += "<span>Url</span>";
      html += "<span>Date</span>";
      html += "<span>Delete</span>";
      html += "</div>";
      for (var link of _linksArray) {
        console.log(JSON.stringify(link));
        var date = new Date(link.dateSaved);
        //console.log(date.toString());
        html += "<div class='links'>";
        if (link.url !== "") {
          html += '<img src=' + link.favIconUrl + ' alt=' + link.title + '></img>';
          html += "<span>" + link.domain + "</span>";
          html += '<span>' + link.title + '</span>';
          html += "<a href='" + link.url + "' target='_blank'>" + "Link" + "</a>";
          //html += "<span>" + date.toString() + "</span>";
          html += "<span>" + daysAgo(link.dateSaved) + "</span>";
          html += "<span class='delete'> Delete </span>";
        } else {
          html += '<img src=' + link.favIconUrl + ' alt=' + link.title + '></img>';
          html += "<span>" + link.domain + "</span>";
          html += '<span>' + link.title + '</span>';
          html += "<a href='" + link.url + "'>" + "Link" + "</a>";
          html += "<span>" + daysAgo(link.dateSaved) + "</span>";
          html += "<span class='delete'> Delete </span>";
        }
        html += "</div>";
      }
    } else {
      html += "<p>" + "Reading queue is empty. Save new links!" + "</p>";
    }
    // append all links in the html page
    $("#saved-links-list").append(html);
    
    // add onclick function on delete text
    $(".delete").click(function (event) {
      console.log($(event.target.parentElement).children("a").text());
      var _deleteUrl = $(event.target.parentElement).children("a").text();
      _linksArray = _linksArray.filter(function(obj) {
        return obj.url !== _deleteUrl;
      });
      $(event.target.parentElement).remove();
      chrome.runtime.sendMessage(
        {
          message: "delete link",
          data: _linksArray
        },
        function(response) {
          if (response.message === "Success"){
            console.log(response.message);
          } else {
            console.error(response.message);
          }            
        }
      );
    });
  };
})();