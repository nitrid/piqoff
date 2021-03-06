/**
 * DevExtreme (esm/ui/scheduler/workspaces/ui.scheduler.work_space_day.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import registerComponent from "../../../core/component_registrator";
import SchedulerWorkSpaceVertical from "./ui.scheduler.work_space_vertical";
var DAY_CLASS = "dx-scheduler-work-space-day";
class SchedulerWorkSpaceDay extends SchedulerWorkSpaceVertical {
    _getElementClass() {
        return DAY_CLASS
    }
    _getRowCount() {
        return this._getCellCountInDay()
    }
    _getCellCount() {
        return this.option("intervalCount")
    }
    _setFirstViewDate() {
        this._firstViewDate = this._getViewStartByOptions();
        this._setStartDayHour(this._firstViewDate)
    }
    _getDateByIndex(headerIndex) {
        if (1 === this.option("intervalCount")) {
            return this._firstViewDate
        }
        var resultDate = new Date(this._firstViewDate);
        resultDate.setDate(this._firstViewDate.getDate() + headerIndex);
        return resultDate
    }
    _renderDateHeader() {
        return 1 === this.option("intervalCount") ? null : super._renderDateHeader()
    }
    renderRHeaderPanel() {
        if (1 === this.option("intervalCount")) {
            super.renderRHeaderPanel(false)
        } else {
            super.renderRHeaderPanel(true)
        }
    }
}
registerComponent("dxSchedulerWorkSpaceDay", SchedulerWorkSpaceDay);
export default SchedulerWorkSpaceDay;
