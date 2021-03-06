/**
 * DevExtreme (cjs/ui/scheduler/workspaces/ui.scheduler.work_space.grouped.strategy.horizontal.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.default = void 0;
var _position = require("../../../core/utils/position");
var _uiSchedulerWork_spaceGrouped = _interopRequireDefault(require("./ui.scheduler.work_space.grouped.strategy"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
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
var HORIZONTAL_GROUPED_ATTR = "dx-group-row-count";
var HorizontalGroupedStrategy = function(_GroupedStrategy) {
    _inheritsLoose(HorizontalGroupedStrategy, _GroupedStrategy);

    function HorizontalGroupedStrategy() {
        return _GroupedStrategy.apply(this, arguments) || this
    }
    var _proto = HorizontalGroupedStrategy.prototype;
    _proto.prepareCellIndexes = function(cellCoordinates, groupIndex, inAllDay) {
        var groupByDay = this._workSpace.isGroupedByDate();
        if (!groupByDay) {
            return {
                rowIndex: cellCoordinates.rowIndex,
                cellIndex: cellCoordinates.cellIndex + groupIndex * this._workSpace._getCellCount()
            }
        } else {
            return {
                rowIndex: cellCoordinates.rowIndex,
                cellIndex: cellCoordinates.cellIndex * this._workSpace._getGroupCount() + groupIndex
            }
        }
    };
    _proto.calculateCellIndex = function(rowIndex, cellIndex) {
        cellIndex %= this._workSpace._getCellCount();
        return this._workSpace._getRowCount() * cellIndex + rowIndex
    };
    _proto.getGroupIndex = function(rowIndex, cellIndex) {
        var groupByDay = this._workSpace.isGroupedByDate();
        var groupCount = this._workSpace._getGroupCount();
        if (groupByDay) {
            return cellIndex % groupCount
        } else {
            return Math.floor(cellIndex / this._workSpace._getCellCount())
        }
    };
    _proto.calculateHeaderCellRepeatCount = function() {
        return this._workSpace._getGroupCount() || 1
    };
    _proto.insertAllDayRowsIntoDateTable = function() {
        return false
    };
    _proto.getTotalCellCount = function(groupCount) {
        groupCount = groupCount || 1;
        return this._workSpace._getCellCount() * groupCount
    };
    _proto.getTotalRowCount = function() {
        return this._workSpace._getRowCount()
    };
    _proto.addAdditionalGroupCellClasses = function(cellClass, index, i, j) {
        var applyUnconditionally = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : false;
        cellClass = this._addLastGroupCellClass(cellClass, index, applyUnconditionally);
        return this._addFirstGroupCellClass(cellClass, index, applyUnconditionally)
    };
    _proto._addLastGroupCellClass = function(cellClass, index, applyUnconditionally) {
        if (applyUnconditionally) {
            return "".concat(cellClass, " ").concat(this.getLastGroupCellClass())
        }
        var groupByDate = this._workSpace.isGroupedByDate();
        if (groupByDate) {
            if (index % this._workSpace._getGroupCount() === 0) {
                return "".concat(cellClass, " ").concat(this.getLastGroupCellClass())
            }
        } else if (index % this._workSpace._getCellCount() === 0) {
            return "".concat(cellClass, " ").concat(this.getLastGroupCellClass())
        }
        return cellClass
    };
    _proto._addFirstGroupCellClass = function(cellClass, index, applyUnconditionally) {
        if (applyUnconditionally) {
            return "".concat(cellClass, " ").concat(this.getFirstGroupCellClass())
        }
        var groupByDate = this._workSpace.isGroupedByDate();
        if (groupByDate) {
            if ((index - 1) % this._workSpace._getGroupCount() === 0) {
                return "".concat(cellClass, " ").concat(this.getFirstGroupCellClass())
            }
        } else if ((index - 1) % this._workSpace._getCellCount() === 0) {
            return "".concat(cellClass, " ").concat(this.getFirstGroupCellClass())
        }
        return cellClass
    };
    _proto.getHorizontalMax = function(groupIndex) {
        return this._workSpace.getMaxAllowedPosition(groupIndex)
    };
    _proto.getVerticalMax = function(groupIndex) {
        var isVirtualScrolling = this._workSpace.isVirtualScrolling();
        var correctedGroupIndex = isVirtualScrolling ? groupIndex : 0;
        return this._workSpace.getMaxAllowedVerticalPosition(correctedGroupIndex)
    };
    _proto.calculateTimeCellRepeatCount = function() {
        return 1
    };
    _proto.getWorkSpaceMinWidth = function() {
        return (0, _position.getBoundingRect)(this._workSpace.$element().get(0)).width - this._workSpace.getTimePanelWidth()
    };
    _proto.getAllDayOffset = function() {
        return this._workSpace.getAllDayHeight()
    };
    _proto.getAllDayTableHeight = function() {
        return (0, _position.getBoundingRect)(this._workSpace._$allDayTable.get(0)).height || 0
    };
    _proto.getGroupCountAttr = function(groups) {
        return {
            attr: HORIZONTAL_GROUPED_ATTR,
            count: null === groups || void 0 === groups ? void 0 : groups.length
        }
    };
    _proto.getLeftOffset = function() {
        return this._workSpace.getTimePanelWidth()
    };
    _proto._createGroupBoundOffset = function(startCell, endCell, cellWidth) {
        var extraOffset = cellWidth / 2;
        var startOffset = startCell ? startCell.offset().left - extraOffset : 0;
        var endOffset = endCell ? endCell.offset().left + cellWidth + extraOffset : 0;
        return {
            left: startOffset,
            right: endOffset,
            top: 0,
            bottom: 0
        }
    };
    _proto._getGroupedByDateBoundOffset = function($cells, cellWidth) {
        var lastCellIndex = $cells.length - 1;
        var startCell = $cells.eq(0);
        var endCell = $cells.eq(lastCellIndex);
        return this._createGroupBoundOffset(startCell, endCell, cellWidth)
    };
    _proto.getGroupBoundsOffset = function(cellCount, $cells, cellWidth, coordinates) {
        if (this._workSpace.isGroupedByDate()) {
            return this._getGroupedByDateBoundOffset($cells, cellWidth)
        }
        var cellIndex = this._workSpace.getCellIndexByCoordinates(coordinates);
        var groupIndex = coordinates.groupIndex || Math.floor(cellIndex / cellCount);
        var startCellIndex = groupIndex * cellCount;
        var startCell = $cells.eq(startCellIndex);
        var endCell = $cells.eq(startCellIndex + cellCount - 1);
        return this._createGroupBoundOffset(startCell, endCell, cellWidth)
    };
    _proto.getVirtualScrollingGroupBoundsOffset = function(cellCount, $cells, cellWidth, coordinates, groupedDataMap) {
        if (this._workSpace.isGroupedByDate()) {
            return this._getGroupedByDateBoundOffset($cells, cellWidth)
        }
        var startCell;
        var endCell;
        var cellIndex = this._workSpace.getCellIndexByCoordinates(coordinates);
        var groupIndex = coordinates.groupIndex || Math.floor(cellIndex / cellCount);
        var currentCellGroup = groupedDataMap.dateTableGroupedMap[groupIndex];
        if (currentCellGroup) {
            var groupRowLength = currentCellGroup[0].length;
            var groupStartPosition = currentCellGroup[0][0].position;
            var groupEndPosition = currentCellGroup[0][groupRowLength - 1].position;
            startCell = $cells.eq(groupStartPosition.cellIndex);
            endCell = $cells.eq(groupEndPosition.cellIndex)
        }
        return this._createGroupBoundOffset(startCell, endCell, cellWidth)
    };
    _proto.shiftIndicator = function($indicator, height, rtlOffset, groupIndex) {
        var offset = this._getIndicatorOffset(groupIndex);
        var horizontalOffset = rtlOffset ? rtlOffset - offset : offset;
        $indicator.css("left", horizontalOffset);
        $indicator.css("top", height)
    };
    _proto._getIndicatorOffset = function(groupIndex) {
        var groupByDay = this._workSpace.isGroupedByDate();
        return groupByDay ? this._calculateGroupByDateOffset(groupIndex) : this._calculateOffset(groupIndex)
    };
    _proto._calculateOffset = function(groupIndex) {
        return this._workSpace._getCellCount() * this._workSpace.getRoundedCellWidth(groupIndex - 1, 0) * groupIndex + this._workSpace.getIndicatorOffset(groupIndex) + groupIndex
    };
    _proto._calculateGroupByDateOffset = function(groupIndex) {
        return this._workSpace.getIndicatorOffset(0) * this._workSpace._getGroupCount() + this._workSpace.getRoundedCellWidth(groupIndex - 1, 0) * groupIndex
    };
    _proto.getShaderOffset = function(i, width) {
        var offset = this._workSpace._getCellCount() * this._workSpace.getRoundedCellWidth(i - 1) * i;
        return this._workSpace.option("rtlEnabled") ? (0, _position.getBoundingRect)(this._workSpace._dateTableScrollable.$content().get(0)).width - offset - this._workSpace.getTimePanelWidth() - width : offset
    };
    _proto.getShaderTopOffset = function(i) {
        return -this.getShaderMaxHeight() * (i > 0 ? 1 : 0)
    };
    _proto.getShaderHeight = function() {
        var height = this._workSpace.getIndicationHeight();
        return height
    };
    _proto.getShaderMaxHeight = function() {
        return (0, _position.getBoundingRect)(this._workSpace._dateTableScrollable.$content().get(0)).height
    };
    _proto.getShaderWidth = function(i) {
        return this._workSpace.getIndicationWidth(i)
    };
    _proto.getScrollableScrollTop = function(allDay) {
        return !allDay ? this._workSpace.getScrollable().scrollTop() : 0
    };
    _proto.getGroupIndexByCell = function($cell) {
        var rowIndex = $cell.parent().index();
        var cellIndex = $cell.index();
        return this.getGroupIndex(rowIndex, cellIndex)
    };
    return HorizontalGroupedStrategy
}(_uiSchedulerWork_spaceGrouped.default);
var _default = HorizontalGroupedStrategy;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;
