// Script to handle the user changing their location.

// ===== Global Analysis =====
var councils;

// ===== File Reading Function =====

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

// ===== Get Councils =====
function updateCouncils() {
    JSON_FILES = ["../data/district-recycle-info.json"];
    JSON_FILES.forEach(element => {
        readTextFile(element, function (stringResponse) {
            councils = JSON.parse(stringResponse);
            
            // Add all the locations once they're loaded.
            addLocations();
        })
    });
}

// Update when script starts.
updateCouncils();

// ===== Set up the drop down =====

function addLocations(){
    let info = councils["district-councils"];

    for(let council in info){
        addLocation(council);
    }
}

function addLocation(locationName){
    let locationSelector = document.getElementById("location-dropdown");
    let newNode = document.createElement("option")
    newNode.value = locationName;
    newNode.innerHTML = locationName;

    locationSelector.appendChild(newNode);
}

// ===== Search Bar =====