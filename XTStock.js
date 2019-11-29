var rows = document.getElementsByClassName('wide-data')[3].children[1].children
for (var a = 0;a<rows.length-1;a++) {
for (var b = 5;b<9;b++) {
var stockValue = rows[a].children[b]
if (stockValue.innerText == 0) {
stockValue.outerHTML = stockValue.outerHTML.replace("<td","<td style='color:lightgrey;'")
} 
}
}
