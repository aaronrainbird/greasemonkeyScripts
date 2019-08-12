// ==UserScript==
// @name     Fulcrum Preview Large Images
// @version  1
// @grant    none
// @match http://fulcrum.net-a-porter.com/photography/preview/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js 
// ==/UserScript==

 var currentPIDNo = window.location.href.split('/')[window.location.href.split('/').length - 1];
  var outfitImageSrc = ""
  var site = "";

$(document).ready(function () { //When document has loaded

  setTimeout(function () {
    var imageDivs = document.getElementsByClassName('image_preview');

    for (var a = 1; a < imageDivs.length - 1; a++) {
      if (imageDivs[a].children[0].src.indexOf('jpg') != -1) {

        var imageSource = imageDivs[a].children[0].src
        var newSource = imageSource.replace("xl", "xxl")
        newSource.replace("m2", "xxl")
        imageDivs[a].children[0].src = newSource
        imageDivs[a].children[0].removeAttribute("width")
        imageDivs[a].children[0].removeAttribute("height")
      }
    }

    var previewDivs = document.getElementsByClassName('image_preview')[0].children[0].children[0].children[0].children;

    for (var a = 0; a < previewDivs.length; a++) {

      if (previewDivs[a].tagName == "IMG") {


        if (previewDivs[a].title == "Outfit Shot") {
          outfitImageSrc = previewDivs[a].src;
          if (previewDivs[a].src.indexOf("net-a-porter") > -1) {
           site = "NAP" 
          }
          else {
           site = "MrP" 
          }

        }

        var imageSource = previewDivs[a].src
        var newSource = imageSource.replace("m2", "xl")
        previewDivs[a].src = newSource
        previewDivs[a].setAttribute("width", "auto")
        previewDivs[a].setAttribute("height", 460)

      }
    }

    fetch("http://fulcrum.net-a-porter.com/product/json/outfit_links/" + currentPIDNo, {
        mode: 'no-cors',
        credentials: 'include'
      }).then(response => response.json())
      .then(response => {
        addLinkToOU(response.outfit_links);
      });


  }, 2000); //Two seconds will elapse and Code will execute.

});

function imageLink(pidNo,imageType,searchType) {

 if (site == "NAP") {
  if (searchType == "ref") {
  pidNo = 1163340;
  }
  return "<img src='http://cache.net-a-porter.com/images/products/" + pidNo + "/" + pidNo + "_" + imageType + "_l.jpg' style='display: inline;' width='auto' height='460'>"
 }
  else {
      if (searchType == "ref") {
  pidNo = 1157508;
  }
    return "<img src='http://cache.mrporter.com/images/products/" + pidNo + "/" + pidNo + "_mrp_" + imageType + "_l.jpg' style='display: inline;' width='auto' height='460'>"
  }
}
  
  function addBGReference() {
    var backgroundRefHTML = "<table class='image_preview' border='0'><tbody><tr><td colspan='6'><div class='image_name'>Background Reference</div></td></tr><tr>"
		    backgroundRefHTML += "<td align='center'>" + imageLink(currentPIDNo,"ou") + "</td>"
    backgroundRefHTML += "<td align='center'>" + imageLink("","ou","ref") + "</td>"
    backgroundRefHTML += "</tr></tbody></table>"
    return backgroundRefHTML;
  }

function addLinkToOU(pidsRAW) {
	var pidResponse = pidsRAW.replace(/\[/g,"")	
  pidResponse = pidResponse.replace(/\]/g,"")
  var pids = pidResponse.split(",")        
  var imageHTML = imageLink(currentPIDNo,"ou");

  var imageSizesPreview = document.getElementsByClassName('image_preview')[document.getElementsByClassName('image_preview').length-1]

	var newText = document.createElement('table'); // create new textarea
	var backgroundRefElement = imageSizesPreview.parentNode.insertBefore( newText, imageSizesPreview.nextSibling );
  backgroundRefElement.outerHTML = addBGReference()  

  var newOutfitLinksHTML = "<table class='image_preview' border='0'><tbody><tr><td colspan='6'><div class='image_name'>Outfit Links</div></td></tr><tr><td align='center'>" + imageHTML + "</td>"

  for (var a = 0; a < pids.length; a++) {
    newOutfitLinksHTML += "<td align='center'>" + imageLink(pids[a].match(/\d{6,7}/),"in") + "</td>"
  }
  newOutfitLinksHTML += "</tr><tr><td align='center'>" + currentPIDNo + "</td>"
  
  for (var a = 0; a < pids.length; a++) {
    newOutfitLinksHTML += "<td align='center'><A  target='_blank' HREF='http://fulcrum.net-a-porter.com/photography/preview/" + pids[a].match(/\d{6,7}/) + "'>" + pids[a].match(/\d{6,7}/) + "</A></td>"
  }
  
  newOutfitLinksHTML += "</tr></tbody></table>"
  imageSizesPreview.innerHTML = newOutfitLinksHTML;
}
