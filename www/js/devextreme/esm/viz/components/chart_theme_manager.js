/**
 * DevExtreme (esm/viz/components/chart_theme_manager.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import {
    noop
} from "../../core/utils/common";
import {
    isString as _isString,
    isDefined as _isDefined,
    isNumeric,
    isPlainObject
} from "../../core/utils/type";
import {
    extend
} from "../../core/utils/extend";
import {
    BaseThemeManager
} from "../core/base_theme_manager";
import {
    normalizeEnum as _normalizeEnum
} from "../core/utils";
export var ThemeManager = BaseThemeManager.inherit(function() {
    var processAxisOptions = function(axisOptions) {
        if (!axisOptions) {
            return {}
        }
        axisOptions = extend(true, {}, axisOptions);
        axisOptions.title = (options = axisOptions.title, _isString(options) ? {
            text: options
        } : options);
        var options;
        if ("logarithmic" === axisOptions.type && axisOptions.logarithmBase <= 0 || axisOptions.logarithmBase && !isNumeric(axisOptions.logarithmBase)) {
            axisOptions.logarithmBase = void 0;
            axisOptions.logarithmBaseError = true
        }
        if (axisOptions.label) {
            if (axisOptions.label.alignment) {
                axisOptions.label.userAlignment = true
            }
        }
        return axisOptions
    };
    var applyParticularAxisOptions = function(name, userOptions, rotated) {
        var theme = this._theme;
        var position = !(rotated ^ "valueAxis" === name) ? "horizontalAxis" : "verticalAxis";
        var processedUserOptions = processAxisOptions(userOptions);
        var commonAxisSettings = processAxisOptions(this._userOptions.commonAxisSettings);
        var mergeOptions = extend(true, {}, theme.commonAxisSettings, theme[position], theme[name], commonAxisSettings, processedUserOptions);
        mergeOptions.workWeek = processedUserOptions.workWeek || theme[name].workWeek;
        mergeOptions.forceUserTickInterval |= _isDefined(processedUserOptions.tickInterval) && !_isDefined(processedUserOptions.axisDivisionFactor);
        return mergeOptions
    };
    var mergeOptions = function(name, userOptions) {
        userOptions = userOptions || this._userOptions[name];
        var theme = this._theme[name];
        var result = this._mergedSettings[name];
        if (result) {
            return result
        }
        if (isPlainObject(theme) && isPlainObject(userOptions)) {
            result = extend(true, {}, theme, userOptions)
        } else {
            result = _isDefined(userOptions) ? userOptions : theme
        }
        this._mergedSettings[name] = result;
        return result
    };
    var applyParticularTheme = {
        base: mergeOptions,
        argumentAxis: applyParticularAxisOptions,
        valueAxisRangeSelector: function() {
            return mergeOptions.call(this, "valueAxis")
        },
        valueAxis: applyParticularAxisOptions,
        series: function(name, userOptions, seriesCount) {
            var that = this;
            var theme = that._theme;
            var userCommonSettings = that._userOptions.commonSeriesSettings || {};
            var themeCommonSettings = theme.commonSeriesSettings;
            var widgetType = that._themeSection.split(".").slice(-1)[0];
            var type = _normalizeEnum(userOptions.type || userCommonSettings.type || themeCommonSettings.type || "pie" === widgetType && theme.type);
            var palette = that.palette;
            var isBar = ~type.indexOf("bar");
            var isLine = ~type.indexOf("line");
            var isArea = ~type.indexOf("area");
            var isBubble = "bubble" === type;
            var mainSeriesColor;
            var resolveLabelsOverlapping = that.getOptions("resolveLabelsOverlapping");
            var containerBackgroundColor = that.getOptions("containerBackgroundColor");
            var seriesTemplate = applyParticularTheme.seriesTemplate.call(this);
            var seriesVisibility;
            if (isBar || isBubble) {
                userOptions = extend(true, {}, userCommonSettings, userCommonSettings[type], userOptions);
                seriesVisibility = userOptions.visible;
                userCommonSettings = {
                    type: {}
                };
                extend(true, userOptions, userOptions.point);
                userOptions.visible = seriesVisibility
            }
            var settings = extend(true, {
                aggregation: {}
            }, themeCommonSettings, themeCommonSettings[type], userCommonSettings, userCommonSettings[type], userOptions);
            settings.aggregation.enabled = "chart" === widgetType && !!settings.aggregation.enabled;
            settings.type = type;
            settings.widgetType = widgetType;
            settings.containerBackgroundColor = containerBackgroundColor;
            if ("pie" !== widgetType) {
                mainSeriesColor = settings.color || palette.getNextColor(seriesCount)
            } else {
                mainSeriesColor = function(argument, index, count) {
                    var cat = "".concat(argument, "-").concat(index);
                    if (!that._multiPieColors[cat]) {
                        that._multiPieColors[cat] = palette.getNextColor(count)
                    }
                    return that._multiPieColors[cat]
                }
            }
            settings.mainSeriesColor = mainSeriesColor;
            settings.resolveLabelsOverlapping = resolveLabelsOverlapping;
            if (settings.label && (isLine || isArea && "rangearea" !== type || "scatter" === type)) {
                settings.label.position = "outside"
            }
            if (seriesTemplate) {
                settings.nameField = seriesTemplate.nameField
            }
            return settings
        },
        animation: function(name) {
            var userOptions = this._userOptions[name];
            userOptions = isPlainObject(userOptions) ? userOptions : _isDefined(userOptions) ? {
                enabled: !!userOptions
            } : {};
            return mergeOptions.call(this, name, userOptions)
        },
        seriesTemplate() {
            var value = mergeOptions.call(this, "seriesTemplate");
            if (value) {
                value.nameField = value.nameField || "series"
            }
            return value
        },
        zoomAndPan() {
            function parseOption(option) {
                option = _normalizeEnum(option);
                var pan = "pan" === option || "both" === option;
                var zoom = "zoom" === option || "both" === option;
                return {
                    pan: pan,
                    zoom: zoom,
                    none: !pan && !zoom
                }
            }
            var options = mergeOptions.call(this, "zoomAndPan");
            return {
                valueAxis: parseOption(options.valueAxis),
                argumentAxis: parseOption(options.argumentAxis),
                dragToZoom: !!options.dragToZoom,
                dragBoxStyle: {
                    class: "dxc-shutter",
                    fill: options.dragBoxStyle.color,
                    opacity: options.dragBoxStyle.opacity
                },
                panKey: options.panKey,
                allowMouseWheel: !!options.allowMouseWheel,
                allowTouchGestures: !!options.allowTouchGestures
            }
        }
    };
    return {
        _themeSection: "chart",
        ctor: function(params) {
            var that = this;
            that.callBase.apply(that, arguments);
            var options = params.options || {};
            that._userOptions = options;
            that._mergeAxisTitleOptions = [];
            that._multiPieColors = {};
            that._callback = noop
        },
        dispose: function() {
            var that = this;
            that.palette && that.palette.dispose();
            that.palette = that._userOptions = that._mergedSettings = that._multiPieColors = null;
            return that.callBase.apply(that, arguments)
        },
        resetPalette: function() {
            this.palette.reset();
            this._multiPieColors = {}
        },
        getOptions: function(name) {
            return (applyParticularTheme[name] || applyParticularTheme.base).apply(this, arguments)
        },
        refresh: function() {
            this._mergedSettings = {};
            return this.callBase.apply(this, arguments)
        },
        _initializeTheme: function() {
            var that = this;
            that.callBase.apply(that, arguments);
            that.updatePalette()
        },
        resetOptions: function(name) {
            this._mergedSettings[name] = null
        },
        update: function(options) {
            this._userOptions = options
        },
        updatePalette: function() {
            this.palette = this.createPalette(this.getOptions("palette"), {
                useHighlight: true,
                extensionMode: this.getOptions("paletteExtensionMode")
            })
        }
    }
}());
