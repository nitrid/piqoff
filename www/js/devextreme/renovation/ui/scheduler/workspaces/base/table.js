/**
 * DevExtreme (renovation/ui/scheduler/workspaces/base/table.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.Table = exports.TableProps = exports.viewFunction = void 0;
var _inferno = require("inferno");
var _vdom = require("@devextreme/vdom");
var _utils = require("../utils");
var _virtual_row = require("./virtual_row");
var _excluded = ["bottomVirtualRowHeight", "children", "className", "height", "leftVirtualCellCount", "leftVirtualCellWidth", "rightVirtualCellCount", "rightVirtualCellWidth", "topVirtualRowHeight", "virtualCellsCount"];

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
var viewFunction = function(_ref) {
    var hasBottomVirtualRow = _ref.hasBottomVirtualRow,
        hasTopVirtualRow = _ref.hasTopVirtualRow,
        _ref$props = _ref.props,
        bottomVirtualRowHeight = _ref$props.bottomVirtualRowHeight,
        children = _ref$props.children,
        className = _ref$props.className,
        leftVirtualCellCount = _ref$props.leftVirtualCellCount,
        leftVirtualCellWidth = _ref$props.leftVirtualCellWidth,
        rightVirtualCellCount = _ref$props.rightVirtualCellCount,
        rightVirtualCellWidth = _ref$props.rightVirtualCellWidth,
        topVirtualRowHeight = _ref$props.topVirtualRowHeight,
        virtualCellsCount = _ref$props.virtualCellsCount,
        restAttributes = _ref.restAttributes,
        style = _ref.style;
    return (0, _inferno.normalizeProps)((0, _inferno.createVNode)(1, "table", className, (0, _inferno.createVNode)(1, "tbody", null, [hasTopVirtualRow && (0, _inferno.createComponentVNode)(2, _virtual_row.VirtualRow, {
        height: topVirtualRowHeight,
        cellsCount: virtualCellsCount,
        leftVirtualCellWidth: leftVirtualCellWidth,
        rightVirtualCellWidth: rightVirtualCellWidth,
        leftVirtualCellCount: leftVirtualCellCount,
        rightVirtualCellCount: rightVirtualCellCount
    }), children, hasBottomVirtualRow && (0, _inferno.createComponentVNode)(2, _virtual_row.VirtualRow, {
        height: bottomVirtualRowHeight,
        cellsCount: virtualCellsCount,
        leftVirtualCellWidth: leftVirtualCellWidth,
        rightVirtualCellWidth: rightVirtualCellWidth,
        leftVirtualCellCount: leftVirtualCellCount,
        rightVirtualCellCount: rightVirtualCellCount
    })], 0), 2, _extends({}, restAttributes, {
        style: (0, _vdom.normalizeStyles)(style)
    })))
};
exports.viewFunction = viewFunction;
var TableProps = {
    className: "",
    topVirtualRowHeight: 0,
    bottomVirtualRowHeight: 0,
    leftVirtualCellWidth: 0,
    rightVirtualCellWidth: 0,
    virtualCellsCount: 0
};
exports.TableProps = TableProps;
var Table = function(_BaseInfernoComponent) {
    _inheritsLoose(Table, _BaseInfernoComponent);

    function Table(props) {
        var _this;
        _this = _BaseInfernoComponent.call(this, props) || this;
        _this.state = {};
        return _this
    }
    var _proto = Table.prototype;
    _proto.render = function() {
        var props = this.props;
        return viewFunction({
            props: _extends({}, props),
            style: this.style,
            hasTopVirtualRow: this.hasTopVirtualRow,
            hasBottomVirtualRow: this.hasBottomVirtualRow,
            restAttributes: this.restAttributes
        })
    };
    _createClass(Table, [{
        key: "style",
        get: function() {
            var height = this.props.height;
            var style = this.restAttributes.style;
            return (0, _utils.addHeightToStyle)(height, style)
        }
    }, {
        key: "hasTopVirtualRow",
        get: function() {
            var topVirtualRowHeight = this.props.topVirtualRowHeight;
            return !!topVirtualRowHeight
        }
    }, {
        key: "hasBottomVirtualRow",
        get: function() {
            var bottomVirtualRowHeight = this.props.bottomVirtualRowHeight;
            return !!bottomVirtualRowHeight
        }
    }, {
        key: "restAttributes",
        get: function() {
            var _this$props = this.props,
                restProps = (_this$props.bottomVirtualRowHeight, _this$props.children, _this$props.className, _this$props.height, _this$props.leftVirtualCellCount, _this$props.leftVirtualCellWidth, _this$props.rightVirtualCellCount, _this$props.rightVirtualCellWidth, _this$props.topVirtualRowHeight, _this$props.virtualCellsCount, _objectWithoutProperties(_this$props, _excluded));
            return restProps
        }
    }]);
    return Table
}(_vdom.BaseInfernoComponent);
exports.Table = Table;
Table.defaultProps = _extends({}, TableProps);
