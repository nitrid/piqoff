/**
 * DevExtreme (cjs/ui/scheduler/workspaces/ui.scheduler.timeline.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _common = require("../../../core/utils/common");
var _extend = require("../../../core/utils/extend");
var _position = require("../../../core/utils/position");
var _component_registrator = _interopRequireDefault(require("../../../core/component_registrator"));
var _uiSchedulerWork_space = _interopRequireDefault(require("./ui.scheduler.work_space.indicator"));
var _date = _interopRequireDefault(require("../../../core/utils/date"));
var _table_creator = _interopRequireDefault(require("../table_creator"));
var _uiSchedulerCurrent_time_shader = _interopRequireDefault(require("../shaders/ui.scheduler.current_time_shader.horizontal"));
var _constants = require("../constants");
var _utils = _interopRequireDefault(require("../utils.timeZone"));
var _layout = _interopRequireDefault(require("../../../renovation/ui/scheduler/workspaces/timeline/header_panel/layout.j"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}

function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread()
}

function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
}

function _unsupportedIterableToArray(o, minLen) {
    if (!o) {
        return
    }
    if ("string" === typeof o) {
        return _arrayLikeToArray(o, minLen)
    }
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if ("Object" === n && o.constructor) {
        n = o.constructor.name
    }
    if ("Map" === n || "Set" === n) {
        return Array.from(o)
    }
    if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) {
        return _arrayLikeToArray(o, minLen)
    }
}

function _iterableToArray(iter) {
    if ("undefined" !== typeof Symbol && null != iter[Symbol.iterator] || null != iter["@@iterator"]) {
        return Array.from(iter)
    }
}

function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
        return _arrayLikeToArray(arr)
    }
}

function _arrayLikeToArray(arr, len) {
    if (null == len || len > arr.length) {
        len = arr.length
    }
    for (var i = 0, arr2 = new Array(len); i < len; i++) {
        arr2[i] = arr[i]
    }
    return arr2
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
var tableCreator = _table_creator.default.tableCreator;
var TIMELINE_CLASS = "dx-scheduler-timeline";
var GROUP_TABLE_CLASS = "dx-scheduler-group-table";
var HORIZONTAL_GROUPED_WORKSPACE_CLASS = "dx-scheduler-work-space-horizontal-grouped";
var HEADER_PANEL_CELL_CLASS = "dx-scheduler-header-panel-cell";
var HEADER_PANEL_WEEK_CELL_CLASS = "dx-scheduler-header-panel-week-cell";
var HEADER_ROW_CLASS = "dx-scheduler-header-row";
var HORIZONTAL = "horizontal";
var DATE_TABLE_CELL_BORDER = 1;
var DATE_TABLE_HEADER_MARGIN = 10;
var toMs = _date.default.dateToMilliseconds;
var SchedulerTimeline = function(_SchedulerWorkSpace) {
    _inheritsLoose(SchedulerTimeline, _SchedulerWorkSpace);

    function SchedulerTimeline() {
        return _SchedulerWorkSpace.apply(this, arguments) || this
    }
    var _proto = SchedulerTimeline.prototype;
    _proto._init = function() {
        _SchedulerWorkSpace.prototype._init.call(this);
        this.$element().addClass(TIMELINE_CLASS);
        this._$sidebarTable = (0, _renderer.default)("<div>").addClass(GROUP_TABLE_CLASS)
    };
    _proto._getCellFromNextRow = function(direction, isMultiSelection) {
        if (!isMultiSelection) {
            return _SchedulerWorkSpace.prototype._getCellFromNextRow.call(this, direction, isMultiSelection)
        }
        return this._$focusedCell
    };
    _proto._getDefaultGroupStrategy = function() {
        return "vertical"
    };
    _proto._toggleGroupingDirectionClass = function() {
        this.$element().toggleClass(HORIZONTAL_GROUPED_WORKSPACE_CLASS, this._isHorizontalGroupedWorkSpace())
    };
    _proto._getDefaultOptions = function() {
        return (0, _extend.extend)(_SchedulerWorkSpace.prototype._getDefaultOptions.call(this), {
            groupOrientation: "vertical"
        })
    };
    _proto._getRowCount = function() {
        return 1
    };
    _proto._getCellCount = function() {
        return this._getCellCountInDay() * this.option("intervalCount")
    };
    _proto.getGroupTableWidth = function() {
        return this._$sidebarTable ? this._$sidebarTable.outerWidth() : 0
    };
    _proto._getTotalRowCount = function(groupCount) {
        if (this._isHorizontalGroupedWorkSpace()) {
            return this._getRowCount()
        } else {
            groupCount = groupCount || 1;
            return this._getRowCount() * groupCount
        }
    };
    _proto._getDateForHeaderText = function(index) {
        var firstViewDate = this._getValidFirstViewDateWithoutDST();
        return this._getDateByIndexCore(firstViewDate, index)
    };
    _proto._getDateByIndexCore = function(date, index) {
        var result = new Date(date);
        var dayIndex = Math.floor(index / this._getCellCountInDay());
        result.setTime(date.getTime() + this._calculateCellIndex(0, index) * this._getInterval() + dayIndex * this._getHiddenInterval());
        return result
    };
    _proto._getDateByIndex = function(index) {
        var firstViewDate = this._getValidFirstViewDateWithoutDST();
        var result = this._getDateByIndexCore(firstViewDate, index);
        if (_utils.default.isTimezoneChangeInDate(this._firstViewDate)) {
            result.setDate(result.getDate() - 1)
        }
        return result
    };
    _proto._getValidFirstViewDateWithoutDST = function() {
        var newFirstViewDate = _utils.default.getDateWithoutTimezoneChange(this._firstViewDate);
        newFirstViewDate.setHours(this.option("startDayHour"));
        return newFirstViewDate
    };
    _proto._getFormat = function() {
        return "shorttime"
    };
    _proto._needApplyLastGroupCellClass = function() {
        return true
    };
    _proto._calculateHiddenInterval = function(rowIndex, cellIndex) {
        var dayIndex = Math.floor(cellIndex / this._getCellCountInDay());
        return dayIndex * this._getHiddenInterval()
    };
    _proto._getMillisecondsOffset = function(rowIndex, cellIndex) {
        cellIndex = this._calculateCellIndex(rowIndex, cellIndex);
        return this._getInterval() * cellIndex + this._calculateHiddenInterval(rowIndex, cellIndex)
    };
    _proto._createWorkSpaceElements = function() {
        this._createWorkSpaceScrollableElements()
    };
    _proto._getWorkSpaceHeight = function() {
        if (this.option("crossScrollingEnabled")) {
            return (0, _position.getBoundingRect)(this._$dateTable.get(0)).height
        }
        return (0, _position.getBoundingRect)(this.$element().get(0)).height
    };
    _proto._dateTableScrollableConfig = function() {
        var config = _SchedulerWorkSpace.prototype._dateTableScrollableConfig.call(this);
        var timelineConfig = {
            direction: HORIZONTAL
        };
        return this.option("crossScrollingEnabled") ? config : (0, _extend.extend)(config, timelineConfig)
    };
    _proto._needCreateCrossScrolling = function() {
        return true
    };
    _proto._headerScrollableConfig = function() {
        var config = _SchedulerWorkSpace.prototype._headerScrollableConfig.call(this);
        return (0, _extend.extend)(config, {
            scrollByContent: true
        })
    };
    _proto._renderTimePanel = function() {
        return (0, _common.noop)()
    };
    _proto._renderAllDayPanel = function() {
        return (0, _common.noop)()
    };
    _proto._getTableAllDay = function() {
        return false
    };
    _proto._getDateHeaderTemplate = function() {
        return this.option("timeCellTemplate")
    };
    _proto._toggleAllDayVisibility = function() {
        return (0, _common.noop)()
    };
    _proto._changeAllDayVisibility = function() {
        return (0, _common.noop)()
    };
    _proto.supportAllDayRow = function() {
        return false
    };
    _proto._getGroupHeaderContainer = function() {
        if (this._isHorizontalGroupedWorkSpace()) {
            return this._$thead
        }
        return this._$sidebarTable
    };
    _proto._insertAllDayRowsIntoDateTable = function() {
        return false
    };
    _proto._createAllDayPanelElements = function() {
        return (0, _common.noop)()
    };
    _proto._renderDateHeader = function() {
        var $headerRow = _SchedulerWorkSpace.prototype._renderDateHeader.call(this);
        if (this._needRenderWeekHeader()) {
            var firstViewDate = new Date(this._firstViewDate);
            var currentDate = new Date(firstViewDate);
            var $cells = [];
            var groupCount = this._getGroupCount();
            var cellCountInDay = this._getCellCountInDay();
            var colSpan = this.isGroupedByDate() ? cellCountInDay * groupCount : cellCountInDay;
            var cellTemplate = this.option("dateCellTemplate");
            var horizontalGroupCount = this._isHorizontalGroupedWorkSpace() && !this.isGroupedByDate() ? groupCount : 1;
            var cellsInGroup = this._getWeekDuration() * this.option("intervalCount");
            var cellsCount = cellsInGroup * horizontalGroupCount;
            for (var templateIndex = 0; templateIndex < cellsCount; templateIndex++) {
                var $th = (0, _renderer.default)("<th>");
                var text = this._formatWeekdayAndDay(currentDate);
                if (cellTemplate) {
                    var templateOptions = {
                        model: _extends({
                            text: text,
                            date: new Date(currentDate)
                        }, this._getGroupsForDateHeaderTemplate(templateIndex, colSpan)),
                        container: $th,
                        index: templateIndex
                    };
                    cellTemplate.render(templateOptions)
                } else {
                    $th.text(text)
                }
                $th.addClass(HEADER_PANEL_CELL_CLASS).addClass(HEADER_PANEL_WEEK_CELL_CLASS).attr("colSpan", colSpan);
                $cells.push($th);
                if (templateIndex % cellsInGroup === cellsInGroup - 1) {
                    currentDate = new Date(firstViewDate)
                } else {
                    this._incrementDate(currentDate)
                }
            }
            var $row = (0, _renderer.default)("<tr>").addClass(HEADER_ROW_CLASS).append($cells);
            $headerRow.before($row)
        }
    };
    _proto._needRenderWeekHeader = function() {
        return false
    };
    _proto._incrementDate = function(date) {
        date.setDate(date.getDate() + 1)
    };
    _proto._getWeekDuration = function() {
        return 1
    };
    _proto._renderView = function() {
        this._setFirstViewDate();
        var groupCellTemplates;
        if (!this.isRenovatedRender()) {
            groupCellTemplates = this._renderGroupHeader()
        }
        if (this.isRenovatedRender()) {
            this.renderRWorkspace()
        } else {
            this._renderDateHeader();
            this._renderTimePanel();
            this._renderDateTable();
            this._renderAllDayPanel()
        }
        this._shader = new _uiSchedulerCurrent_time_shader.default(this);
        this._$sidebarTable.appendTo(this._sidebarScrollable.$content());
        if (this.isRenovatedRender() && this._isVerticalGroupedWorkSpace()) {
            this.renderRGroupPanel()
        }
        this._applyCellTemplates(groupCellTemplates)
    };
    _proto._setHorizontalGroupHeaderCellsHeight = function() {
        return (0, _common.noop)()
    };
    _proto.getIndicationCellCount = function() {
        var timeDiff = this._getTimeDiff();
        return this._calculateDurationInCells(timeDiff)
    };
    _proto._getTimeDiff = function() {
        var today = this._getToday();
        var date = this._getIndicationFirstViewDate();
        return today.getTime() - date.getTime()
    };
    _proto._calculateDurationInCells = function(timeDiff) {
        var today = this._getToday();
        var differenceInDays = Math.floor(timeDiff / toMs("day"));
        var duration = (timeDiff - differenceInDays * toMs("day") - this.option("startDayHour") * toMs("hour")) / this.getCellDuration();
        if (today.getHours() > this.option("endDayHour")) {
            duration = this._getCellCountInDay()
        }
        if (duration < 0) {
            duration = 0
        }
        return differenceInDays * this._getCellCountInDay() + duration
    };
    _proto.getIndicationWidth = function() {
        if (this.isGroupedByDate()) {
            var cellCount = this.getIndicationCellCount();
            var integerPart = Math.floor(cellCount);
            var fractionPart = cellCount - integerPart;
            return this.getCellWidth() * (integerPart * this._getGroupCount() + fractionPart)
        } else {
            return this.getIndicationCellCount() * this.getCellWidth()
        }
    };
    _proto._renderIndicator = function(height, rtlOffset, $container, groupCount) {
        var $indicator;
        var width = this.getIndicationWidth();
        if ("vertical" === this.option("groupOrientation")) {
            $indicator = this._createIndicator($container);
            $indicator.height((0, _position.getBoundingRect)($container.get(0)).height);
            $indicator.css("left", rtlOffset ? rtlOffset - width : width)
        } else {
            for (var i = 0; i < groupCount; i++) {
                var offset = this.isGroupedByDate() ? i * this.getCellWidth() : this._getCellCount() * this.getCellWidth() * i;
                $indicator = this._createIndicator($container);
                $indicator.height((0, _position.getBoundingRect)($container.get(0)).height);
                $indicator.css("left", rtlOffset ? rtlOffset - width - offset : width + offset)
            }
        }
    };
    _proto._isVerticalShader = function() {
        return false
    };
    _proto._isCurrentTimeHeaderCell = function() {
        return false
    };
    _proto._visibilityChanged = function(visible) {
        _SchedulerWorkSpace.prototype._visibilityChanged.call(this, visible)
    };
    _proto._setTableSizes = function() {
        var _this$virtualScrollin;
        var cellHeight = this.getCellHeight();
        var minHeight = this._getWorkSpaceMinHeight();
        var verticalGroupCount = this._isVerticalGroupedWorkSpace() ? this._getGroupCount() : 1;
        var height = cellHeight * verticalGroupCount;
        if (height < minHeight) {
            height = minHeight
        }
        this._$sidebarTable.height(height);
        this._$dateTable.height(height);
        _SchedulerWorkSpace.prototype._setTableSizes.call(this);
        null === (_this$virtualScrollin = this.virtualScrollingDispatcher) || void 0 === _this$virtualScrollin ? void 0 : _this$virtualScrollin.updateDimensions()
    };
    _proto._getWorkSpaceMinHeight = function() {
        var minHeight = this._getWorkSpaceHeight();
        var workspaceContainerHeight = this.$element().outerHeight(true) - this.getHeaderPanelHeight() - 2 * DATE_TABLE_CELL_BORDER - DATE_TABLE_HEADER_MARGIN;
        if (minHeight < workspaceContainerHeight) {
            minHeight = workspaceContainerHeight
        }
        return minHeight
    };
    _proto._makeGroupRows = function(groups, groupByDate) {
        var tableCreatorStrategy = "vertical" === this.option("groupOrientation") ? tableCreator.VERTICAL : tableCreator.HORIZONTAL;
        return tableCreator.makeGroupedTable(tableCreatorStrategy, groups, {
            groupRowClass: this._getGroupRowClass(),
            groupHeaderRowClass: this._getGroupRowClass(),
            groupHeaderClass: this._getGroupHeaderClass.bind(this),
            groupHeaderContentClass: this._getGroupHeaderContentClass()
        }, this._getCellCount() || 1, this.option("resourceCellTemplate"), this._getTotalRowCount(this._getGroupCount()), groupByDate)
    };
    _proto._ensureGroupHeaderCellsHeight = function(cellHeight) {
        var minCellHeight = this._calculateMinCellHeight();
        if (cellHeight < minCellHeight) {
            return minCellHeight
        }
        return cellHeight
    };
    _proto._calculateMinCellHeight = function() {
        var dateTable = this._getDateTable();
        var dateTableRowSelector = "." + this._getDateTableRowClass();
        return (0, _position.getBoundingRect)(dateTable).height / dateTable.find(dateTableRowSelector).length - 2 * DATE_TABLE_CELL_BORDER
    };
    _proto._getCellCoordinatesByIndex = function(index) {
        return {
            cellIndex: index % this._getCellCount(),
            rowIndex: 0
        }
    };
    _proto._getCellByCoordinates = function(cellCoordinates, groupIndex) {
        var indexes = this._groupedStrategy.prepareCellIndexes(cellCoordinates, groupIndex);
        return this._$dateTable.find("tr").eq(indexes.rowIndex).find("td").eq(indexes.cellIndex)
    };
    _proto._getWorkSpaceWidth = function() {
        return this._$dateTable.outerWidth(true)
    };
    _proto._getIndicationFirstViewDate = function() {
        return _date.default.trimTime(new Date(this._firstViewDate))
    };
    _proto._getIntervalBetween = function(currentDate, allDay) {
        var startDayHour = this.option("startDayHour");
        var endDayHour = this.option("endDayHour");
        var firstViewDate = this.getStartViewDate();
        var firstViewDateTime = firstViewDate.getTime();
        var hiddenInterval = (24 - endDayHour + startDayHour) * toMs("hour");
        var timeZoneOffset = _date.default.getTimezonesDifference(firstViewDate, currentDate);
        var apptStart = currentDate.getTime();
        var fullInterval = apptStart - firstViewDateTime - timeZoneOffset;
        var fullDays = Math.floor(fullInterval / toMs("day"));
        var tailDuration = fullInterval - fullDays * toMs("day");
        var tailDelta = 0;
        var cellCount = this._getCellCountInDay() * (fullDays - this._getWeekendsCount(fullDays));
        var gapBeforeAppt = apptStart - _date.default.trimTime(new Date(currentDate)).getTime();
        var result = cellCount * this.option("hoursInterval") * toMs("hour");
        if (!allDay) {
            if (currentDate.getHours() < startDayHour) {
                tailDelta = tailDuration - hiddenInterval + gapBeforeAppt
            } else if (currentDate.getHours() >= startDayHour && currentDate.getHours() < endDayHour) {
                tailDelta = tailDuration
            } else if (currentDate.getHours() >= startDayHour && currentDate.getHours() >= endDayHour) {
                tailDelta = tailDuration - (gapBeforeAppt - endDayHour * toMs("hour"))
            } else if (!fullDays) {
                result = fullInterval
            }
            result += tailDelta
        }
        return result
    };
    _proto._getWeekendsCount = function() {
        return 0
    };
    _proto.getAllDayContainer = function() {
        return null
    };
    _proto.getTimePanelWidth = function() {
        return 0
    };
    _proto.getPositionShift = function(timeShift) {
        var positionShift = _SchedulerWorkSpace.prototype.getPositionShift.call(this, timeShift);
        var left = this.getCellWidth() * timeShift;
        if (this.option("rtlEnabled")) {
            left *= -1
        }
        left += positionShift.left;
        return {
            top: 0,
            left: left,
            cellPosition: left
        }
    };
    _proto.getVisibleBounds = function() {
        var isRtl = this.option("rtlEnabled");
        var result = {};
        var $scrollable = this.getScrollable().$element();
        var cellWidth = this.getCellWidth();
        var scrollableOffset = isRtl ? this.getScrollableOuterWidth() - this.getScrollableScrollLeft() : this.getScrollableScrollLeft();
        var scrolledCellCount = scrollableOffset / cellWidth;
        var visibleCellCount = $scrollable.width() / cellWidth;
        var totalCellCount = isRtl ? scrolledCellCount - visibleCellCount : scrolledCellCount + visibleCellCount;
        var leftDate = this._getDateByIndex(scrolledCellCount);
        var rightDate = this._getDateByIndex(totalCellCount);
        if (isRtl) {
            leftDate = this._getDateByIndex(totalCellCount);
            rightDate = this._getDateByIndex(scrolledCellCount)
        }
        result.left = {
            hours: leftDate.getHours(),
            minutes: leftDate.getMinutes() >= 30 ? 30 : 0,
            date: _date.default.trimTime(leftDate)
        };
        result.right = {
            hours: rightDate.getHours(),
            minutes: rightDate.getMinutes() >= 30 ? 30 : 0,
            date: _date.default.trimTime(rightDate)
        };
        return result
    };
    _proto.getIntervalDuration = function(allDay) {
        return this.getCellDuration()
    };
    _proto._supportCompactDropDownAppointments = function() {
        return false
    };
    _proto.getCellMinWidth = function() {
        return 0
    };
    _proto.getWorkSpaceLeftOffset = function() {
        return 0
    };
    _proto.scrollToTime = function(hours, minutes, date) {
        var coordinates = this._getScrollCoordinates(hours, minutes, date);
        var scrollable = this.getScrollable();
        var offset = this.option("rtlEnabled") ? (0, _position.getBoundingRect)(this.getScrollableContainer().get(0)).width : 0;
        if (this.option("templatesRenderAsynchronously")) {
            setTimeout((function() {
                scrollable.scrollBy({
                    left: coordinates.left - scrollable.scrollLeft() - offset,
                    top: 0
                })
            }))
        } else {
            scrollable.scrollBy({
                left: coordinates.left - scrollable.scrollLeft() - offset,
                top: 0
            })
        }
    };
    _proto._getRowCountWithAllDayRows = function() {
        return this._getRowCount()
    };
    _proto._setCurrentTimeCells = function() {
        var timePanelCells = this._getTimePanelCells();
        var currentTimeCellIndices = this._getCurrentTimePanelCellIndices();
        currentTimeCellIndices.forEach((function(timePanelCellIndex) {
            timePanelCells.eq(timePanelCellIndex).addClass(_constants.HEADER_CURRENT_TIME_CELL_CLASS)
        }))
    };
    _proto._cleanCurrentTimeCells = function() {
        this.$element().find(".".concat(_constants.HEADER_CURRENT_TIME_CELL_CLASS)).removeClass(_constants.HEADER_CURRENT_TIME_CELL_CLASS)
    };
    _proto._getTimePanelCells = function() {
        return this.$element().find(".".concat(HEADER_PANEL_CELL_CLASS, ":not(.").concat(HEADER_PANEL_WEEK_CELL_CLASS, ")"))
    };
    _proto._getCurrentTimePanelCellIndices = function() {
        var columnCountPerGroup = this._getCellCount();
        var today = this._getToday();
        var index = this.getCellIndexByDate(today);
        var _this$_getCellCoordin = this._getCellCoordinatesByIndex(index),
            currentTimeCellIndex = _this$_getCellCoordin.cellIndex;
        if (void 0 === currentTimeCellIndex) {
            return []
        }
        var horizontalGroupCount = this._isHorizontalGroupedWorkSpace() && !this.isGroupedByDate() ? this._getGroupCount() : 1;
        return _toConsumableArray(new Array(horizontalGroupCount)).map((function(_, groupIndex) {
            return columnCountPerGroup * groupIndex + currentTimeCellIndex
        }))
    };
    _proto.renovatedRenderSupported = function() {
        return true
    };
    _proto.renderRAllDayPanel = function() {};
    _proto.renderRTimeTable = function() {};
    _proto.generateRenderOptions = function() {
        var options = _SchedulerWorkSpace.prototype.generateRenderOptions.call(this, true);
        var groupCount = this._getGroupCount();
        var horizontalGroupCount = this._isHorizontalGroupedWorkSpace() && !this.isGroupedByDate() ? groupCount : 1;
        var cellsInGroup = this._getWeekDuration() * this.option("intervalCount");
        var daysInView = cellsInGroup * horizontalGroupCount;
        return _extends({}, options, {
            isGenerateWeekDaysHeaderData: this._needRenderWeekHeader(),
            getWeekDaysHeaderText: this._formatWeekdayAndDay.bind(this),
            daysInView: daysInView,
            cellCountInDay: this._getCellCountInDay()
        })
    };
    _createClass(SchedulerTimeline, [{
        key: "verticalGroupTableClass",
        get: function() {
            return GROUP_TABLE_CLASS
        }
    }, {
        key: "viewDirection",
        get: function() {
            return "horizontal"
        }
    }, {
        key: "renovatedHeaderPanelComponent",
        get: function() {
            return _layout.default
        }
    }]);
    return SchedulerTimeline
}(_uiSchedulerWork_space.default);
(0, _component_registrator.default)("dxSchedulerTimeline", SchedulerTimeline);
var _default = SchedulerTimeline;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;
