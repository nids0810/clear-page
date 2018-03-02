// code actions which will be implemented into a given page...

(function() {
    // Block Element Action
    var blockElementsAction = function (element) {
        element.style.background='none';
        element.style.backgroundColor='#f1f2f3';
        element.style.fontFamily = 'Comic Sans MS, Comic Sans, cursive';
        element.style.color = '#333';
        element.style.border = 'none';
    };
    // Header Action
    var headingAction = function(element) {
        element.style.background='none';
        //element.style.fontFamily = "'Comic Sans MS, Comic Sans, cursive'+'!important'";
        element.style.fontFamily = 'Comic Sans MS, Comic Sans, cursive';
        element.style.color = '#333';
    }
    // Anchor Action
    var anchorAction = function(element) {
        element.style.background='none';
        element.style.backgroundColor='#f1f2f3';
        element.style.fontFamily = 'Comic Sans MS, Comic Sans, cursive';
        element.style.fontWeight = 'bold';
        element.style.textDecoration = 'underline';
        element.style.color = '#333';
    }
    var imgAction = function(element) {
        element.src='';
        element.srcset='';
        element.style.background='none';
        element.style.display = 'none';
    }
    var divs = document.querySelectorAll('body,div,table,header,footer,section,aside,p,ul,li,a,span,input,button');
    for (i=0; i<divs.length; i++) {
        blockElementsAction(divs[i]);
    }
    var anchors = document.querySelectorAll('a');
    for (i=0; i<anchors.length; i++) {
        anchorAction(anchors[i]);
    }
    var imgs = document.querySelectorAll('img,source,picture,svg');
    for (i=0; i<imgs.length; i++) {
        imgAction(imgs[i]);
    }
    var heads = document.querySelectorAll('h1,h2,h3,h4,h5,h6');
    for (i=0; i<divs.length; i++) {
        headingAction(heads[i]);
    }
})();