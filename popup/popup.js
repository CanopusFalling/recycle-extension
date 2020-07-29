// Script to handle the extension's popup page.

"use strict";



window.onload = function(){ 
    var explore = document.getElementById('explorealts');
    var infobutton = document.getElementById('info');
    var back = document.getElementById('back');
    document.getElementById('infosection').style.display = "none";
    explore.addEventListener('click', exploreoptions); 
    back.addEventListener('click',returnhome);
    infobutton.addEventListener('click', loadinfopage);
}



// Reads the product information and materials results.
let exploreoptions = function(){
    openPage("/popup/exploreproducts.html")
}
let returnhome = function(){
    document.getElementById('infosection').style.display = "none";
    document.getElementById('current-product-rating').style.display = "block";
}
let loadinfopage = function(){
    
    document.getElementById('infosection').style.display = "block";
    document.getElementById('current-product-rating').style.display = "none";
    
}
function openPage(page) {
    chrome.tabs.create({url:page});
}



