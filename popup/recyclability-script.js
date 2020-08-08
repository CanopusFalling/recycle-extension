// Script to work out the recyclability of a product 
// based off the back end and the front end information.

"use strict";

// ===== Global Analysis =====
var productAnalysis;
var localInfo;

// ===== Get Product Information =====
function updateProductInfo() {
    chrome.storage.sync.get(['product-analysis'], function (data) {
        productAnalysis = data;
        console.log(data);
    });
}

// Update when script starts.
updateProductInfo();

// Update when product information changes.
chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (var key in changes) {
        if (key == 'product-analysis') {
            updateProductInfo();
        }
    }
});

// ===== Get Local Area Information =====
function updateLocalInfo() {
    chrome.storage.sync.get(['local-info'], function (data) {
        localInfo = data;
    });
}

// Update when script starts.
updateLocalInfo();

// ===== Determine Recyclability Factor =====
function recyclability() {
    let breakdown = productAnalysis["product-analysis"]["product-breakdown"];
    let highHits = breakdown[Object.keys(breakdown)[0]];

    for (let productName in breakdown) {
        let product = breakdown[productName];
        // Find the most likely product.
        if (product['hits'] > highHits['hits']) {
            highHits = product;
        }

        // Find the recyclability.
        let recycleScore = 0;
        let nonRecycleScore = 0;
        let uncertain = 0;
        console.log(product);
        let keywords = product['keywords'];
        for (let keyword in keywords) {
            if (localInfo['local-info']['bin-recyclable'].includes(keyword)) {
                recycleScore += keywords[keyword];
            } else if (localInfo['local-info']['non-bin-recyclable'].includes(keyword)) {
                nonRecycleScore += keywords[keyword];
            } else {
                uncertain += keywords[keyword];
            }
        }

        // Calculate recyclability of the product.

        let total = recycleScore + nonRecycleScore + uncertain;
        console.log(recycleScore + " : " + nonRecycleScore + " : " + uncertain);

        let recyclabilityValue = recycleScore / (recycleScore + nonRecycleScore);
        let uncertainty = uncertain / total;

        productAnalysis['recyclability-value'] = { 'score': recyclabilityValue, 'uncertainty': uncertainty };

        // Return data.
        return productAnalysis;
    }
}

// ===== Set recyclability information =====
function setRecyclability() {
    let product = recyclability();

    // Update visual information.
    setPercentage(product['recyclability-value']['score']);
    setTitle(product["product-analysis"]["product-information"].title);

    console.log(productAnalysis);
}

function setTitle(title){
    let titleObject = document.getElementById("current-product-title");

    titleObject.textContent = title;
}

function setPercentage(score) {
    console.log(score);
    
    // Get the percentage object.
    let percentageObject = document.getElementById("eco-Rating-Percentage");

    if (!isNaN(score)) {
        let percentage = Math.round(score * 100);
        // Update the percentage text.
        percentageObject.innerHTML = percentage + '%';

        // Update wheel percentage.
        setPercentageWheel(score);
    } else {
        // Update the percentage text.
        percentageObject.innerHTML = "N/A";

        // Set the percentage wheel to 0%.
        setPercentageWheel(0);

        // Set the error message for the user.
        let errorDiv = document.getElementById("percentage-card-error");
        errorDiv.textContent = "Unable to determine the recyclability of the product."
    }
}

function setPercentageWheel(score) {
    // Update the wheel percentage.
    let halfDegrees = score * 180;
    let docRoot = document.documentElement;
    docRoot.style.setProperty('--percentage-guess', halfDegrees+'deg');
}

// Wait for the product analysis to be set.
setTimeout(setRecyclability, 1000);