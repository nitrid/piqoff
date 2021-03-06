/**
 * DevExtreme (cjs/renovation/ui/check_box.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.defaultOptions = defaultOptions;
exports.CheckBox = exports.defaultOptionRules = exports.CheckBoxProps = exports.viewFunction = void 0;
var _inferno = require("inferno");
var _vdom = require("@devextreme/vdom");
var _utils = require("../../core/options/utils");
var _devices = _interopRequireDefault(require("../../core/devices"));
var _guid = _interopRequireDefault(require("../../core/guid"));
var _ink_ripple = require("./common/ink_ripple");
var _widget = require("./common/widget");
var _themes = require("../../ui/themes");
var _base_props = require("./common/base_props");
var _combine_classes = require("../utils/combine_classes");
var _validation_message = require("./validation_message");
var _excluded = ["accessKey", "activeStateEnabled", "defaultValue", "disabled", "focusStateEnabled", "height", "hint", "hoverStateEnabled", "isValid", "name", "onClick", "onContentReady", "onFocusIn", "onKeyDown", "readOnly", "rtlEnabled", "saveValueChangeEvent", "tabIndex", "text", "useInkRipple", "validationError", "validationErrors", "validationMessageMode", "validationStatus", "value", "valueChange", "visible", "width"];

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
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

function _assertThisInitialized(self) {
    if (void 0 === self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
    }
    return self
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
var getCssClasses = function(model) {
    var isValid = model.isValid,
        readOnly = model.readOnly,
        text = model.text,
        value = model.value;
    var checked = value;
    var indeterminate = null === checked;
    var classesMap = {
        "dx-checkbox": true,
        "dx-state-readonly": !!readOnly,
        "dx-checkbox-checked": !!checked,
        "dx-checkbox-has-text": !!text,
        "dx-invalid": !isValid,
        "dx-checkbox-indeterminate": indeterminate
    };
    return (0, _combine_classes.combineClasses)(classesMap)
};
var inkRippleConfig = {
    waveSizeCoefficient: 2.5,
    useHoldAnimation: false,
    wavesNumber: 2,
    isCentered: true
};
var viewFunction = function(viewModel) {
    var _viewModel$props = viewModel.props,
        name = _viewModel$props.name,
        text = _viewModel$props.text;
    return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, _widget.Widget, _extends({
        rootElementRef: viewModel.target,
        accessKey: viewModel.props.accessKey,
        activeStateEnabled: viewModel.props.activeStateEnabled,
        classes: viewModel.cssClasses,
        disabled: viewModel.props.disabled,
        focusStateEnabled: viewModel.props.focusStateEnabled,
        height: viewModel.props.height,
        hint: viewModel.props.hint,
        hoverStateEnabled: viewModel.props.hoverStateEnabled,
        onActive: viewModel.onActive,
        onFocusIn: viewModel.onFocusIn,
        onFocusOut: viewModel.onFocusOut,
        aria: viewModel.aria,
        onContentReady: viewModel.props.onContentReady,
        onClick: viewModel.onWidgetClick,
        onInactive: viewModel.onInactive,
        onKeyDown: viewModel.onWidgetKeyDown,
        rtlEnabled: viewModel.props.rtlEnabled,
        tabIndex: viewModel.props.tabIndex,
        visible: viewModel.props.visible,
        width: viewModel.props.width
    }, viewModel.restAttributes, {
        children: [(0, _inferno.normalizeProps)((0, _inferno.createVNode)(64, "input", null, null, 1, _extends({
            type: "hidden",
            value: "".concat(viewModel.props.value)
        }, name && {
            name: name
        }), null, viewModel.inputRef)), (0, _inferno.createVNode)(1, "div", "dx-checkbox-container", [(0, _inferno.createVNode)(1, "span", "dx-checkbox-icon", null, 1, null, null, viewModel.iconRef), text && (0, _inferno.createVNode)(1, "span", "dx-checkbox-text", text, 0)], 0), viewModel.props.useInkRipple && (0, _inferno.createComponentVNode)(2, _ink_ripple.InkRipple, {
            config: inkRippleConfig
        }, null, viewModel.inkRippleRef), viewModel.showValidationMessage && (0, _inferno.createComponentVNode)(2, _validation_message.ValidationMessage, {
            validationErrors: viewModel.validationErrors,
            mode: viewModel.props.validationMessageMode,
            positionRequest: "below",
            rtlEnabled: viewModel.props.rtlEnabled,
            target: viewModel.targetCurrent,
            boundary: viewModel.targetCurrent,
            container: viewModel.targetCurrent
        })]
    }), null, viewModel.widgetRef))
};
exports.viewFunction = viewFunction;
var CheckBoxProps = _extends({}, _base_props.BaseWidgetProps, {
    activeStateEnabled: true,
    hoverStateEnabled: true,
    validationError: null,
    validationErrors: null,
    text: "",
    validationMessageMode: "auto",
    validationStatus: "valid",
    name: "",
    readOnly: false,
    isValid: true,
    useInkRipple: false,
    defaultValue: false,
    valueChange: function() {}
});
exports.CheckBoxProps = CheckBoxProps;
var defaultOptionRules = (0, _utils.createDefaultOptionRules)([{
    device: function() {
        return "desktop" === _devices.default.real().deviceType && !_devices.default.isSimulator()
    },
    options: {
        focusStateEnabled: true
    }
}, {
    device: function() {
        return (0, _themes.isMaterial)((0, _themes.current)())
    },
    options: {
        useInkRipple: false
    }
}]);
exports.defaultOptionRules = defaultOptionRules;
var CheckBox = function(_InfernoWrapperCompon) {
    _inheritsLoose(CheckBox, _InfernoWrapperCompon);

    function CheckBox(props) {
        var _this;
        _this = _InfernoWrapperCompon.call(this, props) || this;
        _this._currentState = null;
        _this.iconRef = (0, _inferno.createRef)();
        _this.inkRippleRef = (0, _inferno.createRef)();
        _this.inputRef = (0, _inferno.createRef)();
        _this.widgetRef = (0, _inferno.createRef)();
        _this.target = (0, _inferno.createRef)();
        _this.state = {
            showValidationMessage: false,
            value: void 0 !== _this.props.value ? _this.props.value : _this.props.defaultValue
        };
        _this.updateValidationMessageVisibility = _this.updateValidationMessageVisibility.bind(_assertThisInitialized(_this));
        _this.focus = _this.focus.bind(_assertThisInitialized(_this));
        _this.contentReadyEffect = _this.contentReadyEffect.bind(_assertThisInitialized(_this));
        _this.onActive = _this.onActive.bind(_assertThisInitialized(_this));
        _this.onInactive = _this.onInactive.bind(_assertThisInitialized(_this));
        _this.onFocusIn = _this.onFocusIn.bind(_assertThisInitialized(_this));
        _this.onFocusOut = _this.onFocusOut.bind(_assertThisInitialized(_this));
        _this.onWidgetClick = _this.onWidgetClick.bind(_assertThisInitialized(_this));
        _this.onWidgetKeyDown = _this.onWidgetKeyDown.bind(_assertThisInitialized(_this));
        _this.wave = _this.wave.bind(_assertThisInitialized(_this));
        return _this
    }
    var _proto = CheckBox.prototype;
    _proto.createEffects = function() {
        return [new _vdom.InfernoEffect(this.updateValidationMessageVisibility, [this.props.isValid, this.props.validationStatus, this.props.validationError, this.props.validationErrors]), new _vdom.InfernoEffect(this.contentReadyEffect, [this.props.onContentReady])]
    };
    _proto.updateEffects = function() {
        var _this$_effects$, _this$_effects$2;
        null === (_this$_effects$ = this._effects[0]) || void 0 === _this$_effects$ ? void 0 : _this$_effects$.update([this.props.isValid, this.props.validationStatus, this.props.validationError, this.props.validationErrors]);
        null === (_this$_effects$2 = this._effects[1]) || void 0 === _this$_effects$2 ? void 0 : _this$_effects$2.update([this.props.onContentReady])
    };
    _proto.set_showValidationMessage = function(value) {
        var _this2 = this;
        this.setState((function(state) {
            _this2._currentState = state;
            var newValue = value();
            _this2._currentState = null;
            return {
                showValidationMessage: newValue
            }
        }))
    };
    _proto.set_value = function(value) {
        var _this3 = this;
        this.setState((function(state) {
            _this3._currentState = state;
            var newValue = value();
            _this3.props.valueChange(newValue);
            _this3._currentState = null;
            return {
                value: newValue
            }
        }))
    };
    _proto.updateValidationMessageVisibility = function() {
        var _this4 = this;
        this.set_showValidationMessage((function() {
            return _this4.shouldShowValidationMessage
        }))
    };
    _proto.contentReadyEffect = function() {
        var onContentReady = this.props.onContentReady;
        null === onContentReady || void 0 === onContentReady ? void 0 : onContentReady({})
    };
    _proto.onActive = function(event) {
        this.wave(event, "showWave", 1)
    };
    _proto.onInactive = function(event) {
        this.wave(event, "hideWave", 1)
    };
    _proto.onFocusIn = function(event) {
        var onFocusIn = this.props.onFocusIn;
        this.wave(event, "showWave", 0);
        null === onFocusIn || void 0 === onFocusIn ? void 0 : onFocusIn(event)
    };
    _proto.onFocusOut = function(event) {
        this.wave(event, "hideWave", 0)
    };
    _proto.onWidgetClick = function(event) {
        var _this5 = this;
        var _this$props = this.props,
            readOnly = _this$props.readOnly,
            saveValueChangeEvent = _this$props.saveValueChangeEvent;
        if (!readOnly) {
            null === saveValueChangeEvent || void 0 === saveValueChangeEvent ? void 0 : saveValueChangeEvent(event);
            this.set_value((function() {
                return !_this5.__state_value
            }))
        }
    };
    _proto.onWidgetKeyDown = function(options) {
        var onKeyDown = this.props.onKeyDown;
        var keyName = options.keyName,
            originalEvent = options.originalEvent,
            which = options.which;
        var result = null === onKeyDown || void 0 === onKeyDown ? void 0 : onKeyDown(options);
        if (null !== result && void 0 !== result && result.cancel) {
            return result
        }
        if ("space" === keyName || "space" === which) {
            originalEvent.preventDefault();
            this.onWidgetClick(originalEvent)
        }
        return
    };
    _proto.wave = function(event, type, waveId) {
        var useInkRipple = this.props.useInkRipple;
        useInkRipple && this.inkRippleRef.current[type]({
            element: this.iconRef.current,
            event: event,
            wave: waveId
        })
    };
    _proto.focus = function() {
        this.widgetRef.current.focus()
    };
    _proto.render = function() {
        var props = this.props;
        return viewFunction({
            props: _extends({}, props, {
                value: this.__state_value
            }),
            showValidationMessage: this.showValidationMessage,
            iconRef: this.iconRef,
            inputRef: this.inputRef,
            target: this.target,
            inkRippleRef: this.inkRippleRef,
            widgetRef: this.widgetRef,
            onActive: this.onActive,
            onInactive: this.onInactive,
            onFocusIn: this.onFocusIn,
            onFocusOut: this.onFocusOut,
            onWidgetClick: this.onWidgetClick,
            onWidgetKeyDown: this.onWidgetKeyDown,
            cssClasses: this.cssClasses,
            shouldShowValidationMessage: this.shouldShowValidationMessage,
            aria: this.aria,
            validationErrors: this.validationErrors,
            targetCurrent: this.targetCurrent,
            wave: this.wave,
            restAttributes: this.restAttributes
        })
    };
    _createClass(CheckBox, [{
        key: "showValidationMessage",
        get: function() {
            var state = this._currentState || this.state;
            return state.showValidationMessage
        }
    }, {
        key: "__state_value",
        get: function() {
            var state = this._currentState || this.state;
            return void 0 !== this.props.value ? this.props.value : state.value
        }
    }, {
        key: "cssClasses",
        get: function() {
            return getCssClasses(_extends({}, this.props, {
                value: this.__state_value
            }))
        }
    }, {
        key: "shouldShowValidationMessage",
        get: function() {
            var _this$validationError;
            var _this$props2 = this.props,
                isValid = _this$props2.isValid,
                validationStatus = _this$props2.validationStatus;
            return !isValid && "invalid" === validationStatus && !!(null !== (_this$validationError = this.validationErrors) && void 0 !== _this$validationError && _this$validationError.length)
        }
    }, {
        key: "aria",
        get: function() {
            var _this$props3 = this.props,
                isValid = _this$props3.isValid,
                readOnly = _this$props3.readOnly;
            var checked = !!this.__state_value;
            var indeterminate = null === this.__state_value;
            var result = {
                role: "checkbox",
                checked: indeterminate ? "mixed" : "".concat(checked),
                readonly: readOnly ? "true" : "false",
                invalid: !isValid ? "true" : "false"
            };
            if (this.shouldShowValidationMessage) {
                result.describedby = "dx-".concat(new _guid.default)
            }
            return result
        }
    }, {
        key: "validationErrors",
        get: function() {
            var _this$props4 = this.props,
                validationError = _this$props4.validationError,
                validationErrors = _this$props4.validationErrors;
            var allValidationErrors = validationErrors;
            if (!allValidationErrors && validationError) {
                allValidationErrors = [validationError]
            }
            return allValidationErrors
        }
    }, {
        key: "targetCurrent",
        get: function() {
            var _this$target;
            return null === (_this$target = this.target) || void 0 === _this$target ? void 0 : _this$target.current
        }
    }, {
        key: "restAttributes",
        get: function() {
            var _this$props$value = _extends({}, this.props, {
                    value: this.__state_value
                }),
                restProps = (_this$props$value.accessKey, _this$props$value.activeStateEnabled, _this$props$value.defaultValue, _this$props$value.disabled, _this$props$value.focusStateEnabled, _this$props$value.height, _this$props$value.hint, _this$props$value.hoverStateEnabled, _this$props$value.isValid, _this$props$value.name, _this$props$value.onClick, _this$props$value.onContentReady, _this$props$value.onFocusIn, _this$props$value.onKeyDown, _this$props$value.readOnly, _this$props$value.rtlEnabled, _this$props$value.saveValueChangeEvent, _this$props$value.tabIndex, _this$props$value.text, _this$props$value.useInkRipple, _this$props$value.validationError, _this$props$value.validationErrors, _this$props$value.validationMessageMode, _this$props$value.validationStatus, _this$props$value.value, _this$props$value.valueChange, _this$props$value.visible, _this$props$value.width, _objectWithoutProperties(_this$props$value, _excluded));
            return restProps
        }
    }]);
    return CheckBox
}(_vdom.InfernoWrapperComponent);
exports.CheckBox = CheckBox;

function __processTwoWayProps(defaultProps) {
    var twoWayProps = ["value"];
    return Object.keys(defaultProps).reduce((function(props, propName) {
        var propValue = defaultProps[propName];
        var defaultPropName = twoWayProps.some((function(p) {
            return p === propName
        })) ? "default" + propName.charAt(0).toUpperCase() + propName.slice(1) : propName;
        props[defaultPropName] = propValue;
        return props
    }), {})
}

function __createDefaultProps() {
    return _extends({}, CheckBoxProps, __processTwoWayProps((0, _utils.convertRulesToOptions)(defaultOptionRules)))
}
CheckBox.defaultProps = __createDefaultProps();
var __defaultOptionRules = [];

function defaultOptions(rule) {
    __defaultOptionRules.push(rule);
    CheckBox.defaultProps = _extends({}, __createDefaultProps(), __processTwoWayProps((0, _utils.convertRulesToOptions)(__defaultOptionRules)))
}
