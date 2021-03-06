/**
 * DevExtreme (esm/ui/scheduler/workspaces/ui.scheduler.work_space_month.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import $ from "../../../core/renderer";
import {
    noop
} from "../../../core/utils/common";
import registerComponent from "../../../core/component_registrator";
import SchedulerWorkSpace from "./ui.scheduler.work_space.indicator";
import dateUtils from "../../../core/utils/date";
import {
    getBoundingRect
} from "../../../core/utils/position";
import dateLocalization from "../../../localization/date";
import dxrMonthDateTableLayout from "../../../renovation/ui/scheduler/workspaces/month/date_table/layout.j";
import {
    getViewStartByOptions
} from "./utils/month";
var MONTH_CLASS = "dx-scheduler-work-space-month";
var DATE_TABLE_CURRENT_DATE_CLASS = "dx-scheduler-date-table-current-date";
var DATE_TABLE_CELL_TEXT_CLASS = "dx-scheduler-date-table-cell-text";
var DATE_TABLE_FIRST_OF_MONTH_CLASS = "dx-scheduler-date-table-first-of-month";
var DATE_TABLE_OTHER_MONTH_DATE_CLASS = "dx-scheduler-date-table-other-month";
var DATE_TABLE_SCROLLABLE_FIXED_CLASS = "dx-scheduler-scrollable-fixed-content";
var DAYS_IN_WEEK = 7;
var DAY_IN_MILLISECONDS = 864e5;
var toMs = dateUtils.dateToMilliseconds;
class SchedulerWorkSpaceMonth extends SchedulerWorkSpace {
    get isDateAndTimeView() {
        return false
    }
    _toggleFixedScrollableClass() {
        this._dateTableScrollable.$content().toggleClass(DATE_TABLE_SCROLLABLE_FIXED_CLASS, !this._isWorkSpaceWithCount() && !this._isVerticalGroupedWorkSpace())
    }
    _getElementClass() {
        return MONTH_CLASS
    }
    _getRowCount() {
        return this._isWorkSpaceWithCount() ? 4 * this.option("intervalCount") + 2 : 6
    }
    _getCellCount() {
        return DAYS_IN_WEEK
    }
    _getDateByIndex(headerIndex) {
        var resultDate = new Date(this._firstViewDate);
        resultDate.setDate(this._firstViewDate.getDate() + headerIndex);
        return resultDate
    }
    _getFormat() {
        return this._formatWeekday
    }
    _calculateCellIndex(rowIndex, cellIndex) {
        if (this._isVerticalGroupedWorkSpace()) {
            rowIndex %= this._getRowCount()
        } else {
            cellIndex %= this._getCellCount()
        }
        return rowIndex * this._getCellCount() + cellIndex
    }
    _getInterval() {
        return DAY_IN_MILLISECONDS
    }
    _getIntervalBetween(currentDate) {
        var firstViewDate = this.getStartViewDate();
        var timeZoneOffset = dateUtils.getTimezonesDifference(firstViewDate, currentDate);
        return currentDate.getTime() - (firstViewDate.getTime() - 36e5 * this.option("startDayHour")) - timeZoneOffset
    }
    _getDateByCellIndexes(rowIndex, cellIndex) {
        var date = super._getDateByCellIndexes(rowIndex, cellIndex);
        this._setStartDayHour(date);
        return date
    }
    getCellWidth() {
        return this.cache.get("cellWidth", () => {
            var averageWidth = 0;
            var cells = this._getCells().slice(0, 7);
            cells.each((index, element) => {
                averageWidth += getBoundingRect(element).width
            });
            return 0 === cells.length ? void 0 : averageWidth / 7
        })
    }
    _calculateHiddenInterval() {
        return 0
    }
    _insertAllDayRowsIntoDateTable() {
        return false
    }
    _getCellCoordinatesByIndex(index) {
        var rowIndex = Math.floor(index / this._getCellCount());
        var cellIndex = index - this._getCellCount() * rowIndex;
        return {
            rowIndex: rowIndex,
            cellIndex: cellIndex
        }
    }
    _createWorkSpaceElements() {
        if (this._isVerticalGroupedWorkSpace()) {
            this._createWorkSpaceScrollableElements()
        } else {
            super._createWorkSpaceElements()
        }
    }
    _needCreateCrossScrolling() {
        return this.option("crossScrollingEnabled") || this._isVerticalGroupedWorkSpace()
    }
    _renderTimePanel() {
        return noop()
    }
    _renderAllDayPanel() {
        return noop()
    }
    _getTableAllDay() {
        return noop()
    }
    _toggleAllDayVisibility() {
        return noop()
    }
    _changeAllDayVisibility() {
        return noop()
    }
    _setFirstViewDate() {
        var firstMonthDate = dateUtils.getFirstMonthDate(this._getViewStartByOptions());
        var firstDayOfWeek = this._getCalculatedFirstDayOfWeek();
        this._firstViewDate = dateUtils.getFirstWeekDate(firstMonthDate, firstDayOfWeek);
        this._setStartDayHour(this._firstViewDate);
        var date = this._getViewStartByOptions();
        this._minVisibleDate = new Date(date.setDate(1));
        this._maxVisibleDate = new Date(new Date(date.setMonth(date.getMonth() + this.option("intervalCount"))).setDate(0))
    }
    _getViewStartByOptions() {
        return getViewStartByOptions(this.option("startDate"), this.option("currentDate"), this.option("intervalCount"), this._getStartViewDate())
    }
    _getStartViewDate() {
        var firstMonthDate = dateUtils.getFirstMonthDate(this.option("startDate"));
        return firstMonthDate
    }
    _renderTableBody(options) {
        options.getCellText = this._getCellText.bind(this);
        options.getCellTextClass = DATE_TABLE_CELL_TEXT_CLASS;
        super._renderTableBody(options)
    }
    _getCellText(rowIndex, cellIndex) {
        if (this.isGroupedByDate()) {
            cellIndex = Math.floor(cellIndex / this._getGroupCount())
        } else {
            cellIndex %= this._getCellCount()
        }
        var date = this._getDate(rowIndex, cellIndex);
        if (this._isWorkSpaceWithCount() && this._isFirstDayOfMonth(date)) {
            return this._formatMonthAndDay(date)
        }
        return dateLocalization.format(date, "dd")
    }
    _formatMonthAndDay(date) {
        var monthName = dateLocalization.getMonthNames("abbreviated")[date.getMonth()];
        return [monthName, dateLocalization.format(date, "day")].join(" ")
    }
    _getDate(week, day) {
        var result = new Date(this._firstViewDate);
        var lastRowInDay = this._getRowCount();
        result.setDate(result.getDate() + week % lastRowInDay * DAYS_IN_WEEK + day);
        return result
    }
    _updateIndex(index) {
        return index
    }
    _prepareCellData(rowIndex, cellIndex, cell) {
        var data = super._prepareCellData(rowIndex, cellIndex, cell);
        var $cell = $(cell);
        $cell.toggleClass(DATE_TABLE_CURRENT_DATE_CLASS, this._isCurrentDate(data.startDate)).toggleClass(DATE_TABLE_FIRST_OF_MONTH_CLASS, this._isFirstDayOfMonth(data.startDate)).toggleClass(DATE_TABLE_OTHER_MONTH_DATE_CLASS, this._isOtherMonth(data.startDate));
        return data
    }
    _isCurrentDate(cellDate) {
        return dateUtils.sameDate(cellDate, this._getToday())
    }
    _isFirstDayOfMonth(cellDate) {
        return this._isWorkSpaceWithCount() && 1 === cellDate.getDate()
    }
    _isOtherMonth(cellDate) {
        return !dateUtils.dateInRange(cellDate, this._minVisibleDate, this._maxVisibleDate, "date")
    }
    isIndicationAvailable() {
        return false
    }
    getCellDuration() {
        return 36e5 * this._calculateDayDuration()
    }
    getIntervalDuration() {
        return toMs("day")
    }
    getTimePanelWidth() {
        return 0
    }
    getPositionShift(timeShift) {
        return {
            cellPosition: timeShift * this.getCellWidth(),
            top: 0,
            left: 0
        }
    }
    getCellCountToLastViewDate(date) {
        var firstDateTime = date.getTime();
        var lastDateTime = this.getEndViewDate().getTime();
        var dayDurationInMs = this.getCellDuration();
        return Math.ceil((lastDateTime - firstDateTime) / dayDurationInMs)
    }
    supportAllDayRow() {
        return false
    }
    keepOriginalHours() {
        return true
    }
    calculateEndDate(startDate) {
        var startDateCopy = new Date(startDate);
        return new Date(startDateCopy.setHours(this.option("endDayHour")))
    }
    getWorkSpaceLeftOffset() {
        return 0
    }
    needApplyCollectorOffset() {
        return true
    }
    _getDateTableBorderOffset() {
        return this._getDateTableBorder()
    }
    _getCellPositionByIndex(index, groupIndex) {
        var position = super._getCellPositionByIndex(index, groupIndex);
        var rowIndex = this._getCellCoordinatesByIndex(index).rowIndex;
        var calculatedTopOffset;
        if (!this._isVerticalGroupedWorkSpace()) {
            calculatedTopOffset = this.getCellHeight() * rowIndex
        } else {
            calculatedTopOffset = this.getCellHeight() * (rowIndex + groupIndex * this._getRowCount())
        }
        if (calculatedTopOffset) {
            position.top = calculatedTopOffset
        }
        return position
    }
    _getHeaderDate() {
        return this._getViewStartByOptions()
    }
    _supportCompactDropDownAppointments() {
        return false
    }
    scrollToTime() {
        return noop()
    }
    _createAllDayPanelElements() {}
    _getRowCountWithAllDayRows() {
        return this._getRowCount()
    }
    renovatedRenderSupported() {
        return true
    }
    renderRAllDayPanel() {}
    renderRTimeTable() {}
    renderRDateTable() {
        this.renderRComponent(this._$dateTable, dxrMonthDateTableLayout, "renovatedDateTable", this._getRDateTableProps())
    }
    generateRenderOptions() {
        var options = super.generateRenderOptions();
        options.cellDataGetters.push((_, rowIndex, cellIndex) => ({
            value: {
                text: this._getCellText(rowIndex, cellIndex)
            }
        }));
        options.cellDataGetters.push((_, rowIndex, cellIndex, groupIndex, startDate) => ({
            value: {
                today: this._isCurrentDate(startDate),
                otherMonth: this._isOtherMonth(startDate),
                firstDayOfMonth: this._isFirstDayOfMonth(startDate)
            }
        }));
        return options
    }
}
registerComponent("dxSchedulerWorkSpaceMonth", SchedulerWorkSpaceMonth);
export default SchedulerWorkSpaceMonth;
