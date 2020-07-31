// Script to extract spesific information from a product page.
let amazon = new Worker('page-event-scripts/site-spesific-workers/amazon.js');
amazon.addEventListener('message', function(msg){
    console.log('Worker replied: ' + msg.data);
})
amazon.postMessage('B33P');

// ===== Constants =====
const WORKERS_LOCATION = "page-event-scripts/site-spesific-workers";

// ===== Uodate Listener =====
chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (var key in changes) {
        if (key == 'page-scrape') {
            
        }
    }
});

// ===== Get Product Details =====
function getProductDetails(details){
    let url = details['site-location'];
    let page = details['page-object'];

    let worker = getWorker(url);
    worker.addEventListener('message', function(message){
        chrome.storage.sync.set(message.data, function(){
            console.log('Product scrape saved!');
        });
    });
    
    worker.postMessage(page);
}

// ===== Worker Script Management =====
function getWorker(url){
    let hostname = getHostName(url);
    let workers = getWorkerNames(WORKERS_LOCATION)
}

// Get the host name from a url
function getHostName(url) {
    var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
    if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
    return match[2];
    }
    else {
        return null;
    }
}

// Get the list of workers available.
function getWorkerNames(location){
    let fs = require('fs');
    let files = fs.readdirSync(location);
    console.log(files);
    return files;
}