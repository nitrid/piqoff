/**
 * DevExtreme (cjs/viz/funnel/tiling.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.getAlgorithm = getAlgorithm;
exports.addAlgorithm = addAlgorithm;
var _utils = require("../core/utils");
var algorithms = {};
var defaultAlgorithm;

function getAlgorithm(name) {
    return algorithms[(0, _utils.normalizeEnum)(name)] || defaultAlgorithm
}

function addAlgorithm(name, callback, setDefault) {
    algorithms[name] = callback;
    if (setDefault) {
        defaultAlgorithm = algorithms[name]
    }
}
