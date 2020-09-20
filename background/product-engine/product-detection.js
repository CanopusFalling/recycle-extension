// Script to detect which product the user is viewing.

"use strict";

// ===== Constants =====
const FILE_DATA_STORAGE_KEY = "file-data";
const PRODUCT_DATA_STORAGE_KEY = "product-information";

// ===== Globals =====
var detectionSettings = {};
var materialInformation = {};

// ===== Get Detection Settings =====
function getFilesNeeded(callback) {
    // Wait for storage to update.
    chrome.storage.onChanged.addListener(function (changes, namespace) {
        // Check if the key is the one we want and that it was empty.
        let fileData = changes[STORAGE_KEY];
        if (typeof fileData != "undefined") {
            // Make sure it's only used when not empty.
            if (JSON.stringify(fileData.oldValue) == "{}") {
                detectionSettings = fileData.newValue.settings.contents;
                materialInformation = fileData.newValue.materialInfo.contents;
                callback();
            }
        }
    });
}

// ===== Listen for new Product Information =====
function newInfoUpdate() {
    // Wait for a new product to be stored.
    chrome.storage.onChanged.addListener(function (changes, namespace) {
        // Check if the key is the one we want.
        let productData = changes[PRODUCT_DATA_STORAGE_KEY];
        if (typeof productData != "undefined") {
            analyzeProduct(productData.newValue);
        }
    });
}

// ===== Determine Current Product =====
function analyzeProduct(productInfo) {
    // Find the hits for all the products.
    let products = {};
    let productWeights = detectionSettings.productDetection.weights;
    getProducts(products, productInfo.title, productWeights.title);
    getProducts(products, productInfo.description, productWeights.description);

    console.log("Product engine found the following products: ")
    console.log(products);

    // Eliminate products that are parents of other products which therefor 
    // must be materials or less specific product names.
    let eliminated = eliminateMaterials(products);
}

// ===== Material Removal =====
function eliminateMaterials(products){
    for(let productName in products){
        
    }
}

// ===== Get Product Matches =====
function getProducts(products, text, factor) {
    iterateProducts(function (product, material) {
        if (wordSearch(product, text)) {
            addHits(products, product, factor);
        }
    });
}

function iterateProducts(callback) {
    for (let materialName in materialInformation) {
        let material = materialInformation[materialName];

        for (let productIndex in material) {
            let product = material[productIndex];
            callback(product, material);
        }
    }
}

// ===== Helper Functions =====
function wordSearch(word, text) {
    // Clean up text.
    let lowerText = text.toLowerCase();

    // Generate matching strings.
    let matchingStrings = [];
    matchingStrings.push("[^a-z]" + word + "[^a-z]");
    matchingStrings.push("[^a-z]" + word + "s" + "[^a-z]");
    matchingStrings.push("[^a-z]" + word + "es" + "[^a-z]");

    // Check if the word matches.
    let isContained = false;
    for (let matchIndex in matchingStrings) {
        let matchString = matchingStrings[matchIndex];
        // Match using regex.
        let regexMatcher = new RegExp(matchString);
        let currentResult = regexMatcher.test(lowerText);
        if (currentResult) {
            isContained = true;
        }
    }

    return isContained;
}

function addHits(obj, key, factor) {
    let addObj = obj[key];
    if (typeof addObj == "undefined") {
        obj[key] = {};
        obj[key]['hits'] = factor;
    } else {
        addObj['hits'] += factor;
    }
}

// ===== Script Start =====
getFilesNeeded(function () {
    newInfoUpdate();
});