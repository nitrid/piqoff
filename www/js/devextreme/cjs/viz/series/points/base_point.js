/**
 * DevExtreme (cjs/viz/series/points/base_point.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.Point = Point;
var _consts = _interopRequireDefault(require("../../components/consts"));
var _symbol_point = _interopRequireDefault(require("./symbol_point"));
var _bar_point = _interopRequireDefault(require("./bar_point"));
var _bubble_point = _interopRequireDefault(require("./bubble_point"));
var _pie_point = _interopRequireDefault(require("./pie_point"));
var _range_symbol_point = _interopRequireDefault(require("./range_symbol_point"));
var _range_bar_point = _interopRequireDefault(require("./range_bar_point"));
var _candlestick_point = _interopRequireDefault(require("./candlestick_point"));
var _stock_point = _interopRequireDefault(require("./stock_point"));
var _polar_point = require("./polar_point");
var _utils = require("../../core/utils");
var _extend2 = require("../../../core/utils/extend");
var _type = require("../../../core/utils/type");
var _common = require("../../../core/utils/common");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}
var mixins = {};
var _extend = _extend2.extend;
var statesConsts = _consts.default.states;
var SYMBOL_POINT = "symbolPoint";
var POLAR_SYMBOL_POINT = "polarSymbolPoint";
var BAR_POINT = "barPoint";
var POLAR_BAR_POINT = "polarBarPoint";
var PIE_POINT = "piePoint";
var SELECTED_STATE = statesConsts.selectedMark;
var HOVER_STATE = statesConsts.hoverMark;
var NORMAL_STATE = statesConsts.normalMark;
var HOVER = statesConsts.hover;
var NORMAL = statesConsts.normal;
var SELECTION = statesConsts.selection;
var pointTypes = {
    chart: {
        scatter: SYMBOL_POINT,
        line: SYMBOL_POINT,
        spline: SYMBOL_POINT,
        stepline: SYMBOL_POINT,
        stackedline: SYMBOL_POINT,
        fullstackedline: SYMBOL_POINT,
        stackedspline: SYMBOL_POINT,
        fullstackedspline: SYMBOL_POINT,
        stackedsplinearea: SYMBOL_POINT,
        fullstackedsplinearea: SYMBOL_POINT,
        area: SYMBOL_POINT,
        splinearea: SYMBOL_POINT,
        steparea: SYMBOL_POINT,
        stackedarea: SYMBOL_POINT,
        fullstackedarea: SYMBOL_POINT,
        rangearea: "rangeSymbolPoint",
        bar: BAR_POINT,
        stackedbar: BAR_POINT,
        fullstackedbar: BAR_POINT,
        rangebar: "rangeBarPoint",
        bubble: "bubblePoint",
        stock: "stockPoint",
        candlestick: "candlestickPoint"
    },
    pie: {
        pie: PIE_POINT,
        doughnut: PIE_POINT,
        donut: PIE_POINT
    },
    polar: {
        scatter: POLAR_SYMBOL_POINT,
        line: POLAR_SYMBOL_POINT,
        area: POLAR_SYMBOL_POINT,
        bar: POLAR_BAR_POINT,
        stackedbar: POLAR_BAR_POINT
    }
};

function isNoneMode(mode) {
    return "none" === (0, _utils.normalizeEnum)(mode)
}

function Point(series, dataItem, options) {
    this.fullState = NORMAL_STATE;
    this.series = series;
    this.update(dataItem, options);
    this._viewCounters = {
        hover: 0,
        selection: 0
    };
    this._emptySettings = {
        fill: null,
        stroke: null,
        dashStyle: null
    }
}
mixins.symbolPoint = _symbol_point.default;
mixins.barPoint = _bar_point.default;
mixins.bubblePoint = _bubble_point.default;
mixins.piePoint = _pie_point.default;
mixins.rangeSymbolPoint = _range_symbol_point.default;
mixins.rangeBarPoint = _range_bar_point.default;
mixins.candlestickPoint = _candlestick_point.default;
mixins.stockPoint = _stock_point.default;
mixins.polarSymbolPoint = _polar_point.polarSymbolPoint;
mixins.polarBarPoint = _polar_point.polarBarPoint;
Point.prototype = {
    constructor: Point,
    getColor: function() {
        if (!this.hasValue() && !this._styles.usePointCustomOptions) {
            this.series.customizePoint(this, this._dataItem)
        }
        return this._styles.normal.fill || this.series.getColor()
    },
    _getStyle: function() {
        return this._styles[this._currentStyle || "normal"]
    },
    update: function(dataItem, options) {
        this.updateOptions(options);
        this.updateData(dataItem)
    },
    updateData: function(dataItem) {
        var argumentWasChanged = this.argument !== dataItem.argument;
        this.argument = this.initialArgument = this.originalArgument = dataItem.argument;
        this.tag = dataItem.tag;
        this.index = dataItem.index;
        this._dataItem = dataItem;
        this.data = dataItem.data;
        this.lowError = dataItem.lowError;
        this.highError = dataItem.highError;
        this.aggregationInfo = dataItem.aggregationInfo;
        this._updateData(dataItem, argumentWasChanged);
        !this.hasValue() && this.setInvisibility();
        this._fillStyle();
        this._updateLabelData()
    },
    deleteMarker: function() {
        if (this.graphic) {
            this.graphic.dispose()
        }
        this.graphic = null
    },
    draw: function(renderer, groups, animationEnabled, firstDrawing) {
        if (this._needDeletingOnDraw || this.series.autoHidePointMarkers && !this.isSelected()) {
            this.deleteMarker();
            this._needDeletingOnDraw = false
        }
        if (this._needClearingOnDraw) {
            this.clearMarker();
            this._needClearingOnDraw = false
        }
        if (!this._hasGraphic()) {
            this.getMarkerVisibility() && !this.series.autoHidePointMarkers && this._drawMarker(renderer, groups.markers, animationEnabled, firstDrawing)
        } else {
            this._updateMarker(animationEnabled, this._getStyle(), groups.markers)
        }
        this._drawLabel();
        this._drawErrorBar(renderer, groups.errorBars, animationEnabled);
        return this
    },
    _getViewStyle: function() {
        var state = NORMAL_STATE;
        var fullState = this.fullState;
        var styles = [NORMAL, HOVER, SELECTION, SELECTION];
        if (this._viewCounters.hover) {
            state |= HOVER_STATE
        }
        if (this._viewCounters.selection) {
            state |= SELECTED_STATE
        }
        if (isNoneMode(this.getOptions().selectionMode)) {
            fullState &= ~SELECTED_STATE
        }
        if (isNoneMode(this.getOptions().hoverMode)) {
            fullState &= ~HOVER_STATE
        }
        state |= fullState;
        return styles[state]
    },
    applyView: function(legendCallback) {
        var style = this._getViewStyle();
        this._currentStyle = style;
        if (!this.graphic && this.series.autoHidePointMarkers && (style === SELECTION || style === HOVER)) {
            this._drawMarker(this.series.getRenderer(), this.series.getMarkersGroup())
        }
        if (this.graphic) {
            if (this.series.autoHidePointMarkers && style !== SELECTION && style !== HOVER) {
                this.deleteMarker()
            } else {
                if ("normal" === style) {
                    this.clearMarker()
                } else {
                    this.graphic.toForeground()
                }
                this._updateMarker(true, this._styles[style], void 0, legendCallback)
            }
        }
    },
    setView: function(style) {
        this._viewCounters[style]++;
        this.applyView()
    },
    resetView: function(style) {
        var viewCounters = this._viewCounters;
        --viewCounters[style];
        if (viewCounters[style] < 0) {
            viewCounters[style] = 0
        }
        this.applyView()
    },
    releaseHoverState: function() {
        if (this.graphic && !this.isSelected()) {
            this.graphic.toBackground()
        }
    },
    select: function() {
        this.series.selectPoint(this)
    },
    clearSelection: function() {
        this.series.deselectPoint(this)
    },
    hover: function() {
        this.series.hoverPoint(this)
    },
    clearHover: function() {
        this.series.clearPointHover()
    },
    showTooltip: function() {
        this.series.showPointTooltip(this)
    },
    hideTooltip: function() {
        this.series.hidePointTooltip(this)
    },
    _checkLabelsChanging: function(oldType, newType) {
        var isNewRange = ~newType.indexOf("range");
        var isOldRange = ~oldType.indexOf("range");
        return isOldRange && !isNewRange || !isOldRange && isNewRange
    },
    updateOptions: function(newOptions) {
        if (!newOptions) {
            return
        }
        var oldOptions = this._options;
        var widgetType = newOptions.widgetType;
        var oldType = oldOptions && oldOptions.type;
        var newType = newOptions.type;
        var newPointTypeMixin = pointTypes[widgetType][newType];
        if (oldType !== newType) {
            this._needDeletingOnDraw = true;
            this._needClearingOnDraw = false;
            if (oldType) {
                this._checkLabelsChanging(oldType, newType) && this.deleteLabel();
                this._resetType(mixins[pointTypes[oldType]])
            }
            this._setType(mixins[newPointTypeMixin])
        } else {
            this._needDeletingOnDraw = this._checkSymbol(oldOptions, newOptions);
            this._needClearingOnDraw = this._checkCustomize(oldOptions, newOptions)
        }
        this._options = newOptions;
        this._fillStyle();
        this._updateLabelOptions(newPointTypeMixin)
    },
    translate: function() {
        if (this.hasValue()) {
            this._translate();
            this.translated = true
        }
    },
    _checkCustomize: function(oldOptions, newOptions) {
        return oldOptions.styles.usePointCustomOptions && !newOptions.styles.usePointCustomOptions
    },
    _getCustomLabelVisibility: function() {
        return this._styles.useLabelCustomOptions ? !!this._options.label.visible : null
    },
    getBoundingRect: function() {
        return this._getGraphicBBox()
    },
    _resetType: function(methods) {
        for (var methodName in methods) {
            delete this[methodName]
        }
    },
    _setType: function(methods) {
        for (var methodName in methods) {
            this[methodName] = methods[methodName]
        }
    },
    isInVisibleArea: function() {
        return this.inVisibleArea
    },
    isSelected: function() {
        return !!(this.fullState & SELECTED_STATE)
    },
    isHovered: function() {
        return !!(this.fullState & HOVER_STATE)
    },
    getOptions: function() {
        return this._options
    },
    animate: function(complete, settings, partitionDuration) {
        if (!this.graphic) {
            complete && complete();
            return
        }
        this.graphic.animate(settings, {
            partitionDuration: partitionDuration
        }, complete)
    },
    getCoords: function(min) {
        if (!min) {
            return {
                x: this.x,
                y: this.y
            }
        }
        if (!this._options.rotated) {
            return {
                x: this.x,
                y: this.minY + (this.y - this.minY ? 0 : 1)
            }
        }
        return {
            x: this.minX - (this.x - this.minX ? 0 : 1),
            y: this.y
        }
    },
    getDefaultCoords: function() {
        return !this._options.rotated ? {
            x: this.x,
            y: this.defaultY
        } : {
            x: this.defaultX,
            y: this.y
        }
    },
    setDefaultCoords: function() {
        var coords = this.getDefaultCoords();
        this.x = coords.x;
        this.y = coords.y
    },
    _getVisibleArea: function() {
        return this.series.getVisibleArea()
    },
    _getArgTranslator: function() {
        return this.series.getArgumentAxis().getTranslator()
    },
    _getValTranslator: function() {
        return this.series.getValueAxis().getTranslator()
    },
    _calculateVisibility: function(x, y, width, height) {
        var visibleArea = this._getVisibleArea();
        var rotated = this._options.rotated;
        if (visibleArea.minX > x + (width || 0) || visibleArea.maxX < x || visibleArea.minY > y + (height || 0) || visibleArea.maxY < y || rotated && (0, _type.isDefined)(width) && 0 !== width && (visibleArea.minX === x + width || visibleArea.maxX === x) || !rotated && (0, _type.isDefined)(height) && 0 !== height && (visibleArea.minY === y + height || visibleArea.maxY === y)) {
            this.inVisibleArea = false
        } else {
            this.inVisibleArea = true
        }
    },
    isArgumentCorrect: function() {
        return this.series._argumentChecker(this.argument)
    },
    isValueCorrect: function() {
        var valueChecker = this.series._valueChecker;
        return valueChecker(this.getMinValue()) && valueChecker(this.getMaxValue())
    },
    hasValue: function() {
        return null !== this.value && null !== this.minValue && this.isArgumentCorrect() && this.isValueCorrect()
    },
    hasCoords: _common.noop,
    correctPosition: _common.noop,
    correctRadius: _common.noop,
    correctLabelRadius: _common.noop,
    getCrosshairData: _common.noop,
    getPointRadius: _common.noop,
    _populatePointShape: _common.noop,
    _checkSymbol: _common.noop,
    getMarkerCoords: _common.noop,
    hide: _common.noop,
    show: _common.noop,
    hideMarker: _common.noop,
    setInvisibility: _common.noop,
    clearVisibility: _common.noop,
    isVisible: _common.noop,
    resetCorrection: _common.noop,
    correctValue: _common.noop,
    resetValue: _common.noop,
    setPercentValue: _common.noop,
    correctCoordinates: _common.noop,
    coordsIn: _common.noop,
    getTooltipParams: _common.noop,
    applyWordWrap: _common.noop,
    setLabelTrackerData: _common.noop,
    updateLabelCoord: _common.noop,
    drawLabel: _common.noop,
    correctLabelPosition: _common.noop,
    getMinValue: _common.noop,
    getMaxValue: _common.noop,
    _drawErrorBar: _common.noop,
    getMarkerVisibility: _common.noop,
    dispose: function() {
        this.deleteMarker();
        this.deleteLabel();
        this._errorBar && this._errorBar.dispose();
        this._options = this._styles = this.series = this._errorBar = null
    },
    getTooltipFormatObject: function(tooltip, stackPoints) {
        var tooltipFormatObject = this._getFormatObject(tooltip);
        var sharedTooltipValuesArray = [];
        var tooltipStackPointsFormatObject = [];
        if (stackPoints) {
            stackPoints.forEach((function(point) {
                if (!point.isVisible()) {
                    return
                }
                var formatObject = point._getFormatObject(tooltip);
                tooltipStackPointsFormatObject.push(formatObject);
                sharedTooltipValuesArray.push(formatObject.seriesName + ": " + formatObject.valueText)
            }));
            _extend(tooltipFormatObject, {
                points: tooltipStackPointsFormatObject,
                valueText: sharedTooltipValuesArray.join("\n"),
                stackName: this.series.getStackName() || null
            })
        }
        var aggregationInfo = this.aggregationInfo;
        if (aggregationInfo) {
            var axis = this.series.getArgumentAxis();
            var rangeText = axis.formatRange(aggregationInfo.intervalStart, aggregationInfo.intervalEnd, aggregationInfo.aggregationInterval);
            if (rangeText) {
                tooltipFormatObject.valueText += "\n".concat(rangeText)
            }
        }
        return tooltipFormatObject
    },
    setHole: function(holeValue, position) {
        var minValue = isFinite(this.minValue) ? this.minValue : 0;
        if ((0, _type.isDefined)(holeValue)) {
            if ("left" === position) {
                this.leftHole = this.value - holeValue;
                this.minLeftHole = minValue - holeValue
            } else {
                this.rightHole = this.value - holeValue;
                this.minRightHole = minValue - holeValue
            }
        }
    },
    resetHoles: function() {
        this.leftHole = null;
        this.minLeftHole = null;
        this.rightHole = null;
        this.minRightHole = null
    },
    getLabel: function() {
        return this._label
    },
    getLabels: function() {
        return [this._label]
    },
    getCenterCoord: function() {
        return {
            x: this.x,
            y: this.y
        }
    }
};
