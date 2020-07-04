function getLocation() {
    let locationDisplay = document.getElementById("location-display");

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        locationDisplay.innerHTML = "Geolocation is not supported by this browser.";
    }

    setup();
}

function showPosition(position) {
    let locationDisplay = document.getElementById("location-display");

    let locationString = "Latitude: " + position.coords.latitude +
        "<br>Longitude: " + position.coords.longitude;

    locationDisplay.innerHTML = locationString;
    console.log(locationString);
}

window.onload = getLocation;