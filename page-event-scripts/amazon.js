// Script to grab the product info from an amazon page.

"use strict";

// ===== Scraping Functions =====
// Gets all the product information and returns it as an object.
function getProductInfo() {

    let ASIN = "";
    let title = "";
    let description = "";
    let price = "";

    // Get all the product information.
    ASIN = getASINAmazon();
    title = getTitleAmazon();
    description = getDescAmazon();
    price = getPriceAmazon();
    // Return empty object if all the information is empty.
    if (ASIN == "" && title == "" && description == "" && price == "") {
        // Return a blank object if there is no product.
        return {};
    } else {
        // Return all the data as a JSON object.
        return {
            "product-information":
            {
                "ASIN": ASIN,
                "title": title,
                "description": description,
                "price": price
            }
        };
    }
}

// Checks for the ASIN on the Amazon page.
function getASINAmazon() {
    let tableRows = document.getElementsByTagName("td");
    let ASIN = "";

    for (let i = 0; i < tableRows.length; i++) {
        let node = tableRows[i];
        if (node.innerHTML == "ASIN") {
            let tableRow = node.parentElement.childNodes;

            for (let j = 0; j < tableRow.length; j++) {
                let tableItem = tableRow[j];
                if (node != tableItem) {
                    ASIN = tableItem.innerHTML;
                }
            }
        }
    }

    let labels = document.getElementsByTagName("bdi");
    for (let i = 0; i < labels.length; i++) {
        let label = labels[i];
        if (label.innerHTML == "ASIN") {
            let ASINarea = label.parentElement.parentElement.innerHTML;

            ASIN = ASINarea.substr(ASINarea.length - 10, ASINarea.length - 1);
        }
    }

    let salt = "amazon-";
    let salted_identity = salt.concat(ASIN);

    return salted_identity;
}

function getTitleAmazon() {
    let title = document.getElementById("productTitle");
    return getCleanText(title);
}

function getDescAmazon() {
    let description = document.getElementById("productDescription");
    return getCleanText(description);
}

function getPriceAmazon(){
    let price = document.getElementById("priceblock_ourprice");
    return getCleanText(price).substring(1);
}

// ===== Text Manipulation Functions =====

function getCleanText(object) {
    let rawText = getHTMLObjectText(object);
    return stripNewlines(rawText);
}

function stripNewlines(text) {
    return text.replace(/(\r\n|\n|\r)/gm, "");
}

function getHTMLObjectText(object) {
    try {
        return object.textContent || object.innerText || "";
    } catch (e) {
        //Checks if the error is not a type error.
        if (!e instanceof TypeError) {
            throw e;
        }
        return "";
    }
}


// ===== Store Product Information ====
let productInfo = getProductInfo();

// Check if the product information can actually be found.
if (productInfo != {}) {
    // Store the products information in the extension storage.
    chrome.storage.sync.set(productInfo, function () {
        console.log('Amazon product information saved');

        // Testing to see if the information is saved.
        chrome.storage.sync.get(["product-information"], function (data) {
            console.log(data);
        })
    });
    
} else {
    console.log('Not Saved.');
}