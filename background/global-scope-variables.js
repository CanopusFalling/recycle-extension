/* Because the background script is all loaded as one page
 * with all the scripts in the same context all the global
 * scope variables are listed here to avoid clashes.
 * 
 * This should ALWAYS be the first script loaded by the 
 * manifest.
 */

"use strict";

// ===== CONSTANTS =====
// Data files.
const FILES = {
    districtInfo: { location: "data/district-recycle-info.json" },
    materialInfo: { location: "data/material-info.json" },
    settings: { location: "settings.json" }
};

// Storage Key locations.
const FILE_DATA_STORAGE_KEY = "file-data";
const PRODUCT_DATA_STORAGE_KEY = "product-information";
const PRODUCT_GUESS_STORAGE_KEY = "product-guesses";

// ===== Globals =====
var detectionSettings = {};
var materialInformation = {};