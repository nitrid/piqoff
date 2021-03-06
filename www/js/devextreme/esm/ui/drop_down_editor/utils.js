/**
 * DevExtreme (esm/ui/drop_down_editor/utils.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import {
    hasWindow
} from "../../core/utils/window";
var getElementWidth = function($element) {
    if (hasWindow()) {
        return $element.outerWidth()
    }
};
var getSizeValue = function(size) {
    if (null === size) {
        size = void 0
    }
    if ("function" === typeof size) {
        size = size()
    }
    return size
};
export {
    getElementWidth,
    getSizeValue
};
