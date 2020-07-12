// Background handling script.

"use strict";

const BACK_END_URL = "https://recyclabilitydiscriminator.eu-gb.mybluemix.net/amazonproduct"
//const BACK_END_URL = "https://riviera-amadeus-8000.codio.io/amazonproduct"

const DISTRICT_INFO = "data/district-recycle-info.json";
const MATERIAL_INFO = "data/material-info.json"

// Code for querying back end server.
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

// Product material identification.
async function identifyMaterials(title, recycleInfo, materials){
    console.log(recycleInfo);


}

// Get the local authority information.
function getDistrictInfo(districtName){
    var fileRead = new XMLHttpRequest();
    fileRead.open("GET", DISTRICT_INFO, true);
    fileRead.onreadystatechange = function() {
        if (fileRead.readyState === 4) {
            let json = JSON.stringify(fileRead.responseText);
            return json;
        }
    }
    fileRead.send();
}

// Get the materials object.
function getMaterialsObject(){
    var fileRead = new XMLHttpRequest();
    fileRead.open("GET", MATERIAL_INFO, true);
    fileRead.onreadystatechange = function() {
        if (fileRead.readyState === 4) {
            let json = JSON.stringify(fileRead.responseText);
            return json;
        }
    }
    fileRead.send();
}

// Listener for when the data updates.
chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (var key in changes) {
        var storageChange = changes[key];
        console.log('Storage key "%s" in namespace "%s" changed. ' +
            'Old value was "%s", new value is "%s".',
            key,
            namespace,
            storageChange.oldValue,
            storageChange.newValue);

            /*
        if(key == "ASIN"){
            //queryBackEnd({ASIN: changes[key].newValue});
        }

        if(key == "product-title"){
            //queryBackEnd({productTitle: changes[key].newValue});
        }*/

        if(key == "product-information"){
            let title = changes[key].newValue.productTitle;
            identifyMaterials(title, getDistrictInfo("Adur"), getMaterialsObject());
        }
    }
});