// Worker script to extract product details from amazon pages.

// ===== Listen For Message =====
self.addEventListener('message', function(msg){
    return getProductInfo(msg.data);
});

// ===== Scraping Functions =====
// Gets all the product information and returns it as an object.
function getProductInfo(page) {
    let pageElement = document.createElement('div');
    pageElement.innerHTML = page.innerHTML;

    let ASIN = "";
    let title = "";
    let description = "";
    let price = "";

    // Get all the product information.
    ASIN = getIdentification();
    title = getTitleAmazon();
    description = getDescAmazon();
    price = getPriceAmazon();

    // Return empty object if all the information is empty.
    if (ASIN == "" && title == "" && description == "" && price == "") {
        // Return a blank object if there is no product.
        return {};
    } else {
        // Return all the data as a JSON object.
        return {
            "product-information":
            {
                "ID": ASIN,
                "title": title,
                "descripti on": description,
                "price": price
            }
        };
    }
}

// Checks for the ASIN on the Amazon page.
function getIdentification() {
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
            let ASINarea = label.parentElement.parentElement.innerHTML;

            ASIN = ASINarea.substr(ASINarea.length - 10, ASINarea.length - 1);
        }
    }

    let salt = "amazon-";
    let salted_identity = salt.concat(ASIN);

    return salted_identity;
}

function getTitle() {
    let title = document.getElementById("productTitle");
    return getCleanText(title);
}

function getDesc() {
    let description = document.getElementById("productDescription");
    return getCleanText(description);
}

function getPrice(){
    let price = document.getElementById("priceblock_ourprice");
    return getCleanText(price).substring(1);
}

// ===== Text Manipulation Functions =====

function getCleanText(object) {
    let rawText = getHTMLObjectText(object);
    return stripNewlines(rawText);
}

function stripNewlines(text) {
    return text.replace(/(\r\n|\n|\r)/gm, "");
}

function getHTMLObjectText(object) {
    try {
        return object.textContent || object.innerText || "";
    } catch (e) {
        //Checks if the error is not a type error.
        if (!e instanceof TypeError) {
            throw e;
        }
        return "";
    }
}