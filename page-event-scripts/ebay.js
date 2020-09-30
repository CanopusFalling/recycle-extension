/**
 * Script to modify the SiteScraper class so that it goes to the 
 * correct places for Ebay.
*/

"use strict";

function setEbayFunction() {
    SiteScraper.prototype.getTitle = function () {
        let title = document.querySelectorAll('[itemprop="name"]');
        return getCleanText(title[title.length - 1]);
    }

    SiteScraper.prototype.getDesc = function () {
        let tableRows = document.getElementsByTagName("td");
        let material = "";

        for (let i = 0; i < tableRows.length; i++) {
            let node = getCleanText(tableRows[i]);
            if (node.includes("Material")) {
                material = getCleanText(tableRows[i + 1]).trim();
            }
        }

        return material;
    }

    SiteScraper.prototype.getPrice = function () {
        let price = document.querySelectorAll('[itemprop="price"]');
        console.log(price);
        price = getCleanText(price[price.length - 1]).substring(1);
        return price;
    }

    SiteScraper.prototype.getID = function () {
        let identity = getCleanText(document.getElementById("descItemNumber"));
        let salt = "ebay-";
        let salted_identity = salt.concat(identity);
        return salted_identity;
    }
}