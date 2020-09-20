// Script to handle the location selection form.

"use strict";

// ===== Constants =====
const COUNCIL_FILE_LOCATION = "/data/district-recycle-info.json";

const DROPDOWN_BOX_ID = "location-dropdown";
const SUBMIT_LOCATION_ID = "submit-location-info";

const SETUP_STORAGE_KEY = "extension_setup_status";

// ===== Read in File =====
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

// ===== Add Locations to Dropdown =====
function addLocations(textFile) {
    // Convert string to JSON
    let councilInfo = JSON.parse(textFile);
    let info = councilInfo["district-councils"];

    // Add all the councils to the selection element.
    for (let council in info) {
        addLocation(council);
    }
}

function addLocation(locationName) {
    // Find the selector element.
    let locationSelector = document.getElementById(DROPDOWN_BOX_ID);

    // Create new option box.
    let newNode = document.createElement("option");
    newNode.value = locationName;
    newNode.innerHTML = locationName;
    // Add element to the selector
    locationSelector.appendChild(newNode);
}

// ===== Add Listener to Form =====
function listenForm() {
    let submitButton = document.getElementById(SUBMIT_LOCATION_ID);
    // Add event listener.
    submitButton.addEventListener("click", updateLocation);
}

function updateLocation() {
    // Get current selection.
    let locationSelector = document.getElementById(DROPDOWN_BOX_ID);
    let selection = locationSelector.value;

    let memoryObject = { 'user-location': selection };
    memoryObject[SETUP_STORAGE_KEY] = true;

    chrome.storage.sync.set(memoryObject);
}

// ===== Startup Point =====
document.addEventListener("DOMContentLoaded", function () {
    readTextFile(COUNCIL_FILE_LOCATION, addLocations);
    listenForm();
});