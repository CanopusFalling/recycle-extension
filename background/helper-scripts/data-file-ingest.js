// Script to read in all the needed files and store them 
// in the extension storage for ease of access.

"use strict";

// ===== Constants =====
const FILES = {
    districtInfo: { location: "data/district-recycle-info.json" },
    materialInfo: { location: "data/material-info.json" }
};

const STORAGE_KEY = "file-data";

// ===== File Reader =====
function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

// ===== Get Data As JSON Object =====
function getJSONInformation(callback) {
    let fileInfo = FILES;

    for (let fileName in fileInfo) {
        let file = fileInfo[fileName];

        readTextFile(file.location, function (fileText) {
            file.contents = JSON.parse(fileText);

            finishedDataReading(fileInfo, callback);
        });
    }
}

function finishedDataReading(fileInfo, callback) {
    //console.log(fileInfo);

    // Check if all the files have been read into the script.
    let isFinished = true;
    for (let fileName in fileInfo) {
        let file = fileInfo[fileName];

        if (typeof file.contents == "undefined") {
            isFinished = false;
        }
    }

    if (isFinished) {
        callback(fileInfo);
    }
}

// ===== Save Data =====

function saveData(data) {
    // Save data to chrome extension storage.
    let saveObject = {};
    saveObject[STORAGE_KEY] = data;
    chrome.storage.local.set(saveObject, function () {
        console.log("External file data saved to storage location: \"" + STORAGE_KEY + "\"");
    });
}

// ===== Script Start =====
getJSONInformation(saveData);