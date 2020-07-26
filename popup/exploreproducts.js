
window.onload = function(){ 
    var prod1 = document.getElementById('product1');
    var prod2 = document.getElementById('product2');

    
    
    prod1.addEventListener('click', explorelink(1)); 
    prod2.addEventListener('click', explorelink(2)); 
    
}

function explorelink(productid){
    
    switch (productid){
        case '1':
            openPage('http://www.amazon.co.uk');
        break;
        case '2':
            //Idea is that openpage will be fed a variable 
            // which lists the product recomendations in order
            openPage('http://www.ebay.com');
        break;
    }
    
}
function openPage(page) {
    chrome.tabs.create({url:page});
}
