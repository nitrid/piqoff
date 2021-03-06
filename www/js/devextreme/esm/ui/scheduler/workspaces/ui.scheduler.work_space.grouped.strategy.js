/**
 * DevExtreme (esm/ui/scheduler/workspaces/ui.scheduler.work_space.grouped.strategy.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
var LAST_GROUP_CELL_CLASS = "dx-scheduler-last-group-cell";
var FIRST_GROUP_CELL_CLASS = "dx-scheduler-first-group-cell";
class GroupedStrategy {
    constructor(workSpace) {
        this._workSpace = workSpace
    }
    getLastGroupCellClass() {
        return LAST_GROUP_CELL_CLASS
    }
    getFirstGroupCellClass() {
        return FIRST_GROUP_CELL_CLASS
    }
    _getOffsetByAllDayPanel() {
        return 0
    }
    _getGroupTop() {
        return 0
    }
}
export default GroupedStrategy;
