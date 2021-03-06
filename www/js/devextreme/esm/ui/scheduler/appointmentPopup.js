/**
 * DevExtreme (esm/ui/scheduler/appointmentPopup.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import devices from "../../core/devices";
import $ from "../../core/renderer";
import dateUtils from "../../core/utils/date";
import {
    Deferred,
    when
} from "../../core/utils/deferred";
import {
    extend
} from "../../core/utils/extend";
import {
    each
} from "../../core/utils/iterator";
import {
    isDefined,
    isEmptyObject
} from "../../core/utils/type";
import {
    getWindow,
    hasWindow
} from "../../core/utils/window";
import {
    triggerResizeEvent
} from "../../events/visibility_change";
import messageLocalization from "../../localization/message";
import Popup from "../popup";
import {
    AppointmentForm
} from "./appointment_form";
import {
    hide as hideLoading,
    show as showLoading
} from "./loading";
var toMs = dateUtils.dateToMilliseconds;
var WIDGET_CLASS = "dx-scheduler";
var APPOINTMENT_POPUP_CLASS = "".concat(WIDGET_CLASS, "-appointment-popup");
var APPOINTMENT_POPUP_WIDTH = 485;
var APPOINTMENT_POPUP_WIDTH_WITH_RECURRENCE = 970;
var APPOINTMENT_POPUP_FULLSCREEN_WINDOW_WIDTH = 1e3;
var APPOINTMENT_POPUP_FULLSCREEN_WINDOW_WIDTH_MOBILE = 500;
var APPOINTMENT_POPUP_WIDTH_MOBILE = 350;
var TOOLBAR_ITEM_AFTER_LOCATION = "after";
var TOOLBAR_ITEM_BEFORE_LOCATION = "before";
var DAY_IN_MS = toMs("day");
export default class AppointmentPopup {
    constructor(scheduler) {
        this.scheduler = scheduler;
        this._popup = null;
        this._appointmentForm = null;
        this.state = {
            lastEditData: null,
            saveChangesLocker: false,
            appointment: {
                data: null,
                isEmptyText: false,
                isEmptyDescription: false
            }
        }
    }
    show() {
        var data = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        var isDoneButtonVisible = arguments.length > 1 ? arguments[1] : void 0;
        if (isEmptyObject(data)) {
            var startDate = this.scheduler.option("currentDate");
            var endDate = new Date(startDate.getTime() + this.scheduler.option("cellDuration") * toMs("minute"));
            this.scheduler.fire("setField", "startDate", data, startDate);
            this.scheduler.fire("setField", "endDate", data, endDate)
        }
        this.state.appointment.data = data;
        if (!this._popup) {
            var popupConfig = this._createPopupConfig();
            this._popup = this._createPopup(popupConfig)
        }
        this._popup.option("toolbarItems", this._createPopupToolbarItems(isDoneButtonVisible));
        this._popup.show()
    }
    hide() {
        this._popup.hide()
    }
    isVisible() {
        return this._popup ? this._popup.option("visible") : false
    }
    dispose() {
        if (this._$popup) {
            this._popup.$element().remove();
            this._$popup = null
        }
    }
    _createPopup(options) {
        var popupElement = $("<div>").addClass(APPOINTMENT_POPUP_CLASS).appendTo(this.scheduler.$element());
        return this.scheduler._createComponent(popupElement, Popup, options)
    }
    _createPopupConfig() {
        return {
            height: "auto",
            maxHeight: "100%",
            showCloseButton: false,
            showTitle: false,
            onHiding: () => {
                this.scheduler.focus()
            },
            contentTemplate: () => this._createPopupContent(),
            onShowing: e => this._onShowing(e),
            defaultOptionsRules: [{
                device: () => devices.current().android,
                options: {
                    showTitle: false
                }
            }]
        }
    }
    _onShowing(e) {
        this._updateForm();
        var arg = {
            form: this._appointmentForm,
            popup: this._popup,
            appointmentData: this.state.appointment.data,
            cancel: false
        };
        this.scheduler._actions.onAppointmentFormOpening(arg);
        this.scheduler._processActionResult(arg, canceled => {
            if (canceled) {
                e.cancel = true
            } else {
                this.updatePopupFullScreenMode()
            }
        })
    }
    _createPopupContent() {
        var formElement = $("<div>");
        this._appointmentForm = this._createForm(formElement);
        return formElement
    }
    _createAppointmentFormData(rawAppointment) {
        var appointment = this._createAppointmentAdapter(rawAppointment);
        var result = extend(true, {
            repeat: !!appointment.recurrenceRule
        }, rawAppointment);
        each(this.scheduler._resourcesManager.getResourcesFromItem(result, true) || {}, (name, value) => result[name] = value);
        return result
    }
    _createForm(element) {
        var {
            expr: expr
        } = this.scheduler._dataAccessors;
        var resources = this.scheduler.option("resources");
        var allowTimeZoneEditing = this._getAllowTimeZoneEditing();
        var rawAppointment = this.state.appointment.data;
        var formData = this._createAppointmentFormData(rawAppointment);
        var readOnly = this._isReadOnly(rawAppointment);
        AppointmentForm.prepareAppointmentFormEditors(expr, this.scheduler, this.triggerResize.bind(this), this.changeSize.bind(this), formData, allowTimeZoneEditing, readOnly);
        if (resources && resources.length) {
            AppointmentForm.concatResources(this.scheduler._resourcesManager.getEditors())
        }
        return AppointmentForm.create(this.scheduler._createComponent.bind(this.scheduler), element, readOnly, formData)
    }
    _getAllowTimeZoneEditing() {
        var scheduler = this.scheduler;
        return scheduler.option("editing.allowTimeZoneEditing") || scheduler.option("editing.allowEditingTimeZones")
    }
    _isReadOnly(rawAppointment) {
        var adapter = this.scheduler.createAppointmentAdapter(rawAppointment);
        if (rawAppointment && adapter.disabled) {
            return true
        }
        return this.scheduler._editAppointmentData ? !this.scheduler._editing.allowUpdating : false
    }
    _createAppointmentAdapter(rawAppointment) {
        return this.scheduler.createAppointmentAdapter(rawAppointment)
    }
    _updateForm() {
        var {
            data: data
        } = this.state.appointment;
        var adapter = this._createAppointmentAdapter(data);
        var allDay = adapter.allDay;
        var startDate = adapter.startDate && adapter.calculateStartDate("toAppointment");
        var endDate = adapter.endDate && adapter.calculateEndDate("toAppointment");
        this.state.appointment.isEmptyText = void 0 === data || void 0 === adapter.text;
        this.state.appointment.isEmptyDescription = void 0 === data || void 0 === adapter.description;
        var appointment = this._createAppointmentAdapter(this._createAppointmentFormData(data));
        if (void 0 === appointment.text) {
            appointment.text = ""
        }
        if (void 0 === appointment.description) {
            appointment.description = ""
        }
        if (void 0 === appointment.recurrenceRule) {
            appointment.recurrenceRule = ""
        }
        var formData = appointment.source();
        if (startDate) {
            this.scheduler.fire("setField", "startDate", formData, startDate)
        }
        if (endDate) {
            this.scheduler.fire("setField", "endDate", formData, endDate)
        }
        var {
            startDateExpr: startDateExpr,
            endDateExpr: endDateExpr
        } = this.scheduler._dataAccessors.expr;
        this._appointmentForm.option("readOnly", this._isReadOnly(data));
        AppointmentForm.updateFormData(this._appointmentForm, formData, this.scheduler._dataAccessors.expr);
        AppointmentForm.setEditorsType(this._appointmentForm, startDateExpr, endDateExpr, allDay)
    }
    _isDeviceMobile() {
        return "desktop" !== devices.current().deviceType
    }
    _isPopupFullScreenNeeded() {
        var width = this._tryGetWindowWidth();
        if (width) {
            return this._isDeviceMobile() ? width < APPOINTMENT_POPUP_FULLSCREEN_WINDOW_WIDTH_MOBILE : width < APPOINTMENT_POPUP_FULLSCREEN_WINDOW_WIDTH
        }
        return false
    }
    _tryGetWindowWidth() {
        if (hasWindow()) {
            var window = getWindow();
            return $(window).width()
        }
    }
    triggerResize() {
        this._popup && triggerResizeEvent(this._popup.$element())
    }
    _getMaxWidth(isRecurrence) {
        if (this._isDeviceMobile()) {
            return APPOINTMENT_POPUP_WIDTH_MOBILE
        }
        return isRecurrence ? APPOINTMENT_POPUP_WIDTH_WITH_RECURRENCE : APPOINTMENT_POPUP_WIDTH
    }
    changeSize(isRecurrence) {
        var isFullScreen = this._isPopupFullScreenNeeded();
        this._popup.option({
            maxWidth: isFullScreen ? "100%" : this._getMaxWidth(isRecurrence),
            fullScreen: isFullScreen
        })
    }
    updatePopupFullScreenMode() {
        if (!this._appointmentForm) {
            return
        }
        var isRecurrence = AppointmentForm.getRecurrenceRule(this._appointmentForm.option("formData"), this.scheduler._dataAccessors.expr);
        if (this.isVisible()) {
            this.changeSize(isRecurrence)
        }
    }
    _createPopupToolbarItems(isDoneButtonVisible) {
        var result = [];
        var isIOs = "ios" === devices.current().platform;
        if (isDoneButtonVisible) {
            result.push({
                shortcut: "done",
                options: {
                    text: messageLocalization.format("Done")
                },
                location: TOOLBAR_ITEM_AFTER_LOCATION,
                onClick: e => this._doneButtonClickHandler(e)
            })
        }
        result.push({
            shortcut: "cancel",
            location: isIOs ? TOOLBAR_ITEM_BEFORE_LOCATION : TOOLBAR_ITEM_AFTER_LOCATION
        });
        return result
    }
    saveChanges(showLoadPanel) {
        var deferred = new Deferred;
        var validation = this._appointmentForm.validate();
        var state = this.state.appointment;
        showLoadPanel && this._showLoadPanel();
        when(validation && validation.complete || validation).done(validation => {
            if (validation && !validation.isValid) {
                this._hideLoadPanel();
                deferred.resolve(false);
                return
            }
            var formData = this._appointmentForm.option("formData");
            var adapter = this.scheduler.createAppointmentAdapter(formData);
            var appointment = adapter.clone({
                pathTimeZone: "fromAppointment"
            }).source();
            var oldData = this.scheduler._editAppointmentData;
            var recData = this.scheduler._updatedRecAppointment;
            if (state.isEmptyText && "" === adapter.text) {
                delete appointment.text
            }
            if (state.isEmptyDescription && "" === adapter.description) {
                delete appointment.description
            }
            if (void 0 === state.data.recurrenceRule && "" === adapter.recurrenceRule) {
                delete appointment.recurrenceRule
            }
            if (isDefined(appointment.repeat)) {
                delete appointment.repeat
            }
            if (oldData && !recData) {
                this.scheduler.updateAppointment(oldData, appointment).done(deferred.resolve)
            } else {
                if (recData) {
                    this.scheduler.updateAppointment(oldData, recData);
                    delete this.scheduler._updatedRecAppointment
                }
                this.scheduler.addAppointment(appointment).done(deferred.resolve)
            }
            deferred.done(() => {
                this._hideLoadPanel();
                this.state.lastEditData = appointment
            })
        });
        return deferred.promise()
    }
    _doneButtonClickHandler(e) {
        e.cancel = true;
        this.saveEditData()
    }
    saveEditData() {
        var deferred = new Deferred;
        if (this._tryLockSaveChanges()) {
            when(this.saveChanges(true)).done(() => {
                if (this.state.lastEditData) {
                    var adapter = this.scheduler.createAppointmentAdapter(this.state.lastEditData);
                    var {
                        startDate: startDate,
                        endDate: endDate,
                        allDay: allDay
                    } = adapter;
                    var startTime = startDate.getTime();
                    var endTime = endDate.getTime();
                    var inAllDayRow = allDay || endTime - startTime >= DAY_IN_MS;
                    this.scheduler._workSpace.updateScrollPosition(startDate, this.scheduler._resourcesManager.getResourcesFromItem(this.state.lastEditData, true), inAllDayRow);
                    this.state.lastEditData = null
                }
                this._unlockSaveChanges();
                deferred.resolve()
            })
        }
        return deferred.promise()
    }
    _hideLoadPanel() {
        hideLoading()
    }
    _showLoadPanel() {
        var $overlayContent = this._popup.$overlayContent();
        showLoading({
            container: $overlayContent,
            position: {
                of: $overlayContent
            }
        })
    }
    _tryLockSaveChanges() {
        if (false === this.state.saveChangesLocker) {
            this.state.saveChangesLocker = true;
            return true
        }
        return false
    }
    _unlockSaveChanges() {
        this.state.saveChangesLocker = false
    }
}
