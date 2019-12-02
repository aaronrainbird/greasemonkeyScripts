var pidItem = document.getElementsByClassName('piditem');
var DC1 = document.querySelectorAll('[id^=row_for_pc]')
for (var a = 0; a < pidItem.length; a++) {
    let pidNo = pidItem[a].innerText;
    pidItem[a].parentElement.parentElement.innerHTML = '<a style="margin: 0px 15px 0 0;font-weight: bold;border: 1px solid gray;color: white;background-color: #a2a2a2;" href="https://xtracker.net-a-porter.com/StockControl/Inventory/Overview?product_id=' + pidNo + '" target="_blank">XT</a>' + pidItem[a].parentElement.parentElement.innerHTML
}



for (var a = 0; a < DC1.length; a++) {
    var currentPID =
        DC1[a].children[6].outerHTML = DC1[a].children[6].outerHTML.replace("<td>", "<td style='color:white;background-color: #999;'>")
    let SRCount = DC1[a].children[6].children[2].children[0].innerText;
    if (SRCount == 1) {
        DC1[a].children[6].children[2].children[0].outerHTML = DC1[a].children[6].children[2].children[0].outerHTML.replace("<abbr", "<abbr style='color:lime;'")
    } else if (SRCount >= 2) {
        DC1[a].children[6].children[2].outerHTML = DC1[a].children[6].children[2].outerHTML.replace("<div", "<div style='color:white;background-color: green;'")
    }
    if (DC1[a].children[6].children[2].children.length == 2) {
        DC1[a].children[6].children[2].children[1].outerHTML = DC1[a].children[6].children[2].children[1].outerHTML.replace("<abbr", "<abbr style='background-color:orange;'")
    }
}

var pids = document.querySelectorAll('[id^=row_for_pc]');

for (var a = 0; a < pids.length; a++) {
    console.log(pids[a].children[6].children[2].children.length)
}
