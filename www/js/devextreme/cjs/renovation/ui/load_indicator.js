/**
 * DevExtreme (cjs/renovation/ui/load_indicator.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.LoadIndicator = exports.LoadIndicatorProps = exports.viewFunction = void 0;
var _inferno = require("inferno");
var _vdom = require("@devextreme/vdom");
var _load_indicator = _interopRequireDefault(require("../../ui/load_indicator"));
var _widget = require("./common/widget");
var _dom_component_wrapper = require("./common/dom_component_wrapper");
var _excluded = ["rootElementRef"],
    _excluded2 = ["_feedbackHideTimeout", "_feedbackShowTimeout", "accessKey", "activeStateEnabled", "activeStateUnit", "aria", "children", "className", "classes", "disabled", "focusStateEnabled", "height", "hint", "hoverStateEnabled", "indicatorSrc", "name", "onActive", "onClick", "onContentReady", "onDimensionChanged", "onFocusIn", "onFocusOut", "onHoverEnd", "onHoverStart", "onInactive", "onKeyDown", "onKeyboardHandled", "onVisibilityChange", "rootElementRef", "rtlEnabled", "tabIndex", "visible", "width"];

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
        componentType: _load_indicator.default,
        componentProps: componentProps
    }, restAttributes)))
};
exports.viewFunction = viewFunction;
var LoadIndicatorProps = _extends({}, _widget.WidgetProps);
exports.LoadIndicatorProps = LoadIndicatorProps;
var LoadIndicator = function(_BaseInfernoComponent) {
    _inheritsLoose(LoadIndicator, _BaseInfernoComponent);

    function LoadIndicator(props) {
        var _this;
        _this = _BaseInfernoComponent.call(this, props) || this;
        _this.state = {};
        return _this
    }
    var _proto = LoadIndicator.prototype;
    _proto.render = function() {
        var props = this.props;
        return viewFunction({
            props: _extends({}, props),
            restAttributes: this.restAttributes
        })
    };
    _createClass(LoadIndicator, [{
        key: "restAttributes",
        get: function() {
            var _this$props = this.props,
                restProps = (_this$props._feedbackHideTimeout, _this$props._feedbackShowTimeout, _this$props.accessKey, _this$props.activeStateEnabled, _this$props.activeStateUnit, _this$props.aria, _this$props.children, _this$props.className, _this$props.classes, _this$props.disabled, _this$props.focusStateEnabled, _this$props.height, _this$props.hint, _this$props.hoverStateEnabled, _this$props.indicatorSrc, _this$props.name, _this$props.onActive, _this$props.onClick, _this$props.onContentReady, _this$props.onDimensionChanged, _this$props.onFocusIn, _this$props.onFocusOut, _this$props.onHoverEnd, _this$props.onHoverStart, _this$props.onInactive, _this$props.onKeyDown, _this$props.onKeyboardHandled, _this$props.onVisibilityChange, _this$props.rootElementRef, _this$props.rtlEnabled, _this$props.tabIndex, _this$props.visible, _this$props.width, _objectWithoutProperties(_this$props, _excluded2));
            return restProps
        }
    }]);
    return LoadIndicator
}(_vdom.BaseInfernoComponent);
exports.LoadIndicator = LoadIndicator;
LoadIndicator.defaultProps = _extends({}, LoadIndicatorProps);
