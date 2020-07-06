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

    return response;
}

function queryBackEnd(data) {
    postData(BACK_END_URL, { ASIN: data })
        .then(
            data => {
                console.log(data.json());
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
            queryBackEnd(changes[key].newValue);
        }
    }
});