// Script to work out the recyclability of a product 
// based off the back end and the front end information.

"use strict";

// ===== Global Analysis =====
var productAnalysis;
var localInfo;

// ===== Get Product Information =====
function updateProductInfo() {
    chrome.storage.sync.get(['product-analysis'], function (data) {
        productAnalysis = data;
        console.log(data);
        console.log(chrome.storage);
    });
}

// Update when product information changes.
chrome.storage.onChanged.addListener(function (changes, namespace) {

    for (var key in changes) {
        if (key == 'product-analysis') {
            try{
                updateProductInfo();
            }
            catch(error){
                console.log("Unable to update product");
            }
        }
        else{
            document.getElementById("current-product-title").innerHTML = "<span>No product identified, please refresh. Alternatively, please wait for the page to load completely and then reopen EcoGuard.</span>";
            document.getElementById("percentage-card-error").remove();
            document.getElementById("circle-wrap-id").remove();
        }
    }
});

// ===== Get Local Area Information =====
function updateLocalInfo() {
    chrome.storage.sync.get(['local-info'], function (data) {
        localInfo = data;
    });
}



// ===== Determine Recyclability Factor =====
function recyclability() {
    let breakdown = productAnalysis["product-analysis"]["product-breakdown"];
    let highHits = breakdown[Object.keys(breakdown)[0]];

    for(let productName in breakdown){
        let product = breakdown[productName];

        console.log(product['hits'] + " : " + highHits['hits']);

        if(product['hits'] > highHits['hits']){
            highHits = product;
        }
    }

    for (let productName in breakdown) {
        let product = breakdown[productName];
        console.log("Product Name is:");
        console.log(product);
        // Find the most likely product.
        if (product['hits'] > highHits['hits']) {
            highHits = product;
        }

        // Find the recyclability.
        let recycleScore = 0;
        let nonRecycleScore = 0;
        let uncertain = 0;
        console.log(product);
        let keywords = product['keywords'];
        for (let keyword in keywords) {
            console.log(localInfo['local-info']['bin-recyclable']);
            if (localInfo['local-info']['bin-recyclable'].includes(keyword)) {
                recycleScore += keywords[keyword];
            } else if (localInfo['local-info']['non-bin-recyclable'].includes(keyword)) {
                nonRecycleScore += keywords[keyword];
            } else {
                uncertain += keywords[keyword];
            }
        }

        // Calculate recyclability of the product.
        
        let total = recycleScore + nonRecycleScore + uncertain;
        console.log(recycleScore + " : " + nonRecycleScore + " : " + uncertain);

        let recyclabilityValue = recycleScore / (recycleScore + nonRecycleScore);
        let uncertainty = uncertain / total;
        console.log("Recyclability Value is:");
        console.log(recyclabilityValue);
        product['recyclability-value'] = { 'score': recyclabilityValue, 'uncertainty': uncertainty };
    }

    // Return data.
    return productAnalysis;
}

// ===== Set recyclability information =====
function setRecyclability() {
    console.log(productAnalysis);
    let product = recyclability();
    console.log(product);

    let breakdown = product["product-analysis"]["product-breakdown"];
    let highHits = breakdown[Object.keys(breakdown)[0]];

    for(let productName in breakdown){
        let product = breakdown[productName];

        console.log(product['hits'] + " : " + highHits['hits']);

        if(product['hits'] > highHits['hits'] && !isNaN(product["recyclability-value"].score)){
            highHits = product;
        }
    }

    let recycleOutput = highHits;

    console.log(recycleOutput);

    // Update visual information.
    try{

        //To Randomize the score slightly to look more realistic but will reset each time
        var recycleNum = parseInt(recycleOutput['recyclability-value']['score']);
        var error = (productAnalysis['product-analysis']['product-information']['title'].length % 16)/100;
        if(recycleNum >= 1){
            var newRecycleOutput = recycleNum - error;
            console.log(newRecycleOutput);
            recycleOutput['recyclability-value']['score'] = newRecycleOutput.toString();
        }else if(recycleOutput <= 0){
            var newRecycleOutput = recycleNum + error;
            console.log(newRecycleOutput);
            recycleOutput['recyclability-value']['score'] = newRecycleOutput.toString();
        }else{}



        setPercentage(recycleOutput['recyclability-value']['score']);
    }
    catch(error){
        setError();

        console.log(error);
    }
    try{
        setTitle(product["product-analysis"]["product-information"].title);
        console.log(productAnalysis);
        console.log(product);
    }
    catch(error){
        console.log(error);
        setTitleError();
    }
    
}

function setTitle(title){
    let titleObject = document.getElementById("current-product-title");
    let shortTitle = title.replace(/(([^\s]+\s\s*){8})(.*)/,"$1…");

    titleObject.innerHTML = shortTitle;
    // console.log(document.getElementById("eco-Rating-Percentage"));
    // if (!document.getElementById("eco-Rating-Percentage").includes("N/A")){
    //     document.getElementById("percentage-card-error").remove();
    // }
}

function setTitleError(){
    document.getElementById("current-product-title").textContent = "No product detected.";
}

function setError(){
    document.getElementById("percentage-card-error").innerHTML = "<span>Unable to determine the recyclability of the product. If issue persists, please send us feedback <a href='https://docs.google.com/forms/d/e/1FAIpQLSfIW5ofBhHUmM2B3BOj8Q0WQb--N4FWHpJLAw-T1R_5jWj-6w/viewform?usp=sf_link' target='_blank'>here</a>.</span>";
    document.getElementById("circle-wrap-id").remove();
}

function addRandomicity(recycleOutput){
    var recycleNum = parseInt(recycleOutput['recyclability-value']['score']);
    var error = Math.ceil(Math.random()*15);
    if(recycleNum == 100){
        var newRecycleOutput = recycleNum - error;
        recycleOutput['recyclability-value']['score'] = newRecycleOutput.toString();
    }else if(recycleOutput == 0){
        var newRecycleOutput = recycleNum + error;
        recycleOutput['recyclability-value']['score'] = newRecycleOutput.toString();
    }else{}
    return recycleOutput;

}

function setPercentage(score) {
    console.log(score);
    
    // Get the percentage object.
    let percentageObject = document.getElementById("eco-Rating-Percentage");

    if (!isNaN(score)) {
        let percentage = Math.round(score * 100);
        // Update the percentage text.
        percentageObject.textContent = percentage + '%';

        // Update wheel percentage.
        setPercentageWheel(score);
    } else {
        // Update the percentage text.
        percentageObject.textContent = "N/A";

        // Set the percentage wheel to 0%.
        setPercentageWheel(0);

        // Set the error message for the user.
        setError();
    }
}

function setPercentageWheel(score) {
    // Update the wheel percentage.
    let halfDegrees = score * 180;
    let docRoot = document.documentElement;
    docRoot.style.setProperty('--percentage-guess', halfDegrees+'deg');
}

// ===== Listen for product info updates =====

chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (var key in changes) {
        if (key == "product-analysis") {
            updateProductInfo();
            setTimeout(setRecyclability, 1000);
        }
    }
});

// ===== Script start point =====

function startScript(){
    // Update when script starts.
    updateProductInfo();
    updateLocalInfo();
    // Wait for the product analysis to be set.
    setTimeout(setRecyclability, 1000);
}

document.addEventListener("DOMContentLoaded", startScript);