// Script to run the setup process if the extension isn't yet ready.

"use strict";

// ===== Constants =====
const SETUP_STORAGE_KEY = "extension_setup_status";
const SETUP_SITE_LOCATION = "first-time-setup/page/setup-page.html"

// ===== Setup Script =====
function setupExtension() {
    chrome.tabs.create({ "url": SETUP_SITE_LOCATION });
}

// Check whether new version is installed.
chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
        setupExtension();
    }else if(details.reason == "update"){
        var thisVersion = chrome.runtime.getManifest().version;
        console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
    }
});