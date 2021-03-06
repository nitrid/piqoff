/**
 * DevExtreme (cjs/ui/gantt/ui.gantt.export_helper.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.GanttExportHelper = void 0;
var _window = require("../../core/utils/window");
var _uiGrid_core = _interopRequireDefault(require("../grid_core/ui.grid_core.utils"));
var _type = require("../../core/utils/type");
var _date = _interopRequireDefault(require("../../localization/date"));
var _number = _interopRequireDefault(require("../../localization/number"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}
var window = (0, _window.getWindow)();
var TREELIST_EMPTY_SPACE = "dx-treelist-empty-space";
var TREELIST_TABLE = "dx-treelist-table";
var GanttExportHelper = function() {
    function GanttExportHelper(gantt) {
        this._gantt = gantt;
        this._treeList = gantt._treeList;
        this._cache = {}
    }
    var _proto = GanttExportHelper.prototype;
    _proto.reset = function() {
        this._cache = {}
    };
    _proto.getTreeListTableStyle = function() {
        var table = this._getTreeListTable();
        var style = window.getComputedStyle(table);
        return {
            color: style.color,
            backgroundColor: style.backgroundColor,
            fontSize: style.fontSize,
            fontFamily: style.fontFamily,
            fontWeight: style.fontWeight,
            fontStyle: style.fontStyle,
            textAlign: "left",
            verticalAlign: "middle"
        }
    };
    _proto.getTreeListColCount = function() {
        var headerView = this._getHeaderView();
        var widths = headerView.getColumnWidths().filter((function(w) {
            return w > 0
        }));
        return widths.length
    };
    _proto.getTreeListHeaderInfo = function(colIndex) {
        var element = this._getHeaderElement(colIndex);
        if (!element) {
            return null
        }
        var style = window.getComputedStyle(element);
        var styleForExport = {
            color: style.color,
            padding: style.padding,
            paddingLeft: style.paddingLeft,
            paddingTop: style.paddingTop,
            paddingRight: style.paddingRight,
            paddingBottom: style.paddingBottom,
            verticalAlign: style.verticalAlign,
            width: this._getColumnWidth(colIndex)
        };
        return {
            content: element.textContent,
            styles: styleForExport
        }
    };
    _proto.getTreeListCellInfo = function(rowIndex, colIndex) {
        var _cell$textContent;
        var cell = this._getDataCell(rowIndex, colIndex);
        var node = this._getNodeByRowIndex(rowIndex);
        var style = cell ? window.getComputedStyle(cell) : this._getColumnCellStyle(colIndex);
        var styleForExport = {
            color: style.color,
            padding: style.padding,
            paddingLeft: style.paddingLeft,
            paddingTop: style.paddingTop,
            paddingRight: style.paddingRight,
            paddingBottom: style.paddingBottom,
            width: this._getColumnWidth(colIndex)
        };
        if (0 === colIndex) {
            styleForExport.extraLeftPadding = this._getEmptySpaceWidth(node.level)
        }
        return {
            content: null !== (_cell$textContent = null === cell || void 0 === cell ? void 0 : cell.textContent) && void 0 !== _cell$textContent ? _cell$textContent : this._getDisplayText(rowIndex, colIndex),
            styles: styleForExport
        }
    };
    _proto._ensureColumnWidthCache = function(colIndex) {
        var _this$_cache, _this$_cache$_columnW;
        null !== (_this$_cache$_columnW = (_this$_cache = this._cache)["columnWidths"]) && void 0 !== _this$_cache$_columnW ? _this$_cache$_columnW : _this$_cache.columnWidths = {};
        if (!this._cache.columnWidths[colIndex]) {
            var _header$clientWidth;
            var header = this._getHeaderElement(colIndex);
            this._cache.columnWidths[colIndex] = null !== (_header$clientWidth = null === header || void 0 === header ? void 0 : header.clientWidth) && void 0 !== _header$clientWidth ? _header$clientWidth : 0
        }
    };
    _proto._getColumnWidth = function(colIndex) {
        this._ensureColumnWidthCache(colIndex);
        var widths = this._cache.columnWidths;
        return widths && widths[colIndex]
    };
    _proto._getEmptySpaceWidth = function(level) {
        if (!this._cache.emptyWidth) {
            var _this$_cache2, _this$_cache2$_emptyW, _element$offsetWidth;
            var element = this._getTreeListElement(TREELIST_EMPTY_SPACE);
            null !== (_this$_cache2$_emptyW = (_this$_cache2 = this._cache)["emptyWidth"]) && void 0 !== _this$_cache2$_emptyW ? _this$_cache2$_emptyW : _this$_cache2.emptyWidth = null !== (_element$offsetWidth = element.offsetWidth) && void 0 !== _element$offsetWidth ? _element$offsetWidth : 0
        }
        return this._cache.emptyWidth * (level + 1)
    };
    _proto._getColumnCellStyle = function(colIndex) {
        this._ensureColumnCellStyleCache(colIndex);
        return this._cache.columnStyles[colIndex]
    };
    _proto._ensureColumnCellStyleCache = function(colIndex) {
        var _this$_cache3, _this$_cache3$_column;
        null !== (_this$_cache3$_column = (_this$_cache3 = this._cache)["columnStyles"]) && void 0 !== _this$_cache3$_column ? _this$_cache3$_column : _this$_cache3.columnStyles = {};
        if (!this._cache.columnStyles[colIndex]) {
            var cell = this._getDataCell(0, colIndex);
            this._cache.columnStyles[colIndex] = window.getComputedStyle(cell)
        }
    };
    _proto._getTreeListTable = function() {
        return this._getTreeListElement(TREELIST_TABLE)
    };
    _proto._getTreeListElement = function(className) {
        return this._treeList._$element.find("." + className).get(0)
    };
    _proto._getDataCell = function(rowIndex, colIndex) {
        var treeList = this._treeList;
        var cellElement = treeList.getCellElement(rowIndex, colIndex);
        return cellElement && cellElement.length ? cellElement[0] : cellElement
    };
    _proto._getHeaderElement = function(index) {
        return this._getHeaderView().getHeaderElement(index).get(0)
    };
    _proto._getHeaderView = function() {
        return this._treeList._views.columnHeadersView
    };
    _proto._getNodeByRowIndex = function(rowIndex) {
        var _treeList$getKeyByRow;
        var treeList = this._treeList;
        var nodeKey = null !== (_treeList$getKeyByRow = treeList.getKeyByRowIndex(rowIndex)) && void 0 !== _treeList$getKeyByRow ? _treeList$getKeyByRow : this._findTaskKeyByRowIndex(rowIndex);
        return treeList.getNodeByKey(nodeKey)
    };
    _proto._findTaskKeyByRowIndex = function(rowIndex) {
        var tasks = this._getGanttTasks();
        var keyGetter = this._gantt._getTaskKeyGetter();
        var task = tasks[rowIndex];
        return keyGetter(task)
    };
    _proto._getGanttTasks = function() {
        var _this$_gantt$_tasksOp;
        return null === (_this$_gantt$_tasksOp = this._gantt._tasksOption) || void 0 === _this$_gantt$_tasksOp ? void 0 : _this$_gantt$_tasksOp._getItems()
    };
    _proto._getDisplayText = function(rowIndex, colIndex) {
        var tasks = this._getGanttTasks();
        var task = tasks[rowIndex];
        return task && this._getGridDisplayText(colIndex, task)
    };
    _proto._getGridDisplayText = function(colIndex, data) {
        var columns = this._treeList.getController("columns").getColumns();
        var column = columns[colIndex];
        var field = null === column || void 0 === column ? void 0 : column.dataField;
        var format = null === column || void 0 === column ? void 0 : column.format;
        var value = _uiGrid_core.default.getDisplayValue(column, data[field], data, "data");
        if ((0, _type.isDefined)(format)) {
            if ((0, _type.isDate)(value)) {
                return _date.default.format(value, format)
            }
            if ((0, _type.isNumeric)(value)) {
                return _number.default.format(value, format)
            }
        }
        return value
    };
    return GanttExportHelper
}();
exports.GanttExportHelper = GanttExportHelper;
