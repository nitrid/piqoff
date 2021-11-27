/**
 * DevExtreme (cjs/ui/gantt/ui.gantt.size_helper.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.GanttSizeHelper = void 0;
var _window = require("../../core/utils/window");
var GanttSizeHelper = function() {
    function GanttSizeHelper(gantt) {
        this._gantt = gantt
    }
    var _proto = GanttSizeHelper.prototype;
    _proto._setTreeListDimension = function(dimension, value) {
        var _this$_gantt$_ganttTr;
        this._gantt._$treeListWrapper[dimension](value);
        null === (_this$_gantt$_ganttTr = this._gantt._ganttTreeList) || void 0 === _this$_gantt$_ganttTr ? void 0 : _this$_gantt$_ganttTr.setOption(dimension, this._gantt._$treeListWrapper[dimension]())
    };
    _proto._setGanttViewDimension = function(dimension, value) {
        this._gantt._$ganttView[dimension](value);
        this._gantt._setGanttViewOption(dimension, this._gantt._$ganttView[dimension]())
    };
    _proto._getPanelsWidthByOption = function() {
        return {
            leftPanelWidth: this._gantt.option("taskListWidth"),
            rightPanelWidth: this._gantt._$element.width() - this._gantt.option("taskListWidth")
        }
    };
    _proto.onAdjustControl = function() {
        var elementHeight = this._gantt._$element.height();
        this.updateGanttWidth();
        this.setGanttHeight(elementHeight)
    };
    _proto.onApplyPanelSize = function(e) {
        this.setInnerElementsWidth(e);
        this.updateGanttRowHeights()
    };
    _proto.updateGanttRowHeights = function() {
        var rowHeight = this._gantt._ganttTreeList.getRowHeight();
        if (this._gantt._getGanttViewOption("rowHeight") !== rowHeight) {
            var _this$_gantt$_ganttVi;
            this._gantt._setGanttViewOption("rowHeight", rowHeight);
            null === (_this$_gantt$_ganttVi = this._gantt._ganttView) || void 0 === _this$_gantt$_ganttVi ? void 0 : _this$_gantt$_ganttVi._ganttViewCore.updateRowHeights(rowHeight)
        }
    };
    _proto.adjustHeight = function() {
        if (!this._gantt._hasHeight) {
            this._gantt._setGanttViewOption("height", 0);
            this._gantt._setGanttViewOption("height", this._gantt._ganttTreeList.getOffsetHeight())
        }
    };
    _proto.setInnerElementsWidth = function(widths) {
        if (!(0, _window.hasWindow)()) {
            return
        }
        if (!widths) {
            widths = this._getPanelsWidthByOption()
        }
        this._setTreeListDimension("width", widths.leftPanelWidth);
        this._setGanttViewDimension("width", widths.rightPanelWidth)
    };
    _proto.updateGanttWidth = function() {
        this._gantt._splitter._dimensionChanged()
    };
    _proto.setGanttHeight = function(height) {
        var _this$_gantt$_ganttVi2;
        var toolbarHeightOffset = this._gantt._$toolbarWrapper.get(0).offsetHeight;
        var mainWrapperHeight = height - toolbarHeightOffset;
        this._setTreeListDimension("height", mainWrapperHeight);
        this._setGanttViewDimension("height", mainWrapperHeight);
        null === (_this$_gantt$_ganttVi2 = this._gantt._ganttView) || void 0 === _this$_gantt$_ganttVi2 ? void 0 : _this$_gantt$_ganttVi2._ganttViewCore.resetAndUpdate()
    };
    return GanttSizeHelper
}();
exports.GanttSizeHelper = GanttSizeHelper;
