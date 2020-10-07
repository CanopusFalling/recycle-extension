// File to sanitise the data from the product scrape function.

// ===== Listen for Raw Data =====
function listenForRawProductData(callback) {
    // Wait for a new product scrape to be found.
    chrome.storage.onChanged.addListener(function (changes, namespace) {
        // Check if the key is the one we want.
        let productGuess = changes[RAW_PRODUCT_DATA_STORAGE_KEY];
        if (typeof productGuess != "undefined") {
            callback(productGuess.newValue);
        }
    });
}

// ===== Data Sanitisation =====
function sanitiseObject(obj) {
    for (let key in obj) {
        obj[key] = sanitizeStringHTML(obj[key]);
    }

    saveSanitisedObject(obj);
}

function sanitizeStringHTML(text) {
    var element = document.createElement('div');
    element.innerText = text;
    return element.innerHTML;
}

// ===== Save Data =====
function saveSanitisedObject(obj) {
    // Set the storage object.
    let storeObject = {};
    storeObject[PRODUCT_DATA_STORAGE_KEY] = obj;

    // Store the information.
    chrome.storage.sync.set(storeObject, function () {
        console.log("Stored sanitised data.");
    })
}

// ===== Program start =====
listenForRawProductData(sanitiseObject);