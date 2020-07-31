// Script to handle the extension's popup page.

"use strict";



window.onload = function(){ 
    var explore = document.getElementById('explore-alts');
    var infoButton = document.getElementById('info');
    var back = document.getElementById('back');
    document.getElementById('info-section').style.display = "none";
    explore.addEventListener('click', exploreOptions); 
    back.addEventListener('click',returnHome);
    infoButton.addEventListener('click', loadInfoPage);
}



// Reads the product information and materials results.
let exploreOptions = function(){
    openPage("/popup/exploreproducts.html")
}
let returnHome = function(){
    document.getElementById('infosection').style.display = "none";
    document.getElementById('current-product-rating').style.display = "block";
}
let loadInfoPage = function(){
    
    document.getElementById('infosection').style.display = "block";
    document.getElementById('current-product-rating').style.display = "none";
    
}
function openPage(page) {
    chrome.tabs.create({url:page});
}



