/**
 * DevExtreme (cjs/renovation/ui/scroll_view/utils/get_element_offset.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.getWindowByElement = getWindowByElement;
exports.getElementOffset = getElementOffset;
var _type = require("../../../../core/utils/type");

function getWindowByElement(element) {
    return (0, _type.isWindow)(element) ? element : element.defaultView
}

function getElementOffset(element) {
    if (!element) {
        return {
            left: 0,
            top: 0
        }
    }
    if (!element.getClientRects().length) {
        return {
            top: 0,
            left: 0
        }
    }
    var rect = element.getBoundingClientRect();
    var window = getWindowByElement(element.ownerDocument);
    var docElem = element.ownerDocument.documentElement;
    return {
        top: rect.top + window.pageYOffset - docElem.clientTop,
        left: rect.left + window.pageXOffset - docElem.clientLeft
    }
}
