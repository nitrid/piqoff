/**
 * DevExtreme (cjs/ui/scheduler/subscribes.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _array = require("../../core/utils/array");
var _type = require("../../core/utils/type");
var _date = _interopRequireDefault(require("../../core/utils/date"));
var _iterator = require("../../core/utils/iterator");
var _ui = _interopRequireDefault(require("../widget/ui.errors"));
var _translator = require("../../animation/translator");
var _common = require("../../core/utils/common");
var _extend = require("../../core/utils/extend");
var _deferred = require("../../core/utils/deferred");
var _date2 = _interopRequireDefault(require("../../localization/date"));
var _utils = _interopRequireDefault(require("./utils.timeZone"));
var _constants = require("./constants");
var _utils2 = _interopRequireDefault(require("./utils"));
var _utils3 = require("./resources/utils");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}
var toMs = _date.default.dateToMilliseconds;
var subscribes = {
    getTimeZoneCalculator: function() {
        return this.timeZoneCalculator
    },
    isCurrentViewAgenda: function() {
        return "agenda" === this.option("currentView")
    },
    currentViewUpdated: function(currentView) {
        this.option("currentView", currentView)
    },
    currentDateUpdated: function(date) {
        this.option("currentDate", date)
    },
    getOption: function(name) {
        return this.option(name)
    },
    isVirtualScrolling: function() {
        return this.isVirtualScrolling()
    },
    setCellDataCacheAlias: function(appointment, geometry) {
        this._workSpace.setCellDataCacheAlias(appointment, geometry)
    },
    createAppointmentSettings: function(appointment) {
        return this._getAppointmentSettingsGenerator().create(appointment)
    },
    isGroupedByDate: function() {
        return this.getWorkSpace().isGroupedByDate()
    },
    showAppointmentTooltip: function(options) {
        var targetedAppointment = this.getTargetedAppointment(options.data, options.target);
        this.showAppointmentTooltip(options.data, options.target, targetedAppointment)
    },
    hideAppointmentTooltip: function() {
        this.hideAppointmentTooltip()
    },
    showAddAppointmentPopup: function(cellData, cellGroups) {
        var appointmentAdapter = this.createAppointmentAdapter({});
        appointmentAdapter.allDay = cellData.allDay;
        appointmentAdapter.startDate = this.timeZoneCalculator.createDate(cellData.startDate, {
            path: "fromGrid"
        });
        appointmentAdapter.endDate = this.timeZoneCalculator.createDate(cellData.endDate, {
            path: "fromGrid"
        });
        var resultAppointment = (0, _extend.extend)(appointmentAdapter.source(), cellGroups);
        this.showAppointmentPopup(resultAppointment, true)
    },
    showEditAppointmentPopup: function(options) {
        var targetedData = this.getTargetedAppointment(options.data, options.target);
        this.showAppointmentPopup(options.data, false, targetedData)
    },
    updateAppointmentAfterResize: function(options) {
        var info = _utils2.default.dataAccessors.getAppointmentInfo(options.$appointment);
        var exceptionDate = info.sourceAppointment.exceptionDate;
        this._checkRecurringAppointment(options.target, options.data, exceptionDate, function() {
            this._updateAppointment(options.target, options.data, (function() {
                this._appointments.moveAppointmentBack()
            }))
        }.bind(this))
    },
    getUpdatedData: function(rawAppointment) {
        return this._getUpdatedData(rawAppointment)
    },
    updateAppointmentAfterDrag: function(_ref) {
        var event = _ref.event,
            element = _ref.element,
            rawAppointment = _ref.rawAppointment,
            coordinates = _ref.coordinates;
        var info = _utils2.default.dataAccessors.getAppointmentInfo(element);
        var appointment = this.createAppointmentAdapter(rawAppointment);
        var targetedAppointment = this.createAppointmentAdapter((0, _extend.extend)({}, rawAppointment, this._getUpdatedData(rawAppointment)));
        var targetedRawAppointment = targetedAppointment.source();
        var newCellIndex = this._workSpace.getDroppableCellIndex();
        var oldCellIndex = this._workSpace.getCellIndexByCoordinates(coordinates);
        var becomeAllDay = targetedAppointment.allDay;
        var wasAllDay = appointment.allDay;
        var movedBetweenAllDayAndSimple = this._workSpace.supportAllDayRow() && (wasAllDay && !becomeAllDay || !wasAllDay && becomeAllDay);
        if (newCellIndex !== oldCellIndex || movedBetweenAllDayAndSimple) {
            this._checkRecurringAppointment(rawAppointment, targetedRawAppointment, info.sourceAppointment.exceptionDate, function() {
                this._updateAppointment(rawAppointment, targetedRawAppointment, (function() {
                    this._appointments.moveAppointmentBack(event)
                }), event)
            }.bind(this), void 0, void 0, event)
        } else {
            this._appointments.moveAppointmentBack(event)
        }
    },
    onDeleteButtonPress: function(options) {
        var targetedData = this.getTargetedAppointment(options.data, (0, _renderer.default)(options.target));
        this.checkAndDeleteAppointment(options.data, targetedData);
        this.hideAppointmentTooltip()
    },
    getAppointmentColor: function(options) {
        var resourcesManager = this._resourcesManager;
        var resourceForPainting = resourcesManager.getResourceForPainting(this._getCurrentViewOption("groups"));
        var response = (new _deferred.Deferred).resolve().promise();
        if (resourceForPainting) {
            var field = (0, _utils3.getFieldExpr)(resourceForPainting);
            var groupIndex = options.groupIndex;
            var groups = this._workSpace._getCellGroups(groupIndex);
            var resourceValues = (0, _array.wrapToArray)(resourcesManager.getDataAccessors(field, "getter")(options.itemData));
            var groupId = resourceValues.length ? resourceValues[0] : void 0;
            for (var i = 0; i < groups.length; i++) {
                if (groups[i].name === field) {
                    groupId = groups[i].id;
                    break
                }
            }
            response = resourcesManager.getResourceColor(field, groupId)
        }
        return response
    },
    getHeaderHeight: function() {
        return this._header._$element && parseInt(this._header._$element.outerHeight(), 10)
    },
    getResourcesFromItem: function(itemData) {
        return this._resourcesManager.getResourcesFromItem(itemData)
    },
    appointmentTakesSeveralDays: function(appointment) {
        return this._appointmentModel.appointmentTakesSeveralDays(appointment)
    },
    getTextAndFormatDate: function(appointmentRaw, targetedAppointmentRaw, format) {
        var appointmentAdapter = this.createAppointmentAdapter(appointmentRaw);
        var targetedAdapter = this.createAppointmentAdapter(targetedAppointmentRaw || appointmentRaw);
        var startDate = this.timeZoneCalculator.createDate(targetedAdapter.startDate, {
            path: "toGrid"
        });
        var endDate = this.timeZoneCalculator.createDate(targetedAdapter.endDate, {
            path: "toGrid"
        });
        var formatType = format || this.fire("_getTypeFormat", startDate, endDate, targetedAdapter.allDay);
        return {
            text: targetedAdapter.text || appointmentAdapter.text,
            formatDate: this.fire("_formatDates", startDate, endDate, formatType)
        }
    },
    _getTypeFormat: function(startDate, endDate, isAllDay) {
        if (isAllDay) {
            return "DATE"
        }
        if ("month" !== this.option("currentView") && _date.default.sameDate(startDate, endDate)) {
            return "TIME"
        }
        return "DATETIME"
    },
    _createAppointmentTitle: function(data) {
        if ((0, _type.isPlainObject)(data)) {
            return data.text
        }
        return String(data)
    },
    _formatDates: function(startDate, endDate, formatType) {
        var isSameDate = startDate.getDate() === endDate.getDate();
        switch (formatType) {
            case "DATETIME":
                return [_date2.default.format(startDate, "monthandday"), " ", _date2.default.format(startDate, "shorttime"), " - ", isSameDate ? "" : _date2.default.format(endDate, "monthandday") + " ", _date2.default.format(endDate, "shorttime")].join("");
            case "TIME":
                return "".concat(_date2.default.format(startDate, "shorttime"), " - ").concat(_date2.default.format(endDate, "shorttime"));
            case "DATE":
                return "".concat(_date2.default.format(startDate, "monthandday")).concat(isSameDate ? "" : " - " + _date2.default.format(endDate, "monthandday"))
        }
    },
    getResizableAppointmentArea: function(options) {
        var allDay = options.allDay;
        var groups = this._getCurrentViewOption("groups");
        if (groups && groups.length) {
            if (allDay || this.getLayoutManager().getRenderingStrategyInstance()._needHorizontalGroupBounds()) {
                var horizontalGroupBounds = this._workSpace.getGroupBounds(options.coordinates);
                return {
                    left: horizontalGroupBounds.left,
                    right: horizontalGroupBounds.right,
                    top: 0,
                    bottom: 0
                }
            }
            if (this.getLayoutManager().getRenderingStrategyInstance()._needVerticalGroupBounds(allDay) && this._workSpace._isVerticalGroupedWorkSpace()) {
                var verticalGroupBounds = this._workSpace.getGroupBounds(options.coordinates);
                return {
                    left: 0,
                    right: 0,
                    top: verticalGroupBounds.top,
                    bottom: verticalGroupBounds.bottom
                }
            }
        }
    },
    needRecalculateResizableArea: function() {
        return this.getWorkSpace().needRecalculateResizableArea()
    },
    getAppointmentGeometry: function(settings) {
        return this.getLayoutManager().getRenderingStrategyInstance().getAppointmentGeometry(settings)
    },
    isAllDay: function(appointmentData) {
        return this.getLayoutManager().getRenderingStrategyInstance().isAllDay(appointmentData)
    },
    getDeltaTime: function(e, initialSize, itemData) {
        return this.getLayoutManager().getRenderingStrategyInstance().getDeltaTime(e, initialSize, itemData)
    },
    getDropDownAppointmentWidth: function(isAllDay) {
        return this.getLayoutManager().getRenderingStrategyInstance().getDropDownAppointmentWidth(this._getViewCountConfig().intervalCount, isAllDay)
    },
    getDropDownAppointmentHeight: function() {
        return this.getLayoutManager().getRenderingStrategyInstance().getDropDownAppointmentHeight()
    },
    getCellWidth: function() {
        return this.getWorkSpace().getCellWidth()
    },
    getCellHeight: function() {
        return this.getWorkSpace().getCellHeight()
    },
    getResizableStep: function() {
        var workSpace = this.getWorkSpace();
        var cellWidth = workSpace.getCellWidth();
        if (workSpace.isGroupedByDate()) {
            return workSpace._getGroupCount() * cellWidth
        }
        return cellWidth
    },
    getRenderingStrategy: function() {
        return this._getAppointmentsRenderingStrategy()
    },
    getMaxAppointmentCountPerCellByType: function(isAllDay) {
        return this.getRenderingStrategyInstance()._getMaxAppointmentCountPerCellByType(isAllDay)
    },
    needCorrectAppointmentDates: function() {
        return this.getRenderingStrategyInstance().needCorrectAppointmentDates()
    },
    getRenderingStrategyDirection: function() {
        return this.getRenderingStrategyInstance().getDirection()
    },
    getWorkSpaceDateTableOffset: function() {
        return this.getWorkSpaceDateTableOffset()
    },
    getFullWeekAppointmentWidth: function(options) {
        var groupIndex = options.groupIndex;
        return this._workSpace.getGroupWidth(groupIndex)
    },
    getMaxAppointmentWidth: function(options) {
        var workSpace = this._workSpace;
        return workSpace.getCellCountToLastViewDate(options.date) * workSpace.getCellWidth()
    },
    updateAppointmentStartDate: function(options) {
        var appointment = options.appointment;
        var firstViewDate = this._workSpace.getStartViewDate();
        var startDate = new Date(options.startDate);
        var startDayHour = this._getCurrentViewOption("startDayHour");
        var updatedStartDate;
        if (this.appointmentTakesAllDay(appointment)) {
            updatedStartDate = _date.default.normalizeDate(startDate, firstViewDate)
        } else {
            if (startDate < firstViewDate) {
                startDate = firstViewDate
            }
            updatedStartDate = _date.default.normalizeDate(options.startDate, new Date(startDate))
        }
        return _date.default.roundDateByStartDayHour(updatedStartDate, startDayHour)
    },
    updateAppointmentEndDate: function(options) {
        var endDate = options.endDate;
        var endDayHour = this._getCurrentViewOption("endDayHour");
        var startDayHour = this._getCurrentViewOption("startDayHour");
        var updatedEndDate = endDate;
        if (endDate.getHours() >= endDayHour) {
            updatedEndDate.setHours(endDayHour, 0, 0, 0)
        } else if (!options.isSameDate && startDayHour > 0 && 60 * endDate.getHours() + endDate.getMinutes() < 60 * startDayHour) {
            updatedEndDate = new Date(updatedEndDate.getTime() - toMs("day"));
            updatedEndDate.setHours(endDayHour, 0, 0, 0)
        }
        return updatedEndDate
    },
    renderCompactAppointments: function(options) {
        this._compactAppointmentsHelper.render(options)
    },
    clearCompactAppointments: function() {
        this._compactAppointmentsHelper.clear()
    },
    supportCompactDropDownAppointments: function() {
        return this._workSpace._supportCompactDropDownAppointments()
    },
    isApplyCompactAppointmentOffset: function() {
        return this._workSpace._isApplyCompactAppointmentOffset()
    },
    getGroupCount: function() {
        return this._workSpace._getGroupCount()
    },
    mapAppointmentFields: function(config) {
        var itemData = config.itemData,
            itemElement = config.itemElement,
            targetedAppointment = config.targetedAppointment;
        var targetedData = targetedAppointment || this.getTargetedAppointment(itemData, itemElement);
        return {
            appointmentData: config.itemData,
            appointmentElement: config.itemElement,
            targetedAppointmentData: targetedData
        }
    },
    getOffsetByAllDayPanel: function(groupIndex) {
        return this._workSpace._getOffsetByAllDayPanel(groupIndex)
    },
    getGroupTop: function(groupIndex) {
        return this._workSpace._getGroupTop(groupIndex)
    },
    updateResizableArea: function() {
        var $allResizableElements = this.$element().find(".dx-scheduler-appointment.dx-resizable");
        var horizontalResizables = (0, _common.grep)($allResizableElements, (function(el) {
            var $el = (0, _renderer.default)(el);
            var resizableInst = $el.dxResizable("instance");
            var area = resizableInst.option("area");
            return (0, _array.inArray)(resizableInst.option("handles"), ["right left", "left right"]) > -1 && (0, _type.isPlainObject)(area)
        }));
        (0, _iterator.each)(horizontalResizables, function(_, el) {
            var $el = (0, _renderer.default)(el);
            var position = (0, _translator.locate)($el);
            var appointmentData = this._appointments._getItemData($el);
            var area = this._appointments._calculateResizableArea({
                left: position.left
            }, appointmentData);
            $el.dxResizable("instance").option("area", area)
        }.bind(this))
    },
    getField: function(field, obj) {
        if (!(0, _type.isDefined)(this._dataAccessors.getter[field])) {
            return
        }
        return this._dataAccessors.getter[field](obj)
    },
    setField: function(field, obj, value) {
        if (!(0, _type.isDefined)(this._dataAccessors.setter[field])) {
            return
        }
        var splitExprStr = this.option(field + "Expr").split(".");
        var rootField = splitExprStr[0];
        if (void 0 === obj[rootField] && splitExprStr.length > 1) {
            var emptyChain = function(arr) {
                var result = {};
                var tmp = result;
                var arrLength = arr.length - 1;
                for (var i = 1; i < arrLength; i++) {
                    tmp = tmp[arr[i]] = {}
                }
                return result
            }(splitExprStr);
            obj[rootField] = emptyChain
        }
        this._dataAccessors.setter[field](obj, value);
        return obj
    },
    renderAppointments: function() {
        this._renderAppointments()
    },
    dayHasAppointment: function(day, appointment, trimTime) {
        return this.dayHasAppointment(day, appointment, trimTime)
    },
    createResourcesTree: function() {
        return this._resourcesManager.createResourcesTree(this._loadedResources)
    },
    getResourceTreeLeaves: function(tree, appointmentResources) {
        return this._resourcesManager.getResourceTreeLeaves(tree, appointmentResources)
    },
    createReducedResourcesTree: function() {
        var tree = this._resourcesManager.createResourcesTree(this._loadedResources);
        return this._resourcesManager.reduceResourcesTree(tree, this.getFilteredItems())
    },
    groupAppointmentsByResources: function(appointments) {
        var result = {
            0: appointments
        };
        var groups = this._getCurrentViewOption("groups");
        if (groups && groups.length && this._resourcesManager.getResourcesData().length) {
            result = this._resourcesManager.groupAppointmentsByResources(appointments, this._loadedResources)
        }
        var totalResourceCount = 0;
        (0, _iterator.each)(this._loadedResources, (function(i, resource) {
            if (!i) {
                totalResourceCount = resource.items.length
            } else {
                totalResourceCount *= resource.items.length
            }
        }));
        for (var j = 0; j < totalResourceCount; j++) {
            var index = j.toString();
            if (result[index]) {
                continue
            }
            result[index] = []
        }
        return result
    },
    getLayoutManager: function() {
        return this._layoutManager
    },
    getAgendaVerticalStepHeight: function() {
        return this.getWorkSpace().getAgendaVerticalStepHeight()
    },
    getAgendaDuration: function() {
        return this._getCurrentViewOption("agendaDuration")
    },
    getStartViewDate: function() {
        return this.getStartViewDate()
    },
    getEndViewDate: function() {
        return this.getEndViewDate()
    },
    getMaxAppointmentsPerCell: function() {
        return this.getMaxAppointmentsPerCell()
    },
    forceMaxAppointmentPerCell: function() {
        return this.forceMaxAppointmentPerCell()
    },
    onAgendaReady: function(rows) {
        var $appts = this.getAppointmentsInstance()._itemElements();
        var total = 0;
        var applyClass = function(_, count) {
            var index = count + total - 1;
            $appts.eq(index).addClass(_constants.AGENDA_LAST_IN_DATE_APPOINTMENT_CLASS);
            total += count
        };
        for (var i = 0; i < rows.length; i++) {
            (0, _iterator.each)(rows[i], applyClass)
        }
    },
    getTimezone: function() {
        return this._getTimezoneOffsetByOption()
    },
    getTargetedAppointmentData: function(appointment, element) {
        return this.getTargetedAppointment(appointment, element)
    },
    getAppointmentDurationInMs: function(options) {
        var startDate = options.startDate;
        var endDate = options.endDate;
        var allDay = options.allDay;
        var appointmentDuration = endDate.getTime() - startDate.getTime();
        var dayDuration = toMs("day");
        var visibleDayDuration = this._workSpace.getVisibleDayDuration();
        var result = 0;
        if (allDay) {
            var ceilQuantityOfDays = Math.ceil(appointmentDuration / dayDuration);
            result = ceilQuantityOfDays * visibleDayDuration
        } else {
            var isDifferentDates = !_utils.default.isSameAppointmentDates(startDate, endDate);
            var floorQuantityOfDays = Math.floor(appointmentDuration / dayDuration);
            var tailDuration;
            if (isDifferentDates) {
                var startDateEndHour = new Date(new Date(startDate).setHours(this.option("endDayHour"), 0, 0));
                var hiddenDayDuration = dayDuration - visibleDayDuration - (startDate.getTime() > startDateEndHour.getTime() ? startDate.getTime() - startDateEndHour.getTime() : 0);
                tailDuration = appointmentDuration - (floorQuantityOfDays ? floorQuantityOfDays * dayDuration : hiddenDayDuration);
                var startDayTime = this.option("startDayHour") * toMs("hour");
                var endPartDuration = endDate - _date.default.trimTime(endDate);
                if (endPartDuration < startDayTime) {
                    if (floorQuantityOfDays) {
                        tailDuration -= hiddenDayDuration
                    }
                    tailDuration += startDayTime - endPartDuration
                }
            } else {
                tailDuration = appointmentDuration % dayDuration
            }
            if (tailDuration > visibleDayDuration) {
                tailDuration = visibleDayDuration
            }
            result = floorQuantityOfDays * visibleDayDuration + tailDuration || toMs("minute")
        }
        return result
    },
    replaceWrongEndDate: function(appointment, startDate, endDate) {
        this._appointmentModel.replaceWrongEndDate(appointment, startDate, endDate)
    },
    calculateAppointmentEndDate: function(isAllDay, startDate) {
        return this._appointmentModel._calculateAppointmentEndDate(isAllDay, startDate)
    },
    getEndDayHour: function() {
        return this._workSpace.option("endDayHour") || this.option("endDayHour")
    },
    getStartDayHour: function() {
        return this._workSpace.option("startDayHour") || this.option("startDayHour")
    },
    isAdaptive: function() {
        return this.option("adaptivityEnabled")
    },
    validateDayHours: function() {
        var endDayHour = this._getCurrentViewOption("endDayHour");
        var startDayHour = this._getCurrentViewOption("startDayHour");
        if (startDayHour >= endDayHour) {
            throw _ui.default.Error("E1058")
        }
    },
    removeDroppableCellClass: function() {
        this._workSpace.removeDroppableCellClass()
    }
};
var _default = subscribes;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;
