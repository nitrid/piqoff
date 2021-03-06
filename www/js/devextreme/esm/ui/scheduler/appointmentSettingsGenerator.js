/**
 * DevExtreme (esm/ui/scheduler/appointmentSettingsGenerator.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import _extends from "@babel/runtime/helpers/esm/extends";
import dateUtils from "../../core/utils/date";
import {
    isEmptyObject
} from "../../core/utils/type";
import {
    extend
} from "../../core/utils/extend";
import {
    getRecurrenceProcessor
} from "./recurrence";
import timeZoneUtils from "./utils.timeZone.js";
var toMs = dateUtils.dateToMilliseconds;
export class AppointmentSettingsGenerator {
    constructor(scheduler) {
        this.scheduler = scheduler;
        this.settingsStrategy = this.scheduler.isVirtualScrolling() ? new AppointmentSettingsGeneratorVirtualStrategy(this.scheduler) : new AppointmentSettingsGeneratorBaseStrategy(this.scheduler)
    }
    create(rawAppointment) {
        return this.settingsStrategy.create(rawAppointment)
    }
}
export class AppointmentSettingsGeneratorBaseStrategy {
    constructor(scheduler) {
        this.scheduler = scheduler
    }
    get timeZoneCalculator() {
        return this.scheduler.timeZoneCalculator
    }
    get workspace() {
        return this.scheduler.getWorkSpace()
    }
    get viewDataProvider() {
        return this.workspace.viewDataProvider
    }
    create(rawAppointment) {
        var {
            scheduler: scheduler
        } = this;
        var appointment = scheduler.createAppointmentAdapter(rawAppointment);
        var itemResources = scheduler._resourcesManager.getResourcesFromItem(rawAppointment);
        var isAllDay = this._isAllDayAppointment(rawAppointment);
        var appointmentList = this._createAppointments(appointment, itemResources);
        appointmentList = this._getProcessedByAppointmentTimeZone(appointmentList, appointment);
        if (this._canProcessNotNativeTimezoneDates(appointment)) {
            appointmentList = this._getProcessedNotNativeTimezoneDates(appointmentList, appointment)
        }
        var gridAppointmentList = this._createGridAppointmentList(appointmentList, appointment);
        gridAppointmentList = this._cropAppointmentsByStartDayHour(gridAppointmentList, rawAppointment, isAllDay);
        gridAppointmentList = this._getProcessedLongAppointmentsIfRequired(gridAppointmentList, appointment);
        var appointmentInfos = this.createAppointmentInfos(gridAppointmentList, itemResources, isAllDay, appointment.isRecurrent);
        return appointmentInfos
    }
    _getProcessedByAppointmentTimeZone(appointmentList, appointment) {
        var hasAppointmentTimeZone = !isEmptyObject(appointment.startDateTimeZone) || !isEmptyObject(appointment.endDateTimeZone);
        if (appointmentList.length > 1 && hasAppointmentTimeZone) {
            var appointmentOffsets = {
                startDate: this.timeZoneCalculator.getOffsets(appointment.startDate, appointment.startDateTimeZone),
                endDate: this.timeZoneCalculator.getOffsets(appointment.endDate, appointment.endDateTimeZone)
            };
            appointmentList.forEach(a => {
                var sourceOffsets_startDate = this.timeZoneCalculator.getOffsets(a.startDate, appointment.startDateTimeZone),
                    sourceOffsets_endDate = this.timeZoneCalculator.getOffsets(a.endDate, appointment.endDateTimeZone);
                var startDateOffsetDiff = appointmentOffsets.startDate.appointment - sourceOffsets_startDate.appointment;
                var endDateOffsetDiff = appointmentOffsets.endDate.appointment - sourceOffsets_endDate.appointment;
                if (sourceOffsets_startDate.appointment !== sourceOffsets_startDate.common) {
                    a.startDate = new Date(a.startDate.getTime() + startDateOffsetDiff * toMs("hour"))
                }
                if (sourceOffsets_endDate.appointment !== sourceOffsets_endDate.common) {
                    a.endDate = new Date(a.endDate.getTime() + endDateOffsetDiff * toMs("hour"))
                }
            })
        }
        return appointmentList
    }
    _isAllDayAppointment(rawAppointment) {
        return this.scheduler.appointmentTakesAllDay(rawAppointment) && this.workspace.supportAllDayRow()
    }
    _createAppointments(appointment, resources) {
        var appointments = this._createRecurrenceAppointments(appointment, resources);
        if (!appointment.isRecurrent && 0 === appointments.length) {
            appointments.push({
                startDate: appointment.startDate,
                endDate: appointment.endDate
            })
        }
        appointments = appointments.map(item => {
            var _item$endDate;
            var resultEndTime = null === (_item$endDate = item.endDate) || void 0 === _item$endDate ? void 0 : _item$endDate.getTime();
            if (item.startDate.getTime() === resultEndTime) {
                item.endDate.setTime(resultEndTime + toMs("minute"))
            }
            return _extends({}, item, {
                exceptionDate: new Date(item.startDate)
            })
        });
        return appointments
    }
    _canProcessNotNativeTimezoneDates(appointment) {
        var timeZoneName = this.scheduler.option("timeZone");
        var isTimeZoneSet = !isEmptyObject(timeZoneName);
        if (!isTimeZoneSet) {
            return false
        }
        if (!appointment.isRecurrent) {
            return false
        }
        return !timeZoneUtils.isEqualLocalTimeZone(timeZoneName, appointment.startDate)
    }
    _getProcessedNotNativeDateIfCrossDST(date, offset) {
        if (offset < 0) {
            var newDate = new Date(date);
            var newDateMinusOneHour = new Date(newDate);
            newDateMinusOneHour.setHours(newDateMinusOneHour.getHours() - 1);
            var newDateOffset = this.timeZoneCalculator.getOffsets(newDate).common;
            var newDateMinusOneHourOffset = this.timeZoneCalculator.getOffsets(newDateMinusOneHour).common;
            if (newDateOffset !== newDateMinusOneHourOffset) {
                return 0
            }
        }
        return offset
    }
    _getCommonOffset(date) {
        return this.timeZoneCalculator.getOffsets(date).common
    }
    _getProcessedNotNativeTimezoneDates(appointmentList, appointment) {
        return appointmentList.map(item => {
            var diffStartDateOffset = this._getCommonOffset(appointment.startDate) - this._getCommonOffset(item.startDate);
            var diffEndDateOffset = this._getCommonOffset(appointment.endDate) - this._getCommonOffset(item.endDate);
            if (0 === diffStartDateOffset && 0 === diffEndDateOffset) {
                return item
            }
            diffStartDateOffset = this._getProcessedNotNativeDateIfCrossDST(item.startDate, diffStartDateOffset);
            diffEndDateOffset = this._getProcessedNotNativeDateIfCrossDST(item.endDate, diffEndDateOffset);
            var newStartDate = new Date(item.startDate.getTime() + diffStartDateOffset * toMs("hour"));
            var newEndDate = new Date(item.endDate.getTime() + diffEndDateOffset * toMs("hour"));
            var testNewStartDate = this.timeZoneCalculator.createDate(newStartDate, {
                path: "toGrid"
            });
            var testNewEndDate = this.timeZoneCalculator.createDate(newEndDate, {
                path: "toGrid"
            });
            if (appointment.duration > testNewEndDate.getTime() - testNewStartDate.getTime()) {
                newEndDate = new Date(newStartDate.getTime() + appointment.duration)
            }
            return _extends({}, item, {
                startDate: newStartDate,
                endDate: newEndDate,
                exceptionDate: new Date(newStartDate)
            })
        })
    }
    _getProcessedLongAppointmentsIfRequired(gridAppointmentList, appointment) {
        var rawAppointment = appointment.source();
        var allDay = this.scheduler.appointmentTakesAllDay(rawAppointment);
        var dateRange = this.workspace.getDateRange();
        var renderingStrategy = this.scheduler.getLayoutManager().getRenderingStrategyInstance();
        if (renderingStrategy.needSeparateAppointment(allDay)) {
            var longStartDateParts = [];
            var resultDates = [];
            gridAppointmentList.forEach(gridAppointment => {
                var maxDate = new Date(dateRange[1]);
                var endDateOfPart = renderingStrategy.normalizeEndDateByViewEnd(rawAppointment, gridAppointment.endDate);
                longStartDateParts = dateUtils.getDatesOfInterval(gridAppointment.startDate, endDateOfPart, {
                    milliseconds: this.scheduler.getWorkSpace().getIntervalDuration(allDay)
                });
                var list = longStartDateParts.filter(startDatePart => new Date(startDatePart) < maxDate).map(date => ({
                    startDate: date,
                    endDate: new Date(new Date(date).setMilliseconds(appointment.duration)),
                    source: gridAppointment.source
                }));
                resultDates = resultDates.concat(list)
            });
            gridAppointmentList = resultDates
        }
        return gridAppointmentList
    }
    _createGridAppointmentList(appointmentList, appointment) {
        return appointmentList.map(source => {
            var offsetDifference = appointment.startDate.getTimezoneOffset() - source.startDate.getTimezoneOffset();
            if (0 !== offsetDifference && this._canProcessNotNativeTimezoneDates(appointment)) {
                source.startDate = new Date(source.startDate.getTime() + offsetDifference * toMs("minute"));
                source.endDate = new Date(source.endDate.getTime() + offsetDifference * toMs("minute"));
                source.exceptionDate = new Date(source.startDate)
            }
            var startDate = this.timeZoneCalculator.createDate(source.startDate, {
                path: "toGrid"
            });
            var endDate = this.timeZoneCalculator.createDate(source.endDate, {
                path: "toGrid"
            });
            return {
                startDate: startDate,
                endDate: endDate,
                source: source
            }
        })
    }
    _createExtremeRecurrenceDates(rawAppointment) {
        var dateRange = this.scheduler._workSpace.getDateRange();
        var startViewDate = this.scheduler.appointmentTakesAllDay(rawAppointment) ? dateUtils.trimTime(dateRange[0]) : dateRange[0];
        var endViewDate = dateRange[1];
        var commonTimeZone = this.scheduler.option("timeZone");
        if (commonTimeZone) {
            startViewDate = this.timeZoneCalculator.createDate(startViewDate, {
                path: "fromGrid"
            });
            endViewDate = this.timeZoneCalculator.createDate(endViewDate, {
                path: "fromGrid"
            });
            var daylightOffset = timeZoneUtils.getDaylightOffsetInMs(startViewDate, endViewDate);
            if (daylightOffset) {
                endViewDate = new Date(endViewDate.getTime() + daylightOffset)
            }
        }
        return [startViewDate, endViewDate]
    }
    _createRecurrenceOptions(appointment, groupIndex) {
        var [minRecurrenceDate, maxRecurrenceDate] = this._createExtremeRecurrenceDates(appointment.source(), groupIndex);
        return {
            rule: appointment.recurrenceRule,
            exception: appointment.recurrenceException,
            min: minRecurrenceDate,
            max: maxRecurrenceDate,
            firstDayOfWeek: this.scheduler.getFirstDayOfWeek(),
            start: appointment.startDate,
            end: appointment.endDate,
            getPostProcessedException: date => {
                var timeZoneName = this.scheduler.option("timeZone");
                if (isEmptyObject(timeZoneName) || timeZoneUtils.isEqualLocalTimeZone(timeZoneName, date)) {
                    return date
                }
                var appointmentOffset = this.timeZoneCalculator.getOffsets(appointment.startDate).common;
                var exceptionAppointmentOffset = this.timeZoneCalculator.getOffsets(date).common;
                var diff = appointmentOffset - exceptionAppointmentOffset;
                diff = this._getProcessedNotNativeDateIfCrossDST(date, diff);
                return new Date(date.getTime() - diff * dateUtils.dateToMilliseconds("hour"))
            }
        }
    }
    _createRecurrenceAppointments(appointment, resources) {
        var {
            duration: duration
        } = appointment;
        var option = this._createRecurrenceOptions(appointment);
        var generatedStartDates = getRecurrenceProcessor().generateDates(option);
        return generatedStartDates.map(date => {
            var utcDate = timeZoneUtils.createUTCDateWithLocalOffset(date);
            utcDate.setTime(utcDate.getTime() + duration);
            var endDate = timeZoneUtils.createDateFromUTCWithLocalOffset(utcDate);
            return {
                startDate: new Date(date),
                endDate: endDate
            }
        })
    }
    _cropAppointmentsByStartDayHour(appointments, rawAppointment, isAllDay) {
        return appointments.map(appointment => {
            var startDate = new Date(appointment.startDate);
            var firstViewDate = this._getAppointmentFirstViewDate(appointment, rawAppointment);
            var startDayHour = this._getViewStartDayHour(firstViewDate);
            appointment.startDate = this._getAppointmentResultDate({
                appointment: appointment,
                rawAppointment: rawAppointment,
                startDate: startDate,
                startDayHour: startDayHour,
                firstViewDate: firstViewDate
            });
            return appointment
        })
    }
    _getAppointmentFirstViewDate() {
        return this.scheduler.getStartViewDate()
    }
    _getViewStartDayHour() {
        return this.scheduler._getCurrentViewOption("startDayHour")
    }
    _getAppointmentResultDate(options) {
        var {
            appointment: appointment,
            rawAppointment: rawAppointment,
            startDayHour: startDayHour,
            firstViewDate: firstViewDate
        } = options;
        var {
            startDate: startDate
        } = options;
        var resultDate = new Date(appointment.startDate);
        if (this.scheduler.appointmentTakesAllDay(rawAppointment)) {
            resultDate = dateUtils.normalizeDate(startDate, firstViewDate)
        } else {
            if (startDate < firstViewDate) {
                startDate = firstViewDate
            }
            resultDate = dateUtils.normalizeDate(appointment.startDate, startDate)
        }
        return dateUtils.roundDateByStartDayHour(resultDate, startDayHour)
    }
    createAppointmentInfos(gridAppointments, resources, isAllDay, recurrent) {
        var _this = this;
        var result = [];
        var _loop = function(i) {
            var appointment = gridAppointments[i];
            var coordinates = _this.getCoordinates({
                appointment: appointment,
                resources: resources,
                isAllDay: isAllDay,
                recurrent: recurrent
            });
            coordinates.forEach(coordinate => {
                extend(coordinate, {
                    info: {
                        appointment: gridAppointments[i],
                        sourceAppointment: gridAppointments[i].source
                    }
                })
            });
            result = result.concat(coordinates)
        };
        for (var i = 0; i < gridAppointments.length; i++) {
            _loop(i)
        }
        return result
    }
    getCoordinates(options) {
        var {
            appointment: appointment,
            resources: resources,
            isAllDay: isAllDay
        } = options;
        return this.workspace.getCoordinatesByDateInGroup(appointment.startDate, resources, isAllDay)
    }
}
export class AppointmentSettingsGeneratorVirtualStrategy extends AppointmentSettingsGeneratorBaseStrategy {
    get viewDataProvider() {
        return this.workspace.viewDataProvider
    }
    get isVerticalGrouping() {
        return this.workspace._isVerticalGroupedWorkSpace()
    }
    createAppointmentInfos(gridAppointments, resources, allDay, recurrent) {
        var appointments = allDay ? gridAppointments : gridAppointments.filter(_ref => {
            var {
                source: source,
                startDate: startDate,
                endDate: endDate
            } = _ref;
            var {
                groupIndex: groupIndex
            } = source;
            return this.viewDataProvider.isGroupIntersectDateInterval(groupIndex, startDate, endDate)
        });
        if (recurrent) {
            return this._createRecurrentAppointmentInfos(appointments, resources, allDay)
        }
        return super.createAppointmentInfos(appointments, resources, allDay, recurrent)
    }
    getCoordinates(options) {
        var {
            appointment: appointment,
            isAllDay: isAllDay,
            resources: resources,
            recurrent: recurrent
        } = options;
        var {
            startDate: startDate
        } = appointment;
        var {
            workspace: workspace
        } = this;
        var groupIndex = !recurrent ? appointment.source.groupIndex : void 0;
        return workspace.getCoordinatesByDateInGroup(startDate, resources, isAllDay, groupIndex)
    }
    _createRecurrentAppointmentInfos(gridAppointments, resources, allDay) {
        var result = [];
        gridAppointments.forEach(appointment => {
            var {
                source: source
            } = appointment;
            var {
                groupIndex: groupIndex
            } = source;
            var coordinate = this.workspace.getCoordinatesByDate(appointment.startDate, groupIndex, allDay);
            if (coordinate) {
                extend(coordinate, {
                    info: {
                        appointment: appointment,
                        sourceAppointment: source
                    }
                });
                result.push(coordinate)
            }
        });
        return result
    }
    _cropAppointmentsByStartDayHour(appointments, rawAppointment, isAllDay) {
        return appointments.filter(appointment => {
            var firstViewDate = this._getAppointmentFirstViewDate(appointment, rawAppointment);
            if (!firstViewDate) {
                return false
            }
            var startDayHour = this._getViewStartDayHour(firstViewDate);
            var startDate = new Date(appointment.startDate);
            appointment.startDate = this._getAppointmentResultDate({
                appointment: appointment,
                rawAppointment: rawAppointment,
                startDate: startDate,
                startDayHour: startDayHour,
                firstViewDate: firstViewDate
            });
            return !isAllDay ? appointment.endDate > appointment.startDate : true
        })
    }
    _createRecurrenceAppointments(appointment, resources) {
        var {
            duration: duration
        } = appointment;
        var result = [];
        var groupIndices = this.workspace._getGroupCount() ? this._getGroupIndices(resources) : [0];
        groupIndices.forEach(groupIndex => {
            var option = this._createRecurrenceOptions(appointment, groupIndex);
            var generatedStartDates = getRecurrenceProcessor().generateDates(option);
            var recurrentInfo = generatedStartDates.map(date => {
                var startDate = new Date(date);
                var utcDate = timeZoneUtils.createUTCDateWithLocalOffset(date);
                utcDate.setTime(utcDate.getTime() + duration);
                var endDate = timeZoneUtils.createDateFromUTCWithLocalOffset(utcDate);
                return {
                    startDate: startDate,
                    endDate: endDate,
                    groupIndex: groupIndex
                }
            });
            result.push(...recurrentInfo)
        });
        return result
    }
    _getViewStartDayHour(firstViewDate) {
        return firstViewDate.getHours()
    }
    _getAppointmentFirstViewDate(appointment, rawAppointment) {
        var {
            viewDataProvider: viewDataProvider
        } = this.scheduler.getWorkSpace();
        var {
            groupIndex: groupIndex
        } = appointment.source;
        var {
            startDate: startDate,
            endDate: endDate
        } = appointment;
        var isAllDay = this._isAllDayAppointment(rawAppointment);
        return viewDataProvider.findGroupCellStartDate(groupIndex, startDate, endDate, isAllDay)
    }
    _updateGroupIndices(appointments, itemResources) {
        var groupIndices = this._getGroupIndices(itemResources);
        var result = [];
        groupIndices.forEach(groupIndex => {
            var groupStartDate = this.viewDataProvider.getGroupStartDate(groupIndex);
            if (groupStartDate) {
                appointments.forEach(appointment => {
                    var appointmentCopy = extend({}, appointment);
                    appointmentCopy.groupIndex = groupIndex;
                    result.push(appointmentCopy)
                })
            }
        });
        return result
    }
    _getGroupIndices(resources) {
        var _groupIndices;
        var groupIndices = this.workspace._getGroupIndexes(resources);
        var {
            viewDataProvider: viewDataProvider
        } = this.workspace;
        var viewDataGroupIndices = viewDataProvider.getGroupIndices();
        if (!(null !== (_groupIndices = groupIndices) && void 0 !== _groupIndices && _groupIndices.length)) {
            groupIndices = [0]
        }
        return groupIndices.filter(groupIndex => -1 !== viewDataGroupIndices.indexOf(groupIndex))
    }
    _createAppointments(appointment, resources) {
        var appointments = super._createAppointments(appointment, resources);
        return !appointment.isRecurrent ? this._updateGroupIndices(appointments, resources) : appointments
    }
}
