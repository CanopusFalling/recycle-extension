// Script to handle the navigation bar for the extension.

"use strict";

function setup() {
    let homeButton = document.getElementById("home-navigation");
    let exploreButton = document.getElementById("explore-navigation");

    homeButton.addEventListener("click", function() {
        openPage("home.html");
    });
    exploreButton.addEventListener("click", function() {
        openPage("explore.html");
    });
}

function openPage(page) {
    var fileRead = new XMLHttpRequest();
    fileRead.open("GET", page, true);
    fileRead.onreadystatechange = function() {
        if (fileRead.readyState === 4) {
            var allText = fileRead.responseText;
            document.getElementById("main-area").innerHTML = allText;
        }
    }
    fileRead.send();
}

window.onload = setup;