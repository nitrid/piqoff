/**
 * DevExtreme (renovation/component_wrapper/data_grid.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.default = void 0;
var _component = _interopRequireDefault(require("./component"));
var _uiData_grid = _interopRequireDefault(require("../../ui/data_grid/ui.data_grid.core"));
var _utils = require("./utils");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
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
var DataGridWrapper = function(_Component) {
    _inheritsLoose(DataGridWrapper, _Component);

    function DataGridWrapper() {
        return _Component.apply(this, arguments) || this
    }
    var _proto = DataGridWrapper.prototype;
    _proto.beginUpdate = function() {
        var _this$viewRef;
        var gridInstance = null === (_this$viewRef = this.viewRef) || void 0 === _this$viewRef ? void 0 : _this$viewRef.getComponentInstance();
        _Component.prototype.beginUpdate.call(this);
        null === gridInstance || void 0 === gridInstance ? void 0 : gridInstance.beginUpdate()
    };
    _proto.endUpdate = function() {
        var _this$viewRef2;
        var gridInstance = null === (_this$viewRef2 = this.viewRef) || void 0 === _this$viewRef2 ? void 0 : _this$viewRef2.getComponentInstance();
        _Component.prototype.endUpdate.call(this);
        null === gridInstance || void 0 === gridInstance ? void 0 : gridInstance.endUpdate()
    };
    _proto.isReady = function() {
        var _this$viewRef3;
        var gridInstance = null === (_this$viewRef3 = this.viewRef) || void 0 === _this$viewRef3 ? void 0 : _this$viewRef3.getComponentInstance();
        return null === gridInstance || void 0 === gridInstance ? void 0 : gridInstance.isReady()
    };
    _proto.getView = function(name) {
        var _this$viewRef4;
        var gridInstance = null === (_this$viewRef4 = this.viewRef) || void 0 === _this$viewRef4 ? void 0 : _this$viewRef4.getComponentInstance();
        return null === gridInstance || void 0 === gridInstance ? void 0 : gridInstance.getView(name)
    };
    _proto.getController = function(name) {
        var _this$viewRef5;
        var gridInstance = null === (_this$viewRef5 = this.viewRef) || void 0 === _this$viewRef5 ? void 0 : _this$viewRef5.getComponentInstance();
        return null === gridInstance || void 0 === gridInstance ? void 0 : gridInstance.getController(name)
    };
    _proto.state = function(_state) {
        var _this$viewRef6;
        var gridInstance = null === (_this$viewRef6 = this.viewRef) || void 0 === _this$viewRef6 ? void 0 : _this$viewRef6.getComponentInstance();
        return null === gridInstance || void 0 === gridInstance ? void 0 : gridInstance.state(_state)
    };
    _proto._wrapKeyDownHandler = function(handler) {
        return handler
    };
    _proto._optionChanging = function(fullName, value, prevValue) {
        _Component.prototype._optionChanging.call(this, fullName, value, prevValue);
        if (this.viewRef) {
            var name = fullName.split(/[.[]/)[0];
            var prevProps = _extends({}, this.viewRef.prevProps);
            (0, _utils.updatePropsImmutable)(prevProps, this.option(), name, fullName);
            this.viewRef.prevProps = prevProps
        }
    };
    _proto._optionChanged = function(e) {
        var _this$viewRef7, _this$viewRef7$getCom;
        var gridInstance = null === (_this$viewRef7 = this.viewRef) || void 0 === _this$viewRef7 ? void 0 : null === (_this$viewRef7$getCom = _this$viewRef7.getComponentInstance) || void 0 === _this$viewRef7$getCom ? void 0 : _this$viewRef7$getCom.call(_this$viewRef7);
        if ("dataSource" === e.fullName && e.value === (null === gridInstance || void 0 === gridInstance ? void 0 : gridInstance.option("dataSource"))) {
            null === gridInstance || void 0 === gridInstance ? void 0 : gridInstance.option("dataSource", e.value)
        }
        _Component.prototype._optionChanged.call(this, e)
    };
    _proto._createTemplateComponent = function(templateOption) {
        return templateOption
    };
    _proto._initializeComponent = function() {
        var options = this.option();
        this._onInitialized = options.onInitialized;
        options.onInitialized = null;
        _Component.prototype._initializeComponent.call(this)
    };
    _proto._patchOptionValues = function(options) {
        options.onInitialized = this._onInitialized;
        return _Component.prototype._patchOptionValues.call(this, options)
    };
    _proto._setOptionsByReference = function() {
        _Component.prototype._setOptionsByReference.call(this);
        this._optionsByReference.focusedRowKey = true;
        this._optionsByReference["editing.editRowKey"] = true;
        this._optionsByReference["editing.changes"] = true
    };
    _proto._setDeprecatedOptions = function() {
        _Component.prototype._setDeprecatedOptions.call(this);
        this._deprecatedOptions.useKeyboard = {
            since: "19.2",
            alias: "keyboardNavigation.enabled"
        }
    };
    return DataGridWrapper
}(_component.default);
exports.default = DataGridWrapper;
DataGridWrapper.registerModule = _uiData_grid.default.registerModule.bind(_uiData_grid.default);
module.exports = exports.default;
module.exports.default = exports.default;
