/**
 * DevExtreme (cjs/renovation/component_wrapper/utils.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.getAriaName = getAriaName;
exports.updatePropsImmutable = updatePropsImmutable;
exports.removeDifferentElements = exports.addAttributes = void 0;
var _iterator = require("../../core/utils/iterator");
var _type = require("../../core/utils/type");

function _extends() {
    _extends = Object.assign || function(target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key]
                }
            }
        }
        return target
    };
    return _extends.apply(this, arguments)
}

function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread()
}

function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
}

function _unsupportedIterableToArray(o, minLen) {
    if (!o) {
        return
    }
    if ("string" === typeof o) {
        return _arrayLikeToArray(o, minLen)
    }
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if ("Object" === n && o.constructor) {
        n = o.constructor.name
    }
    if ("Map" === n || "Set" === n) {
        return Array.from(o)
    }
    if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) {
        return _arrayLikeToArray(o, minLen)
    }
}

function _iterableToArray(iter) {
    if ("undefined" !== typeof Symbol && null != iter[Symbol.iterator] || null != iter["@@iterator"]) {
        return Array.from(iter)
    }
}

function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
        return _arrayLikeToArray(arr)
    }
}

function _arrayLikeToArray(arr, len) {
    if (null == len || len > arr.length) {
        len = arr.length
    }
    for (var i = 0, arr2 = new Array(len); i < len; i++) {
        arr2[i] = arr[i]
    }
    return arr2
}
var addAttributes = function($element, attributes) {
    (0, _iterator.each)(attributes, (function(_, _ref) {
        var name = _ref.name,
            value = _ref.value;
        if ("class" === name) {
            $element.addClass(value)
        } else {
            $element.attr(name, value)
        }
    }))
};
exports.addAttributes = addAttributes;

function getAriaName(name) {
    return "role" === name || "id" === name ? name : "aria-".concat(name)
}
var removeDifferentElements = function($children, $newChildren) {
    (0, _iterator.each)($newChildren, (function(__, element) {
        var hasComponent = false;
        (0, _iterator.each)($children, (function(_, oldElement) {
            if (element === oldElement) {
                hasComponent = true
            }
        }));
        if (!hasComponent && element.parentNode) {
            element.parentNode.removeChild(element)
        }
    }))
};
exports.removeDifferentElements = removeDifferentElements;

function updatePropsImmutable(props, option, name, fullName) {
    var currentPropsValue = option[name];
    var result = props;
    if (name !== fullName) {
        if (Array.isArray(currentPropsValue)) {
            var newArray = _toConsumableArray(currentPropsValue);
            result[name] = newArray;
            var matchIndex = /\[\s*(\d+)\s*\]/g.exec(fullName);
            if (matchIndex) {
                var index = parseInt(matchIndex[1], 10);
                if ((0, _type.isPlainObject)(newArray[index])) {
                    newArray[index] = _extends({}, currentPropsValue[index])
                }
            }
            return
        }
    }
    if ((0, _type.isPlainObject)(currentPropsValue)) {
        result[name] = _extends({}, currentPropsValue)
    } else {
        result[name] = currentPropsValue
    }
}
