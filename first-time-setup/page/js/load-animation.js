// Script to manage the animation for the setup screen.

"use strict";

// ===== Constants =====
const HANG_TIME = 1000;

const TITLE_SCREEN_SIZE = 80;
const FINAL_SCREEN_SIZE = 40;

const OVERLAY_START_OPACITY = 1;
const OVERLAY_FINAL_OPACITY = 0;

const FRAME_RATE = 30;
const FRAME_INTERVAL = 1000 / FRAME_RATE;

const ANIMATION_TIME = 2000;

// ===== Setup Animation =====
function animationSetup(logo, overlay) {
    // Set the logo to the correct size.
    logo.style.width = TITLE_SCREEN_SIZE + "%";
    logo.style.zIndex = "3";

    // Set the overlay's transparency.
    overlay.style.opacity = String(OVERLAY_START_OPACITY);
}

// ===== Start Animation =====
function runAnimation(logo, overlay) {
    // Call the frame function on interval.
    let frameInterval = setInterval(function () { frame(logo, overlay) }, FRAME_INTERVAL);

    // Kill the animation after time is up.
    setTimeout(function () { killAnimation(frameInterval) }, ANIMATION_TIME);
}

// ===== Kill Animation =====
function killAnimation(frameInterval) {
    clearInterval(frameInterval);
}

// ===== Frame Handler =====
function frame(logo, overlay) {
    // Get the current logo width.
    let logoWidthString = logo.style.width;
    logoWidthString = logoWidthString.substring(0, logoWidthString.length - 1);
    let logoWidth = Number(logoWidthString);

    // Get the current overlay opacity.
    let overlayOpacity = Number(overlay.style.opacity);

    // Work out the total frame count.
    let frameCount = Math.floor(ANIMATION_TIME / FRAME_INTERVAL);

    // Work out the step for each.
    let logoSizeStep = (FINAL_SCREEN_SIZE - TITLE_SCREEN_SIZE) / frameCount;
    let overlayOpacityStep = (OVERLAY_FINAL_OPACITY - OVERLAY_START_OPACITY) / frameCount;

    // Set the styles.
    logo.style.width = (logoWidth + logoSizeStep) + "%";
    overlay.style.opacity = (overlayOpacity + overlayOpacityStep);
}

// ==== Animation Delay =====
function delayAnimation() {
    let logo = document.getElementById("main-page-logo");
    let overlay = document.getElementById("white-overlay");

    animationSetup(logo, overlay);
    setTimeout(function () { runAnimation(logo, overlay) }, HANG_TIME);
}

// ===== OnLoad Start Script =====

document.addEventListener("DOMContentLoaded", delayAnimation);