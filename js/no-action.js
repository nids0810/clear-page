"use strict";

if ($("#tool-option").length != 0) {
  $("#tool-option").remove();
}

if ($("#edit-mode").length != 0) {
  $("#edit-option").remove();
}

if ($("#clear-mode").length != 0) {
  $("#clear-option").remove();
}

if ($("#highlight-mode").length != 0) {
  $("#highlight-option").remove();
}

if ($("#speak-mode").length != 0) {
    $("#speak-option").remove();
}

if ($("#dialog-box").length != 0) {
    $("#dialog-option").remove();
}

if ($("#save-mode").length != 0) {
    $("#save-option").remove();
}

if ($("#help-mode").length != 0) {
    $("#help-option").remove();
}

window.location.reload();
