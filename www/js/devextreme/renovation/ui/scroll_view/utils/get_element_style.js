/**
 * DevExtreme (renovation/ui/scroll_view/utils/get_element_style.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.getElementStyle = getElementStyle;
var _get_computed_style = _interopRequireDefault(require("../../../utils/get_computed_style"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}

function getElementStyle(name, element) {
    var computedStyle = (0, _get_computed_style.default)(element) || {};
    return computedStyle[name]
}
