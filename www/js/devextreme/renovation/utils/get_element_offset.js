/**
 * DevExtreme (renovation/utils/get_element_offset.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.default = getElementOffset;

function getElementOffset(elem) {
    if (!elem) {
        return null
    }
    var rect = elem.getBoundingClientRect();
    return {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX
    }
}
module.exports = exports.default;
module.exports.default = exports.default;
