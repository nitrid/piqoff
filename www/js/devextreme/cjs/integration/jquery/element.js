/**
 * DevExtreme (cjs/integration/jquery/element.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _element = require("../../core/element");
var _use_jquery = _interopRequireDefault(require("./use_jquery"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}
var useJQuery = (0, _use_jquery.default)();
var getPublicElement = function($element) {
    return $element
};
if (useJQuery) {
    (0, _element.setPublicElementWrapper)(getPublicElement)
}
