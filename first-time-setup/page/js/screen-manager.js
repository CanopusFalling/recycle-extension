// Script to manage the contents of the startup screen so the user can proceed between them.

// ===== Globals =====
let currentScreen = 0;

// ===== Set up Screens =====
function screenSetup(){
    showScreen(currentScreen);

    addListeners("previous-screen-button", -1);
    addListeners("next-screen-button", 1);
}

// ===== Adding Listeners to Buttons =====
function addListeners(className, advancement){
    let buttons = document.getElementsByClassName(className);

    for(let i = 0; i < buttons.length; i++){
        let button = buttons[i];

        button.addEventListener("click", function(){
            currentScreen += advancement;
            showScreen(currentScreen);
        });
    }
}

// ===== Show Specific Screen =====
function showScreen(screenNumber){
    // Hide all screens.
    let screens = document.getElementsByTagName("main");
    for(let i = 0; i < screens.length; i++){
        let screen = screens[i];
        screen.style.display = "none";
    }

    // Show the 1 selected screen.
    let currentScreenID = "main-section-" + screenNumber;
    let currentScreen = document.getElementById(currentScreenID);
    currentScreen.style.display = "block";
}

// ===== OnLoad Start Script =====
document.addEventListener("DOMContentLoaded", screenSetup);