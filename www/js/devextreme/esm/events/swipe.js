/**
 * DevExtreme (esm/events/swipe.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import {
    eventData
} from "./utils/index";
import GestureEmitter from "./gesture/emitter.gesture";
import registerEmitter from "./core/emitter_registrator";
var SWIPE_START_EVENT = "dxswipestart";
var SWIPE_EVENT = "dxswipe";
var SWIPE_END_EVENT = "dxswipeend";
var HorizontalStrategy = {
    defaultItemSizeFunc: function() {
        return this.getElement().width()
    },
    getBounds: function() {
        return [this._maxLeftOffset, this._maxRightOffset]
    },
    calcOffsetRatio: function(e) {
        var endEventData = eventData(e);
        return (endEventData.x - (this._savedEventData && this._savedEventData.x || 0)) / this._itemSizeFunc().call(this, e)
    },
    isFastSwipe: function(e) {
        var endEventData = eventData(e);
        return this.FAST_SWIPE_SPEED_LIMIT * Math.abs(endEventData.x - this._tickData.x) >= endEventData.time - this._tickData.time
    }
};
var VerticalStrategy = {
    defaultItemSizeFunc: function() {
        return this.getElement().height()
    },
    getBounds: function() {
        return [this._maxTopOffset, this._maxBottomOffset]
    },
    calcOffsetRatio: function(e) {
        var endEventData = eventData(e);
        return (endEventData.y - (this._savedEventData && this._savedEventData.y || 0)) / this._itemSizeFunc().call(this, e)
    },
    isFastSwipe: function(e) {
        var endEventData = eventData(e);
        return this.FAST_SWIPE_SPEED_LIMIT * Math.abs(endEventData.y - this._tickData.y) >= endEventData.time - this._tickData.time
    }
};
var STRATEGIES = {
    horizontal: HorizontalStrategy,
    vertical: VerticalStrategy
};
var SwipeEmitter = GestureEmitter.inherit({
    TICK_INTERVAL: 300,
    FAST_SWIPE_SPEED_LIMIT: 10,
    ctor: function(element) {
        this.callBase(element);
        this.direction = "horizontal";
        this.elastic = true
    },
    _getStrategy: function() {
        return STRATEGIES[this.direction]
    },
    _defaultItemSizeFunc: function() {
        return this._getStrategy().defaultItemSizeFunc.call(this)
    },
    _itemSizeFunc: function() {
        return this.itemSizeFunc || this._defaultItemSizeFunc
    },
    _init: function(e) {
        this._tickData = eventData(e)
    },
    _start: function(e) {
        this._savedEventData = eventData(e);
        e = this._fireEvent(SWIPE_START_EVENT, e);
        if (!e.cancel) {
            this._maxLeftOffset = e.maxLeftOffset;
            this._maxRightOffset = e.maxRightOffset;
            this._maxTopOffset = e.maxTopOffset;
            this._maxBottomOffset = e.maxBottomOffset
        }
    },
    _move: function(e) {
        var strategy = this._getStrategy();
        var moveEventData = eventData(e);
        var offset = strategy.calcOffsetRatio.call(this, e);
        offset = this._fitOffset(offset, this.elastic);
        if (moveEventData.time - this._tickData.time > this.TICK_INTERVAL) {
            this._tickData = moveEventData
        }
        this._fireEvent(SWIPE_EVENT, e, {
            offset: offset
        });
        e.preventDefault()
    },
    _end: function(e) {
        var strategy = this._getStrategy();
        var offsetRatio = strategy.calcOffsetRatio.call(this, e);
        var isFast = strategy.isFastSwipe.call(this, e);
        var startOffset = offsetRatio;
        var targetOffset = this._calcTargetOffset(offsetRatio, isFast);
        startOffset = this._fitOffset(startOffset, this.elastic);
        targetOffset = this._fitOffset(targetOffset, false);
        this._fireEvent(SWIPE_END_EVENT, e, {
            offset: startOffset,
            targetOffset: targetOffset
        })
    },
    _fitOffset: function(offset, elastic) {
        var strategy = this._getStrategy();
        var bounds = strategy.getBounds.call(this);
        if (offset < -bounds[0]) {
            return elastic ? (-2 * bounds[0] + offset) / 3 : -bounds[0]
        }
        if (offset > bounds[1]) {
            return elastic ? (2 * bounds[1] + offset) / 3 : bounds[1]
        }
        return offset
    },
    _calcTargetOffset: function(offsetRatio, isFast) {
        var result;
        if (isFast) {
            result = Math.ceil(Math.abs(offsetRatio));
            if (offsetRatio < 0) {
                result = -result
            }
        } else {
            result = Math.round(offsetRatio)
        }
        return result
    }
});
registerEmitter({
    emitter: SwipeEmitter,
    events: [SWIPE_START_EVENT, SWIPE_EVENT, SWIPE_END_EVENT]
});
export {
    SWIPE_EVENT as swipe, SWIPE_START_EVENT as start, SWIPE_END_EVENT as end
};
