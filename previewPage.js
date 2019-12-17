var currentPIDNo = window.location.href.split('/')[window.location.href.split('/').length - 1].split("#")[0];
var outfitImageSrc = ""
var site = document.getElementsByClassName('image_preview')[0].innerHTML.indexOf("cache.mrporter") > 0 ? "MrP" : "NAP";

createScript("https://code.jquery.com/jquery-3.3.1.min.js")
createScript("https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.3.5/jquery.fancybox.min.js")
createCSS("https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.3.5/jquery.fancybox.min.css")


$(document).ready(function () { //When document has loaded
    setTimeout(function () {
        var allImageDivs = document.getElementsByClassName('image_preview');

        for (var a = 1; a < allImageDivs.length - 1; a++) { // skip the preview grid
            if (allImageDivs[a].children[0].src.indexOf('jpg') != -1) {
                var imageSource = allImageDivs[a].children[0].src
                var newSource = imageSource.replace("xl", "xxl")
                newSource.replace("m2", "xxl")
                allImageDivs[a].children[0].src = newSource
                allImageDivs[a].children[0].removeAttribute("width")
                allImageDivs[a].children[0].removeAttribute("height")
                // If it's an image, load the larger image and then removeAttributes to limit size.
            }
        }
        // Grab Outfit Links
        fetch("http://fulcrum.net-a-porter.com/product/json/outfit_links/" + currentPIDNo, {
                mode: 'no-cors',
                credentials: 'include'
            }).then(response => response.json())
            .then(response => {
                createExtraPreviews(response.outfit_links);
            });
    }, 4000); //Two and a half seconds will elapse and Code will execute.

});




function imageLink(pidNo, imageType, searchType) {
    if (site == "NAP") {
        if (imageType == "video") {
            return `https://video.net-a-porter.com/videos/productPage/${pidNo}_detail.mp4#t=02`
        } else if (imageType == "sw") {
            return `http://cache.net-a-porter.com/images/products/${pidNo}/${pidNo}_${imageType}.jpg`
        } else {
            return `http://cache.net-a-porter.com/images/products/${pidNo}/${pidNo}_${imageType}_l.jpg`
        }
    } else {
        if (imageType == "video") {
            return `https://video.mrporter.com/videos/productPage/${pidNo}_detail.mp4#t=02`
        } else if (imageType == "sw") {
            return `http://cache.mrporter.com/images/products/${pidNo}/${pidNo}_mrp_${imageType}.jpg`
        }
        return `http://cache.mrporter.com/images/products/${pidNo}/${pidNo}_mrp_${imageType}_l.jpg`
    }
}

function createExtraPreviews(outfitPIDsRAW) {
    // outfit links returned in this format, [Under Armour Top id1147681]
    var outfitPIDsResponse = outfitPIDsRAW.replace(/\[/g, "");
    outfitPIDsResponse = outfitPIDsResponse.replace(/\]/g, "");
    var outfitPIDs = outfitPIDsResponse.split(",");
    removeSizePreviews();

    addExtraGridImages()
    addFancyBoxLinks()

    addBGReference();
    addOutfitLinks(outfitPIDs)
    removeMissingImages()
}


function addExtraGridImages() {
    // Get last image in preview grid strip
    let imagePreviewGrid = document.querySelectorAll("table.image_preview img.lazy")
    lastPreviewImage = imagePreviewGrid[imagePreviewGrid.length - 1]

    let videoHTML = `<video width="280" height="345" controls>
  <source src="${imageLink(currentPIDNo,"video")}" type="video/mp4">
</video>`

    let swatchImageHTML = `<img src="${imageLink(currentPIDNo, "sw")}" alt="Swatch" width="144" height="144" onerror="this.onerror=null;this.src='https://via.placeholder.com/144x144.png/FFBF00/FFFFFF?text=SWATCH%20MISSING';" />`
    
    let pressImageHTML = `<img src="${imageLink(currentPIDNo, "pr")}" alt="Press Image" width="230" height="345" onerror="this.onerror=null;this.src='https://via.placeholder.com/230x455.png/FF0000/FFFFFF?text=PRESS IMAGE MISSING';" />`

    if (site == "NAP") {
        lastPreviewImage.outerHTML += videoHTML + swatchImageHTML + pressImageHTML;
    } else {
        lastPreviewImage.outerHTML += videoHTML + swatchImageHTML;
    }
}

function addFancyBoxLinks() {
    var imagesToPreview = document.querySelector("table.image_preview").querySelectorAll("img")

    for (var a = 0; a < imagesToPreview.length; a++) {

        if (imagesToPreview[a].src != "http://fulcrum.net-a-porter.com/static/images/missing.gif") {
            let currentImageSRC = imagesToPreview[a].src

            if (site == "NAP") {
                var newLink = currentImageSRC.replace("_l.jpg", "_xxl.jpg")
            } else {
                var newLink = currentImageSRC.replace("_m2.jpg", "_xxl.jpg")
            }
            let currentImageHTML = imagesToPreview[a].outerHTML

            imagesToPreview[a].outerHTML = "<a href=" + newLink + " data-fancybox='gallery' data-caption=''>" + currentImageHTML + "</a>"
        }
    }

}

function addOutfitLinks(outfitLinks) {

    let imageSizesPreview = document.getElementsByClassName('image_preview')[document.getElementsByClassName('image_preview').length - 1]

    if (outfitLinks[0] != "") {
        // Show current PID FR
        var newOutfitLinksHTML = `<table class='image_preview' border='0'><tbody><tr><td colspan='6'><div class='image_name'>Outfit Links</div></td></tr><tr><td align='center'><IMG SRC='${imageLink(currentPIDNo, "fr")}' style='display: inline;' width='auto' height='460'></td>`
        // For each outfit link image show the index
        for (var a = 0; a < outfitLinks.length; a++) {
            newOutfitLinksHTML += `<td align='center'><IMG SRC=${imageLink(outfitLinks[a].match(/\d{6,7}/), "in")} style='display: inline;' width='auto' height='460'></td>`
        }
        // Then show the current PID OU caption
        newOutfitLinksHTML += `</tr><tr><td align='center'>${currentPIDNo}</td>`
        // Cycle back through each outfit link adding names
        for (var a = 0; a < outfitLinks.length; a++) {
            newOutfitLinksHTML += `<td align='center'><A target='_blank' HREF='http://fulcrum.net-a-porter.com/photography/preview/${outfitLinks[a].match(/\d{6,7}/)}'>${outfitLinks[a].match(/\d{6,7}/)}</A></td>`
        }
        newOutfitLinksHTML += "</tr></tbody></table>"
    } else {
        var newOutfitLinksHTML = `<table class='image_preview' border='0'><tbody><tr><td colspan='6'><div class='image_name'>Outfit Links</div></td></tr><tr><td align='center'>No Outfit Links exist</td></tr></table>`
    }

    var newText = document.createElement('table'); // create new textarea
    var addOutfitLinksElement = imageSizesPreview.parentNode.insertBefore(newText, imageSizesPreview.nextSibling);
    addOutfitLinksElement.outerHTML = newOutfitLinksHTML;

}

function addBGReference() {
    let imageSizesPreview = document.getElementsByClassName('image_preview')[document.getElementsByClassName('image_preview').length - 1]
    let backgroundRefHTML = ``

    if (site=="NAP") {
        backgroundRefHTML += `<table class='image_preview' border='0'><tbody><tr><td colspan='6'><div class='image_name'>Template Check</div></td></tr><tr>`
        backgroundRefHTML += `<td align='center'><div style="height: 500px;width: 335px;background-image: url('https://raw.githack.com/aaronrainbird/greasemonkeyScripts/master/Index Template.jpg'),
        url('${imageLink(currentPIDNo, "in")}');background-blend-mode: multiply;background-size: cover;"></div></td>`
        backgroundRefHTML += `<td align='center'><div style="height: 500px;width: 335px;background-image: url('https://raw.githack.com/aaronrainbird/greasemonkeyScripts/master/Accessory Template.jpg'),
        url('${imageLink(currentPIDNo, "in")}');background-blend-mode: multiply;background-size: cover;"></div></td>`
        backgroundRefHTML += `<td align='center'><div style="height: 500px;width: 335px;background-image: url('https://raw.githack.com/aaronrainbird/greasemonkeyScripts/master/FJ Template.jpg'),
        url('${imageLink(currentPIDNo, "in")}');background-blend-mode: multiply;background-size: cover;"></div></td>`
        backgroundRefHTML += `</tr><tr><td style="text-align:center">RTW Template</td><td style="text-align:center">Accessory Template</td><td style="text-align:center">FJ Template</td></tbody></table>`
    }

    backgroundRefHTML += `<table class='image_preview' border='0'><tbody><tr><td colspan='6'><div class='image_name'>Background Reference</div></td></tr><tr>`

    if (site == "MrP") {
        backgroundRefHTML += `<td align='center'><IMG SRC='${imageLink(currentPIDNo, "fr")}' style='display: inline;' width='auto' height='460'></td>`
        backgroundRefHTML += `<td align='center'><IMG SRC='${imageLink(currentPIDNo, "ou")}' style='display: inline;' width='auto' height='460'></td>`
        backgroundRefHTML += `<td align='center'><IMG SRC='${imageLink(1157508, "ou")}' style='display: inline;' width='auto' height='460'></td>`
    } else {
        backgroundRefHTML += "<td align='center'> <img src='https://raw.githack.com/aaronrainbird/injectImages/master/CONCRETEREF.jpg' style='display: inline;' width='auto' height='460'>  </td>"
        backgroundRefHTML += `<td align='center'><img src='${imageLink(currentPIDNo, "fr")}' style='display: inline;' width='auto' height='460' onerror='this.onerror=null;this.src="${imageLink(currentPIDNo, "ou")}"'</td>`
        backgroundRefHTML += `<td align='center'> <img src='https://raw.githack.com/aaronrainbird/injectImages/master/PANELREF.jpg' style='display: inline;' width='auto' height='460'></td>`
    }
    backgroundRefHTML += `</tr></tbody></table>`

    var newText = document.createElement('table'); // create new textarea
    var backgroundRefElement = imageSizesPreview.parentNode.insertBefore(newText, imageSizesPreview.nextSibling);
    backgroundRefElement.outerHTML = backgroundRefHTML;
}

function removeSizePreviews() {
    document.querySelectorAll('table.image_preview')[1].remove()
}

function removeMissingImages() {
    [...document.querySelectorAll('div.image_preview')].filter(div => div.children[0].src=="http://fulcrum.net-a-porter.com/static/images/missing.gif").forEach(function(missing) {
        missing.previousElementSibling.remove();
          missing.remove();
     });
}


function createScript(source) {
    var script = document.createElement('script');
    script.src = source;
    document.head.appendChild(script); //or something of the likes
}

function createCSS(source) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = source;
    link.media = 'all';
    document.head.appendChild(link)
}
