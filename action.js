// code actions which will be implemented into a given page...

(function() {
    var blockElementsAction = function (element) {
        element.style.background='none';
        element.style.backgroundColor='#f1f2f3';
        element.style.fontFamily = 'Comic Sans MS, Comic Sans, cursive';
        element.style.color = '#333';
        element.style.border = 'none';
    };
    var headingAction = function(element) {
        element.style.backgroundColor='#555';
        element.style.fontFamily = 'Comic Sans MS, Comic Sans, cursive';
        element.style.color = '#fff';
    }
    var divs = document.querySelectorAll('div,table,header,footer,section,aside,p,ul,li,a,span,input,button');
    for (i=0; i<divs.length; i++) {
        blockElementsAction(divs[i]);
    }
    var heads = document.querySelectorAll('h1,h2,h3,h4,h5,h6');
    for (i=0; i<divs.length; i++) {
        headingAction(heads[i]);
    }
})();