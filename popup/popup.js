// Script to handle the extension's popup page.

"use strict";

let url = window.location.toString();

// Reads the product information and materials results.
chrome.storage.sync.get(['product-information', 'product-materials'], function(items){
    console.log(items);
})