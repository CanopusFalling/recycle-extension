// Handles the location option on the settings page.

"Use strict";

// ===== Script Start =====
function start() {
    // Get all the councils.
    getCouncils(function (data) {
        chrome.storage.sync.get(['user-location'], function (location) {
            addLocations(data, location['user-location']);
        });
    });
    let dropdown = document.getElementById("location-dropdown");
    dropdown.addEventListener("change", updateLocation);
}
document.addEventListener("DOMContentLoaded", start);

// ===== Get List Of Councils =====
function getCouncils(callback) {
    chrome.storage.local.get(["file-data"], function (data) {
        // Extract a list of councils from the data.
        let districtInfo = data["file-data"].districtInfo.contents['district-councils'];
        let councils = [];
        for (let council in districtInfo) {
            councils.push(council);
        }
        // Callback with the array of councils.
        callback(councils);
    });
}

// ===== Add Locations To Dropdown =====
function addLocations(locations, currentLocation) {
    let dropdown = document.getElementById("location-dropdown");
    locations.forEach(element => {
        let option = document.createElement("option");
        option.text = element;
        if (element == currentLocation) {
            option.selected = true;
        }
        dropdown.add(option);
    });
}

// ===== Update Location On Change =====
function updateLocation() {
    let dropdown = document.getElementById("location-dropdown");
    let location = dropdown.options[dropdown.selectedIndex].text;
    chrome.storage.sync.set({ "user-location": location }, function () {
        confirmLocationUpdate(location);
    });
}

function confirmLocationUpdate(location) {
    let messageBox = document.getElementById("location-message-box");
    messageBox.innerHTML = "Location Updated to " + location + " successfully!";
}