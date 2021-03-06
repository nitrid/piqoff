/**
 * DevExtreme (esm/ui/overlay/utils.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import $ from "../../core/renderer";
import {
    getWindow
} from "../../core/utils/window";
import {
    isNumeric
} from "../../core/utils/type";
var WINDOW_HEIGHT_PERCENT = .9;
export var getElementMaxHeightByWindow = ($element, startLocation) => {
    var $window = $(getWindow());
    var {
        top: elementOffset
    } = $element.offset();
    var actualOffset;
    if (isNumeric(startLocation)) {
        if (startLocation < elementOffset) {
            return elementOffset - startLocation
        } else {
            actualOffset = $window.innerHeight() - startLocation + $window.scrollTop()
        }
    } else {
        var offsetTop = elementOffset - $window.scrollTop();
        var offsetBottom = $window.innerHeight() - offsetTop - $element.outerHeight();
        actualOffset = Math.max(offsetTop, offsetBottom)
    }
    return actualOffset * WINDOW_HEIGHT_PERCENT
};
