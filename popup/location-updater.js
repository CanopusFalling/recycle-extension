"use strict";

// ===== Start of Script =====
function startLocationScript(){
    getLocation(setLocation);
}
document.addEventListener("DOMContentLoaded", startLocationScript);

// ===== Get Location =====
function getLocation(callback){
    chrome.storage.sync.get(['user-location'], function(data){
        callback(data['user-location']);
    })
}

function setLocation(location){
    document.getElementById("current-location").innerHTML 
        = "Location set to " + location;
}