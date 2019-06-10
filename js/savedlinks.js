"use strict";

(function () {

  var savedLinksArray = [];
  var totalReadingTime = 0;
  var totalReadingArticle = 0;
  var _sorted = {
    "title": false,
    "date": false,
    "domain":false,
    "readTime":false
  };

  chrome.runtime.sendMessage({
    message: "send links"
  }, function (response) {
    if (response.message === "links sent") {
      //console.log("links loaded in local" + JSON.stringify(response.data));
      var tempArray = response.data;
      savedLinksArray = tempArray.sort(compareDate).reverse(compareDate);
      loadSavedLinksObject(savedLinksArray);
      loadButtonFunctions();
    } else if (response.message === "links empty") {
      //console.log("links empty" + JSON.stringify(response.data));
      savedLinksArray = response.data;
      loadSavedLinksObject(savedLinksArray);
      loadButtonFunctions();
    } else {
      //console.log(response.message);
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
      if (a.dateSaved < b.dateSaved) return -1;
      if (a.dateSaved > b.dateSaved) return 1;
      return 0;
  }

  //compare array by title
  function compareTitle(a, b) {
    if (a.title < b.title) return -1;
    if (a.title > b.title) return 1;
    return 0;
  }

  //compare array by read time
  function compareReadTime(a, b) {
    return a.readingTime - b.readingTime;
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
       if (!_sorted.date) {
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

     $("#sort-readTime").click(function() {
       var _newArray;
       if (!_sorted.readTime) {
         _newArray = savedLinksArray.sort(compareReadTime);
         _sorted.readTime = true;
       } else {
         _newArray = savedLinksArray.reverse(compareReadTime);
         _sorted.readTime = false;
       }
       loadSavedLinksObject(_newArray);
     });
  }

  var loadSavedLinksObject = function (_linksArray) {
    var html = '';
    totalReadingTime = 0;
    totalReadingArticle = 0;
    $("#saved-links-list").empty();
    if (_linksArray.length !== 0) {
      for (var link of _linksArray) {
        //console.log(JSON.stringify(link));
        var date = new Date(link.dateSaved);
        var rTime = link.readingTime == null ? "-" : link.readingTime + " mins";
        totalReadingTime += link.readingTime == null ? 0 : parseInt(link.readingTime);
        totalReadingArticle += 1;
        html += "<div class='links'>";
        if (link.url !== "") {
          html += '<img src=' + link.favIconUrl + ' alt=' + link.title + '></img>';
          html += "<span>" + link.domain + "</span>";
          html += '<span>' + link.title + '</span>';
          html += "<span>" + rTime + "</span>";
          html += "<a href='" + link.url + "' target='_blank'>" + "Link" + "</a>";
          html += "<span>" + daysAgo(link.dateSaved) + "</span>";
          html += "<img class='delete-btn' src='" + chrome.runtime.getURL("images/delete.png") + "' ></img>";
        } else {
          html += '<img src=' + link.favIconUrl + ' alt=' + link.title + '></img>';
          html += "<span>" + link.domain + "</span>";
          html += '<span>' + link.title + '</span>';
          html += "<span>" + rTime + "</span>";
          html += "<a href='" + link.url + "'>" + "Link" + "</a>";
          html += "<span>" + daysAgo(link.dateSaved) + "</span>";
          html += "<img class='delete-btn' src='" + chrome.runtime.getURL("images/delete.png") + "' ></img>";
        }
        html += "</div>";
      }
    } else {
      html += "<p>" + "Reading queue is empty. Save new links!" + "</p>";
    }
    // append all links in the html page
    $("#saved-links-list").append(html);

    $(".delete-btn").hover(function () {
      $(this).attr('src', chrome.runtime.getURL("images/delete-green.png"));
    }, function () {
      $(this).attr("src", chrome.runtime.getURL("images/delete.png"));
    });

    $("#total-reading-time").text("Total Reading Time - " + totalReadingTime + " mins");
    if (parseInt(totalReadingTime) > 60) {
      $("#warning-icon").show();
    } else {
      $("#warning-icon").hide();
    }

    $("#total-reading-article").text("Total Articles: " + totalReadingArticle);
    
    // add onclick function on delete text
    $(".delete-btn").click(function (event) {
      //console.log($(event.target.parentElement).children("a").attr('href'));
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
            location.reload();
          } else {
            //console.error(response.message);
          }            
        }
      );
    });
    // add save link footer icon
    $('#save-link-footer').attr('src', chrome.runtime.getURL("icons/icon_48.png"));
  };
})();