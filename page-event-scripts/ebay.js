/**
 * Script to modify the SiteScraper class so that it goes to the 
 * correct places for Ebay.
*/

"use strict";

function setEbayFunction(){
    SiteScraper.prototype.getTitle = function(){
        return "ebay-title"
    }

    SiteScraper.prototype.getDesc = function(){
        return "ebay-description"
    }

    SiteScraper.prototype.getPrice = function(){
        return "ebay-price"
    }

    SiteScraper.prototype.getID = function(){
        let identity = getCleanText(document.getElementById("descItemNumber"));
        let salt = "ebay-";
        let salted_identity = salt.concat(identity);
        return salted_identity;
    }
}