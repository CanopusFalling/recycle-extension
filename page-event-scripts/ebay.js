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
    ASIN = getASINEbay();
    title = getTitleEbay();
    description = getDescEbay();
    price = getPriceEbay();

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

function getASINEbay() {
    let identity = getCleanText(document.getElementById("descItemNumber"));
    let salt = "ebay-";
    let salted_identity = salt.concat(identity);
    return salted_identity;
}

function getTitleEbay() {
    let title = document.querySelectorAll('[itemprop="name"]');
    return getCleanText(title[title.length - 1]);
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

function getPriceEbay() {
    let price = document.querySelectorAll('[itemprop="price"]');
    console.log(price);
    price = getCleanText(price[price.length - 1]).substring(1);
    return price;
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