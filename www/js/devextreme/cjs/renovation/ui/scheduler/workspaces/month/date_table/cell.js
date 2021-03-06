/**
 * DevExtreme (cjs/renovation/ui/scheduler/workspaces/month/date_table/cell.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.MonthDateTableCell = exports.viewFunction = void 0;
var _inferno = require("inferno");
var _vdom = require("@devextreme/vdom");
var _combine_classes = require("../../../../../utils/combine_classes");
var _cell = require("../../base/date_table/cell");
var _excluded = ["allDay", "children", "className", "contentTemplate", "contentTemplateProps", "dataCellTemplate", "endDate", "firstDayOfMonth", "groupIndex", "groups", "index", "isFirstGroupCell", "isLastGroupCell", "otherMonth", "startDate", "text", "today"];

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

function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        })
    } else {
        obj[key] = value
    }
    return obj
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
    var classes = _ref.classes,
        contentTemplateProps = _ref.contentTemplateProps,
        _ref$props = _ref.props,
        dataCellTemplate = _ref$props.dataCellTemplate,
        endDate = _ref$props.endDate,
        groupIndex = _ref$props.groupIndex,
        groups = _ref$props.groups,
        index = _ref$props.index,
        isFirstGroupCell = _ref$props.isFirstGroupCell,
        isLastGroupCell = _ref$props.isLastGroupCell,
        startDate = _ref$props.startDate,
        text = _ref$props.text;
    return (0, _inferno.createComponentVNode)(2, _cell.DateTableCellBase, {
        className: classes,
        dataCellTemplate: dataCellTemplate,
        startDate: startDate,
        endDate: endDate,
        text: text,
        groups: groups,
        groupIndex: groupIndex,
        index: index,
        isFirstGroupCell: isFirstGroupCell,
        isLastGroupCell: isLastGroupCell,
        contentTemplateProps: contentTemplateProps,
        children: (0, _inferno.createVNode)(1, "div", "dx-scheduler-date-table-cell-text", text, 0)
    })
};
exports.viewFunction = viewFunction;
var getTemplate = function(TemplateProp) {
    return TemplateProp && (TemplateProp.defaultProps ? function(props) {
        return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, TemplateProp, _extends({}, props)))
    } : TemplateProp)
};
var MonthDateTableCell = function(_BaseInfernoComponent) {
    _inheritsLoose(MonthDateTableCell, _BaseInfernoComponent);

    function MonthDateTableCell(props) {
        var _this;
        _this = _BaseInfernoComponent.call(this, props) || this;
        _this.state = {};
        return _this
    }
    var _proto = MonthDateTableCell.prototype;
    _proto.render = function() {
        var props = this.props;
        return viewFunction({
            props: _extends({}, props, {
                dataCellTemplate: getTemplate(props.dataCellTemplate),
                contentTemplate: getTemplate(props.contentTemplate)
            }),
            classes: this.classes,
            contentTemplateProps: this.contentTemplateProps,
            restAttributes: this.restAttributes
        })
    };
    _createClass(MonthDateTableCell, [{
        key: "classes",
        get: function() {
            var _this$props = this.props,
                className = _this$props.className,
                firstDayOfMonth = _this$props.firstDayOfMonth,
                otherMonth = _this$props.otherMonth,
                today = _this$props.today;
            return (0, _combine_classes.combineClasses)(_defineProperty({
                "dx-scheduler-date-table-other-month": !!otherMonth,
                "dx-scheduler-date-table-current-date": !!today,
                "dx-scheduler-date-table-first-of-month": !!firstDayOfMonth
            }, className, !!className))
        }
    }, {
        key: "contentTemplateProps",
        get: function() {
            var _this$props2 = this.props,
                index = _this$props2.index,
                text = _this$props2.text;
            return {
                data: {
                    text: text
                },
                index: index
            }
        }
    }, {
        key: "restAttributes",
        get: function() {
            var _this$props3 = this.props,
                restProps = (_this$props3.allDay, _this$props3.children, _this$props3.className, _this$props3.contentTemplate, _this$props3.contentTemplateProps, _this$props3.dataCellTemplate, _this$props3.endDate, _this$props3.firstDayOfMonth, _this$props3.groupIndex, _this$props3.groups, _this$props3.index, _this$props3.isFirstGroupCell, _this$props3.isLastGroupCell, _this$props3.otherMonth, _this$props3.startDate, _this$props3.text, _this$props3.today, _objectWithoutProperties(_this$props3, _excluded));
            return restProps
        }
    }]);
    return MonthDateTableCell
}(_vdom.BaseInfernoComponent);
exports.MonthDateTableCell = MonthDateTableCell;
MonthDateTableCell.defaultProps = _extends({}, _cell.DateTableCellBaseProps);
