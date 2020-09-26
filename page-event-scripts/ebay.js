/**
 * Script with the Ebay class to have all the functions specific 
 * to the Ebay page.
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
        return "ebay-ID"
    }
}