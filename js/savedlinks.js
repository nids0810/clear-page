"use strict";

(function () {

  var savedLinksArray = [];
  var _sorted = {
    "title": false,
    "date": false,
    "domain":false
  };

  chrome.runtime.sendMessage({
    message: "send links"
  }, function (response) {
    if (response.message === "links sent") {
      console.log("links loaded in local" + JSON.stringify(response.data));
      savedLinksArray = response.data.sort(compareDate);
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
    var _week = 7, _month = 30, _year = 365;
    if(diff === NaN) {
      return "";
    } else if(diff === 0){
      return "Today";
    } else if (diff === 1) {
      return "Yesterday";
    } else if (Math.floor(diff/_week) > 0 && Math.floor(diff/_week) < 5) {
      return Math.floor(diff/_week) + " weeks ago";
    } else if (Math.floor(diff/_month) > 0 && Math.floor(diff/_month) < 13) {
      return Math.floor(diff/_month) + " months ago";
    } else if (Math.floor(diff/_year) > 0) {
      return Math.floor(diff/_year) + " years ago";
    } else {
      return diff + " days ago";
    }
  }

  //add onclick function to all buttons
  function loadButtonFunctions(){
     $("#sort-date").click(function (event) {
       var _newArray;
       if (!_sorted.domain) {
         _newArray = savedLinksArray.reverse(compareDate);
         _sorted.date = true;
       } else {
         _newArray = savedLinksArray.sort(compareDate);
         _sorted.date = false;
       }
       loadSavedLinksObject(_newArray);
     });
     $("#sort-title").click(function(event) {
       var _newArray;
       if(!_sorted.title){
          _newArray = savedLinksArray.sort(compareTitle);
          _sorted.title = true;
       } else {
          _newArray = savedLinksArray.reverse(compareTitle);
          _sorted.title = false;
       }
       loadSavedLinksObject(_newArray);
     });

     $("#sort-origin").click(function() {
       var _newArray;
       if (!_sorted.domain) {
         _newArray = savedLinksArray.sort(compareDomain);
         _sorted.domain = true;
       } else {
         _newArray = savedLinksArray.reverse(compareDomain);
         _sorted.domain = false;
       }
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
      html += "<span class='heading'>Icon</span>";
      html += "<span class='heading'>Domain Name</span>";
      html += "<span class='heading'>Link Title</span>";
      html += "<span class='heading'>Url</span>";
      html += "<span class='heading'>Date</span>";
      html += "<span class='heading'>Delete</span>";
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
      console.log($(event.target.parentElement).children("a").attr('href'));
      var _deleteUrl = $(event.target.parentElement).children("a").attr('href');
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