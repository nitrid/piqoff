/**
 * DevExtreme (cjs/core/polyfills/number.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.default = void 0;
var _window = require("../../core/utils/window");
var number = (0, _window.hasWindow)() ? (0, _window.getWindow)().Number : Number;
number.isFinite = number.isFinite || function(value) {
    return "number" === typeof value && isFinite(value)
};
var _default = number;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;
