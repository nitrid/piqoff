/**
 * DevExtreme (cjs/renovation/ui/grids/data_grid/utils/get_updated_options.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.getUpdatedOptions = getUpdatedOptions;
var _type = require("../../../../../core/utils/type");

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

function getDiffItem(key, value, previousValue) {
    return {
        path: key,
        value: value,
        previousValue: previousValue
    }
}

function compare(resultPaths, item1, item2, key) {
    var type1 = (0, _type.type)(item1);
    var type2 = (0, _type.type)(item2);
    if (item1 === item2) {
        return
    }
    if (type1 !== type2) {
        resultPaths.push(getDiffItem(key, item2, item1))
    } else if ("object" === type1) {
        if (!(0, _type.isPlainObject)(item2)) {
            resultPaths.push(getDiffItem(key, item2, item1))
        } else {
            var diffPaths = objectDiffs(item1, item2);
            resultPaths.push.apply(resultPaths, _toConsumableArray(diffPaths.map((function(item) {
                return _extends({}, item, {
                    path: "".concat(key, ".").concat(item.path)
                })
            }))))
        }
    } else if ("array" === type1) {
        if ("columns" !== key && item1 !== item2) {
            resultPaths.push(getDiffItem(key, item2, item1))
        } else if (item1.length !== item2.length) {
            resultPaths.push(getDiffItem(key, item2, item1))
        } else {
            var _diffPaths = objectDiffs(item1, item2);
            [].push.apply(resultPaths, _diffPaths.map((function(item) {
                return _extends({}, item, {
                    path: "".concat(key).concat(item.path)
                })
            })))
        }
    } else {
        resultPaths.push(getDiffItem(key, item2, item1))
    }
}
var objectDiffsFiltered = function(propsEnumerator) {
    return function(oldProps, props) {
        var resultPaths = [];
        var processItem = !Array.isArray(oldProps) ? function(propName) {
            return compare(resultPaths, oldProps[propName], props[propName], propName)
        } : function(propName) {
            return compare(resultPaths, oldProps[propName], props[propName], "[".concat(propName, "]"))
        };
        propsEnumerator(oldProps).forEach(processItem);
        Object.keys(props).filter((function(propName) {
            return !Object.prototype.hasOwnProperty.call(oldProps, propName) && oldProps[propName] !== props[propName]
        })).forEach((function(propName) {
            resultPaths.push({
                path: propName,
                value: props[propName],
                previousValue: oldProps[propName]
            })
        }));
        return resultPaths
    }
};
var objectDiffs = objectDiffsFiltered((function(oldProps) {
    return Object.keys(oldProps)
}));
var reactProps = {
    key: true,
    ref: true,
    children: true,
    style: true
};
var objectDiffsWithoutReactProps = objectDiffsFiltered((function(prop) {
    return Object.keys(prop).filter((function(p) {
        return !reactProps[p]
    }))
}));

function getUpdatedOptions(oldProps, props) {
    return objectDiffsWithoutReactProps(oldProps, props)
}
