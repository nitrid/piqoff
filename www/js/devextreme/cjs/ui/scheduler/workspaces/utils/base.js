/**
 * DevExtreme (cjs/ui/scheduler/workspaces/utils/base.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.isDateInRange = void 0;
var _date = _interopRequireDefault(require("../../../../core/utils/date"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}
var isDateInRange = function(date, startDate, endDate, diff) {
    return diff > 0 ? _date.default.dateInRange(date, startDate, new Date(endDate.getTime() - 1)) : _date.default.dateInRange(date, endDate, startDate, "date")
};
exports.isDateInRange = isDateInRange;
