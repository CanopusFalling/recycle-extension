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

    addOptionListener();
}

function addLocation(locationName){
    let locationSelector = document.getElementById("location-dropdown");
    let newNode = document.createElement("option")
    newNode.value = locationName;
    newNode.innerHTML = locationName;

    locationSelector.appendChild(newNode);
}

// ===== Change location =====
function addOptionListener(){
    let updateButton = document.getElementById("update-location-button");

    updateButton.addEventListener('click', onSelectionUpdate);
    console.log("Added.");

    //addSearchListener();
}

function onSelectionUpdate(){
    let optionBox = document.getElementById("location-dropdown");

    let selection = optionBox.value;

    chrome.storage.sync.set({'user-location': selection}, function(){
        console.log("location set to: " + selection);
        document.getElementById("dot").style.visibility = "visible";
    });

    let messageDiv = document.getElementById("location-selector-message");

    messageDiv.innerHTML = "Updated Location to " + selection;

    setTimeout(updateLocalInfo, 1000);
    setTimeout(setRecyclability, 2000);
}

/*
// ===== Search Bar =====

function addSearchListener(){
    let searchBar = document.getElementById("location-search");

    searchBar.addEventListener("keyup", filterSearch);
}

function filterSearch(){
    // Get the search string.
    let searchBar = document.getElementById("location-search");

    let search = searchBar.value;

    let dropdown = document.getElementById("location-dropdown");
    let options = dropdown.childNodes;

    options.forEach(element => {
        if(typeof element.value != "undefined"){
            if(element.value.includes(search)){
                element.style.display = "block";
            }else{
                element.style.display = "none";
            }
        }
    });
}
*/