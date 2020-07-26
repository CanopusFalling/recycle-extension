// Script to handle the extension's popup page.

"use strict";
window.onload = function(){ 
    var explore = document.getElementById('explorealts');
    explore.addEventListener('click', exploreoptions); 
    
}



// Reads the product information and materials results.
let exploreoptions = function(){
    openPage("/popup/exploreproducts.html")
}
function openPage(page) {
    chrome.tabs.create({url:page});
}



