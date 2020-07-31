// External Site Referencing Script.

"use strict";

// ===== On Load Script =====
// Adds the event listeners for the products on the page.
window.onload = function(){ 
    var prod1 = document.getElementById('product1');
    var prod2 = document.getElementById('product2');

    prod1.addEventListener('click', exploreLink(1)); 
    prod2.addEventListener('click', exploreLink(2)); 
    
}

function exploreLink(productID){
    switch (productID){
        case '1':
            openPage('http://www.amazon.co.uk');
        break;
        case '2':
            // Idea is that openPage will be fed a variable 
            // which lists the product recommendations in order
            openPage('http://www.ebay.com');
        break;
    }
    
}
function openPage(page) {
    chrome.tabs.create({url:page});
}
