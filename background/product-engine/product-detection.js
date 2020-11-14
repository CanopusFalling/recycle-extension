// Script to detect which product the user is viewing.

"use strict";

// ===== Get Detection Settings =====
function getFilesNeeded(callback) {
    // Wait for storage to update.
    chrome.storage.onChanged.addListener(function (changes, namespace) {
        // Check if the key is the one we want and that it was empty.
        let fileData = changes[FILE_DATA_STORAGE_KEY];
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
            // Check if the product title is valid.
            if (productData['newValue']['title'] == "") {
                console.log("No product title found by scraper.");
                document.getElementById("current-product-title").textContent = "No product detected.";
                //document.getElementById("percentage-card-error").innerHTML = "<span>If issue persists, please send us feedback <a href='https://docs.google.com/forms/d/e/1FAIpQLSfIW5ofBhHUmM2B3BOj8Q0WQb--N4FWHpJLAw-T1R_5jWj-6w/viewform?usp=sf_link' target='_blank'>here</a>.</span>";

            } else {
                analyzeProduct(productData.newValue);
            }
        }
    });
}

// ===== Store Results =====
function storeProductResults(productInfo, productGuesses) {
    // Set the storage object.
    let storeObject = {}
    storeObject[PRODUCT_GUESS_STORAGE_KEY] = {
        'raw-product-info': productInfo,
        'info-guess': productGuesses
    };

    // Store the information.
    chrome.storage.sync.set(storeObject, function () {
        console.log("Stored product guesses.");
        console.log(storeObject);
    })
}

// ===== Determine Current Product =====
function analyzeProduct(productInfo) {
    // Find the hits for all the products.
    let products = {};
    let productWeights = detectionSettings.productDetection.weights;
    getProducts(products, productInfo.title, productWeights.title);
    getProducts(products, productInfo.description, productWeights.description);

    //console.log("Product engine found the following products: ");
    //console.log(products);

    // Eliminate products that are parents of other products which therefor 
    // must be materials or less specific product names.
    let eliminated = eliminateMaterials(products);

    //console.log("Product engine eliminated these elements: ");
    //console.log(eliminated);

    // Store the guesses.
    storeProductResults(productInfo, products);
}

// ===== Material Removal =====
function eliminateMaterials(materials) {
    let eliminated = {};

    for (let materialName in materials) {
        // Get the information about the material if it is in the file.
        let materialChildren = getAllMaterialChildren(materialName);

        // Detect if there is a child of this material already detected.
        if (hasChildProduct(materials, materialChildren)) {
            eliminated[materialName] = materials[materialName];
            delete materials[materialName];
        }
    }

    return eliminated;
}

// Gets all the children of a material.
function getAllMaterialChildren(materialName) {
    let children = [];
    let isFinished = false;
    let childrenCount = 0

    // Get the first set of children.
    getMaterialChildren(materialName, children);
    childrenCount = children.length;

    // repeatedly get all the children till the array is exhausted.
    while (!isFinished) {
        for (let i = 0; i < children.length; i++) {
            const element = children[i];

            getMaterialChildren(element, children);
        }

        // Checks if no new elements were added.
        isFinished = childrenCount == children.length;
        childrenCount = children.length;
    }

    return children;
}

// Gets children of
function getMaterialChildren(parent, children) {
    let currentChildren = materialInformation[parent];
    // Check that the item has children.
    if (typeof currentChildren == "undefined") {
        currentChildren = [];
    }

    // Add all the new children.
    currentChildren.forEach(element => {
        if (!children.includes(element)) {
            children.push(element);
        }
    });

    return children;
}

// Checks if the product has a child in the materials.
function hasChildProduct(materials, children) {
    for (let childIndex in children) {
        let child = children[childIndex];

        for (let material in materials) {
            if (child == material) {
                return true;
            }
        }
    }
    return false;
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
    matchingStrings.push(word + "[^a-z]");
    matchingStrings.push(word + "s" + "[^a-z]");
    matchingStrings.push(word + "es" + "[^a-z]");
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