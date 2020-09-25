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
function assignMaterials(productInfo) {
    let products = productInfo['info-guess'];

    for (let productName in products) {
        // Get the materials that the product is made from.
        let materials = getMaterials(productName);

        let materialHits = getMaterialHits(materials, productInfo['raw-product-info']);
        console.log(productName + " is made/a sub-product of: ");
        console.log(materials);
        console.log(materialHits);
    }
}

// Get hits for each material.
function getMaterialHits(materials, productScrape) {
    // Get the settings needed.
    let weights = detectionSettings.keywordDetection.weights;

    // Set up hits object.
    let materialHits = {};

    materials.forEach(element => {
        materialHits[element] = {};
        materialHits[element]['hits'] = 0;
        // Run for the title and description.
        console.log(materialHits);
        weightMaterial(
            element,
            productScrape.title,
            weights.title,
            materialHits
        );
        console.log(materialHits);
        weightMaterial(
            element,
            productScrape.description,
            weights.description,
            materialHits
        );
    });

    //Return hits.
    return materialHits;
}

function weightMaterial(material, text, factor, hitsObj) {
    //console.log(hitsObj);
    //console.log(text + " : " + material);
    if (wordSearch(material, text)) {
        hitsObj[material]['hits'] += factor;
        console.log(hitsObj);
    }
}

// Get the raw list of products associated with a product.
function getMaterials(productName) {
    let materials = [];
    let currentSearchItems = [productName];

    // Loop until the search has nowhere else to go.
    while (currentSearchItems.length != 0) {
        let newSearchItems = [];
        for (let materialName in materialInformation) {

            // Make sure that the material isn't in the list already.
            if (!materials.includes(materialName)) {

                //console.log(materials);
                //console.log(materialName);
                let materialCategory = materialInformation[materialName];

                // Loops over each product that the material makes.
                materialCategory.forEach(element => {
                    //console.log(element);
                    //console.log(currentSearchItems);
                    if (currentSearchItems.includes(element) &&
                        !newSearchItems.includes(materialName)) {
                        // If the material matches then add it to the list 
                        // of materials and the next search set.
                        newSearchItems.push(materialName);
                        materials.push(materialName);
                    }
                });
            }
        }
        currentSearchItems = newSearchItems;
    }

    return materials;
}

// ===== Program Start =====
listenForProductUpdate(assignMaterials);