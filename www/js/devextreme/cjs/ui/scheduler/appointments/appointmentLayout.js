/**
 * DevExtreme (cjs/ui/scheduler/appointments/appointmentLayout.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.createAgendaAppointmentLayout = exports.createAppointmentLayout = void 0;
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _dom_adapter = _interopRequireDefault(require("../../../core/dom_adapter"));
var _message = _interopRequireDefault(require("../../../localization/message"));
var _constants = require("../constants");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}
var allDayText = " " + _message.default.format("dxScheduler-allDay") + ": ";
var createAppointmentLayout = function(formatText, config) {
    var result = (0, _renderer.default)(_dom_adapter.default.createDocumentFragment());
    (0, _renderer.default)("<div>").text(formatText.text).addClass(_constants.APPOINTMENT_CONTENT_CLASSES.APPOINTMENT_TITLE).appendTo(result);
    if (config.html) {
        result.html(config.html)
    }
    var $contentDetails = (0, _renderer.default)("<div>").addClass(_constants.APPOINTMENT_CONTENT_CLASSES.APPOINTMENT_CONTENT_DETAILS).appendTo(result);
    (0, _renderer.default)("<div>").addClass(_constants.APPOINTMENT_CONTENT_CLASSES.APPOINTMENT_DATE).text(formatText.formatDate).appendTo($contentDetails);
    config.isRecurrence && (0, _renderer.default)("<span>").addClass(_constants.APPOINTMENT_CONTENT_CLASSES.RECURRING_ICON + " dx-icon-repeat").appendTo(result);
    config.isAllDay && (0, _renderer.default)("<div>").text(allDayText).addClass(_constants.APPOINTMENT_CONTENT_CLASSES.ALL_DAY_CONTENT).prependTo($contentDetails);
    return result
};
exports.createAppointmentLayout = createAppointmentLayout;
var createAgendaAppointmentLayout = function(formatText, config) {
    var result = (0, _renderer.default)(_dom_adapter.default.createDocumentFragment());
    var leftLayoutContainer = (0, _renderer.default)("<div>").addClass("dx-scheduler-agenda-appointment-left-layout").appendTo(result);
    var rightLayoutContainer = (0, _renderer.default)("<div>").addClass("dx-scheduler-agenda-appointment-right-layout").appendTo(result);
    var marker = (0, _renderer.default)("<div>").addClass(_constants.APPOINTMENT_CONTENT_CLASSES.AGENDA_MARKER).appendTo(leftLayoutContainer);
    config.isRecurrence && (0, _renderer.default)("<span>").addClass(_constants.APPOINTMENT_CONTENT_CLASSES.RECURRING_ICON + " dx-icon-repeat").appendTo(marker);
    (0, _renderer.default)("<div>").addClass(_constants.APPOINTMENT_CONTENT_CLASSES.APPOINTMENT_TITLE).text(formatText.text).appendTo(rightLayoutContainer);
    var additionalContainer = (0, _renderer.default)("<div>").addClass(_constants.APPOINTMENT_CONTENT_CLASSES.APPOINTMENT_CONTENT_DETAILS).appendTo(rightLayoutContainer);
    (0, _renderer.default)("<div>").addClass(_constants.APPOINTMENT_CONTENT_CLASSES.APPOINTMENT_DATE).text(formatText.formatDate).appendTo(additionalContainer);
    config.isAllDay && (0, _renderer.default)("<div>").text(allDayText).addClass(_constants.APPOINTMENT_CONTENT_CLASSES.ALL_DAY_CONTENT).prependTo(additionalContainer);
    return result
};
exports.createAgendaAppointmentLayout = createAgendaAppointmentLayout;
