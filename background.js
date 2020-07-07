// Background handling script.

"use strict";

const BACK_END_URL = "https://recyclabilitydiscriminator.eu-gb.mybluemix.net/amazonproduct"
//const BACK_END_URL = "https://riviera-amadeus-8000.codio.io/amazonproduct"


async function postData(url, data) {
    let response = await fetch(url, {
        method: 'POST',
        cors: 'cors',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data)
    });

    return response.json();
}

function queryBackEnd(data) {
    postData(BACK_END_URL, data)
        .then(
            data => {
                console.log(data);
                chrome.storage.sync.set({'ASINresponse': data }, function () {
                    console.log('Response saved to memory.');
                });
            }
        );
}

chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (var key in changes) {
        var storageChange = changes[key];
        console.log('Storage key "%s" in namespace "%s" changed. ' +
            'Old value was "%s", new value is "%s".',
            key,
            namespace,
            storageChange.oldValue,
            storageChange.newValue);

        if(key == "ASIN"){
            //queryBackEnd({ASIN: changes[key].newValue});
        }

        if(key == "product-title"){
            queryBackEnd({productTitle: changes[key].newValue});
        }
    }
});