/**
 * DevExtreme (esm/viz/axes/smart_formatter.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import formatHelper from "../../format_helper";
import {
    isDefined,
    isFunction,
    isExponential,
    isObject
} from "../../core/utils/type";
import dateUtils from "../../core/utils/date";
import {
    adjust,
    getPrecision,
    getExponent
} from "../../core/utils/math";
import {
    getAdjustedLog10 as log10
} from "../core/utils";
var _format = formatHelper.format;
var {
    abs: abs,
    floor: floor
} = Math;
var EXPONENTIAL = "exponential";
var formats = ["fixedPoint", "thousands", "millions", "billions", "trillions", EXPONENTIAL];
var dateUnitIntervals = ["millisecond", "second", "minute", "hour", "day", "month", "year"];

function getDatesDifferences(prevDate, curDate, nextDate, tickFormat) {
    var prevDifferences;
    var nextDifferences;
    var dateUnitInterval;
    var dateUnitsLength = dateUnitIntervals.length;
    var i;
    var j;
    if ("week" === tickFormat) {
        tickFormat = "day"
    } else if ("quarter" === tickFormat) {
        tickFormat = "month"
    } else if ("shorttime" === tickFormat) {
        tickFormat = "hour"
    } else if ("longtime" === tickFormat) {
        tickFormat = "second"
    }
    var tickFormatIndex = dateUnitIntervals.indexOf(tickFormat);
    if (nextDate) {
        nextDifferences = dateUtils.getDatesDifferences(curDate, nextDate);
        prevDifferences = dateUtils.getDatesDifferences(curDate, prevDate);
        if (nextDifferences[tickFormat]) {
            for (i = dateUnitsLength - 1; i >= tickFormatIndex; i--) {
                dateUnitInterval = dateUnitIntervals[i];
                if (i === tickFormatIndex) {
                    setDateUnitInterval(nextDifferences, tickFormatIndex + (nextDifferences.millisecond ? 2 : 1))
                } else if (nextDifferences[dateUnitInterval]) {
                    resetDateUnitInterval(nextDifferences, i);
                    break
                }
            }
        }
    } else {
        prevDifferences = dateUtils.getDatesDifferences(prevDate, curDate);
        for (i = dateUnitsLength - 1; i >= tickFormatIndex; i--) {
            dateUnitInterval = dateUnitIntervals[i];
            if (prevDifferences[dateUnitInterval]) {
                if (i - tickFormatIndex > 1) {
                    for (j = tickFormatIndex + 1; j >= 0; j--) {
                        resetDateUnitInterval(prevDifferences, j)
                    }
                    break
                } else if (isDateTimeStart(curDate, dateUnitInterval)) {
                    for (j = i - 1; j > 0; j--) {
                        resetDateUnitInterval(prevDifferences, j)
                    }
                    break
                }
            }
        }
    }
    return nextDate ? nextDifferences : prevDifferences
}

function isDateTimeStart(date, dateUnitInterval) {
    var unitNumbers = [date.getMilliseconds(), date.getSeconds(), date.getMinutes(), date.getHours(), date.getDate(), date.getMonth()];
    var unitIndex = dateUnitIntervals.indexOf(dateUnitInterval);
    var i;
    for (i = 0; i < unitIndex; i++) {
        if (4 === i && 1 !== unitNumbers[i] || 4 !== i && 0 !== unitNumbers[i]) {
            return false
        }
    }
    return true
}

function resetDateUnitInterval(differences, intervalIndex) {
    var dateUnitInterval = dateUnitIntervals[intervalIndex];
    if (differences[dateUnitInterval]) {
        differences[dateUnitInterval] = false;
        differences.count--
    }
}

function setDateUnitInterval(differences, intervalIndex) {
    var dateUnitInterval = dateUnitIntervals[intervalIndex];
    if (false === differences[dateUnitInterval]) {
        differences[dateUnitInterval] = true;
        differences.count++
    }
}

function getNoZeroIndex(str) {
    return str.length - parseInt(str).toString().length
}

function getTransitionTickIndex(ticks, value) {
    var i;
    var curDiff;
    var minDiff;
    var nearestTickIndex = 0;
    minDiff = abs(value - ticks[0]);
    for (i = 1; i < ticks.length; i++) {
        curDiff = abs(value - ticks[i]);
        if (curDiff < minDiff) {
            minDiff = curDiff;
            nearestTickIndex = i
        }
    }
    return nearestTickIndex
}

function splitDecimalNumber(value) {
    return value.toString().split(".")
}

function createFormat(type) {
    var formatter;
    if (isFunction(type)) {
        formatter = type;
        type = null
    }
    return {
        type: type,
        formatter: formatter
    }
}
export function smartFormatter(tick, options) {
    var tickInterval = options.tickInterval;
    var tickIntervalIndex;
    var tickIndex;
    var actualIndex;
    var stringTick = abs(tick).toString();
    var precision = 0;
    var typeFormat;
    var offset = 0;
    var separatedTickInterval;
    var indexOfFormat = 0;
    var indexOfTick = -1;
    var datesDifferences;
    var format = options.labelOptions.format;
    var ticks = options.ticks;
    var log10Tick;
    var prevDateIndex;
    var nextDateIndex;
    var isLogarithmic = "logarithmic" === options.type;
    if (1 === ticks.length && 0 === ticks.indexOf(tick) && !isDefined(tickInterval)) {
        tickInterval = abs(tick) >= 1 ? 1 : adjust(1 - abs(tick), tick)
    }
    if (!isDefined(format) && "discrete" !== options.type && tick && (10 === options.logarithmBase || !isLogarithmic)) {
        if ("datetime" !== options.dataType && isDefined(tickInterval)) {
            if (ticks.length && -1 === ticks.indexOf(tick)) {
                indexOfTick = getTransitionTickIndex(ticks, tick);
                tickInterval = adjust(abs(tick - ticks[indexOfTick]), tick)
            }
            separatedTickInterval = splitDecimalNumber(tickInterval);
            if (separatedTickInterval < 2) {
                separatedTickInterval = splitDecimalNumber(tick)
            }
            if (isLogarithmic) {
                log10Tick = log10(abs(tick));
                if (log10Tick > 0) {
                    typeFormat = formats[floor(log10Tick / 3)] || EXPONENTIAL
                } else if (log10Tick < -4) {
                    typeFormat = EXPONENTIAL
                } else {
                    return _format(adjust(tick))
                }
            } else if (separatedTickInterval.length > 1 && !isExponential(tickInterval)) {
                precision = separatedTickInterval[1].length;
                typeFormat = formats[indexOfFormat]
            } else if (isExponential(tickInterval) && (-1 !== stringTick.indexOf(".") || isExponential(tick))) {
                typeFormat = EXPONENTIAL;
                if (!isExponential(tick)) {
                    precision = abs(getNoZeroIndex(stringTick.split(".")[1]) - getExponent(tickInterval) + 1)
                } else {
                    precision = Math.max(abs(getExponent(tick) - getExponent(tickInterval)), abs(getPrecision(tick) - getPrecision(tickInterval)))
                }
            } else {
                tickIntervalIndex = floor(log10(tickInterval));
                actualIndex = tickIndex = floor(log10(abs(tick)));
                if (tickIndex - tickIntervalIndex >= 2) {
                    actualIndex = tickIntervalIndex
                }
                indexOfFormat = floor(actualIndex / 3);
                offset = 3 * indexOfFormat;
                if (indexOfFormat < 5) {
                    if (tickIntervalIndex - offset === 2 && tickIndex >= 3) {
                        indexOfFormat++;
                        offset = 3 * indexOfFormat
                    }
                    typeFormat = formats[indexOfFormat]
                } else {
                    typeFormat = formats[formats.length - 1]
                }
                if (offset > 0) {
                    separatedTickInterval = splitDecimalNumber(tickInterval / Math.pow(10, offset));
                    if (separatedTickInterval[1]) {
                        precision = separatedTickInterval[1].length
                    }
                }
            }
            if (void 0 !== typeFormat || void 0 !== precision) {
                format = {
                    type: typeFormat,
                    precision: precision
                }
            }
        } else if ("datetime" === options.dataType) {
            typeFormat = dateUtils.getDateFormatByTickInterval(tickInterval);
            if (options.showTransition && ticks.length) {
                indexOfTick = ticks.map(Number).indexOf(+tick);
                if (1 === ticks.length && 0 === indexOfTick) {
                    typeFormat = formatHelper.getDateFormatByTicks(ticks)
                } else {
                    if (-1 === indexOfTick) {
                        prevDateIndex = getTransitionTickIndex(ticks, tick)
                    } else {
                        prevDateIndex = 0 === indexOfTick ? ticks.length - 1 : indexOfTick - 1;
                        nextDateIndex = 0 === indexOfTick ? 1 : -1
                    }
                    datesDifferences = getDatesDifferences(ticks[prevDateIndex], tick, ticks[nextDateIndex], typeFormat);
                    typeFormat = formatHelper.getDateFormatByDifferences(datesDifferences, typeFormat)
                }
            }
            format = createFormat(typeFormat)
        }
    }
    return _format(tick, format)
}

function getHighDiffFormat(diff) {
    var stop = false;
    for (var i in diff) {
        if (true === diff[i] || "hour" === i || stop) {
            diff[i] = false;
            stop = true
        } else if (false === diff[i]) {
            diff[i] = true
        }
    }
    return createFormat(formatHelper.getDateFormatByDifferences(diff))
}

function getHighAndSelfDiffFormat(diff, interval) {
    var stop = false;
    for (var i in diff) {
        if (stop) {
            diff[i] = false
        } else if (i === interval) {
            stop = true
        } else {
            diff[i] = true
        }
    }
    return createFormat(formatHelper.getDateFormatByDifferences(diff))
}

function formatDateRange(startValue, endValue, tickInterval) {
    var diff = getDatesDifferences(startValue, endValue);
    var typeFormat = dateUtils.getDateFormatByTickInterval(tickInterval);
    var diffFormatType = formatHelper.getDateFormatByDifferences(diff, typeFormat);
    var diffFormat = createFormat(diffFormatType);
    var values = [];
    if (tickInterval in diff) {
        var rangeFormat = getHighAndSelfDiffFormat(getDatesDifferences(startValue, endValue), tickInterval);
        var value = _format(startValue, rangeFormat);
        if (value) {
            values.push(value)
        }
    } else {
        var _rangeFormat = getHighDiffFormat(getDatesDifferences(startValue, endValue));
        var highValue = _format(startValue, _rangeFormat);
        if (highValue) {
            values.push(highValue)
        }
        values.push("".concat(_format(startValue, diffFormat), " - ").concat(_format(endValue, diffFormat)))
    }
    return values.join(", ")
}

function processDateInterval(interval) {
    if (isObject(interval)) {
        var dateUnits = Object.keys(interval);
        var sum = dateUnits.reduce((sum, k) => interval[k] + sum, 0);
        if (1 === sum) {
            var dateUnit = dateUnits.filter(k => 1 === interval[k])[0];
            return dateUnit.slice(0, dateUnit.length - 1)
        }
    }
    return interval
}
export function formatRange(startValue, endValue, tickInterval, _ref) {
    var {
        dataType: dataType,
        type: type,
        logarithmBase: logarithmBase
    } = _ref;
    if ("discrete" === type) {
        return ""
    }
    if ("datetime" === dataType) {
        return formatDateRange(startValue, endValue, processDateInterval(tickInterval))
    }
    var formatOptions = {
        ticks: [],
        type: type,
        dataType: dataType,
        tickInterval: tickInterval,
        logarithmBase: logarithmBase,
        labelOptions: {}
    };
    return "".concat(smartFormatter(startValue, formatOptions), " - ").concat(smartFormatter(endValue, formatOptions))
}
