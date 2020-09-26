/**
 * Scraper function that uses the individual website classes to get 
 * all the details then bundles it all up to send to the back end for 
 * sanitisation.
 */

"use strict";

// Testing class.
class SiteScraper{
    getProductDetails(){
        let detailsObject = {
            title: "",
            description: "",
            price: "",
            identity: ""
        };

        // Maps all the functions to their keys.
        let functionMapping = {};
        functionMapping.title = this.getTitle;
        functionMapping.description = this.getDesc;
        functionMapping.price = this.getPrice;
        functionMapping.identity = this.getID;

        for(let key in functionMapping){
            let currFunction = functionMapping[key];
            // Try catch in case the prototype chain has failed.
            try{
                detailsObject[key] = currFunction();
            }catch(e){
                console.log(e);
            }
        }

        return detailsObject;
    }
}

// ===== Site Class Information =====
let siteFunctions = {};
siteFunctions['amazon'] = setAmazonFunction;
siteFunctions['ebay'] = setEbayFunction;

let testScrape = new SiteScraper();

let currentURL = window.location.href;

for(let siteName in siteFunctions){
    if(currentURL.includes(siteName)){
        // If the URL has the name of one of the functions 
        // then run that function.
        let siteFunction = siteFunctions[siteName];
        siteFunction();
    }
}

console.log(testScrape.getProductDetails());