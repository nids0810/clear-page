alert('This is sample.js')

//function for Save as PDF
/* 
var convertToPDF = function (quality = 1) {
    console.log('Convert to PDF');
    const filename = 'new-file.pdf';

    html2canvas(document.querySelector('#myheading'), {scale: quality})
    .then(canvas => {
        let pdf = new jsPDF('p', 'mm', 'a4');
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 211, 298);
        pdf.save(filename);
    });
}
*/

//function for highlighting
/* 
var getRangeObject = function (selectionObject) {
    try {
        if (selectionObject.getRangeAt)
            return selectionObject.getRangeAt(0);
    } catch (ex) {
        console.log(ex);
    }
} 

document.onmousedown = function (e) {
    var text;
    if (window.getSelection) {
        // get the Selection object
        userSelection = window.getSelection()

        // get the innerText (without the tags)
        text = userSelection.toString();

        // Creating Range object based on the userSelection object
        var rangeObject = getRangeObject(userSelection);

        // This extracts the contents from the DOM literally, inclusive of the tags. 
        // The content extracted also disappears from the DOM 
        contents = rangeObject.extractContents();

        var span = document.createElement("span");
        span.className = "highlight";
        span.appendChild(contents);

        //Insert your new span element in the same position from where the selected text was extracted
        rangeObject.insertNode(span);

    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
};
*/


//CSS for highlight
/*
    :: -moz - selection { // Code for Firefox
    color: red;
    background: yellow;
}

:: selection {
    color: red;
    background: yellow;
} */