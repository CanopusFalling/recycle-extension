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
    ASIN = getASINTesco();
    title = getTitleTesco();
    description = getDescTesco();
    price = getPriceTesco();

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

// Checks for the data on the Tesco page.
function getASINTesco() {
    let url = window.location.href;
    let paths = url.split('/');
    let identity = paths[paths.length-1];
    let salt = "tesco-";
    let salted_identity = salt.concat(identity);
    //console.log(identity);
    return salted_identity;
}

function getTitleTesco() {
    let title = document.getElementsByClassName("product-details-tile__title");
    title = title[0].innerText;
    //console.log(title);
    return title;
}

function getDescTesco() {
    let description = document.getElementsByClassName("product-info-block product-info-block--product-marketing ");
    description = description[0].innerText;
    return description;
}

function getPriceTesco() {
    let price = document.querySelectorAll('[data-auto="price-value"]');
    return getCleanText(price[0]);
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
    chrome.storage.local.clear(function() {
        var error = chrome.runtime.lastError;
        if (error) {
            console.error(error);
        }
    });
    // Store the products information in the extension storage.
    chrome.storage.sync.set(productInfo, function () {
        console.log('Tesco product information saved');

        // Testing to see if the information is saved.
        chrome.storage.sync.get(["product-information"], function (data) {
            console.log(data);
        })
    });
} else {
    console.log('Not Saved.');
}