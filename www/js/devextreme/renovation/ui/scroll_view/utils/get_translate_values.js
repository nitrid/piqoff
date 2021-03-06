/**
 * DevExtreme (renovation/ui/scroll_view/utils/get_translate_values.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.getTranslateValues = getTranslateValues;
var _get_element_style = require("./get_element_style");

function getTranslateValues(element) {
    if (!element) {
        return {
            left: 0,
            top: 0
        }
    }
    var matrix = (0, _get_element_style.getElementStyle)("transform", element);
    var matrixValues = /matrix.*\((.+)\)/.exec(matrix);
    if (matrixValues) {
        var result = matrixValues[1].split(", ");
        return {
            left: Number(result[4]),
            top: Number(result[5])
        }
    }
    return {
        left: 0,
        top: 0
    }
}
