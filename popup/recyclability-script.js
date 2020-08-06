// Script to work out the recyclability of a product 
// based off the back end and the front end information.

"use strict";

// ===== Global Analysis =====
var productAnalysis;
var localInfo;

// ===== Get Product Information =====
function updateProductInfo(){
    chrome.storage.sync.get(['product-analysis'], function(data){
        productAnalysis = data;
        console.log(data);
    });
}

// Update when script starts.
updateProductInfo();

// Update when product information changes.
chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (var key in changes) {
        if(key == 'product-analysis'){
            updateProductInfo();
        }
    }
});

// ===== Get Local Area Information =====
function updateLocalInfo(){
    chrome.storage.sync.get(['local-info'], function(data){
        localInfo = data;
    });
}

// Update when script starts.
updateLocalInfo();

// ===== Determine Recyclability Factor =====
function recyclability(){
    let breakdown = productAnalysis["product-analysis"]["product-breakdown"];
    let highHits = breakdown[Object.keys(breakdown)[0]];

    for(let productName in breakdown){
        let product = breakdown[productName];
        // Find the most likely product.
        if(product['hits'] > highHits['hits']){
            highHits = product;
        }

        // Find the recyclability.
        let recycleScore = 0;
        let nonRecycleScore = 0;
        let uncertain = 0;
        for(let keyword in product){
            if(localInfo['local-info']['bin-recyclable'].includes(keyword)){
                recycleScore += product[keyword];
            }else if(localInfo['local-info']['non-bin-recyclable'].includes(keyword)){
                nonRecycleScore += product[keyword];
            }else{
                uncertain += product[keyword];
            }
        }

        // Calculate recyclability.
        let total = recycleScore + nonRecycleScore + uncertain;
        let recyclability = recycleScore / total;
        let uncertainty = uncertain / total;

        productAnalysis['recyclability'] = {'score': recyclability, 'uncertainty': uncertainty};
        
        //Update plugin dials to reflect recyclability score
        console.log(recyclability);
        document.getElementById("eco-Rating-Percentage").innerHTML = recyclability;
        document.documentElement.style.setProperty('--percentage-guess', recyclability + 'deg');

        // Return data.
        return productAnalysis;
    }
}

// ===== Get recyclability information =====
function getRecyclability(){
    let product = recyclability();
    console.log(productAnalysis);
}

setTimeout(getRecyclability, 1000);
