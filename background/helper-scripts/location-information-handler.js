// Script to update the local information.

"use strict";

//===== Read in Files =====
function getLocalInfoFile(callback) {
    // Wait for storage to update.
    chrome.storage.onChanged.addListener(function (changes, namespace) {
        // Check if the key is the one we want and that it was empty.
        let fileData = changes[FILE_DATA_STORAGE_KEY];
        if (typeof fileData != "undefined") {
            // Make sure it's only used when not empty.
            if (JSON.stringify(fileData.oldValue) == "{}") {
                councilInformation = fileData.newValue.districtInfo.contents['district-councils'];
                callback();
            }
        }
    });
}

// ===== Listen for Location Update =====
function listenForLocationUpdate(callback) {
    chrome.storage.onChanged.addListener(function (changes, namespace) {
        // Check for the correct key.
        let locationChange = changes[LOCATION_STORAGE_KEY];
        if (typeof locationChange != "undefined") {
            callback(locationChange.newValue);
        }
    });
}

// ===== Update Local Information =====
function updateLocalInformation(location) {
    let storageObject = {};
    storageObject[LOCAL_INFO_STORAGE_KEY] = councilInformation[location];
    console.log(councilInformation);
    chrome.storage.sync.set(storageObject, function () {
        console.log("location set to: " + location);
        console.log(storageObject);
    });
}

// ===== Script Start =====
getLocalInfoFile(function () {
    listenForLocationUpdate(updateLocalInformation);
})