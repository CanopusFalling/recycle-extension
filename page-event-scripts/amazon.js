/**
 * Script to modify the SiteScraper class so that it goes to the correct places for Amazon.
*/

"use strict";

function setAmazonFunction(){
    SiteScraper.prototype.getTitle = function(){
        return "amazon-title"
    }

    SiteScraper.prototype.getDesc = function(){
        return "amazon-description"
    }

    SiteScraper.prototype.getPrice = function(){
        return "amazon-price"
    }

    SiteScraper.prototype.getID = function(){
        return "amazon-ID"
    }
}