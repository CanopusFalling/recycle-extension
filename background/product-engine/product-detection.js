// Script to detect which product the user is viewing.

"use strict";

// ===== Globals =====
var detectionSettings = {};

const FILE_DATA_STORAGE_KEY = "file-data";

// ===== Get Detection Settings =====
function getDetectionSettings(callback) {
    // Wait for storage to update.
    chrome.storage.onChanged.addListener(function (changes, namespace) {
        // Check if the key is the one we want.
        let fileData = changes[FILE_DATA_STORAGE_KEY];
        if(fileData != "undefined"){
            detectionSettings = fileData.newValue.settings.contents;
            callback();
        }
    });
}

// ===== Listen for new Product Information =====
function newInfoUpdate(){
    
}

// ===== Get Product Hits =====
function getProductHits(){
    
}

// ===== Script Start =====
getDetectionSettings(function(){
    newInfoUpdate();
});