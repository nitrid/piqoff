/**
 * DevExtreme (renovation/viz/sparklines/bullet.j.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../../core/component_registrator"));
var _component = _interopRequireDefault(require("../../component_wrapper/component"));
var _bullet = require("./bullet");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}

function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) {
            descriptor.writable = true
        }
        Object.defineProperty(target, descriptor.key, descriptor)
    }
}

function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) {
        _defineProperties(Constructor.prototype, protoProps)
    }
    if (staticProps) {
        _defineProperties(Constructor, staticProps)
    }
    return Constructor
}

function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    _setPrototypeOf(subClass, superClass)
}

function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function(o, p) {
        o.__proto__ = p;
        return o
    };
    return _setPrototypeOf(o, p)
}
var Bullet = function(_BaseComponent) {
    _inheritsLoose(Bullet, _BaseComponent);

    function Bullet() {
        return _BaseComponent.apply(this, arguments) || this
    }
    var _proto = Bullet.prototype;
    _proto._getActionConfigs = function() {
        return {
            onTooltipHidden: {},
            onTooltipShown: {},
            onContentReady: {
                excludeValidators: ["disabled"]
            }
        }
    };
    _createClass(Bullet, [{
        key: "_propsInfo",
        get: function() {
            return {
                twoWay: [
                    ["canvas", {
                        width: 0,
                        height: 0,
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0
                    }, "canvasChange"]
                ],
                allowNull: [],
                elements: [],
                templates: [],
                props: ["value", "color", "target", "targetColor", "targetWidth", "showTarget", "showZeroLevel", "startScaleValue", "endScaleValue", "tooltip", "onTooltipHidden", "onTooltipShown", "size", "margin", "disabled", "rtlEnabled", "classes", "className", "defaultCanvas", "onContentReady", "pointerEvents", "canvasChange", "canvas"]
            }
        }
    }, {
        key: "_viewComponent",
        get: function() {
            return _bullet.Bullet
        }
    }]);
    return Bullet
}(_component.default);
exports.default = Bullet;
(0, _component_registrator.default)("dxBullet", Bullet);
module.exports = exports.default;
module.exports.default = exports.default;
