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
const PRODUCT_GUESS_STORAGE_KEY = "product-guess";
const MATERIAL_GUESS_STORAGE_KEY = "material-guess";
const OLD_ENGINE_KEY = "product-analysis";
const LOCATION_STORAGE_KEY = "user-location";
const LOCAL_INFO_STORAGE_KEY = "local-info";

// ===== Globals =====
var detectionSettings = {};
var materialInformation = {};
var councilInformation = {};