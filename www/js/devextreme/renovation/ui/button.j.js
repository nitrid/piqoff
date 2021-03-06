/**
 * DevExtreme (renovation/ui/button.j.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../core/component_registrator"));
var _button = _interopRequireDefault(require("../component_wrapper/button"));
var _button2 = require("./button");

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
var Button = function(_BaseComponent) {
    _inheritsLoose(Button, _BaseComponent);

    function Button() {
        return _BaseComponent.apply(this, arguments) || this
    }
    var _proto = Button.prototype;
    _proto.getProps = function() {
        var props = _BaseComponent.prototype.getProps.call(this);
        props.onKeyDown = this._wrapKeyDownHandler(props.onKeyDown);
        return props
    };
    _proto.focus = function() {
        var _this$viewRef;
        return null === (_this$viewRef = this.viewRef) || void 0 === _this$viewRef ? void 0 : _this$viewRef.focus()
    };
    _proto._getActionConfigs = function() {
        return {
            onClick: {
                excludeValidators: ["readOnly"]
            },
            onSubmit: {},
            onContentReady: {
                excludeValidators: ["disabled", "readOnly"]
            }
        }
    };
    _createClass(Button, [{
        key: "_propsInfo",
        get: function() {
            return {
                twoWay: [],
                allowNull: [],
                elements: ["onSubmit"],
                templates: ["template"],
                props: ["activeStateEnabled", "hoverStateEnabled", "icon", "iconPosition", "onClick", "onSubmit", "pressed", "stylingMode", "template", "text", "type", "useInkRipple", "useSubmitBehavior", "validationGroup", "accessKey", "disabled", "focusStateEnabled", "height", "hint", "onContentReady", "onKeyDown", "rtlEnabled", "tabIndex", "visible", "width"]
            }
        }
    }, {
        key: "_viewComponent",
        get: function() {
            return _button2.Button
        }
    }]);
    return Button
}(_button.default);
exports.default = Button;
(0, _component_registrator.default)("dxButton", Button);
module.exports = exports.default;
module.exports.default = exports.default;
