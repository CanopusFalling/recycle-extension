/**
 * Script to modify the SiteScraper class so that it goes to the 
 * correct places for tesco.
*/

"use strict";

function setTescoFunction() {
    SiteScraper.prototype.getTitle = function () {
        let title = document.getElementsByClassName("product-details-tile__title");
        title = title[0].innerText;
        return title;
    }

    SiteScraper.prototype.getDesc = function () {
        let description = document.getElementsByClassName("product-info-block product-info-block--product-marketing ");
        description = description[0].innerText;
        return description;
    }

    SiteScraper.prototype.getPrice = function () {
        let price = document.querySelectorAll('[data-auto="price-value"]');
        return getCleanText(price[0]);
    }

    SiteScraper.prototype.getID = function () {
        let url = window.location.href;
        let paths = url.split('/');
        let identity = paths[paths.length - 1];
        let salt = "tesco-";
        let salted_identity = salt.concat(identity);
        return salted_identity;
    }
}