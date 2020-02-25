var pidElements = document.getElementsByClassName('piditem')
var pidRows = document.querySelectorAll("[id^='row_for_pc']");

var pidsChecked = 0;
var colourVariationsMatches = 0;
var rowsWithColourVariations = []
var filteredState = false;

var mainDiv = document.createElement('div')
mainDiv.id = 'colourVariationsInfo'
mainDiv.style.margin = "15px 0"

var runButton = document.createElement("BUTTON");
runButton.innerHTML = "Click to search for Colour Variations";

mainDiv.appendChild(runButton);

var referenceNode = document.getElementsByClassName('data')[0];
referenceNode.parentNode.insertBefore(mainDiv, referenceNode);

runButton.onclick = function () {
    mainDiv.innerHTML = "<H1>0 of " + pidElements.length + " PIDs checked for Colour Variations</H1>"

    for (var a = 0; a < pidElements.length; a++) {
        grabColourVariations(pidElements[a].innerText, a)
    }

    function grabColourVariations(pidNo, order) {
        fetch("http://fulcrum.net-a-porter.com/product/" + pidNo + "/colour_variation")
            .then(response => response.text())
            .then(text => {
                pidsChecked++;
                const parser = new DOMParser();
                const htmlDocument = parser.parseFromString(text, "text/html");
                const linkedPIDCount = htmlDocument.querySelectorAll(".colour_variation_linked,.colour_variation_unlinked").length

                if (linkedPIDCount > 0) {
                    colourVariationsMatches++;
                    rowsWithColourVariations.push(order);
                    let currentHTML = document.getElementsByClassName('classification')[0].nextElementSibling.innerHTML;
                    if (linkedPIDCount == 1) {
                        document.getElementsByClassName('classification')[order].nextElementSibling.innerHTML = currentHTML.trim() + "<br><p style='border:3px; border-style:solid; background-color:#FF0000;color:white;font-size:12px'>" + linkedPIDCount + " " + "Col Variation</p>";
                    } else {
                        document.getElementsByClassName('classification')[order].nextElementSibling.innerHTML = currentHTML.trim() + "<br><p style='border:3px; border-style:solid; background-color:#FF0000;color:white;font-size:12px'>" + linkedPIDCount + " " + "Col Variations</p>";
                    }
                }
                if (pidsChecked == pidElements.length) {
                    mainDiv.innerHTML = "<H1>All PIDs checked for Colour Variations. <span style='color:red'>" + colourVariationsMatches + " matches found. </span></H1>"
                    if (colourVariationsMatches > 0) {
                        var filterDiv = document.createElement('div');
                        filterDiv.style.margin = "15px 0"
                        filterDiv.onclick = function () {
                            if (!filteredState) {
                                for (var a = 0; a < pidRows.length; a++) {
                                    if (rowsWithColourVariations.indexOf(a) == -1) {
                                        pidRows[a].style.visibility = "collapse"
                                    }
                                }
                                for (var b = 1; b < document.getElementsByClassName('data')[0].getElementsByTagName('thead').length; b++) {
                                    document.getElementsByClassName('data')[0].getElementsByTagName('thead')[b].style.visibility = "collapse";
                                }
                                filterButton.innerText = "UNFILTER ROWS"
                                filterButton.style.backgroundColor = "red"
                                filteredState = true;

                            } else {
                                for (var a = 0; a < pidRows.length; a++) {
                                    pidRows[a].style.visibility = "visible"
                                }
                                for (var b = 1; b < document.getElementsByClassName('data')[0].getElementsByTagName('thead').length; b++) {
                                    document.getElementsByClassName('data')[0].getElementsByTagName('thead')[b].style.visibility = "visible";
                                }
                                filterButton.innerText = "FILTER ROWS"
                                filterButton.style.backgroundColor = "green"
                                filteredState = false;
                            }

                        }
                        var filterButton = document.createElement('button')
                        filterButton.innerText = "FILTER ROWS"
                        filterButton.style.backgroundColor = "green"
                        filterDiv.appendChild(filterButton)
                        mainDiv.parentNode.insertBefore(filterDiv, mainDiv.nextSibling)
                    }

                } else {
                    mainDiv.innerHTML = "<H1>" + pidsChecked + " of " + pidElements.length + " PIDs checked for Colour Variations</H1>"
                }
            })
    }
};
