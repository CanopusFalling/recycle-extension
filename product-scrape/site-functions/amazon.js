/**
 * Script to modify the SiteScraper class so that it goes to the 
 * correct places for Amazon.
*/

"use strict";

function setAmazonFunction() {
    SiteScraper.prototype.getTitle = function () {
        let title = document.getElementById("productTitle");
        return getCleanText(title);
    }

    SiteScraper.prototype.getDesc = function () {
        let description = document.getElementById("productDescription");
        return getCleanText(description);
    }

    SiteScraper.prototype.getPrice = function () {
        let price = document.getElementById("priceblock_ourprice");
        return getCleanText(price).substring(1);
    }

    SiteScraper.prototype.getID = function () {
        let tableRows = document.getElementsByTagName("td");
        let ASIN = "";

        for (let i = 0; i < tableRows.length; i++) {
            let node = tableRows[i];
            if (node.innerHTML == "ASIN") {
                let tableRow = node.parentElement.childNodes;

                for (let j = 0; j < tableRow.length; j++) {
                    let tableItem = tableRow[j];
                    if (node != tableItem) {
                        ASIN = tableItem.innerHTML;
                    }
                }
            }
        }

        let labels = document.getElementsByTagName("bdi");
        for (let i = 0; i < labels.length; i++) {
            let label = labels[i];
            if (label.innerHTML == "ASIN") {
                let ASINArea = label.parentElement.parentElement.innerHTML;

                ASIN = ASINArea.substr(ASINArea.length - 10, ASINArea.length - 1);
            }
        }

        let salt = "amazon-";
        let salted_identity = salt.concat(ASIN);

        return salted_identity;
    }
}