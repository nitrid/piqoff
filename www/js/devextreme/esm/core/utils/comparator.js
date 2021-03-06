/**
 * DevExtreme (esm/core/utils/comparator.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import domAdapter from "../dom_adapter";
import {
    toComparable
} from "./data";
import {
    isRenderer
} from "./type";
var hasNegation = function(oldValue, newValue) {
    return 1 / oldValue === 1 / newValue
};
export var equals = function(oldValue, newValue) {
    oldValue = toComparable(oldValue, true);
    newValue = toComparable(newValue, true);
    if (oldValue && newValue && isRenderer(oldValue) && isRenderer(newValue)) {
        return newValue.is(oldValue)
    }
    var oldValueIsNaN = oldValue !== oldValue;
    var newValueIsNaN = newValue !== newValue;
    if (oldValueIsNaN && newValueIsNaN) {
        return true
    }
    if (0 === oldValue && 0 === newValue) {
        return hasNegation(oldValue, newValue)
    }
    if (null === oldValue || "object" !== typeof oldValue || domAdapter.isElementNode(oldValue)) {
        return oldValue === newValue
    }
    return false
};
