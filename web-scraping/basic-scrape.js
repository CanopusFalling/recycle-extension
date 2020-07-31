// Script that simply saves all the information from a new page to the extension memory.

"use strict";

// ===== Globals =====
var REMOVED_TAGS = ['script', 'noscript', 'style', 'meta', 'link', 'head','header', 'footer', 'input', 'path'];

// ===== Scraping =====
// Get the information about the page.
let rawHTML = document.documentElement.innerHTML;
let siteLocation = window.location.href;

// Remove any bloat from the HTML where possible.
let processedHTML = removeTagList(rawHTML, REMOVED_TAGS);
processedHTML = removeNewlines(processedHTML);
processedHTML = removeHTMLComments(processedHTML);

// Make HTML into an object.
let processedPage = document.createElement('div');
processedPage.innerHTML = processedHTML;

// Make JSON object of the information;
let JSONObject = { 'page-scrape': { 'page-object': processedPage, 'site-location': siteLocation } };

// Push the scraped information to chrome storage.
//console.log(processedHTML);
chrome.storage.sync.set(JSONObject, function(){
    console.log('Page anonamised and saved successfully!');
});

// ===== Heper Functions =====
// ----- HTML Cleanup Functions -----

// Remove list of tag types from a string.
function removeTagList(text, list) {
    // Loop over all the tags.
    list.forEach(tag => {
        text = removeTag(text, tag);
    });
    // Return the result.
    return text;
}

// Remove tag type from string.
function removeTag(text, tag) {
    // Make new div and set contents to the text.
    let div = document.createElement('div');
    div.innerHTML = text;
    // Get all the tags specified from the div.
    let tags = div.getElementsByTagName(tag);
    let i = tags.length;
    // Loop until all the tags are gone.
    while (i--) {
        tags[i].parentNode.removeChild(tags[i]);
    }
    // Return resulting HTML.
    return div.innerHTML;
}

// Removes newlines from string.
function removeNewlines(text) {
    return text.replace(/(\r\n|\n|\r)/gm, "");
}

// Remove HTML comments
function removeHTMLComments(text) {
    return text.replace(/<!--(?!>)[\S\s]*?-->/g, '');
}