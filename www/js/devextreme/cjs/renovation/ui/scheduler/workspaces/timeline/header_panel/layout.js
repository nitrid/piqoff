/**
 * DevExtreme (cjs/renovation/ui/scheduler/workspaces/timeline/header_panel/layout.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.TimelineHeaderPanelLayout = exports.viewFunction = void 0;
var _inferno = require("inferno");
var _vdom = require("@devextreme/vdom");
var _layout = require("../../base/header_panel/layout");
var _layout2 = require("./date_header/layout");
var _excluded = ["baseColSpan", "className", "columnCountPerGroup", "dateCellTemplate", "dateHeaderData", "dateHeaderTemplate", "groupByDate", "groupOrientation", "groupPanelCellBaseColSpan", "groups", "height", "isRenderDateHeader", "resourceCellTemplate", "timeCellTemplate"];

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
    var _ref$props = _ref.props,
        columnCountPerGroup = _ref$props.columnCountPerGroup,
        dateCellTemplate = _ref$props.dateCellTemplate,
        dateHeaderData = _ref$props.dateHeaderData,
        groupByDate = _ref$props.groupByDate,
        groupOrientation = _ref$props.groupOrientation,
        groupPanelCellBaseColSpan = _ref$props.groupPanelCellBaseColSpan,
        groups = _ref$props.groups,
        isRenderDateHeader = _ref$props.isRenderDateHeader,
        resourceCellTemplate = _ref$props.resourceCellTemplate,
        timeCellTemplate = _ref$props.timeCellTemplate;
    return (0, _inferno.createComponentVNode)(2, _layout.HeaderPanelLayout, {
        dateHeaderTemplate: _layout2.TimelineDateHeaderLayout,
        dateHeaderData: dateHeaderData,
        groupByDate: groupByDate,
        groups: groups,
        groupOrientation: groupOrientation,
        groupPanelCellBaseColSpan: groupPanelCellBaseColSpan,
        columnCountPerGroup: columnCountPerGroup,
        isRenderDateHeader: isRenderDateHeader,
        resourceCellTemplate: resourceCellTemplate,
        dateCellTemplate: dateCellTemplate,
        timeCellTemplate: timeCellTemplate
    })
};
exports.viewFunction = viewFunction;
var getTemplate = function(TemplateProp) {
    return TemplateProp && (TemplateProp.defaultProps ? function(props) {
        return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, TemplateProp, _extends({}, props)))
    } : TemplateProp)
};
var TimelineHeaderPanelLayout = function(_InfernoWrapperCompon) {
    _inheritsLoose(TimelineHeaderPanelLayout, _InfernoWrapperCompon);

    function TimelineHeaderPanelLayout(props) {
        var _this;
        _this = _InfernoWrapperCompon.call(this, props) || this;
        _this.state = {};
        return _this
    }
    var _proto = TimelineHeaderPanelLayout.prototype;
    _proto.render = function() {
        var props = this.props;
        return viewFunction({
            props: _extends({}, props, {
                dateCellTemplate: getTemplate(props.dateCellTemplate),
                timeCellTemplate: getTemplate(props.timeCellTemplate),
                dateHeaderTemplate: getTemplate(props.dateHeaderTemplate),
                resourceCellTemplate: getTemplate(props.resourceCellTemplate)
            }),
            restAttributes: this.restAttributes
        })
    };
    _createClass(TimelineHeaderPanelLayout, [{
        key: "restAttributes",
        get: function() {
            var _this$props = this.props,
                restProps = (_this$props.baseColSpan, _this$props.className, _this$props.columnCountPerGroup, _this$props.dateCellTemplate, _this$props.dateHeaderData, _this$props.dateHeaderTemplate, _this$props.groupByDate, _this$props.groupOrientation, _this$props.groupPanelCellBaseColSpan, _this$props.groups, _this$props.height, _this$props.isRenderDateHeader, _this$props.resourceCellTemplate, _this$props.timeCellTemplate, _objectWithoutProperties(_this$props, _excluded));
            return restProps
        }
    }]);
    return TimelineHeaderPanelLayout
}(_vdom.InfernoWrapperComponent);
exports.TimelineHeaderPanelLayout = TimelineHeaderPanelLayout;
TimelineHeaderPanelLayout.defaultProps = _extends({}, _layout.HeaderPanelLayoutProps);
