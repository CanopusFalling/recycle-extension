/**
 * Script to take the products and work out the most probable 
 * materials that it is made out of.
 */

"use strict";

/**
 * Always runs after the product-detection.js script so at no 
 * point will it not have access to "materialInformation" and 
 * "detectionSettings" from the global scope.
 */

// ===== Get Product Guess =====
function listenForProductUpdate(callback) {
    // Wait for a new product guess to be stored.
    chrome.storage.onChanged.addListener(function (changes, namespace) {
        // Check if the key is the one we want.
        let productGuess = changes[PRODUCT_GUESS_STORAGE_KEY];
        if (typeof productGuess != "undefined") {
            callback(productGuess.newValue);
        }
    });
}

// ===== Get Materials For Each Product =====
function assignMaterials(product){
    console.log(product);
    console.log(materialInformation);
    console.log(detectionSettings);
}

// ===== Program Start =====
listenForProductUpdate(assignMaterials);