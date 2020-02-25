var currentPID = window.location.href.split("/")[window.location.href.split("/").length - 2];
var linkedPIDInfo = [];
var pageChange = false;
var site = document.getElementsByClassName('data')[0].children[1].children[0].children[0].innerHTML.indexOf("MRP") > 1 ? "MRP" : "NAP";
var siteLink = site == "MRP" ? "mrporter" : "net-a-porter";
var yuiNav = document.getElementsByClassName('yui-nav')[0].children;
var navNumber
for (var i = 0; i < yuiNav.length; i++) {
    if (yuiNav[i].title == "active") {
        navNumber = i;
    }
}
console.log(navNumber)


grabColourVariations(currentPID);

var otherKeywords = []

function grabColourVariations(pid) {
    fetch("http://fulcrum.net-a-porter.com/product/" + pid + "/colour_variation")
        .then(response => response.text())
        .then(text => {
            const parser = new DOMParser();
            const htmlDocument = parser.parseFromString(text, "text/html");
            const linkedPIDs = htmlDocument.querySelectorAll(".colour_variation_linked,.colour_variation_unlinked")
            let linkedPIDsArray = []

            document.getElementsByClassName('yui-nav')[0].appendChild(document.createRange().createContextualFragment(`<li style="max-width: 500px;max-height:100px;padding: 5px;"><p id='onClickShow' style="border:3px; padding:10px;cursor:pointer;border-style:solid; background-color:#FF0000;color:white;font-size:12px;text-align: center;"><b>${linkedPIDs.length}</b> Col Variations Found : <span id='loadingText'>Data being loaded <img style='mix-blend-mode: multiply;height: 50px;' src='https://upload.wikimedia.org/wikipedia/commons/9/92/Loading_icon_cropped.gif'></img></span></p></li>`))

            for (let a = 0; a < linkedPIDs.length; a++) {
                linkedPIDsArray.push("http://fulcrum.net-a-porter.com/product/" + linkedPIDs[a].childNodes[1].textContent.trim().split(" ")[1] + "/editorial");
            }

            grabLinkedPidInfo(linkedPIDsArray);
        })
}

function grabLinkedPidInfo(urls) {

    Promise.all(urls.map(url =>
        fetch(url).then(resp => resp.text())
    )).then(text => {
        for (let a = 0; a < text.length; a++) {
            const parser = new DOMParser();
            const htmlDocument = parser.parseFromString(text[a], "text/html");
            console.log(htmlDocument.querySelectorAll("[id^='editors_comments']:not([id$='count'])"))
            console.log(htmlDocument.querySelectorAll("[id^='editors_comments']:not([id$='count'])")[navNumber].value)
            let pidInfo = {
                "pid": htmlDocument.querySelectorAll("title")[0].textContent.match(/\d+/)[0],
                "description": htmlDocument.querySelectorAll('#product_overview')[0].children[1].children[0].children[0].children[1].textContent.trim(),
                "editorsNotes": htmlDocument.querySelectorAll("[id^='editors_comments']:not([id$='count'])")[navNumber].value,
                "details": htmlDocument.querySelectorAll("[id^='long_description']:not([id$='count'])")[navNumber].value,
                "sizeAndFit": htmlDocument.querySelectorAll("[id^='size_fit']:not([id$='count']):not([id^='size_fit_delta'])")[navNumber].value,
                "keywords": htmlDocument.querySelectorAll("[id^='keywords']:not([id$='count'])")[navNumber].value,
                "currentListLink": htmlDocument.querySelectorAll("[id^='editorial_list']").length > 0 ? "<A HREF=" + htmlDocument.querySelectorAll("[id^='editorial_list']")[0].href + ">" + htmlDocument.querySelectorAll("[id^='editorial_list']")[0].textContent.replace(/_/g, " ") + "<A>" : "Not in an Editorial List",
                "visibility": htmlDocument.getElementsByClassName('data')[0].children[1].children[navNumber].children[7].innerHTML.indexOf('bullet_green') > -1
            }
            linkedPIDInfo.push(pidInfo)
        }

        if (linkedPIDInfo.length > 0) {

            linkedPIDInfo.sort(dynamicSortMultiple("-visibility", "-pid")) // sort LinkedPID array to prioritise the pids on site.

            document.getElementById('onClickShow').addEventListener("click", toggleModal, false) // Add onlclick to show colour variations button.

            let currentEditorsNotes = document.querySelectorAll("[id^='editors_comments']:not([id$='count'])")[navNumber].value;
            let currentDetails = document.querySelectorAll("[id^='long_description']:not([id$='count'])")[navNumber].value;
            let currentDescription = document.querySelectorAll('#product_overview')[0].children[1].children[0].children[0].children[1].textContent.trim();
            let currentSizeAndFit = document.querySelectorAll("[id^='size_fit']:not([id$='count']):not([id^='size_fit_delta'])")[navNumber].value;
            let currentKeywords = arrayUnique(document.querySelectorAll("[id^='keywords']:not([id$='count'])")[navNumber].value.trim().split(/[\s{1,},]|\t/)).filter(word => word.length > 1).sort();
            let currentCurrentList = document.querySelectorAll("[id^='editorial_list']")[0].textContent.replace(/_/g, "_<BR>");
            let currentPid = document.querySelectorAll("title")[0].textContent.match(/\d+/)[0];


            loadCSS();

            var divHTML = `
            <div class="modalN">
            <div class="modal__header">
                <table>
                    <thead>
                        <tr class="sticky">
                            <th style=''>PID No.</td>
                            <th style=''>Index Image</td>
                            <th style=''>Editors Notes</td>
                            <th style=''>Details</td>
                            <th style=''>Size and Fit Notes</td>
                            <th style=''>Keywords<div id='onClickHide' style="position: absolute;cursor:pointer;right: 10px;top:5px;color: red;">X</div></td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="width:5%;white-space:pre-wrap;white-space:-moz-pre-wrap;word-wrap:break-word"><B>${currentPid}</B><BR><BR>${currentCurrentList}<BR><BR>${currentDescription}</td>
                            <td style='width: 10%'><IMG
                                    SRC="https://cache.${siteLink}.com/images/products/${currentPid}/${currentPid}_in_m2.jpg" onerror="this.src='https://fulcrum.net-a-porter.com/static/images/product/${currentPid}/100.jpg'">
                            </td>
                            <td id='currentEditorsNotes'><textarea>${currentEditorsNotes}</textarea></td>
                            <td id='currentDetails'><textarea>${currentDetails}</textarea></td>
                            <td id='currentSizeAndFitNotes'><textarea>${currentSizeAndFit}</textarea></td>
                            <td id='currentKeywords'><textarea id='currentKeywordsBox'>${currentKeywords.join(" ") + " "}</textarea></td>
                        </tr>
                        <tr>
                            <td style='width:5%;'></td>
                            <td style='width:10%;'></td>
                            <td style="text-align: center;"><button type="button" class="copyTo">Copy to Page</button></td>
                            <td style="text-align: center;"><button type="button" class="copyTo">Copy to Page</button></td>
                            <td style="text-align: center;"><button type="button" class="copyTo">Copy to Page</button></td>
                            <td style="text-align: center;"><button type="button" class="copyTo">Copy to Page</button></td>
                        </tr>
                    </tbody>
                </table>
            </div><BR><BR> <div class="modal__content"><table>
            <tbody>`



            var allPhrases = []
            if (currentEditorsNotes.indexOf("Shown here with:") > -1) { //Ignore shown here with copy when generating all phrases
                allPhrases.push(currentEditorsNotes.substring(0, currentEditorsNotes.indexOf("Shown here with:")).replace(/<br>/gi, "").split(".").filter(sentence => sentence.length > 1))
            } else {
                allPhrases.push(currentEditorsNotes.replace(/<br>/gi, "").split(".").filter(sentence => sentence.length > 1))
            }

            for (var a = 0; a < linkedPIDInfo.length; a++) {
                otherKeywords.push(...linkedPIDInfo[a].keywords.trim().split(/\s{1,}|\t/))
                //  console.log(linkedPIDInfo[a])
                if (linkedPIDInfo[a].editorsNotes.indexOf("Shown here with:") > -1) {
                    allPhrases.push(linkedPIDInfo[a].editorsNotes.substring(0, linkedPIDInfo[a].editorsNotes.indexOf("Shown here with:")).replace(/<br>/gi, "").split(".").filter(sentence => sentence.length > 1))
                } else {
                    allPhrases.push(linkedPIDInfo[a].editorsNotes.replace(/<br>/gi, "").split(".").filter(sentence => sentence.length > 1))
                }

                divHTML +=
                    ` 
                        <tr>
                            <td class='listInfo' style="width:5%;border:1px solid red;white-space:pre-wrap;white-space:-moz-pre-wrap;word-wrap:break-word;${linkedPIDInfo[a].visibility ? 'background-color:#d5ffd9' : 'background-color:#ffd5d5'}"><B><A HREF="http://fulcrum.net-a-porter.com/product/${linkedPIDInfo[a].pid}/editorial" target="_blank">${linkedPIDInfo[a].pid}</A></B><BR><BR>${linkedPIDInfo[a].currentListLink}<BR><BR><BR>${linkedPIDInfo[a].description}<BR><BR>${linkedPIDInfo[a].visibility ? 'Live on Site':''}</td>
                            <td style='width: 10%'><IMG
                                    SRC="https://cache.${siteLink}.com/images/products/${linkedPIDInfo[a].pid}/${linkedPIDInfo[a].pid}_in_m2.jpg" onerror="this.onerror=null;this.src='http://fulcrum.net-a-porter.com/static/images/product/${linkedPIDInfo[a].pid}/100.jpg'"/>
                            </td>
                            <td class='editorsNotes'></td>
                            <td class='details'></td>
                            <td class='sizeAndFitNotes'></td>
                            <td class='keywords'></td>
                        </tr>  
                   `
            }


            otherKeywords = otherKeywords.filter(word => word.length > 1).sort(function (a, b) {
                a = a.toLowerCase();
                b = b.toLowerCase();
                if (a == b) return 0;
                return a < b ? -1 : 1;
            })

            var uniqueKeywordsArray = arrayUnique(currentKeywords.concat(otherKeywords));

            divHTML += ` </tbody></table>
            <table><thead><th style="padding: 20px 0;font-size: 14px;font-weight: bold;text-align:center">All Keywords Used:</th></thead><tbody>
            <tr style="height: 100px;padding: 20px 0px;">
   
            <td style="width: 90%;padding: 20px 0;font-size: 14px;font-weight: bold;text-align:center" id='keywordArea'></td>
            </tr>
            </tbody>
            </table>

            </div></div>
            `
            //<tbody id='sentenceArea'>
            /*

                        <table><thead><th colspan="2" style="padding: 20px 0;font-size: 14px;font-weight: bold;text-align:center">All Sentences Used:</th></thead>
            

            </tbody>
            </table>
            */

            let divToAdd = document.createRange().createContextualFragment(divHTML);

            let loadingReference = document.getElementById('loading');
            loadingReference.parentNode.insertBefore(divToAdd, loadingReference.nextSibling);

            let keywordArea = document.getElementById('keywordArea');

            for (var a = 0; a < uniqueKeywordsArray.length; a++) {

                let keywordButton = document.createElement("button");
                keywordButton.type = "button"
                keywordButton.onclick = function () {
                    // document.getElementById('currentKeywords').children[0];

                    let selectedWord = this.innerText.trim() + " "

                    if (this.className == "used") {
                        this.className = "unused";

                        selectedWordRegex = new RegExp(selectedWord, "g")
                        let replaceText = " " + document.getElementById('currentKeywordsBox').value + " ";
                        replaceText = replaceText.replace(selectedWordRegex, "").replace(/\s{1,}|\t/g, " ").trim()
                        document.getElementById('currentKeywordsBox').value = replaceText += " ";

                    } else {
                        this.className = "used";
                        // console.log(selectedWord)
                        var updatedText = document.getElementById('currentKeywordsBox').value.trim().replace(/\s{1,}|\t/g, " ") + " " + selectedWord + " "
                        // console.log(updatedText)
                        document.getElementById('currentKeywordsBox').value = updatedText;
                    }
                    document.getElementById('currentKeywordsBox').value = document.getElementById('currentKeywordsBox').value.split(" ").sort(function (a, b) {
                        a = a.toLowerCase();
                        b = b.toLowerCase();
                        if (a == b) return 0;
                        return a < b ? -1 : 1;
                    }).join(" ")
                }
                keywordButton.innerText = uniqueKeywordsArray[a] + " ";
                // console.log(currentKeywords.length)
                // console.log(uniqueKeywordsArray[a] + " - " + a)
                if (a < currentKeywords.length) {
                    keywordButton.className = 'used'
                } else {
                    keywordButton.className = 'unused'
                }

                //  keywordButton.style.cssText = "margin: 10px 5px;border-radius: 20px;background-color: green;color: white;padding: 10px 10px;-webkit-appearance: button;-moz-appearance: button;appearance: button;display: inline-block;"
                keywordArea.appendChild(keywordButton);
            }
            addOnInteractionFunctions()

            for (var a = 0; a < linkedPIDInfo.length; a++) {
                document.getElementsByClassName('editorsNotes')[a].innerText = linkedPIDInfo[a].editorsNotes
                document.getElementsByClassName('details')[a].innerText = linkedPIDInfo[a].details
                document.getElementsByClassName('sizeAndFitNotes')[a].innerText = linkedPIDInfo[a].sizeAndFit
                document.getElementsByClassName('keywords')[a].innerText = linkedPIDInfo[a].keywords

            }
            document.getElementById('onClickHide').addEventListener("click", toggleModal, false)
            document.getElementById('loadingText').innerHTML = "<B>Click to View</B>"


            $('#currentKeywordsBox').on('blur', function (e) {
                document.getElementById('currentKeywordsBox').value = document.getElementById('currentKeywordsBox').value.split(" ").sort(function (a, b) {
                    a = a.toLowerCase();
                    b = b.toLowerCase();
                    if (a == b) return 0;
                    return a < b ? -1 : 1;
                }).join(" ").trimStart();
                updateKeywordCloud(this.value);
            });


        }
    })
}



function arrayUnique(array) {
    var a = array.concat();
    for (var i = 0; i < a.length; ++i) {
        for (var j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j])
                a.splice(j--, 1);
        }
    }
    return a;
}


function addOnInteractionFunctions() {

    for (var a = 0; a < document.getElementsByClassName('copyTo').length; a++) {
        document.getElementsByClassName('copyTo')[a].onclick = function () {
            this.innerText = "Copied"
            this.style.color = "lawngreen"
            this.style.backgroundColor = "green"
            var cellIndex = this.parentElement.cellIndex
            // console.log(cellIndex)
            pageChange = true;
            if (cellIndex == 2) {
                document.querySelectorAll("[id^='editors_comments']:not([id$='count'])")[navNumber].value = document.getElementById('currentEditorsNotes').children[0].value;
            } else if (cellIndex == 3) {
                document.querySelectorAll("[id^='long_description']:not([id$='count'])")[navNumber].value = document.getElementById('currentDetails').children[0].value;
            } else if (cellIndex == 4) {
                document.querySelectorAll("[id^='size_fit']:not([id$='count']):not([id^='size_fit_delta'])")[navNumber].value = document.getElementById('currentSizeAndFitNotes').children[0].value;
            } else if (cellIndex == 5) {
                document.querySelectorAll("[id^='keywords']:not([id$='count'])")[navNumber].value = document.getElementById('currentKeywordsBox').value;
            }
        }
    }

    document.getElementById('currentEditorsNotes').children[0].oninput = function () {
        if (document.getElementsByClassName('copyTo')[0].innerText == "Copied") {
            document.getElementsByClassName('copyTo')[0].innerText = "Copy to Page";
            document.getElementsByClassName('copyTo')[0].style.color = "";
            document.getElementsByClassName('copyTo')[0].style.backgroundColor = "";
        }
    }
    document.getElementById('currentDetails').children[0].oninput = function () {
        if (document.getElementsByClassName('copyTo')[1].innerText == "Copied") {
            document.getElementsByClassName('copyTo')[1].innerText = "Copy to Page";
            document.getElementsByClassName('copyTo')[1].style.color = "";
            document.getElementsByClassName('copyTo')[1].style.backgroundColor = "";
        }
    }
    document.getElementById('currentSizeAndFitNotes').children[0].oninput = function () {
        if (document.getElementsByClassName('copyTo')[2].innerText == "Copied") {
            document.getElementsByClassName('copyTo')[2].innerText = "Copy to Page";
            document.getElementsByClassName('copyTo')[2].style.color = "";
            document.getElementsByClassName('copyTo')[2].style.backgroundColor = "";
        }
    }
    document.getElementById('currentKeywords').children[0].oninput = function () {
        if (document.getElementsByClassName('copyTo')[3].innerText == "Copied") {
            document.getElementsByClassName('copyTo')[3].innerText = "Copy to Page";
            document.getElementsByClassName('copyTo')[3].style.color = "";
            document.getElementsByClassName('copyTo')[3].style.backgroundColor = "";
        }
    }
}

function loadCSS() {
    var cssId = 'myCss'; // you could encode the css path itself to generate id..
    if (!document.getElementById(cssId)) {
        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.id = cssId;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = 'https://raw.githack.com/aaronrainbird/greasemonkeyScripts/master/colourV.css';
        link.media = 'all';
        head.appendChild(link);
    }
}



function updateKeywordCloud(current) {

    var currentKeywords = arrayUnique(current.trim().split(/[\s{1,},]|\t/)).filter(word => word.length > 1).sort(function (a, b) {
        a = a.toLowerCase();
        b = b.toLowerCase();
        if (a == b) return 0;
        return a < b ? -1 : 1;
    })
    var uniqueKeywordsArray = arrayUnique(currentKeywords.concat(otherKeywords));

    let keywordArea = document.getElementById('keywordArea');
    keywordArea.innerHTML = "";

    for (var a = 0; a < uniqueKeywordsArray.length; a++) {

        let keywordButton = document.createElement("button");
        keywordButton.type = "button"
        keywordButton.onclick = function () {

            let selectedWord = this.innerText.trim() + " "

            if (this.className == "used") {
                this.className = "unused";

                selectedWordRegex = new RegExp(selectedWord, "g")
                let replaceText = " " + document.getElementById('currentKeywordsBox').value + " ";
                replaceText = replaceText.replace(selectedWordRegex, "").replace(/\s{1,}|\t/g, " ").trim()
                document.getElementById('currentKeywordsBox').value = replaceText += " ";

            } else {
                this.className = "used";
                // console.log(selectedWord)
                var updatedText = document.getElementById('currentKeywordsBox').value.trim().replace(/\s{1,}|\t/g, " ") + " " + selectedWord + " "
                // console.log(updatedText)
                document.getElementById('currentKeywordsBox').value = updatedText;
            }
            document.getElementById('currentKeywordsBox').value = document.getElementById('currentKeywordsBox').value.split(" ").sort(function (a, b) {
                a = a.toLowerCase();
                b = b.toLowerCase();
                if (a == b) return 0;
                return a < b ? -1 : 1;
            }).join(" ").trimStart();
        }
        keywordButton.innerText = uniqueKeywordsArray[a] + " ";
        // console.log(currentKeywords.length)
        // console.log(uniqueKeywordsArray[a] + " - " + a)
        if (a < currentKeywords.length) {
            keywordButton.className = 'used'
        } else {
            keywordButton.className = 'unused'
        }

        //  keywordButton.style.cssText = "margin: 10px 5px;border-radius: 20px;background-color: green;color: white;padding: 10px 10px;-webkit-appearance: button;-moz-appearance: button;appearance: button;display: inline-block;"
        keywordArea.appendChild(keywordButton);
    }




}


function keywordCloud(keyword) {
    // console.log(keyword.innerText);
}



function dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a, b) {
        /* next line works with strings and numbers, 
         * and you may want to customize it to your needs
         */
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

function dynamicSortMultiple() {
    /*
     * save the arguments object as it will be overwritten
     * note that arguments object is an array-like object
     * consisting of the names of the properties to sort by
     */
    var props = arguments;
    return function (obj1, obj2) {
        var i = 0,
            result = 0,
            numberOfProperties = props.length;
        /* try getting a different result from 0 (equal)
         * as long as we have extra properties to compare
         */
        while (result === 0 && i < numberOfProperties) {
            result = dynamicSort(props[i])(obj1, obj2);
            i++;
        }
        return result;
    }
}

function toggleModal() {
    if (document.getElementsByClassName('modalN').length == 1) {
        if (document.getElementsByClassName('modalN')[0].getAttribute("class") == "modalN open") {
            document.getElementsByClassName('modalN')[0].setAttribute('class', 'modalN')
            if (pageChange) {
                alert("You've made a change to the copy, please make sure you save properly to Fulcrum")
            }
            pageChange = false;
            // IF AN ELEMNENT WAS CHANGED YOU COULD DO A SAVE WARNING HERE.

        } else {
            console.log("modal hidden")
            document.getElementsByClassName('modalN')[0].setAttribute('class', 'modalN open')
        }
    } else {
        console.log("no modal yet")
    }
}

/*  PHRASES STUFF            
    var tempHTML = ""
    for (var a = 0; a < allPhrases.length; a++) {

        let sentenceArea = document.getElementById('sentenceArea');
        let row = sentenceArea.insertRow(0);
        let numberCell = row.insertCell(0);
        numberCell.setAttribute('rowSpan', allPhrases[a].length);
        numberCell.innerHTML = a;

        for (var b = 0; b < allPhrases[a].length; b++) {
            let contentCell = row.insertCell(1);
            contentCell.innerHTML = allPhrases[a][b];
        }
    }
    document.getElementById('sentenceArea').innerHTML = tempHTML;
*/

/*

var masterPhraseArray = []

var phrase = "TOM FORD's ivory sweater is spun from fine cashmere and silk-blend that feels really soft and light. It has a draped, one-shoulder silhouette and dolman sleeves with thumbholes at the cuffs to keep them in place. Wear yours tucked into sleek leather pants.<br><br>Shown here with: [Gucci Pants id1202975], [SAINT LAURENT Shoulder bag id415376], [TOM FORD Sandals id1155219], [Leigh Miller Necklace id1186156]."

var phraseClean = phrase.substring(0,phrase.indexOf("Shown here with:")).replace(/<br>/gi,"").split(".").filter(sentence => sentence.length > 1)

for (let a = 0;a<phraseClean.length;a++) {
masterPhraseArray.push(phraseClean[a].trim())
}

console.log(masterPhraseArray)

*/
