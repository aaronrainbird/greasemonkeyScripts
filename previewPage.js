// ==UserScript==
// @name     Fulcrum Preview Large Images
// @version  1
// @grant    none
// @match http://fulcrum.net-a-porter.com/photography/preview/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js 
// ==/UserScript==

$(document).ready(function () { //When document has loaded
  setTimeout(function () {
    var imageDivs = document.getElementsByClassName('image_preview');
    for (var a = 1; a < imageDivs.length - 1; a++) {
      if (imageDivs[a].children[0].src.indexOf('jpg') != -1) {
        var imageSource = imageDivs[a].children[0].src
        var newSource = imageSource.replace("xl", "xxl")
        imageDivs[a].children[0].src = newSource
        imageDivs[a].children[0].removeAttribute("width")
        imageDivs[a].children[0].removeAttribute("height")
      }
    }

    var previewDivs = document.getElementsByClassName('image_preview')[0].children[0].children[0].children[0].children;
    for (var a = 0; a < previewDivs.length; a++) {
      if (previewDivs[a].src.indexOf('jpg') != -1) {
        var imageSource = previewDivs[a].src
        var newSource = imageSource.replace("xl", "xxl")
        previewDivs[a].src = newSource
        previewDivs[a].setAttribute("width", "auto")
        previewDivs[a].setAttribute("height", 460)
      }
    }
  }, 2000); //Two seconds will elapse and Code will execute.
}); 
