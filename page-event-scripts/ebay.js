// Script to grab the product info from an amazon page.

"use strict";

// ===== Scraping Functions =====
// Gets all the product information and returns it as an object.
function getProductInfo() {
    // Get hostname
    let url = window.location.href;
    //console.log(url);

    let ASIN = "";
    let title = "";
    let description = "";

    if (url.includes("ebay")){
        // Get all the product information.
        ASIN = getASINEbay();
        title = getTitleEbay();
        description = getDescEbay();

        // Return empty object if all the information is empty.
        if (ASIN == "" && title == "" && description == "") {
            // Return a blank object if there is no product.
            return {};
        } else {
            // Return all the data as a JSON object.
            return {
                "product-information":
                {
                    "ASIN": ASIN,
                    "title": title,
                    "description": description
                }
            };
        }
    }
}

function getASINEbay() {
    let title = document.getElementById("descItemNumber");
    return getCleanText(title);
}

function getTitleEbay() {
    let selector = document.querySelectorAll('[itemprop="name"]');
    //console.log(selector[selector.length - 1]);
    return getCleanText(selector[selector.length - 1]);
}

function getDescEbay() {
    let tableRows = document.getElementsByTagName("td");
    let material = "";

    for (let i = 0; i < tableRows.length; i++) {
        let node = getCleanText(tableRows[i]);
        if (node.includes("Material")){
            material = getCleanText(tableRows[i+1]).trim();
        } 
    }

    return material;
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
        console.log('Product information saved');

        // Testing to see if the information is saved.
        chrome.storage.sync.get(["product-information"], function (data) {
            console.log(data);
        })
    });
} else {
    console.log('Not Saved.');
}