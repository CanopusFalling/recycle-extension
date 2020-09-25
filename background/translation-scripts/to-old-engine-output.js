// Translate to the old output so the front end doesn't need any 
// changes while the rest of the background is developed.

"use strict";

// ===== Get Material Guess =====
function listenForProductUpdate(callback) {
    // Wait for a new product guess to be stored.
    chrome.storage.onChanged.addListener(function (changes, namespace) {
        // Check if the key is the one we want.
        let materialGuess = changes[MATERIAL_GUESS_STORAGE_KEY];
        if (typeof materialGuess != "undefined") {
            //console.log(materialGuess);
            callback(materialGuess.newValue);
        }
    });
}

// ===== Translation =====
function saveToOld(newFormat) {
    let oldFormat = {};
    oldFormat[OLD_ENGINE_KEY] = {};

    // Raw info just moves directly across.
    oldFormat[OLD_ENGINE_KEY]['product-information'] = newFormat['raw-product-info'];

    // Analysis format.
    let oldAnalysis = newFormat['info-guess'];

    for (let productName in oldAnalysis) {
        let product = oldAnalysis[productName];

        product['keywords'] = product['materials'];
        delete product['materials'];

        // Adjust hits.
        let keywords = product['keywords'];
        for(let keywordName in keywords){
            let keyword = keywords[keywordName];

            let hits = keyword['hits'];
            delete keywords[keywordName];
            keywords[keywordName] = hits;
        }
    }

    oldFormat[OLD_ENGINE_KEY]['product-breakdown'] = oldAnalysis;

    chrome.storage.sync.set(oldFormat, function () {
        //console.log(oldFormat);
    })
}

// ===== Script Start =====
listenForProductUpdate(saveToOld);