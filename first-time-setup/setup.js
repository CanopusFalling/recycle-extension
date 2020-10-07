// Script to run the setup process if the extension isn't yet ready.

"use strict";

// ===== Constants =====
const SETUP_STORAGE_KEY = "extension_setup_status";
const SETUP_SITE_LOCATION = "first-time-setup/page/setup-page.html"

// Setup info. 
// This constant will determine if the extension redoes the setup.
const setupInfo = 
{
    lastSetupChange: "0.1.0"
};

// ===== Setup Script =====
function setupExtension() {
    chrome.tabs.create({ "url": SETUP_SITE_LOCATION });
}

// ===== Version Checker =====
// Check whether new version is installed.
chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
        setupExtension();
    }else if(details.reason == "update"){
        // Check if the current version needs the setup running again.
        if(details.previousVersion <= setupInfo.lastSetupChange){
            setupExtension();
        }
    }
});