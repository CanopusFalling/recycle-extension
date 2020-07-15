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
var LOCAL_INFO = {
    "Type": "Unitary authority",
    "bin-recyclable": ["metal", "wood", "cardboard", "paper", "glass"],
    "non-bin-recyclable": ["chipboard", "MDF", "plywood"]
};

function updateLocationInformation() {
    chrome.storage.sync.get(['user-location'], function (location) {
        try {
            LOCAL_INFO = JSON_OBJECTS[0][key];
        } catch (e) {
            console.log(e);
        }
    })
}

// ===== Update Product Information =====
/*
function updateProductInformation() {
    let districtInfo = LOCAL_INFO;
    let materialInfo = JSON_OBJECTS[1];
    chrome.storage.sync.get(['product-information'], function (productInformation) {
        let title = productInformation['product-information']['product-title'];
        let materials = wordMatching(title.toLowerCase(), materialInfo, districtInfo);
        chrome.storage.sync.set({ materials: materials });
        console.log(materials);
    })
}

function wordMatching(title, materialInfo, districtInfo) {
    //let materials = [];
    let separation = { 'recyclable': {}, 'non-recyclable': {}, 'uncertain': {} };

    // Go through all the known materials.
    for (var material in materialInfo) {
        //console.log(materialInfo[material]);

        // Check all the products in each material against the title.
        for (var product in materialInfo[material]) {
            if (title.includes(material)
                || title.includes(materialInfo[material][product])) {
                //console.log(material + " : " + materialInfo[material][product]);
                //materials.push(material);

                let recyclability = isMaterialRecyclable(material, product, districtInfo).split('/');

                if (recyclability[0] == "material") {
                    if (separation[recyclability[1]].hasOwnProperty(material)) {
                        separation[recyclability[1]][material] += 1;
                    } else {
                        separation[recyclability[1]][material] = 1;
                    }
                } else {
                    if (separation[recyclability[1]].hasOwnProperty(materialInfo[material][product])) {
                        separation[recyclability[1]][materialInfo[material][product]] += 1;
                    } else {
                        console.log("Hi");
                        separation[recyclability[1]][materialInfo[material][product]] = 1;
                    }
                }
            }
        }
    }

    return separation;
}

// ===== Determine Recyclability =====

function isMaterialRecyclable(material, product, districtInfo) {
    let result = "material/uncertain";

    for (var recyclable in districtInfo['bin-recyclable']) {
        result = productMaterialSeparation("recyclable", result, recyclable, material, product);
    }
    for (var nonRecyclable in districtInfo['non-bin-recyclable']) {
        result = productMaterialSeparation("non-recyclable", result, nonRecyclable, material, product);
    }

    return result;
}

function productMaterialSeparation(postfix, result, comparison, material, product) {
    if (comparison == product) {
        result = "product/" + postfix;
    } else if (comparison == material) {
        result = "material/" + postfix;
    }

    return result;
}*/

// ===== Update Product Recyclability Information =====

function determineProduct(title, body, ){

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
            updateProductInformation();
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