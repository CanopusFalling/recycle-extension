// Script to handle the extension's popup page.

"use strict";

let url = window.location.toString();
chrome.storage.sync.get(['product-information', 'product-materials'], function(items){
    console.log(items);
})


window.onload = function(){ 
    var mb = document.getElementById("recommendedalternatives");
    mb.addEventListener("click", showalternatives()); 
}
// Reads the product information and materials results.
function showalternatives(){
    window.alert("Hi");
}



