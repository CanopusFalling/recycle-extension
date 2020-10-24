// Handles the location option on the settings page.

"Use strict";

// ===== Script Start =====
function start(){
    // Get all the councils.
    getCouncils(function(data){
        console.log(data);
    });
}
document.addEventListener("DOMContentLoaded", start);

// ===== Get List Of Councils =====
function getCouncils(callback) {
    chrome.storage.local.get(["file-data"], function(data){
        // Extract a list of councils from the data.
        let districtInfo = data["file-data"].districtInfo.contents['district-councils'];
        let councils = [];
        for(let council in districtInfo){
            councils.push(council);
        }
        // Callback with the array of councils.
        callback(councils);
    });
}