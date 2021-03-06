/**
 * DevExtreme (cjs/core/utils/position.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.getElementsFromPoint = exports.getDefaultAlignment = exports.getBoundingRect = void 0;
var _config = _interopRequireDefault(require("../config"));
var _dom_adapter = _interopRequireDefault(require("../dom_adapter"));
var _browser = _interopRequireDefault(require("../utils/browser"));
var _type = require("../utils/type");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}
var getDefaultAlignment = function(isRtlEnabled) {
    var rtlEnabled = null !== isRtlEnabled && void 0 !== isRtlEnabled ? isRtlEnabled : (0, _config.default)().rtlEnabled;
    return rtlEnabled ? "right" : "left"
};
exports.getDefaultAlignment = getDefaultAlignment;
var getElementsFromPoint = function(x, y) {
    var document = _dom_adapter.default.getDocument();
    if (_browser.default.msie) {
        var result = document.msElementsFromPoint(x, y);
        if (result) {
            return Array.prototype.slice.call(result)
        }
        return []
    }
    return document.elementsFromPoint(x, y)
};
exports.getElementsFromPoint = getElementsFromPoint;
var getBoundingRect = function(element) {
    if ((0, _type.isWindow)(element)) {
        return {
            width: element.outerWidth,
            height: element.outerHeight
        }
    }
    var rect;
    try {
        rect = element.getBoundingClientRect()
    } catch (e) {
        rect = {
            width: 0,
            height: 0,
            bottom: 0,
            top: 0,
            left: 0,
            right: 0
        }
    }
    return rect
};
exports.getBoundingRect = getBoundingRect;
