// Script to grab the product info from an amazon page.

"use strict";

const BACK_END_URL = "https://recyclabilitydiscriminator.eu-gb.mybluemix.net/amazonproduct"

// Checks for the ASIN on the Amazon page.
function getASIN() {
    let tableRows = document.getElementsByTagName("td");
    let ASIN;

    for (let i = 0; i < tableRows.length; i++) {
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

    let labels = document.getElementsByTagName("bdi");
    //console.log(labels);
    for (let i = 0; i < labels.length; i++) {
        let label = labels[i];
        //console.log(label);
        if(label.innerHTML == "ASIN"){
            let ASINarea = label.parentElement.parentElement.innerHTML;

            ASIN = ASINarea.substr(ASINarea.length - 10, ASINarea.length - 1);
        }
    }

    return ASIN;
}

async function postData(url, data) {
    let response = await fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data)
    });

    return response.text();
}

function queryBackEnd(data) {
    postData(BACK_END_URL, { ASIN: data })
        .then(
            data => {
                console.log(data);
            }
        );
}

let ASIN = getASIN();
console.log("Product Identification Number: " + ASIN);
queryBackEnd(ASIN);
