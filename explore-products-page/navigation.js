// External Site Referencing Script.

"use strict";

// ===== On Load Script =====
// Adds the event listeners for the products on the page.
window.onload = function(){ 
    var prod1 = document.getElementById('product1');
    var prod2 = document.getElementById('product2');
    prod1.addEventListener('click', exploreLink(1)); 
    prod2.addEventListener('click', exploreLink(2));
    //Functions to be moved to appropriate stage in highlighting alternative products
    loadCardImages(1,'https://images-na.ssl-images-amazon.com/images/I/41r683RvE%2BL._SX425_.jpg');
    loadCardImages(2,'https://images-na.ssl-images-amazon.com/images/I/613uPrrd6nL._AC_SX679_.jpg');
    loadCardImages(3,'https://images-na.ssl-images-amazon.com/images/I/61jUhJ92kML._AC_SL1466_.jpg'); 
    document.getElementById('p1-title').textContent = 'Smart Solar Light';
    document.getElementById('p2-title').textContent = 'Webcam';
    document.getElementById('p3-title').textContent = 'Wood Carving Set';
}

function exploreLink(productID){
    switch (productID){
        case '1':
            openPage('http://www.amazon.co.uk');
        break;
        case '2':
            // Idea is that openPage will be fed a variable 
            // which lists the product recommendations in order
            openPage('http://www.ebay.com');
        break;
        case '3':


        break;
    }
    
}
function loadCardImages(productID,IURL){
    switch (productID){
        case 1:
            
        break;
        case 2:

        break;
        case 3:

        break;
    }

}
function openPage(page) {
    chrome.tabs.create({url:page});
}
function updateDials(eco_rating){


}