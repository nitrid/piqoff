/**
 * DevExtreme (cjs/ui/grid_core/ui.grid_core.virtual_scrolling_core.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.getContentHeightLimit = getContentHeightLimit;
exports.subscribeToExternalScrollers = subscribeToExternalScrollers;
exports.VirtualScrollController = exports.getPixelRatio = void 0;
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _window = require("../../core/utils/window");
var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));
var _browser = _interopRequireDefault(require("../../core/utils/browser"));
var _position = _interopRequireDefault(require("../../animation/position"));
var _iterator = require("../../core/utils/iterator");
var _class = _interopRequireDefault(require("../../core/class"));
var _deferred = require("../../core/utils/deferred");
var _callbacks = _interopRequireDefault(require("../../core/utils/callbacks"));
var _uiGridCore = require("./ui.grid.core.virtual_data_loader");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}
var SCROLLING_MODE_INFINITE = "infinite";
var SCROLLING_MODE_VIRTUAL = "virtual";
var NEW_SCROLLING_MODE = "scrolling.newMode";
var _isVirtualMode = function(that) {
    return that.option("scrolling.mode") === SCROLLING_MODE_VIRTUAL || that._isVirtual
};
var _isAppendMode = function(that) {
    return that.option("scrolling.mode") === SCROLLING_MODE_INFINITE && !that._isVirtual
};
var getPixelRatio = function(window) {
    return window.devicePixelRatio || 1
};
exports.getPixelRatio = getPixelRatio;

function getContentHeightLimit(browser) {
    if (browser.msie) {
        return 4e6
    } else if (browser.mozilla) {
        return 8e6
    }
    return 15e6 / getPixelRatio((0, _window.getWindow)())
}

function subscribeToExternalScrollers($element, scrollChangedHandler, $targetElement) {
    var $scrollElement;
    var scrollableArray = [];
    var scrollToArray = [];
    var disposeArray = [];
    $targetElement = $targetElement || $element;

    function getElementOffset(scrollable) {
        var $scrollableElement = scrollable.element ? scrollable.$element() : scrollable;
        var scrollableOffset = _position.default.offset($scrollableElement);
        if (!scrollableOffset) {
            return $element.offset().top
        }
        return scrollable.scrollTop() - (scrollableOffset.top - $element.offset().top)
    }
    var widgetScrollStrategy = {
        on: function(scrollable, eventName, handler) {
            scrollable.on("scroll", handler)
        },
        off: function(scrollable, eventName, handler) {
            scrollable.off("scroll", handler)
        }
    };

    function subscribeToScrollEvents($scrollElement) {
        var isDocument = "#document" === $scrollElement.get(0).nodeName;
        var scrollable = $scrollElement.data("dxScrollable");
        var eventsStrategy = widgetScrollStrategy;
        if (!scrollable) {
            scrollable = isDocument && (0, _renderer.default)((0, _window.getWindow)()) || "auto" === $scrollElement.css("overflowY") && $scrollElement;
            eventsStrategy = _events_engine.default;
            if (!scrollable) {
                return
            }
        }
        var handler = function(scrollable) {
            return function() {
                var scrollTop = scrollable.scrollTop() - getElementOffset(scrollable);
                scrollTop = scrollTop > 0 ? scrollTop : 0;
                scrollChangedHandler(scrollTop)
            }
        }(scrollable);
        eventsStrategy.on(scrollable, "scroll", handler);
        scrollToArray.push((function(pos) {
            var topOffset = getElementOffset(scrollable);
            var scrollMethod = scrollable.scrollTo ? "scrollTo" : "scrollTop";
            if (pos - topOffset >= 0) {
                scrollable[scrollMethod](pos + topOffset)
            }
        }));
        scrollableArray.push(scrollable);
        disposeArray.push((function() {
            eventsStrategy.off(scrollable, "scroll", handler)
        }))
    }
    for ($scrollElement = $targetElement.parent(); $scrollElement.length; $scrollElement = $scrollElement.parent()) {
        subscribeToScrollEvents($scrollElement)
    }
    return {
        scrollTo: function(pos) {
            (0, _iterator.each)(scrollToArray, (function(_, scrollTo) {
                scrollTo(pos)
            }))
        },
        dispose: function() {
            (0, _iterator.each)(disposeArray, (function(_, dispose) {
                dispose()
            }))
        }
    }
}
var VirtualScrollController = _class.default.inherit(function() {
    var members = {
        ctor: function(component, dataOptions, isVirtual) {
            this._dataOptions = dataOptions;
            this.component = component;
            this._viewportSize = 0;
            this._viewportItemSize = 20;
            this._viewportItemIndex = 0;
            this._contentSize = 0;
            this._itemSizes = {};
            this._sizeRatio = 1;
            this._isVirtual = isVirtual;
            this.positionChanged = (0, _callbacks.default)();
            this._dataLoader = new _uiGridCore.VirtualDataLoader(this, this._dataOptions)
        },
        getItemSizes: function() {
            return this._itemSizes
        },
        option: function() {
            return this.component.option.apply(this.component, arguments)
        },
        isVirtual: function() {
            return this._isVirtual
        },
        virtualItemsCount: function() {
            if (_isVirtualMode(this)) {
                var totalItemsCount = this._dataOptions.totalItemsCount();
                if (this.option(NEW_SCROLLING_MODE) && -1 !== totalItemsCount) {
                    var viewportParams = this.getViewportParams();
                    var endItemsCount = totalItemsCount - (viewportParams.skip + viewportParams.take);
                    return {
                        begin: viewportParams.skip,
                        end: endItemsCount
                    }
                }
                return this._dataLoader.virtualItemsCount.apply(this._dataLoader, arguments)
            }
        },
        setViewportPosition: function(position) {
            var _this = this;
            var result = new _deferred.Deferred;
            var scrollingTimeout = Math.min(this.option("scrolling.timeout") || 0, this._dataOptions.changingDuration());
            if (scrollingTimeout < this.option("scrolling.renderingThreshold")) {
                scrollingTimeout = this.option("scrolling.minTimeout") || 0
            }
            clearTimeout(this._scrollTimeoutID);
            if (scrollingTimeout > 0) {
                this._scrollTimeoutID = setTimeout((function() {
                    _this._setViewportPositionCore(position);
                    result.resolve()
                }), scrollingTimeout)
            } else {
                this._setViewportPositionCore(position);
                result.resolve()
            }
            return result.promise()
        },
        getViewportPosition: function() {
            return this._position || 0
        },
        getItemIndexByPosition: function() {
            var position = this._position;
            var defaultItemSize = this.getItemSize();
            var offset = 0;
            var itemOffset = 0;
            var itemOffsetsWithSize = Object.keys(this._itemSizes).concat(-1);
            for (var i = 0; i < itemOffsetsWithSize.length && offset < position; i++) {
                var itemOffsetWithSize = parseInt(itemOffsetsWithSize[i]);
                var itemOffsetDiff = (position - offset) / defaultItemSize;
                if (itemOffsetWithSize < 0 || itemOffset + itemOffsetDiff < itemOffsetWithSize) {
                    itemOffset += itemOffsetDiff;
                    break
                } else {
                    itemOffsetDiff = itemOffsetWithSize - itemOffset;
                    offset += itemOffsetDiff * defaultItemSize;
                    itemOffset += itemOffsetDiff
                }
                var itemSize = this._itemSizes[itemOffsetWithSize];
                offset += itemSize;
                itemOffset += offset < position ? 1 : (position - offset + itemSize) / itemSize
            }
            return Math.round(50 * itemOffset) / 50
        },
        _setViewportPositionCore: function(position) {
            this._position = position;
            var itemIndex = this.getItemIndexByPosition();
            var result = this.setViewportItemIndex(itemIndex);
            this.positionChanged.fire();
            return result
        },
        setContentItemSizes: function(sizes) {
            var _this2 = this;
            var virtualItemsCount = this.virtualItemsCount();
            this._contentSize = sizes.reduce((function(a, b) {
                return a + b
            }), 0);
            if (virtualItemsCount) {
                sizes.forEach((function(size, index) {
                    _this2._itemSizes[virtualItemsCount.begin + index] = size
                }));
                var virtualContentSize = (virtualItemsCount.begin + virtualItemsCount.end + this.itemsCount()) * this._viewportItemSize;
                var contentHeightLimit = getContentHeightLimit(_browser.default);
                if (virtualContentSize > contentHeightLimit) {
                    this._sizeRatio = contentHeightLimit / virtualContentSize
                } else {
                    this._sizeRatio = 1
                }
            }
        },
        getItemSize: function() {
            return this._viewportItemSize * this._sizeRatio
        },
        getItemOffset: function(itemIndex, isEnd) {
            var _this3 = this;
            var virtualItemsCount = this.virtualItemsCount();
            var itemCount = itemIndex;
            if (!virtualItemsCount) {
                return 0
            }
            var offset = 0;
            var totalItemsCount = this._dataOptions.totalItemsCount();
            Object.keys(this._itemSizes).forEach((function(currentItemIndex) {
                if (!itemCount) {
                    return
                }
                if (isEnd ? currentItemIndex >= totalItemsCount - itemIndex : currentItemIndex < itemIndex) {
                    offset += _this3._itemSizes[currentItemIndex];
                    itemCount--
                }
            }));
            return Math.floor(offset + itemCount * this._viewportItemSize * this._sizeRatio)
        },
        getContentOffset: function(type) {
            var isEnd = "end" === type;
            var virtualItemsCount = this.virtualItemsCount();
            if (!virtualItemsCount) {
                return 0
            }
            return this.getItemOffset(isEnd ? virtualItemsCount.end : virtualItemsCount.begin, isEnd)
        },
        getVirtualContentSize: function() {
            var virtualItemsCount = this.virtualItemsCount();
            return virtualItemsCount ? this.getContentOffset("begin") + this.getContentOffset("end") + this._contentSize : 0
        },
        getViewportItemIndex: function() {
            return this._viewportItemIndex
        },
        setViewportItemIndex: function(itemIndex) {
            this._viewportItemIndex = itemIndex;
            if (this.option(NEW_SCROLLING_MODE)) {
                return
            }
            return this._dataLoader.viewportItemIndexChanged.apply(this._dataLoader, arguments)
        },
        viewportItemSize: function(size) {
            if (void 0 !== size) {
                this._viewportItemSize = size
            }
            return this._viewportItemSize
        },
        viewportSize: function(size) {
            if (void 0 !== size) {
                this._viewportSize = size
            }
            return this._viewportSize
        },
        reset: function(isRefresh) {
            this._dataLoader.reset();
            if (!isRefresh) {
                this._itemSizes = {}
            }
        },
        subscribeToWindowScrollEvents: function($element) {
            var _this4 = this;
            this._windowScroll = this._windowScroll || subscribeToExternalScrollers($element, (function(scrollTop) {
                if (_this4.viewportItemSize()) {
                    _this4.setViewportPosition(scrollTop)
                }
            }))
        },
        dispose: function() {
            clearTimeout(this._scrollTimeoutID);
            this._windowScroll && this._windowScroll.dispose();
            this._windowScroll = null
        },
        scrollTo: function(pos) {
            this._windowScroll && this._windowScroll.scrollTo(pos)
        },
        isVirtualMode: function() {
            return _isVirtualMode(this)
        },
        isAppendMode: function() {
            return _isAppendMode(this)
        },
        getViewportParams: function() {
            var topIndex = this._viewportItemIndex;
            var bottomIndex = this._viewportSize + topIndex;
            var maxGap = this.pageSize();
            var minGap = this.option("scrolling.minGap");
            var virtualMode = this.option("scrolling.mode") === SCROLLING_MODE_VIRTUAL;
            var skip = Math.floor(Math.max(0, topIndex - minGap) / maxGap) * maxGap;
            var take = Math.ceil((bottomIndex + minGap) / maxGap) * maxGap - skip;
            if (virtualMode) {
                var remainedItems = this._dataOptions.totalItemsCount() - skip;
                take = Math.min(take, remainedItems)
            }
            return {
                skip: skip,
                take: take
            }
        }
    };
    ["pageIndex", "beginPageIndex", "endPageIndex", "pageSize", "load", "loadIfNeed", "handleDataChanged", "itemsCount", "getDelayDeferred"].forEach((function(name) {
        members[name] = function() {
            return this._dataLoader[name].apply(this._dataLoader, arguments)
        }
    }));
    return members
}());
exports.VirtualScrollController = VirtualScrollController;
