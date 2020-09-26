/**
 * Script to modify the SiteScraper class so that it goes to the 
 * correct places for tesco.
*/

"use strict";

function setTescoFunction(){
    SiteScraper.prototype.getTitle = function(){
        return "tesco-title"
    }

    SiteScraper.prototype.getDesc = function(){
        return "tesco-description"
    }

    SiteScraper.prototype.getPrice = function(){
        return "tesco-price"
    }

    SiteScraper.prototype.getID = function(){
        return "tesco-ID"
    }
}