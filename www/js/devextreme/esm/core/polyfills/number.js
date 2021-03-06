/**
 * DevExtreme (esm/core/polyfills/number.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import {
    hasWindow,
    getWindow
} from "../../core/utils/window";
var number = hasWindow() ? getWindow().Number : Number;
number.isFinite = number.isFinite || function(value) {
    return "number" === typeof value && isFinite(value)
};
export default number;
