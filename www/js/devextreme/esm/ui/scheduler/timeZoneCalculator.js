/**
 * DevExtreme (esm/ui/scheduler/timeZoneCalculator.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import {
    isDefined
} from "../../core/utils/type";
import dateUtils from "../../core/utils/date";
var toMs = dateUtils.dateToMilliseconds;
export var PathTimeZoneConversion = {
    fromSourceToAppointment: "toAppointment",
    fromAppointmentToSource: "fromAppointment",
    fromSourceToGrid: "toGrid",
    fromGridToSource: "fromGrid"
};
export class TimeZoneCalculator {
    constructor(options) {
        this.options = options
    }
    createDate(sourceDate, info) {
        var date = new Date(sourceDate);
        switch (info.path) {
            case PathTimeZoneConversion.fromSourceToAppointment:
                return this._getConvertedDate(date, info.appointmentTimeZone, true);
            case PathTimeZoneConversion.fromAppointmentToSource:
                return this._getConvertedDate(date, info.appointmentTimeZone, true, true);
            case PathTimeZoneConversion.fromSourceToGrid:
                return this._getConvertedDate(date, info.appointmentTimeZone, false);
            case PathTimeZoneConversion.fromGridToSource:
                return this._getConvertedDate(date, info.appointmentTimeZone, false, true)
        }
        throw new Error("not specified pathTimeZoneConversion")
    }
    getOffsets(date, appointmentTimezone) {
        var clientOffset = -this._getClientOffset(date) / toMs("hour");
        var commonOffset = this._getCommonOffset(date);
        var appointmentOffset = this._getAppointmentOffset(date, appointmentTimezone);
        return {
            client: clientOffset,
            common: !isDefined(commonOffset) ? clientOffset : commonOffset,
            appointment: "number" !== typeof appointmentOffset ? clientOffset : appointmentOffset
        }
    }
    _getClientOffset(date) {
        return this.options.getClientOffset(date)
    }
    _getCommonOffset(date) {
        return this.options.getCommonOffset(date)
    }
    _getAppointmentOffset(date, appointmentTimezone) {
        return this.options.getAppointmentOffset(date, appointmentTimezone)
    }
    _getConvertedDate(date, appointmentTimezone, useAppointmentTimeZone, isBack) {
        var newDate = new Date(date.getTime());
        var offsets = this.getOffsets(newDate, appointmentTimezone);
        if (useAppointmentTimeZone && !!appointmentTimezone) {
            return this._getConvertedDateByOffsets(date, offsets.client, offsets.appointment, isBack)
        }
        return this._getConvertedDateByOffsets(date, offsets.client, offsets.common, isBack)
    }
    _getConvertedDateByOffsets(date, clientOffset, targetOffset, isBack) {
        var direction = isBack ? -1 : 1;
        var utcDate = date.getTime() - direction * clientOffset * toMs("hour");
        return new Date(utcDate + direction * targetOffset * toMs("hour"))
    }
}
