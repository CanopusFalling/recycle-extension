// Script to grab the product info from an amazon page.

"use strict";

// Checks for the ASIN on the Amazon page.
function getASIN() {
    let tableRows = document.getElementsByTagName("td");
    let ASIN;

    for(let i = 0; i < tableRows.length; i++){
        let node = tableRows[i];
        if (node.innerHTML == "ASIN") {
            let tableRow = node.parentElement.childNodes;

            for (let j = 0; j < tableRow.length; j++) {
                let tableItem = tableRow[j];
                if (node != tableItem) {
                    ASIN = tableItem.innerHTML;
                    //console.log(ASIN);
                }
                //console.log(node);
            }
            //console.log(tableRow);
        }
        //console.log(node + " : " + node.innerHTML);
    }

    return ASIN;
}

function queryBackEnd(){

}

let ASIN = getASIN();

