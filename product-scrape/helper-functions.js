/**
 * Holds all the helper functions used by the other scripts.
 */

"use strict";

// ===== Text Manipulation Functions =====

function getCleanText(object) {
    let rawText = getHTMLObjectText(object);
    return stripNewlines(rawText);
}

function stripNewlines(text) {
    return text.replace(/(\r\n|\n|\r)/gm, "");
}

function getHTMLObjectText(object) {
    try {
        return object.textContent || object.innerText || "";
    } catch (e) {
        //Checks if the error is not a type error.
        if (!e instanceof TypeError) {
            throw e;
        }
        return "";
    }
}