// Background handling script.

"use strict";

// ===== Constants =====

const JSON_FILES = ["data/district-recycle-info.json", "data/material-info.json"];

// ===== File Reading Function =====

function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

// ===== Get JSON Files Into Variables =====

var JSON_OBJECTS = [];

JSON_FILES.forEach(element => {
    readTextFile(element, function (stringResponse) {
        JSON_OBJECTS.push(JSON.parse(stringResponse));
    })
});

// ===== Update Local Area Information =====

function updateLocationInformation() {
    chrome.storage.sync.get(['user-location'], function (locationObj) {
        let location = locationObj['user-location'];
        try {
            let localInfo = JSON_OBJECTS[0]['district-councils'][location];

            chrome.storage.sync.set({'local-info': localInfo}, function(){
                console.log("Set local information data.");
            })
        } catch (e) {
            console.log(e);
        }
    })
}

// Set the location to Adur if it isn't defined.
chrome.storage.sync.get(['user-location'], function (location) {
    if (typeof location['user-location'] == "undefined") {
        chrome.storage.sync.set({ 'user-location': 'Adur' });
    }
});

// ===== Determine Product Information =====

function setProductInformation(productInfo) {
    let products = determineProductList(productInfo);
    let productBreakdown = determineKeywords(products);
    productBreakdown = keywordAjust(productBreakdown, productInfo);
    
    console.log(productBreakdown);
   

    let productAnalysis = {
        'product-analysis': {
            'product-information': productInfo,
            'product-breakdown': productBreakdown
        }
    };

    chrome.storage.sync.set(productAnalysis, function(){
        console.log("Saved analysis of product.");
    })
}

function keywordAjust(productBreakdown, productInfo) {

    // Get the product information.
    let title = productInfo['title'];
    let description = productInfo['description'];

    for (let productName in productBreakdown) {
        let product = productBreakdown[productName];
        let keywords = product['keywords'];

        for (let keywordName in keywords) {
            let keywordCount = keywords[keywordName];

            // Add to the count for the title and decription.
            keywordCount = keywordAdd(title, keywordCount, keywordName, 5);
            keywordCount = keywordAdd(description, keywordCount, keywordName, 1);

            // Set the object to the new count.
            keywords[keywordName] = keywordCount;
        }
        productBreakdown[productName]['keywords'] = keywords;
    }

    return productBreakdown;
}

function keywordAdd(text, keywordCount, keywordName, factor) {
    if (text.toLowerCase().includes(keywordName)) {
        keywordCount += factor;
    }

    return keywordCount;
}

// Work out the different keywords associated with a product.
function determineKeywords(products) {
    let result = products;
    let lastResult = result;

    // Get the materials information.
    let materials = JSON_OBJECTS[1];

    // Loop round until there are no more layers.
    while (true) {
        for (let product in result) {
            let keywords = result[product]['keywords'];
            for (let keyword in keywords) {
                keywords = getJSONParents(keyword, keywords, materials);
            }
        }

        if (result == lastResult) {
            break;
        } else {
            lastResult = result;
        }
    }

    return result;
}

// Get the parents of the products associated.
function getJSONParents(keyword, keywords, materials) {
    for (let material in materials) {
        for (let productID in materials[material]) {
            let product = materials[material][productID];
            if (keyword == product) {
                incrementKeywordCount(keywords, material, 1);
            }
        }
    }

    return keywords;
}

function incrementKeywordCount(object, name, factor) {
    // Add the factor ammount to the count for a spesific item.
    if (object.hasOwnProperty(name)) {
        object[name] += factor;
    } else {
        object[name] = factor;
    }

    // Return incrimented object.
    return object;
}


// Get a range of products with confidence values.
function determineProductList(productInformation) {
    // Get the materials object.
    let materials = JSON_OBJECTS[1];

    // Get the product information.
    let title = productInformation['title'];
    let description = productInformation['description'];

    // Work out the probable current product.
    // The factor element is to weight the title more than the description.
    let likelyProducts = itterateOverJSONChildren({}, materials, productMatch, title, 5);
    likelyProducts = itterateOverJSONChildren(likelyProducts, materials, productMatch, description, 1);

    return likelyProducts;
}

function itterateOverJSONChildren(result, object, callback, callbackObject, factor) {
    for (let categoryName in object) {
        let category = object[categoryName];
        for (let itemPosition in category) {
            let item = category[itemPosition];
            result = callback(callbackObject, item, result, factor, categoryName);
        }
    }

    return result;
}

function productMatch(text, product, object, factor) {
    if (text.toLowerCase().includes(product)) {
        return incrementObjectCount(object, product, factor);
    } else {
        return object;
    }
}

function incrementObjectCount(object, name, factor) {
    // Add the factor ammount to the count for a spesific item.
    if (object.hasOwnProperty(name)) {
        object[name]['hits'] += factor;
    } else {
        object[name] = { 'keywords': { [name]: 100 }, 'hits': factor };
    }

    // Return incrimented object.
    return object;
}

// ===== Data Update Listener =====
chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (var key in changes) {
        // Readout for debugging.
        var storageChange = changes[key];
        console.log('Storage key "%s" in namespace "%s" changed. ' +
            'Old value was "%s", new value is "%s".',
            key,
            namespace,
            storageChange.oldValue,
            storageChange.newValue);

        if (key == "product-information") {
            setProductInformation(storageChange.newValue);
        }

        // When the user changes their location.
        if (key == "user-location") {
            updateLocationInformation();
        }
    }
});

// ===== Testing Function =====
function update() {
    updateProductInformation();
    setTimeout(update, 10000);
}

//update();

// Update the local info about the user's location.
updateLocationInformation();