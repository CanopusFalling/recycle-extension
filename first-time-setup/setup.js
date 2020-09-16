// Script to run the setup process if the extension isn't yet ready.

"use strict";

// ===== Constants =====
const SETUP_STORAGE_KEY = "extension_setup_status";
const SETUP_SITE_LOCATION = "first-time-setup/page/setup-page.html"

// ===== Setup Script =====
function setupExtension() {
    chrome.tabs.create({ "url": SETUP_SITE_LOCATION });
}

// ===== Check If Setup Needed =====
chrome.storage.sync.get([SETUP_STORAGE_KEY], function (setup) {
    // Check if setup is set to true.
    console.log(setup);
    if (setup != true) {
        setupExtension();
        chrome.storage.sync.set({ SETUP_STORAGE_KEY: true });
    }
});