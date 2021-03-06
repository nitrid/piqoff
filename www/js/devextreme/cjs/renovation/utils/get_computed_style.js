/**
 * DevExtreme (cjs/renovation/utils/get_computed_style.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.default = getElementComputedStyle;

function getElementComputedStyle(el) {
    var _window$getComputedSt, _window;
    return el ? null === (_window$getComputedSt = (_window = window).getComputedStyle) || void 0 === _window$getComputedSt ? void 0 : _window$getComputedSt.call(_window, el) : null
}
module.exports = exports.default;
module.exports.default = exports.default;
