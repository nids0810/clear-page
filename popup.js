function click(e) {
    chrome.tabs.executeScript(null, {file: "action.js"});
    window.close();
}
                              
document.addEventListener('DOMContentLoaded', function(){
    var divAction = document.getElementById('clickMe');
    divAction.addEventListener('click',click);
});