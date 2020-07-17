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

// Basic local info for testing purposes while there is no 
// method to switch location in the popup.
var LOCAL_INFO;

function updateLocationInformation() {
    chrome.storage.sync.get(['user-location'], function (locationObj) {
        let location = locationObj['user-location'];
        try {
            LOCAL_INFO = JSON_OBJECTS[0]['district-councils'][location];
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

// ===== Update Product Information =====

function determineProductList(productInformation) {
    // Get the materials object.
    let materials = JSON_OBJECTS[1];

    // Get the product information.
    let title = productInformation['title'];
    let description = productInformation['description'];
    let ASIN = productInformation['ASIN']

    // Work out the probable current product.
    // The factor element is to weight the title more than the description.
    let likelyProducts = itterateOverJSONChildren({}, materials, productMatch, title, 5);
    likelyProducts = itterateOverJSONChildren(likelyProducts, materials, productMatch, description, 1);

    console.log(likelyProducts);

    
}

function itterateOverJSONChildren(result, object, callback, callbackString, factor) {
    for (let categoryName in object) {
        let category = object[categoryName];
        for (let itemPosition in category) {
            let item = category[itemPosition];
            result = callback(callbackString, item, result, factor, categoryName);
        }
    }

    return result;
}

function productMatch(text, product, object, factor) {
    if (text.toLowerCase().includes(product)) {
        return incrementObjectCount(object, product, factor);
    }else{
        return object;
    }
}

function incrementObjectCount(object, name, factor) {
    // Add the factor ammount to the count for a spesific item.
    if (object.hasOwnProperty(name)) {
        object[name] += factor;
    } else {
        object[name] = factor;
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
            determineProductList(storageChange.newValue);
        }

        // When the user changes their location.
        if (key == "user-location") {
            updateLocationInformation();
        }

        /*if (key == 'materials') {
            updateRecyclability();
        }*/
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