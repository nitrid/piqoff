/**
 * DevExtreme (esm/ui/scheduler/workspaces/utils/work_week.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import dateUtils from "../../../../core/utils/date";
var MONDAY_INDEX = 1;
var SATURDAY_INDEX = 6;
var SUNDAY_INDEX = 0;
export var isDataOnWeekend = date => {
    var day = date.getDay();
    return day === SATURDAY_INDEX || day === SUNDAY_INDEX
};
export var getFirstDayOfWeek = firstDayOfWeekOption => firstDayOfWeekOption || MONDAY_INDEX;
export var getWeekendsCount = days => 2 * Math.floor(days / 7);
export var getFirstViewDate = (viewStart, firstDayOfWeek) => {
    var firstViewDate = dateUtils.getFirstWeekDate(viewStart, firstDayOfWeek);
    return dateUtils.normalizeDateByWeek(firstViewDate, viewStart)
};
