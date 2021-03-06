/**
 * DevExtreme (cjs/data/utils.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.isDisjunctiveOperator = isDisjunctiveOperator;
exports.isConjunctiveOperator = isConjunctiveOperator;
exports.throttleChanges = throttleChanges;
exports.rejectedPromise = exports.trivialPromise = exports.isGroupCriterion = exports.isUnaryOperation = exports.base64_encode = exports.keysEqual = exports.processRequestResultLock = exports.aggregators = exports.errorMessageFromXhr = exports.normalizeSortingInfo = exports.normalizeBinaryCriterion = exports.XHR_ERROR_UNLOAD = void 0;
var _type = require("../core/utils/type");
var _dom_adapter = _interopRequireDefault(require("../core/dom_adapter"));
var _ready_callbacks = _interopRequireDefault(require("../core/utils/ready_callbacks"));
var _window = require("../core/utils/window");
var _iterator = require("../core/utils/iterator");
var _deferred = require("../core/utils/deferred");
var _common = require("../core/utils/common");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
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
var ready = _ready_callbacks.default.add;
var XHR_ERROR_UNLOAD = "DEVEXTREME_XHR_ERROR_UNLOAD";
exports.XHR_ERROR_UNLOAD = XHR_ERROR_UNLOAD;
var normalizeBinaryCriterion = function(crit) {
    return [crit[0], crit.length < 3 ? "=" : String(crit[1]).toLowerCase(), crit.length < 2 ? true : crit[crit.length - 1]]
};
exports.normalizeBinaryCriterion = normalizeBinaryCriterion;
var normalizeSortingInfo = function(info) {
    if (!Array.isArray(info)) {
        info = [info]
    }
    return (0, _iterator.map)(info, (function(i) {
        var result = {
            selector: (0, _type.isFunction)(i) || "string" === typeof i ? i : i.getter || i.field || i.selector,
            desc: !!(i.desc || "d" === String(i.dir).charAt(0).toLowerCase())
        };
        if (i.compare) {
            result.compare = i.compare
        }
        return result
    }))
};
exports.normalizeSortingInfo = normalizeSortingInfo;
var errorMessageFromXhr = function() {
    var textStatusMessages = {
        timeout: "Network connection timeout",
        error: "Unspecified network error",
        parsererror: "Unexpected server response"
    };
    var unloading;
    ready((function() {
        var window = (0, _window.getWindow)();
        _dom_adapter.default.listen(window, "beforeunload", (function() {
            unloading = true
        }))
    }));
    return function(xhr, textStatus) {
        if (unloading) {
            return XHR_ERROR_UNLOAD
        }
        if (xhr.status < 400) {
            return function(textStatus) {
                var result = textStatusMessages[textStatus];
                if (!result) {
                    return textStatus
                }
                return result
            }(textStatus)
        }
        return xhr.statusText
    }
}();
exports.errorMessageFromXhr = errorMessageFromXhr;
var aggregators = {
    count: {
        seed: 0,
        step: function(count) {
            return 1 + count
        }
    },
    sum: {
        seed: 0,
        step: function(sum, item) {
            return sum + item
        }
    },
    min: {
        step: function(min, item) {
            return item < min ? item : min
        }
    },
    max: {
        step: function(max, item) {
            return item > max ? item : max
        }
    },
    avg: {
        seed: [0, 0],
        step: function(pair, value) {
            return [pair[0] + value, pair[1] + 1]
        },
        finalize: function(pair) {
            return pair[1] ? pair[0] / pair[1] : NaN
        }
    }
};
exports.aggregators = aggregators;
var processRequestResultLock = function() {
    var lockCount = 0;
    var lockDeferred;
    return {
        obtain: function() {
            if (0 === lockCount) {
                lockDeferred = new _deferred.Deferred
            }
            lockCount++
        },
        release: function() {
            lockCount--;
            if (lockCount < 1) {
                lockDeferred.resolve()
            }
        },
        promise: function() {
            var deferred = 0 === lockCount ? (new _deferred.Deferred).resolve() : lockDeferred;
            return deferred.promise()
        },
        reset: function() {
            lockCount = 0;
            if (lockDeferred) {
                lockDeferred.resolve()
            }
        }
    }
}();
exports.processRequestResultLock = processRequestResultLock;

function isDisjunctiveOperator(condition) {
    return /^(or|\|\||\|)$/i.test(condition)
}

function isConjunctiveOperator(condition) {
    return /^(and|&&|&)$/i.test(condition)
}
var keysEqual = function(keyExpr, key1, key2) {
    if (Array.isArray(keyExpr)) {
        var names = (0, _iterator.map)(key1, (function(v, k) {
            return k
        }));
        var name;
        for (var i = 0; i < names.length; i++) {
            name = names[i];
            if (!(0, _common.equalByValue)(key1[name], key2[name], 0, false)) {
                return false
            }
        }
        return true
    }
    return (0, _common.equalByValue)(key1, key2, 0, false)
};
exports.keysEqual = keysEqual;
var BASE64_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
var base64_encode = function(input) {
    if (!Array.isArray(input)) {
        input = stringToByteArray(String(input))
    }
    var result = "";

    function getBase64Char(index) {
        return BASE64_CHARS.charAt(index)
    }
    for (var i = 0; i < input.length; i += 3) {
        var octet1 = input[i];
        var octet2 = input[i + 1];
        var octet3 = input[i + 2];
        result += (0, _iterator.map)([octet1 >> 2, (3 & octet1) << 4 | octet2 >> 4, isNaN(octet2) ? 64 : (15 & octet2) << 2 | octet3 >> 6, isNaN(octet3) ? 64 : 63 & octet3], getBase64Char).join("")
    }
    return result
};
exports.base64_encode = base64_encode;

function stringToByteArray(str) {
    var bytes = [];
    var code;
    var i;
    for (i = 0; i < str.length; i++) {
        code = str.charCodeAt(i);
        if (code < 128) {
            bytes.push(code)
        } else if (code < 2048) {
            bytes.push(192 + (code >> 6), 128 + (63 & code))
        } else if (code < 65536) {
            bytes.push(224 + (code >> 12), 128 + (code >> 6 & 63), 128 + (63 & code))
        } else if (code < 2097152) {
            bytes.push(240 + (code >> 18), 128 + (code >> 12 & 63), 128 + (code >> 6 & 63), 128 + (63 & code))
        }
    }
    return bytes
}
var isUnaryOperation = function(crit) {
    return "!" === crit[0] && Array.isArray(crit[1])
};
exports.isUnaryOperation = isUnaryOperation;
var isGroupOperator = function(value) {
    return "and" === value || "or" === value
};
var isGroupCriterion = function(crit) {
    var first = crit[0];
    var second = crit[1];
    if (Array.isArray(first)) {
        return true
    }
    if ((0, _type.isFunction)(first)) {
        if (Array.isArray(second) || (0, _type.isFunction)(second) || isGroupOperator(second)) {
            return true
        }
    }
    return false
};
exports.isGroupCriterion = isGroupCriterion;
var trivialPromise = function() {
    var d = new _deferred.Deferred;
    return d.resolve.apply(d, arguments).promise()
};
exports.trivialPromise = trivialPromise;
var rejectedPromise = function() {
    var d = new _deferred.Deferred;
    return d.reject.apply(d, arguments).promise()
};
exports.rejectedPromise = rejectedPromise;

function throttle(func, timeout) {
    var timeoutId;
    var lastArgs;
    return function() {
        var _this = this;
        lastArgs = arguments;
        if (!timeoutId) {
            timeoutId = setTimeout((function() {
                timeoutId = void 0;
                if (lastArgs) {
                    func.call(_this, lastArgs)
                }
            }), (0, _type.isFunction)(timeout) ? timeout() : timeout)
        }
        return timeoutId
    }
}

function throttleChanges(func, timeout) {
    var cache = [];
    var throttled = throttle((function() {
        func.call(this, cache);
        cache = []
    }), timeout);
    return function(changes) {
        if (Array.isArray(changes)) {
            var _cache;
            (_cache = cache).push.apply(_cache, _toConsumableArray(changes))
        }
        return throttled.call(this, cache)
    }
}
