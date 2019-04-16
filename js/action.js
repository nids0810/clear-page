"use strict";

(function () {

    // Block Element Action
    var blockElementsAction = function (element) {
        element.style.background = 'none';
        element.style.backgroundImage = 'none';
        element.style.backgroundColor = '#f9f9f9';
        element.style.fontFamily = 'sans-serif';
        element.style.color = '#333';
        element.style.border = 'none';
    };
    // Heading Action
    var headingAction = function (element) {
        element.style.background = 'none';
        element.style.fontFamily = 'sans-serif';
        element.style.color = '#333';
    }
    // Anchor Action
    var anchorAction = function (element) {
        element.style.background = 'none';
        element.style.backgroundColor = '#f9f9f9';
        element.style.fontFamily = 'sans-serif';
        element.style.fontWeight = 'bold';
        element.style.textDecoration = 'underline';
        element.style.color = '#333';
        element.style.border = 'none';
        if (element.hasAttribute("target")) {
            element.setAttribute("target", "_blank");
        }
    }

    // Images Action
    var imgAction = function (element) {
        element.style.display = 'none';
    }

    // Frame Action
    var frameAction = function (element) {
        element.style.display = 'none';
    }

    // Program Action
    var programAction = function (element) {
        element.style.display = 'none';
    }

    //Format the text
    var blocks = document.querySelectorAll('body,div,table,tr,td,header,footer,section,aside,p,ul,li,span,main,article,details,dialog,summary,data,cite,pre,code,form');
    for (var i = 0; i < blocks.length; i++) {
        blockElementsAction(blocks[i]);
    }

    var anchors = document.querySelectorAll('a,link,nav');
    for (var i = 0; i < anchors.length; i++) {
        anchorAction(anchors[i]);
    }

    var media = document.querySelectorAll('img,source,picture,svg,map,area,canvas,figure,figcaption,audio,source,track,video,textarea,i');
    for (var i = 0; i < media.length; i++) {
        imgAction(media[i]);
    }

    var heads = document.querySelectorAll('h1,h2,h3,h4,h5,h6');
    for (var i = 0; i < heads.length; i++) {
        headingAction(heads[i]);
    }

    var frames = document.querySelectorAll('frame,frameset,noframes,iframe');
    for (var i = 0; i < frames.length; i++) {
        frameAction(frames[i]);
    }

    var programs = document.querySelectorAll('script,noscript,applet,embed,object,param');
    for (var i = 0; i < programs.length; i++) {
        programAction(programs[i]);
    }

    //Create Tool Option
    var createToolOptions = function () {
        //Create tool options
        var toolOpt = document.createElement("div");
        toolOpt.style.backgroundColor = "red";
        toolOpt.setAttribute("id", "tool-option");
        document.body.appendChild(toolOpt);

        //Create Edit Button
        var editBtn = document.createElement("button");
        editBtn.innerHTML = "Edit";
        editBtn.setAttribute("id", "edit-btn");
        editBtn.onclick = editWebPage;
        document.getElementById("tool-option").appendChild(editBtn);

        //Create Highlight Button
        var highlightBtn = document.createElement("button");
        highlightBtn.innerHTML = "Highlight";
        highlightBtn.setAttribute("id", "highlight-btn");
        highlightBtn.onclick = highlightText;
        document.getElementById("tool-option").appendChild(highlightBtn);

        //Create Save as PDF Button
        var pdfBtn = document.createElement("button");
        pdfBtn.innerHTML = "Save as PDF";
        pdfBtn.setAttribute("id", "pdf-btn");
        pdfBtn.onclick = convertToPDF;
        document.getElementById("tool-option").appendChild(pdfBtn);
    }

    //Edit Button Function
    let editMode = false;
    var editWebPage = function () {
        console.log('Edit WebPage');

        if (!editMode) {
            editMode = true;
            $('#edit-btn').css("background-color", "red");
            $("body").append("<h1 id='edit-mode'>Edit Mode On!</h1>");
            //Add a new class "web-edited"
            $("<style>")
                .prop("type", "text/css")
                .html("\
                    .web-edited {\
                        color: red;\
                    }\
                    .web-deleted {\
                        color: red;\
                        display: none;\
                    }")
                .appendTo("head");

            // make all links unclickable
            $("a").each(function () {
                //console.log(this);
                //$(this).preventDefault();
            });

            // Click elements in edit mode
            $(document).click(function (event) {

                if (event.target.id === 'edit-btn' || event.target.id === 'highlight-btn' || event.target.id === 'pdf-btn' || event.target.id === 'tool-option' || event.target.id === 'edit-mode') {
                    //Don't delete extension elements
                    console.log($(event.target).text().trim() + ' cannot be deleted');
                } else if ($(event.target).hasClass('web-edited')) {
                    //Don't delete already deleted elements
                    $(event.target).removeClass("web-edited");
                } else {
                    //Delete other deleted elements
                    console.log($(event.target).text().trim() + ' deleted');
                    $(event.target).addClass("web-edited");
                }
            });

        } else {
            $('.web-edited').each(function () {
                //you can use this to access the current item
                $(this).addClass("web-deleted");
            });
            $('#edit-btn').css("background-color", "yellow");
            $('#edit-mode').remove();
            editMode = false;
        }
    }

    //Highlight Button Function
    let highlightMode = false;
    var highlightText = function () {
        console.log('highlight');

        if (!highlightMode) {
            highlightMode = true;
            $('#highlight-btn').css("background-color", "red");
            $("body").append("<h1 id='highlight-mode'>Highlight Mode On!</h1>");

            $("<style>")
                .prop("type", "text/css")
                .html("\
                    ::-moz - selection {\
                        color: red;\
                        background: yellow;\
                    }\
                    ::selection {\
                        color: red;\
                        background: yellow;\
                    }")
                .appendTo("head");
        } else {
            $('#highlight-btn').css("background-color", "yellow");
            $('#highlight-mode').remove();
            highlightMode = false;
        }
    }

    //Save as PDF Button Function
    var convertToPDF = function () {
        console.log('Convert to PDF');
        window.print();
    }

    createToolOptions();

})();