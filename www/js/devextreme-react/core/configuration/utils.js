/*!
 * devextreme-react
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file in the root of the project for details.
 *
 * https://github.com/DevExpress/devextreme-react
 */

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shallowEquals = exports.isIE = exports.parseOptionName = exports.mergeNameParts = void 0;
function mergeNameParts() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return args.filter(function (value) { return value; }).join('.');
}
exports.mergeNameParts = mergeNameParts;
function parseOptionName(name) {
    var parts = name.split('[');
    if (parts.length === 1) {
        return {
            isCollectionItem: false,
            name: name,
        };
    }
    return {
        isCollectionItem: true,
        name: parts[0],
        index: Number(parts[1].slice(0, -1)),
    };
}
exports.parseOptionName = parseOptionName;
exports.isIE = function () {
    var _a, _b;
    var ua = (_b = (_a = window === null || window === void 0 ? void 0 : window.navigator) === null || _a === void 0 ? void 0 : _a.userAgent) !== null && _b !== void 0 ? _b : ''; // Check the userAgent property of the window.navigator object
    var msie = ua.indexOf('MSIE'); // IE 10 or older
    var trident = ua.indexOf('Trident/'); // IE 11
    return (msie > 0 || trident > 0);
};
exports.shallowEquals = function (first, second) {
    if (Object.keys(first).length !== Object.keys(second).length) {
        return false;
    }
    return Object.keys(first).every(function (key) { return first[key] === second[key]; });
};
