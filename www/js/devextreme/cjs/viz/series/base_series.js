/**
 * DevExtreme (cjs/viz/series/base_series.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";

function _typeof(obj) {
    if ("function" === typeof Symbol && "symbol" === typeof Symbol.iterator) {
        _typeof = function(obj) {
            return typeof obj
        }
    } else {
        _typeof = function(obj) {
            return obj && "function" === typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj
        }
    }
    return _typeof(obj)
}
exports.Series = Series;
exports.mixins = void 0;
var _type = require("../../core/utils/type");
var _extend2 = require("../../core/utils/extend");
var _iterator = require("../../core/utils/iterator");
var _base_point = require("./points/base_point");
var _utils = require("../core/utils");
var _common = require("../../core/utils/common");
var _consts = _interopRequireDefault(require("../components/consts"));
var _range_data_calculator = _interopRequireDefault(require("./helpers/range_data_calculator"));
var scatterSeries = _interopRequireWildcard(require("./scatter_series"));
var lineSeries = _interopRequireWildcard(require("./line_series"));
var areaSeries = _interopRequireWildcard(require("./area_series"));
var barSeries = _interopRequireWildcard(require("./bar_series"));
var _range_series = require("./range_series");
var _bubble_series = require("./bubble_series");
var pieSeries = _interopRequireWildcard(require("./pie_series"));
var financialSeries = _interopRequireWildcard(require("./financial_series"));
var stackedSeries = _interopRequireWildcard(require("./stacked_series"));

function _getRequireWildcardCache(nodeInterop) {
    if ("function" !== typeof WeakMap) {
        return null
    }
    var cacheBabelInterop = new WeakMap;
    var cacheNodeInterop = new WeakMap;
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop
    })(nodeInterop)
}

function _interopRequireWildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj
    }
    if (null === obj || "object" !== _typeof(obj) && "function" !== typeof obj) {
        return {
            default: obj
        }
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj)
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for (var key in obj) {
        if ("default" !== key && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc)
            } else {
                newObj[key] = obj[key]
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj)
    }
    return newObj
}

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}
var seriesNS = {};
var states = _consts.default.states;
var DISCRETE = "discrete";
var SELECTED_STATE = states.selectedMark;
var HOVER_STATE = states.hoverMark;
var HOVER = states.hover;
var NORMAL = states.normal;
var SELECTION = states.selection;
var APPLY_SELECTED = states.applySelected;
var APPLY_HOVER = states.applyHover;
var RESET_ITEM = states.resetItem;
var NONE_MODE = "none";
var INCLUDE_POINTS = "includepoints";
var NEAREST_POINT = "nearestpoint";
var SERIES_SELECTION_CHANGED = "seriesSelectionChanged";
var POINT_SELECTION_CHANGED = "pointSelectionChanged";
var SERIES_HOVER_CHANGED = "seriesHoverChanged";
var POINT_HOVER_CHANGED = "pointHoverChanged";
var ALL_SERIES_POINTS = "allseriespoints";
var ALL_ARGUMENT_POINTS = "allargumentpoints";
var POINT_HOVER = "pointHover";
var CLEAR_POINT_HOVER = "clearPointHover";
var SERIES_SELECT = "seriesSelect";
var POINT_SELECT = "pointSelect";
var POINT_DESELECT = "pointDeselect";
var getEmptyBusinessRange = function() {
    return {
        arg: {},
        val: {}
    }
};

function triggerEvent(element, event, point) {
    element && element.trigger(event, point)
}
seriesNS.mixins = {
    chart: {},
    pie: {},
    polar: {}
};
seriesNS.mixins.chart.scatter = scatterSeries.chart;
seriesNS.mixins.polar.scatter = scatterSeries.polar;
(0, _extend2.extend)(seriesNS.mixins.pie, pieSeries);
(0, _extend2.extend)(seriesNS.mixins.chart, lineSeries.chart, areaSeries.chart, barSeries.chart, _range_series.chart, _bubble_series.chart, financialSeries, stackedSeries.chart);
(0, _extend2.extend)(seriesNS.mixins.polar, lineSeries.polar, areaSeries.polar, barSeries.polar, stackedSeries.polar);

function includePointsMode(mode) {
    mode = (0, _utils.normalizeEnum)(mode);
    return mode === INCLUDE_POINTS || mode === ALL_SERIES_POINTS
}

function getLabelOptions(labelOptions, defaultColor) {
    var opt = labelOptions || {};
    var labelFont = (0, _extend2.extend)({}, opt.font) || {};
    var labelBorder = opt.border || {};
    var labelConnector = opt.connector || {};
    var backgroundAttr = {
        fill: opt.backgroundColor || defaultColor,
        "stroke-width": labelBorder.visible ? labelBorder.width || 0 : 0,
        stroke: labelBorder.visible && labelBorder.width ? labelBorder.color : "none",
        dashStyle: labelBorder.dashStyle
    };
    var connectorAttr = {
        stroke: labelConnector.visible && labelConnector.width ? labelConnector.color || defaultColor : "none",
        "stroke-width": labelConnector.visible ? labelConnector.width || 0 : 0
    };
    labelFont.color = "none" === opt.backgroundColor && "#ffffff" === (0, _utils.normalizeEnum)(labelFont.color) && "inside" !== opt.position ? defaultColor : labelFont.color;
    return {
        alignment: opt.alignment,
        format: opt.format,
        argumentFormat: opt.argumentFormat,
        customizeText: (0, _type.isFunction)(opt.customizeText) ? opt.customizeText : void 0,
        attributes: {
            font: labelFont
        },
        visible: 0 !== labelFont.size ? opt.visible : false,
        showForZeroValues: opt.showForZeroValues,
        horizontalOffset: opt.horizontalOffset,
        verticalOffset: opt.verticalOffset,
        radialOffset: opt.radialOffset,
        background: backgroundAttr,
        position: opt.position,
        connector: connectorAttr,
        rotationAngle: opt.rotationAngle,
        wordWrap: opt.wordWrap,
        textOverflow: opt.textOverflow,
        cssClass: opt.cssClass
    }
}

function setPointHoverState(point, legendCallback) {
    point.fullState |= HOVER_STATE;
    point.applyView(legendCallback)
}

function releasePointHoverState(point, legendCallback) {
    point.fullState &= ~HOVER_STATE;
    point.applyView(legendCallback);
    point.releaseHoverState()
}

function setPointSelectedState(point, legendCallback) {
    point.fullState |= SELECTED_STATE;
    point.applyView(legendCallback)
}

function releasePointSelectedState(point, legendCallback) {
    point.fullState &= ~SELECTED_STATE;
    point.applyView(legendCallback)
}

function mergePointOptionsCore(base, extra) {
    var options = (0, _extend2.extend)({}, base, extra);
    options.border = (0, _extend2.extend)({}, base && base.border, extra && extra.border);
    return options
}

function mergePointOptions(base, extra) {
    var options = mergePointOptionsCore(base, extra);
    options.image = (0, _extend2.extend)(true, {}, base.image, extra.image);
    options.selectionStyle = mergePointOptionsCore(base.selectionStyle, extra.selectionStyle);
    options.hoverStyle = mergePointOptionsCore(base.hoverStyle, extra.hoverStyle);
    return options
}

function Series(settings, options) {
    this.fullState = 0;
    this._extGroups = settings;
    this._renderer = settings.renderer;
    this._group = settings.renderer.g().attr({
        class: "dxc-series"
    });
    this._eventTrigger = settings.eventTrigger;
    this._eventPipe = settings.eventPipe;
    this._incidentOccurred = settings.incidentOccurred;
    this._legendCallback = _common.noop;
    this.updateOptions(options, settings)
}

function getData(pointData) {
    return pointData.data
}

function getValueChecker(axisType, axis) {
    if (!axis || "logarithmic" !== axisType || false !== axis.getOptions().allowNegatives) {
        return function() {
            return true
        }
    } else {
        return function(value) {
            return value > 0
        }
    }
}
Series.prototype = {
    constructor: Series,
    _createLegendState: _common.noop,
    getLegendStyles: function() {
        return this._styles.legendStyles
    },
    _createStyles: function(options) {
        var mainSeriesColor = options.mainSeriesColor;
        this._styles = {
            normal: this._parseStyle(options, mainSeriesColor, mainSeriesColor),
            hover: this._parseStyle(options.hoverStyle || {}, mainSeriesColor, mainSeriesColor),
            selection: this._parseStyle(options.selectionStyle || {}, mainSeriesColor, mainSeriesColor),
            legendStyles: {
                normal: this._createLegendState(options, mainSeriesColor),
                hover: this._createLegendState(options.hoverStyle || {}, mainSeriesColor),
                selection: this._createLegendState(options.selectionStyle || {}, mainSeriesColor)
            }
        }
    },
    setClippingParams: function(baseId, wideId, forceClipping) {
        var clipLabels = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : true;
        this._paneClipRectID = baseId;
        this._widePaneClipRectID = wideId;
        this._forceClipping = forceClipping;
        this._clipLabels = clipLabels
    },
    applyClip: function() {
        this._group.attr({
            "clip-path": this._paneClipRectID
        })
    },
    resetClip: function() {
        this._group.attr({
            "clip-path": null
        })
    },
    getTagField: function() {
        return this._options.tagField || "tag"
    },
    getValueFields: _common.noop,
    getSizeField: _common.noop,
    getArgumentField: _common.noop,
    getPoints: function() {
        return this._points
    },
    getPointsInViewPort: function() {
        return _range_data_calculator.default.getPointsInViewPort(this)
    },
    _createPoint: function(data, index, oldPoint) {
        data.index = index;
        var pointsByArgument = this.pointsByArgument;
        var options = this._getCreatingPointOptions(data);
        var arg = data.argument.valueOf();
        var point = oldPoint;
        if (point) {
            point.update(data, options)
        } else {
            point = new _base_point.Point(this, data, options);
            if (this.isSelected() && includePointsMode(this.lastSelectionMode)) {
                point.setView(SELECTION)
            }
        }
        var pointByArgument = pointsByArgument[arg];
        if (pointByArgument) {
            pointByArgument.push(point)
        } else {
            pointsByArgument[arg] = [point]
        }
        if (point.hasValue()) {
            this.customizePoint(point, data)
        }
        return point
    },
    getRangeData: function() {
        return this._visible ? this._getRangeData() : getEmptyBusinessRange()
    },
    getArgumentRange: function() {
        return this._visible ? _range_data_calculator.default.getArgumentRange(this) : getEmptyBusinessRange()
    },
    getViewport: function() {
        return _range_data_calculator.default.getViewport(this)
    },
    _deleteGroup: function(groupName) {
        var group = this[groupName];
        if (group) {
            group.dispose();
            this[groupName] = null
        }
    },
    updateOptions: function(newOptions, settings) {
        var widgetType = newOptions.widgetType;
        var oldType = this.type;
        var newType = newOptions.type;
        this.type = newType && (0, _utils.normalizeEnum)(newType.toString());
        if (!this._checkType(widgetType) || this._checkPolarBarType(widgetType, newOptions)) {
            this.dispose();
            this.isUpdated = false;
            return
        }
        if (oldType !== this.type) {
            this._firstDrawing = true;
            this._resetType(oldType, widgetType);
            this._setType(this.type, widgetType)
        } else {
            this._defineDrawingState()
        }
        this._options = newOptions;
        this._pointOptions = null;
        this.name = newOptions.name;
        this.pane = newOptions.pane;
        this.tag = newOptions.tag;
        if (settings) {
            this._seriesModes = settings.commonSeriesModes || this._seriesModes;
            this._valueAxis = settings.valueAxis || this._valueAxis;
            this.axis = this._valueAxis && this._valueAxis.name;
            this._argumentAxis = settings.argumentAxis || this._argumentAxis
        }
        this._createStyles(newOptions);
        this._stackName = null;
        this._updateOptions(newOptions);
        this._visible = newOptions.visible;
        this.isUpdated = true;
        this.stack = newOptions.stack;
        this.barOverlapGroup = newOptions.barOverlapGroup;
        this._createGroups();
        this._processEmptyValue = newOptions.ignoreEmptyPoints ? function(x) {
            return null === x ? void 0 : x
        } : function(x) {
            return x
        }
    },
    _defineDrawingState: function() {
        this._firstDrawing = true
    },
    _disposePoints: function(points) {
        (0, _iterator.each)(points || [], (function(_, p) {
            p.dispose()
        }))
    },
    updateDataType: function(settings) {
        this.argumentType = settings.argumentType;
        this.valueType = settings.valueType;
        this.argumentAxisType = settings.argumentAxisType;
        this.valueAxisType = settings.valueAxisType;
        this.showZero = settings.showZero;
        this._argumentChecker = getValueChecker(settings.argumentAxisType, this.getArgumentAxis());
        this._valueChecker = getValueChecker(settings.valueAxisType, this.getValueAxis());
        return this
    },
    _argumentChecker: function() {
        return true
    },
    _valueChecker: function() {
        return true
    },
    getOptions: function() {
        return this._options
    },
    _getOldPoint: function(data, oldPointsByArgument, index) {
        var arg = data.argument && data.argument.valueOf();
        var point = (oldPointsByArgument[arg] || [])[0];
        if (point) {
            oldPointsByArgument[arg].splice(0, 1)
        }
        return point
    },
    updateData: function(data) {
        var options = this._options;
        var nameField = options.nameField;
        data = data || [];
        if (data.length) {
            this._canRenderCompleteHandle = true
        }
        var dataSelector = this._getPointDataSelector();
        var itemsWithoutArgument = 0;
        this._data = data.reduce((function(data, dataItem, index) {
            var pointDataItem = dataSelector(dataItem);
            if ((0, _type.isDefined)(pointDataItem.argument)) {
                if (!nameField || dataItem[nameField] === options.nameFieldValue) {
                    pointDataItem.index = index;
                    data.push(pointDataItem)
                }
            } else {
                itemsWithoutArgument++
            }
            return data
        }), []);
        if (itemsWithoutArgument && itemsWithoutArgument === data.length) {
            this._incidentOccurred("W2002", [this.name, this.getArgumentField()])
        }
        this._endUpdateData()
    },
    _getData: function() {
        var data = this._data || [];
        if (this.useAggregation()) {
            data = this._resample(this.getArgumentAxis().getAggregationInfo(this._useAllAggregatedPoints, this.argumentAxisType !== DISCRETE ? this.getArgumentRange() : {}), data)
        }
        return data
    },
    useAggregation: function() {
        var aggregation = this.getOptions().aggregation;
        return aggregation && aggregation.enabled
    },
    autoHidePointMarkersEnabled: _common.noop,
    usePointsToDefineAutoHiding: _common.noop,
    createPoints: function(useAllAggregatedPoints) {
        this._normalizeUsingAllAggregatedPoints(useAllAggregatedPoints);
        this._createPoints()
    },
    _normalizeUsingAllAggregatedPoints: function(useAllAggregatedPoints) {
        this._useAllAggregatedPoints = this.useAggregation() && (this.argumentAxisType === DISCRETE || (this._data || []).length > 1 && !!useAllAggregatedPoints)
    },
    _createPoints: function() {
        var that = this;
        var oldPointsByArgument = that.pointsByArgument || {};
        var data = that._getData();
        that.pointsByArgument = {};
        that._calculateErrorBars(data);
        var skippedFields = {};
        var points = data.reduce((function(points, pointDataItem) {
            if (that._checkData(pointDataItem, skippedFields)) {
                var pointIndex = points.length;
                var oldPoint = that._getOldPoint(pointDataItem, oldPointsByArgument, pointIndex);
                var point = that._createPoint(pointDataItem, pointIndex, oldPoint);
                points.push(point)
            }
            return points
        }), []);
        for (var field in skippedFields) {
            if (skippedFields[field] === data.length) {
                that._incidentOccurred("W2002", [that.name, field])
            }
        }
        Object.keys(oldPointsByArgument).forEach((function(key) {
            return that._disposePoints(oldPointsByArgument[key])
        }));
        that._points = points
    },
    _removeOldSegments: function() {
        var that = this;
        var startIndex = that._segments.length;
        (0, _iterator.each)(that._graphics.splice(startIndex, that._graphics.length) || [], (function(_, elem) {
            that._removeElement(elem)
        }));
        if (that._trackers) {
            (0, _iterator.each)(that._trackers.splice(startIndex, that._trackers.length) || [], (function(_, elem) {
                elem.remove()
            }))
        }
    },
    _drawElements: function(animationEnabled, firstDrawing, translateAllPoints) {
        var that = this;
        var points = that._points || [];
        var closeSegment = points[0] && points[0].hasValue() && that._options.closed;
        var groupForPoint = {
            markers: that._markersGroup,
            errorBars: that._errorBarGroup
        };
        that._drawnPoints = [];
        that._graphics = that._graphics || [];
        that._segments = [];
        var segments = points.reduce((function(segments, p) {
            var segment = segments[segments.length - 1];
            if (!p.translated || translateAllPoints) {
                p.translate();
                !translateAllPoints && p.setDefaultCoords()
            }
            if (p.hasValue() && p.hasCoords()) {
                translateAllPoints && that._drawPoint({
                    point: p,
                    groups: groupForPoint,
                    hasAnimation: animationEnabled,
                    firstDrawing: firstDrawing
                });
                segment.push(p)
            } else if (!p.hasValue()) {
                segment.length && segments.push([])
            } else {
                p.setInvisibility()
            }
            return segments
        }), [
            []
        ]);
        segments.forEach((function(segment, index) {
            if (segment.length) {
                that._drawSegment(segment, animationEnabled, index, closeSegment && index === this.length - 1)
            }
        }), segments);
        that._firstDrawing = !points.length;
        that._removeOldSegments();
        animationEnabled && that._animate(firstDrawing)
    },
    draw: function(animationEnabled, hideLayoutLabels, legendCallback) {
        var firstDrawing = this._firstDrawing;
        this._legendCallback = legendCallback || this._legendCallback;
        if (!this._visible) {
            this._group.remove();
            return
        }
        this._appendInGroup();
        this._applyVisibleArea();
        this._setGroupsSettings(animationEnabled, firstDrawing);
        !firstDrawing && !this._resetApplyingAnimation && this._drawElements(false, firstDrawing, false);
        this._drawElements(animationEnabled, firstDrawing, true);
        hideLayoutLabels && this.hideLabels();
        if (this.isSelected()) {
            this._changeStyle(this.lastSelectionMode, void 0, true)
        } else if (this.isHovered()) {
            this._changeStyle(this.lastHoverMode, void 0, true)
        } else {
            this._applyStyle(this._styles.normal)
        }
        this._resetApplyingAnimation = false
    },
    _setLabelGroupSettings: function(animationEnabled) {
        var settings = {
            class: "dxc-labels",
            "pointer-events": "none"
        };
        this._clipLabels && this._applyElementsClipRect(settings);
        this._applyClearingSettings(settings);
        animationEnabled && (settings.opacity = .001);
        this._labelsGroup.attr(settings).append(this._extGroups.labelsGroup)
    },
    _checkType: function(widgetType) {
        return !!seriesNS.mixins[widgetType][this.type]
    },
    _checkPolarBarType: function(widgetType, options) {
        return "polar" === widgetType && options.spiderWidget && -1 !== this.type.indexOf("bar")
    },
    _resetType: function(seriesType, widgetType) {
        var methodName;
        var methods;
        if (seriesType) {
            methods = seriesNS.mixins[widgetType][seriesType];
            for (methodName in methods) {
                delete this[methodName]
            }
        }
    },
    _setType: function(seriesType, widgetType) {
        var methodName;
        var methods = seriesNS.mixins[widgetType][seriesType];
        for (methodName in methods) {
            this[methodName] = methods[methodName]
        }
    },
    _setPointsView: function(view, target) {
        this.getPoints().forEach((function(point) {
            if (target !== point) {
                point.setView(view)
            }
        }))
    },
    _resetPointsView: function(view, target) {
        this.getPoints().forEach((function(point) {
            if (target !== point) {
                point.resetView(view)
            }
        }))
    },
    _resetNearestPoint: function() {
        this._nearestPoint && null !== this._nearestPoint.series && this._nearestPoint.resetView(HOVER);
        this._nearestPoint = null
    },
    _setSelectedState: function(mode) {
        this.lastSelectionMode = (0, _utils.normalizeEnum)(mode || this._options.selectionMode);
        this.fullState = this.fullState | SELECTED_STATE;
        this._resetNearestPoint();
        this._changeStyle(this.lastSelectionMode);
        if (this.lastSelectionMode !== NONE_MODE && this.isHovered() && includePointsMode(this.lastHoverMode)) {
            this._resetPointsView(HOVER)
        }
    },
    _releaseSelectedState: function() {
        this.fullState = this.fullState & ~SELECTED_STATE;
        this._changeStyle(this.lastSelectionMode, SELECTION);
        if (this.lastSelectionMode !== NONE_MODE && this.isHovered() && includePointsMode(this.lastHoverMode)) {
            this._setPointsView(HOVER)
        }
    },
    isFullStackedSeries: function() {
        return 0 === this.type.indexOf("fullstacked")
    },
    isStackedSeries: function() {
        return 0 === this.type.indexOf("stacked")
    },
    resetApplyingAnimation: function(isFirstDrawing) {
        this._resetApplyingAnimation = true;
        if (isFirstDrawing) {
            this._firstDrawing = true
        }
    },
    isFinancialSeries: function() {
        return "stock" === this.type || "candlestick" === this.type
    },
    _canChangeView: function() {
        return !this.isSelected() && (0, _utils.normalizeEnum)(this._options.hoverMode) !== NONE_MODE
    },
    _changeStyle: function(mode, resetView, skipPoints) {
        var state = this.fullState;
        var styles = [NORMAL, HOVER, SELECTION, SELECTION];
        if ("none" === this.lastHoverMode) {
            state &= ~HOVER_STATE
        }
        if ("none" === this.lastSelectionMode) {
            state &= ~SELECTED_STATE
        }
        if (includePointsMode(mode) && !skipPoints) {
            if (!resetView) {
                this._setPointsView(styles[state])
            } else {
                this._resetPointsView(resetView)
            }
        }
        this._legendCallback([RESET_ITEM, APPLY_HOVER, APPLY_SELECTED, APPLY_SELECTED][state]);
        this._applyStyle(this._styles[styles[state]])
    },
    updateHover: function(x, y) {
        var currentNearestPoint = this._nearestPoint;
        var point = this.isHovered() && this.lastHoverMode === NEAREST_POINT && this.getNeighborPoint(x, y);
        if (point !== currentNearestPoint && !(this.isSelected() && this.lastSelectionMode !== NONE_MODE)) {
            this._resetNearestPoint();
            if (point) {
                point.setView(HOVER);
                this._nearestPoint = point
            }
        }
    },
    _getMainAxisName: function() {
        return this._options.rotated ? "X" : "Y"
    },
    areLabelsVisible: function() {
        return !(0, _type.isDefined)(this._options.maxLabelCount) || this._points.length <= this._options.maxLabelCount
    },
    getLabelVisibility: function() {
        return this.areLabelsVisible() && this._options.label && this._options.label.visible
    },
    customizePoint: function(point, pointData) {
        var options = this._options;
        var customizePoint = options.customizePoint;
        var customizeObject;
        var pointOptions;
        var customLabelOptions;
        var customOptions;
        var customizeLabel = options.customizeLabel;
        var useLabelCustomOptions;
        var usePointCustomOptions;
        if (customizeLabel && customizeLabel.call) {
            customizeObject = (0, _extend2.extend)({
                seriesName: this.name
            }, pointData);
            customizeObject.series = this;
            customLabelOptions = customizeLabel.call(customizeObject, customizeObject);
            useLabelCustomOptions = customLabelOptions && !(0, _type.isEmptyObject)(customLabelOptions);
            customLabelOptions = useLabelCustomOptions ? (0, _extend2.extend)(true, {}, options.label, customLabelOptions) : null
        }
        if (customizePoint && customizePoint.call) {
            customizeObject = customizeObject || (0, _extend2.extend)({
                seriesName: this.name
            }, pointData);
            customizeObject.series = this;
            customOptions = customizePoint.call(customizeObject, customizeObject);
            usePointCustomOptions = customOptions && !(0, _type.isEmptyObject)(customOptions)
        }
        if (useLabelCustomOptions || usePointCustomOptions) {
            pointOptions = this._parsePointOptions(this._preparePointOptions(customOptions), customLabelOptions || options.label, pointData, point);
            pointOptions.styles.useLabelCustomOptions = useLabelCustomOptions;
            pointOptions.styles.usePointCustomOptions = usePointCustomOptions;
            point.updateOptions(pointOptions)
        }
    },
    show: function() {
        if (!this._visible) {
            this._changeVisibility(true)
        }
    },
    hide: function() {
        if (this._visible) {
            this._changeVisibility(false)
        }
    },
    _changeVisibility: function(visibility) {
        this._visible = this._options.visible = visibility;
        this._updatePointsVisibility();
        this.hidePointTooltip();
        this._options.visibilityChanged(this)
    },
    _updatePointsVisibility: _common.noop,
    hideLabels: function() {
        (0, _iterator.each)(this._points, (function(_, point) {
            point._label.draw(false)
        }))
    },
    _parsePointOptions: function(pointOptions, labelOptions, data, point) {
        var options = this._options;
        var styles = this._createPointStyles(pointOptions, data, point);
        var parsedOptions = (0, _extend2.extend)({}, pointOptions, {
            type: options.type,
            rotated: options.rotated,
            styles: styles,
            widgetType: options.widgetType,
            visibilityChanged: options.visibilityChanged
        });
        parsedOptions.label = getLabelOptions(labelOptions, styles.normal.fill);
        if (this.areErrorBarsVisible()) {
            parsedOptions.errorBars = options.valueErrorBar
        }
        return parsedOptions
    },
    _preparePointOptions: function(customOptions) {
        var pointOptions = this._getOptionsForPoint();
        return customOptions ? mergePointOptions(pointOptions, customOptions) : pointOptions
    },
    _getMarkerGroupOptions: function() {
        return (0, _extend2.extend)(false, {}, this._getOptionsForPoint(), {
            hoverStyle: {},
            selectionStyle: {}
        })
    },
    _getAggregationMethod: function(isDiscrete, aggregateByCategory) {
        var options = this.getOptions().aggregation;
        var method = (0, _utils.normalizeEnum)(options.method);
        var customAggregator = "custom" === method && options.calculate;
        var aggregator;
        if (isDiscrete && !aggregateByCategory) {
            aggregator = function(_ref) {
                var data = _ref.data;
                return data[0]
            }
        } else {
            aggregator = this._aggregators[method] || this._aggregators[this._defaultAggregator]
        }
        return customAggregator || aggregator
    },
    _resample: function(_ref2, data) {
        var interval = _ref2.interval,
            ticks = _ref2.ticks,
            aggregateByCategory = _ref2.aggregateByCategory;
        var that = this;
        var isDiscrete = that.argumentAxisType === DISCRETE || that.valueAxisType === DISCRETE;
        var dataIndex = 0;
        var dataSelector = this._getPointDataSelector();
        var options = that.getOptions();
        var addAggregatedData = function(target, data, aggregationInfo) {
            if (!data) {
                return
            }
            var processData = function(d) {
                var pointData = d && dataSelector(d, options);
                if (pointData && that._checkData(pointData)) {
                    pointData.aggregationInfo = aggregationInfo;
                    target.push(pointData)
                }
            };
            if (Array.isArray(data)) {
                data.forEach(processData)
            } else {
                processData(data)
            }
        };
        var aggregationMethod = this._getAggregationMethod(isDiscrete, aggregateByCategory);
        if (isDiscrete) {
            if (aggregateByCategory) {
                var categories = this.getArgumentAxis().getTranslator().getBusinessRange().categories;
                var groups = categories.reduce((function(g, category) {
                    g[category.valueOf()] = [];
                    return g
                }), {});
                data.forEach((function(dataItem) {
                    groups[dataItem.argument.valueOf()].push(dataItem)
                }));
                return categories.reduce((function(result, c) {
                    addAggregatedData(result, aggregationMethod({
                        aggregationInterval: null,
                        intervalStart: c,
                        intervalEnd: c,
                        data: groups[c.valueOf()].map(getData)
                    }, that));
                    return result
                }), [])
            } else {
                return data.reduce((function(result, dataItem, index, data) {
                    result[1].push(dataItem);
                    if (index === data.length - 1 || (index + 1) % interval === 0) {
                        var dataInInterval = result[1];
                        var aggregationInfo = {
                            aggregationInterval: interval,
                            data: dataInInterval.map(getData)
                        };
                        addAggregatedData(result[0], aggregationMethod(aggregationInfo, that));
                        result[1] = []
                    }
                    return result
                }), [
                    [],
                    []
                ])[0]
            }
        }
        var aggregatedData = [];
        for (var i = 1; i < ticks.length; i++) {
            var intervalEnd = ticks[i];
            var intervalStart = ticks[i - 1];
            var dataInInterval = [];
            while (data[dataIndex] && data[dataIndex].argument < intervalEnd) {
                if (data[dataIndex].argument >= intervalStart) {
                    dataInInterval.push(data[dataIndex])
                }
                dataIndex++
            }
            var aggregationInfo = {
                intervalStart: intervalStart,
                intervalEnd: intervalEnd,
                aggregationInterval: interval,
                data: dataInInterval.map(getData)
            };
            addAggregatedData(aggregatedData, aggregationMethod(aggregationInfo, that), aggregationInfo)
        }
        that._endUpdateData();
        return aggregatedData
    },
    canRenderCompleteHandle: function() {
        var result = this._canRenderCompleteHandle;
        delete this._canRenderCompleteHandle;
        return !!result
    },
    isHovered: function() {
        return !!(1 & this.fullState)
    },
    isSelected: function() {
        return !!(2 & this.fullState)
    },
    isVisible: function() {
        return this._visible
    },
    getAllPoints: function() {
        this._createAllAggregatedPoints();
        return (this._points || []).slice()
    },
    getPointByPos: function(pos) {
        this._createAllAggregatedPoints();
        return (this._points || [])[pos]
    },
    getVisiblePoints: function() {
        return (this._drawnPoints || []).slice()
    },
    selectPoint: function(point) {
        if (!point.isSelected()) {
            setPointSelectedState(point, this._legendCallback);
            this._eventPipe({
                action: POINT_SELECT,
                target: point
            });
            this._eventTrigger(POINT_SELECTION_CHANGED, {
                target: point
            })
        }
    },
    deselectPoint: function(point) {
        if (point.isSelected()) {
            releasePointSelectedState(point, this._legendCallback);
            this._eventPipe({
                action: POINT_DESELECT,
                target: point
            });
            this._eventTrigger(POINT_SELECTION_CHANGED, {
                target: point
            })
        }
    },
    hover: function(mode) {
        var eventTrigger = this._eventTrigger;
        if (this.isHovered()) {
            return
        }
        this.lastHoverMode = (0, _utils.normalizeEnum)(mode || this._options.hoverMode);
        this.fullState = this.fullState | HOVER_STATE;
        this._changeStyle(this.lastHoverMode, void 0, this.isSelected() && this.lastSelectionMode !== NONE_MODE);
        eventTrigger(SERIES_HOVER_CHANGED, {
            target: this
        })
    },
    clearHover: function() {
        var eventTrigger = this._eventTrigger;
        if (!this.isHovered()) {
            return
        }
        this._resetNearestPoint();
        this.fullState = this.fullState & ~HOVER_STATE;
        this._changeStyle(this.lastHoverMode, HOVER, this.isSelected() && this.lastSelectionMode !== NONE_MODE);
        eventTrigger(SERIES_HOVER_CHANGED, {
            target: this
        })
    },
    hoverPoint: function(point) {
        if (!point.isHovered()) {
            point.clearHover();
            setPointHoverState(point, this._legendCallback);
            this._canChangeView() && this._applyStyle(this._styles.hover);
            this._eventPipe({
                action: POINT_HOVER,
                target: point
            });
            this._eventTrigger(POINT_HOVER_CHANGED, {
                target: point
            })
        }
    },
    clearPointHover: function() {
        var that = this;
        that.getPoints().some((function(currentPoint) {
            if (currentPoint.isHovered()) {
                releasePointHoverState(currentPoint, that._legendCallback);
                that._canChangeView() && that._applyStyle(that._styles.normal);
                that._eventPipe({
                    action: CLEAR_POINT_HOVER,
                    target: currentPoint
                });
                that._eventTrigger(POINT_HOVER_CHANGED, {
                    target: currentPoint
                });
                return true
            }
            return false
        }))
    },
    showPointTooltip: function(point) {
        triggerEvent(this._extGroups.seriesGroup, "showpointtooltip", point)
    },
    hidePointTooltip: function(point) {
        triggerEvent(this._extGroups.seriesGroup, "hidepointtooltip", point)
    },
    select: function() {
        if (!this.isSelected()) {
            this._setSelectedState(this._options.selectionMode);
            this._eventPipe({
                action: SERIES_SELECT,
                target: this
            });
            this._group.toForeground();
            this._eventTrigger(SERIES_SELECTION_CHANGED, {
                target: this
            })
        }
    },
    clearSelection: function() {
        if (this.isSelected()) {
            this._releaseSelectedState();
            this._eventTrigger(SERIES_SELECTION_CHANGED, {
                target: this
            })
        }
    },
    getPointsByArg: function(arg, skipPointsCreation) {
        var argValue = arg.valueOf();
        var points = this.pointsByArgument[argValue];
        if (!points && !skipPointsCreation && this._createAllAggregatedPoints()) {
            points = this.pointsByArgument[argValue]
        }
        return points || []
    },
    _createAllAggregatedPoints: function() {
        if (this.useAggregation() && !this._useAllAggregatedPoints) {
            this.createPoints(true);
            return true
        }
        return false
    },
    getPointsByKeys: function(arg) {
        return this.getPointsByArg(arg)
    },
    notify: function(data) {
        var that = this;
        var action = data.action;
        var seriesModes = that._seriesModes;
        var target = data.target;
        var targetOptions = target.getOptions();
        var pointHoverMode = (0, _utils.normalizeEnum)(targetOptions.hoverMode);
        var selectionModeOfPoint = (0, _utils.normalizeEnum)(targetOptions.selectionMode);
        if (action === POINT_HOVER) {
            that._hoverPointHandler(target, pointHoverMode, data.notifyLegend)
        } else if (action === CLEAR_POINT_HOVER) {
            that._clearPointHoverHandler(target, pointHoverMode, data.notifyLegend)
        } else if (action === SERIES_SELECT) {
            target !== that && "single" === seriesModes.seriesSelectionMode && that.clearSelection()
        } else if (action === POINT_SELECT) {
            if ("single" === seriesModes.pointSelectionMode) {
                that.getPoints().some((function(currentPoint) {
                    if (currentPoint !== target && currentPoint.isSelected()) {
                        that.deselectPoint(currentPoint);
                        return true
                    }
                    return false
                }))
            }
            that._selectPointHandler(target, selectionModeOfPoint)
        } else if (action === POINT_DESELECT) {
            that._deselectPointHandler(target, selectionModeOfPoint)
        }
    },
    _selectPointHandler: function(target, mode) {
        if (mode === ALL_SERIES_POINTS) {
            target.series === this && this._setPointsView(SELECTION, target)
        } else if (mode === ALL_ARGUMENT_POINTS) {
            this.getPointsByKeys(target.argument, target.argumentIndex).forEach((function(currentPoint) {
                currentPoint !== target && currentPoint.setView(SELECTION)
            }))
        }
    },
    _deselectPointHandler: function(target, mode) {
        if (mode === ALL_SERIES_POINTS) {
            target.series === this && this._resetPointsView(SELECTION, target)
        } else if (mode === ALL_ARGUMENT_POINTS) {
            this.getPointsByKeys(target.argument, target.argumentIndex).forEach((function(currentPoint) {
                currentPoint !== target && currentPoint.resetView(SELECTION)
            }))
        }
    },
    _hoverPointHandler: function(target, mode, notifyLegend) {
        if (target.series !== this && mode === ALL_ARGUMENT_POINTS) {
            this.getPointsByKeys(target.argument, target.argumentIndex).forEach((function(currentPoint) {
                currentPoint.setView(HOVER)
            }));
            notifyLegend && this._legendCallback(target)
        } else if (mode === ALL_SERIES_POINTS && target.series === this) {
            this._setPointsView(HOVER, target)
        }
    },
    _clearPointHoverHandler: function(target, mode, notifyLegend) {
        if (mode === ALL_ARGUMENT_POINTS) {
            target.series !== this && this.getPointsByKeys(target.argument, target.argumentIndex).forEach((function(currentPoint) {
                currentPoint.resetView(HOVER)
            }));
            notifyLegend && this._legendCallback(target)
        } else if (mode === ALL_SERIES_POINTS && target.series === this) {
            this._resetPointsView(HOVER, target)
        }
    },
    _deletePoints: function() {
        this._disposePoints(this._points);
        this._points = this._drawnPoints = null
    },
    _deleteTrackers: function() {
        (0, _iterator.each)(this._trackers || [], (function(_, tracker) {
            tracker.remove()
        }));
        this._trackersGroup && this._trackersGroup.dispose();
        this._trackers = this._trackersGroup = null
    },
    dispose: function() {
        this._deletePoints();
        this._group.dispose();
        this._labelsGroup && this._labelsGroup.dispose();
        this._errorBarGroup && this._errorBarGroup.dispose();
        this._deleteTrackers();
        this._group = this._extGroups = this._markersGroup = this._elementsGroup = this._bordersGroup = this._labelsGroup = this._errorBarGroup = this._graphics = this._rangeData = this._renderer = this._styles = this._options = this._pointOptions = this._drawnPoints = this.pointsByArgument = this._segments = this._prevSeries = null
    },
    correctPosition: _common.noop,
    drawTrackers: _common.noop,
    getNeighborPoint: _common.noop,
    areErrorBarsVisible: _common.noop,
    getMarginOptions: function() {
        return this._patchMarginOptions({
            percentStick: this.isFullStackedSeries()
        })
    },
    getColor: function() {
        return this.getLegendStyles().normal.fill
    },
    getOpacity: function() {
        return this._options.opacity
    },
    getStackName: function() {
        return this._stackName
    },
    getBarOverlapGroup: function() {
        return this._options.barOverlapGroup
    },
    getPointByCoord: function(x, y) {
        var point = this.getNeighborPoint(x, y);
        return null !== point && void 0 !== point && point.coordsIn(x, y) ? point : null
    },
    getValueAxis: function() {
        return this._valueAxis
    },
    getArgumentAxis: function() {
        return this._argumentAxis
    },
    getMarkersGroup: function() {
        return this._markersGroup
    },
    getRenderer: function() {
        return this._renderer
    }
};
var mixins = seriesNS.mixins;
exports.mixins = mixins;
