/**
 * DevExtreme (renovation/ui/number_box.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.NumberBox = exports.NumberBoxProps = exports.viewFunction = void 0;
var _inferno = require("inferno");
var _vdom = require("@devextreme/vdom");
var _number_box = _interopRequireDefault(require("../../ui/number_box"));
var _widget = require("./common/widget");
var _dom_component_wrapper = require("./common/dom_component_wrapper");
var _excluded = ["rootElementRef"],
    _excluded2 = ["_feedbackHideTimeout", "_feedbackShowTimeout", "accessKey", "activeStateEnabled", "activeStateUnit", "aria", "children", "className", "classes", "defaultValue", "disabled", "focusStateEnabled", "height", "hint", "hoverStateEnabled", "invalidValueMessage", "max", "min", "mode", "name", "onActive", "onClick", "onContentReady", "onDimensionChanged", "onFocusIn", "onFocusOut", "onHoverEnd", "onHoverStart", "onInactive", "onKeyDown", "onKeyboardHandled", "onVisibilityChange", "rootElementRef", "rtlEnabled", "showSpinButtons", "step", "tabIndex", "useLargeSpinButtons", "value", "valueChange", "visible", "width"];

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

function _objectWithoutProperties(source, excluded) {
    if (null == source) {
        return {}
    }
    var target = _objectWithoutPropertiesLoose(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for (i = 0; i < sourceSymbolKeys.length; i++) {
            key = sourceSymbolKeys[i];
            if (excluded.indexOf(key) >= 0) {
                continue
            }
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) {
                continue
            }
            target[key] = source[key]
        }
    }
    return target
}

function _objectWithoutPropertiesLoose(source, excluded) {
    if (null == source) {
        return {}
    }
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for (i = 0; i < sourceKeys.length; i++) {
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) {
            continue
        }
        target[key] = source[key]
    }
    return target
}
var viewFunction = function(_ref) {
    var _ref$props = _ref.props,
        rootElementRef = _ref$props.rootElementRef,
        componentProps = _objectWithoutProperties(_ref$props, _excluded),
        restAttributes = _ref.restAttributes;
    return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, _dom_component_wrapper.DomComponentWrapper, _extends({
        rootElementRef: rootElementRef,
        componentType: _number_box.default,
        componentProps: componentProps
    }, restAttributes)))
};
exports.viewFunction = viewFunction;
var NumberBoxProps = _extends({}, _widget.WidgetProps, {
    focusStateEnabled: true,
    hoverStateEnabled: true,
    defaultValue: 0
});
exports.NumberBoxProps = NumberBoxProps;
var NumberBox = function(_BaseInfernoComponent) {
    _inheritsLoose(NumberBox, _BaseInfernoComponent);

    function NumberBox(props) {
        var _this;
        _this = _BaseInfernoComponent.call(this, props) || this;
        _this._currentState = null;
        _this.state = {
            value: void 0 !== _this.props.value ? _this.props.value : _this.props.defaultValue
        };
        return _this
    }
    var _proto = NumberBox.prototype;
    _proto.set_value = function(value) {
        var _this2 = this;
        this.setState((function(state) {
            var _this2$props$valueCha, _this2$props;
            _this2._currentState = state;
            var newValue = value();
            null === (_this2$props$valueCha = (_this2$props = _this2.props).valueChange) || void 0 === _this2$props$valueCha ? void 0 : _this2$props$valueCha.call(_this2$props, newValue);
            _this2._currentState = null;
            return {
                value: newValue
            }
        }))
    };
    _proto.render = function() {
        var props = this.props;
        return viewFunction({
            props: _extends({}, props, {
                value: this.__state_value
            }),
            restAttributes: this.restAttributes
        })
    };
    _createClass(NumberBox, [{
        key: "__state_value",
        get: function() {
            var state = this._currentState || this.state;
            return void 0 !== this.props.value ? this.props.value : state.value
        }
    }, {
        key: "restAttributes",
        get: function() {
            var _this$props$value = _extends({}, this.props, {
                    value: this.__state_value
                }),
                restProps = (_this$props$value._feedbackHideTimeout, _this$props$value._feedbackShowTimeout, _this$props$value.accessKey, _this$props$value.activeStateEnabled, _this$props$value.activeStateUnit, _this$props$value.aria, _this$props$value.children, _this$props$value.className, _this$props$value.classes, _this$props$value.defaultValue, _this$props$value.disabled, _this$props$value.focusStateEnabled, _this$props$value.height, _this$props$value.hint, _this$props$value.hoverStateEnabled, _this$props$value.invalidValueMessage, _this$props$value.max, _this$props$value.min, _this$props$value.mode, _this$props$value.name, _this$props$value.onActive, _this$props$value.onClick, _this$props$value.onContentReady, _this$props$value.onDimensionChanged, _this$props$value.onFocusIn, _this$props$value.onFocusOut, _this$props$value.onHoverEnd, _this$props$value.onHoverStart, _this$props$value.onInactive, _this$props$value.onKeyDown, _this$props$value.onKeyboardHandled, _this$props$value.onVisibilityChange, _this$props$value.rootElementRef, _this$props$value.rtlEnabled, _this$props$value.showSpinButtons, _this$props$value.step, _this$props$value.tabIndex, _this$props$value.useLargeSpinButtons, _this$props$value.value, _this$props$value.valueChange, _this$props$value.visible, _this$props$value.width, _objectWithoutProperties(_this$props$value, _excluded2));
            return restProps
        }
    }]);
    return NumberBox
}(_vdom.BaseInfernoComponent);
exports.NumberBox = NumberBox;
NumberBox.defaultProps = _extends({}, NumberBoxProps);
