/**
 * DevExtreme (renovation/ui/pager/pages/large.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.PagesLarge = exports.viewFunction = void 0;
var _inferno = require("inferno");
var _vdom = require("@devextreme/vdom");
var _page = require("./page");
var _pager_props = require("../common/pager_props");
var _config_context = require("../../../common/config_context");
var _excluded = ["pageIndexes"],
    _excluded2 = ["defaultPageIndex", "maxPagesCount", "pageCount", "pageIndex", "pageIndexChange"];

function _extends() {
    _extends = Object.assign || function(target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key]
                }
            }
        }
        return target
    };
    return _extends.apply(this, arguments)
}

function _objectWithoutProperties(source, excluded) {
    if (null == source) {
        return {}
    }
    var target = _objectWithoutPropertiesLoose(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for (i = 0; i < sourceSymbolKeys.length; i++) {
            key = sourceSymbolKeys[i];
            if (excluded.indexOf(key) >= 0) {
                continue
            }
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) {
                continue
            }
            target[key] = source[key]
        }
    }
    return target
}

function _objectWithoutPropertiesLoose(source, excluded) {
    if (null == source) {
        return {}
    }
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for (i = 0; i < sourceKeys.length; i++) {
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) {
            continue
        }
        target[key] = source[key]
    }
    return target
}

function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) {
            descriptor.writable = true
        }
        Object.defineProperty(target, descriptor.key, descriptor)
    }
}

function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) {
        _defineProperties(Constructor.prototype, protoProps)
    }
    if (staticProps) {
        _defineProperties(Constructor, staticProps)
    }
    return Constructor
}

function _assertThisInitialized(self) {
    if (void 0 === self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
    }
    return self
}

function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    _setPrototypeOf(subClass, superClass)
}

function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function(o, p) {
        o.__proto__ = p;
        return o
    };
    return _setPrototypeOf(o, p)
}

function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread()
}

function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
}

function _unsupportedIterableToArray(o, minLen) {
    if (!o) {
        return
    }
    if ("string" === typeof o) {
        return _arrayLikeToArray(o, minLen)
    }
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if ("Object" === n && o.constructor) {
        n = o.constructor.name
    }
    if ("Map" === n || "Set" === n) {
        return Array.from(o)
    }
    if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) {
        return _arrayLikeToArray(o, minLen)
    }
}

function _iterableToArray(iter) {
    if ("undefined" !== typeof Symbol && null != iter[Symbol.iterator] || null != iter["@@iterator"]) {
        return Array.from(iter)
    }
}

function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
        return _arrayLikeToArray(arr)
    }
}

function _arrayLikeToArray(arr, len) {
    if (null == len || len > arr.length) {
        len = arr.length
    }
    for (var i = 0, arr2 = new Array(len); i < len; i++) {
        arr2[i] = arr[i]
    }
    return arr2
}
var PAGER_PAGE_SEPARATOR_CLASS = "dx-separator";
var viewFunction = function(_ref) {
    var pages = _ref.pages;
    var PagesMarkup = pages.map((function(_ref2) {
        var key = _ref2.key,
            pageProps = _ref2.pageProps;
        return pageProps ? (0, _inferno.createComponentVNode)(2, _page.Page, {
            index: pageProps.index,
            selected: pageProps.selected,
            onClick: pageProps.onClick
        }, key) : (0, _inferno.createVNode)(1, "div", PAGER_PAGE_SEPARATOR_CLASS, ". . .", 16, null, key)
    }));
    return (0, _inferno.createFragment)(PagesMarkup, 0)
};
exports.viewFunction = viewFunction;
var PAGES_LIMITER = 4;

function getDelimiterType(startIndex, slidingWindowSize, pageCount) {
    if (1 === startIndex) {
        return "high"
    }
    if (startIndex + slidingWindowSize === pageCount - 1) {
        return "low"
    }
    return "both"
}

function createPageIndexesBySlidingWindowIndexes(slidingWindowIndexes, pageCount, delimiter) {
    var pageIndexes = [];
    var indexesForReuse = [];
    switch (delimiter) {
        case "none":
            pageIndexes = _toConsumableArray(slidingWindowIndexes);
            break;
        case "both":
            pageIndexes = [0, "low"].concat(_toConsumableArray(slidingWindowIndexes), ["high", pageCount - 1]);
            indexesForReuse = slidingWindowIndexes.slice(1, -1);
            break;
        case "high":
            pageIndexes = [0].concat(_toConsumableArray(slidingWindowIndexes), ["high", pageCount - 1]);
            indexesForReuse = slidingWindowIndexes.slice(0, -1);
            break;
        case "low":
            pageIndexes = [0, "low"].concat(_toConsumableArray(slidingWindowIndexes), [pageCount - 1]);
            indexesForReuse = slidingWindowIndexes.slice(1)
    }
    return {
        slidingWindowIndexes: slidingWindowIndexes,
        indexesForReuse: indexesForReuse,
        pageIndexes: pageIndexes
    }
}

function createPageIndexes(startIndex, slidingWindowSize, pageCount, delimiter) {
    var slidingWindowIndexes = [];
    for (var i = 0; i < slidingWindowSize; i += 1) {
        slidingWindowIndexes.push(i + startIndex)
    }
    return createPageIndexesBySlidingWindowIndexes(slidingWindowIndexes, pageCount, delimiter)
}
var PagesLargePropsType = {
    maxPagesCount: _pager_props.PagerProps.maxPagesCount,
    pageCount: _pager_props.PagerProps.pageCount,
    defaultPageIndex: _pager_props.PagerProps.pageIndex
};
var PagesLarge = function(_BaseInfernoComponent) {
    _inheritsLoose(PagesLarge, _BaseInfernoComponent);

    function PagesLarge(props) {
        var _this;
        _this = _BaseInfernoComponent.call(this, props) || this;
        _this._currentState = null;
        _this.state = {
            pageIndex: void 0 !== _this.props.pageIndex ? _this.props.pageIndex : _this.props.defaultPageIndex
        };
        _this.canReuseSlidingWindow = _this.canReuseSlidingWindow.bind(_assertThisInitialized(_this));
        _this.generatePageIndexes = _this.generatePageIndexes.bind(_assertThisInitialized(_this));
        _this.isSlidingWindowMode = _this.isSlidingWindowMode.bind(_assertThisInitialized(_this));
        _this.onPageClick = _this.onPageClick.bind(_assertThisInitialized(_this));
        return _this
    }
    var _proto = PagesLarge.prototype;
    _proto.set_pageIndex = function(value) {
        var _this2 = this;
        this.setState((function(state) {
            var _this2$props$pageInde, _this2$props;
            _this2._currentState = state;
            var newValue = value();
            null === (_this2$props$pageInde = (_this2$props = _this2.props).pageIndexChange) || void 0 === _this2$props$pageInde ? void 0 : _this2$props$pageInde.call(_this2$props, newValue);
            _this2._currentState = null;
            return {
                pageIndex: newValue
            }
        }))
    };
    _proto.canReuseSlidingWindow = function(currentPageCount, pageIndex) {
        var indexesForReuse = this.slidingWindowState.indexesForReuse;
        var currentPageNotExistInIndexes = -1 === indexesForReuse.indexOf(currentPageCount);
        var pageIndexExistInIndexes = -1 !== indexesForReuse.indexOf(pageIndex);
        return currentPageNotExistInIndexes && pageIndexExistInIndexes
    };
    _proto.generatePageIndexes = function() {
        var pageCount = this.props.pageCount;
        var startIndex = 0;
        var slidingWindowIndexes = this.slidingWindowState.slidingWindowIndexes;
        if (this.__state_pageIndex === slidingWindowIndexes[0]) {
            startIndex = this.__state_pageIndex - 1
        } else if (this.__state_pageIndex === slidingWindowIndexes[slidingWindowIndexes.length - 1]) {
            startIndex = this.__state_pageIndex + 2 - PAGES_LIMITER
        } else if (this.__state_pageIndex < PAGES_LIMITER) {
            startIndex = 1
        } else if (this.__state_pageIndex >= pageCount - PAGES_LIMITER) {
            startIndex = pageCount - PAGES_LIMITER - 1
        } else {
            startIndex = this.__state_pageIndex - 1
        }
        var slidingWindowSize = PAGES_LIMITER;
        var delimiter = getDelimiterType(startIndex, slidingWindowSize, pageCount);
        var _createPageIndexes = createPageIndexes(startIndex, slidingWindowSize, pageCount, delimiter),
            pageIndexes = _createPageIndexes.pageIndexes,
            slidingWindowState = _objectWithoutProperties(_createPageIndexes, _excluded);
        this.slidingWindowStateHolder = slidingWindowState;
        return pageIndexes
    };
    _proto.isSlidingWindowMode = function() {
        var _this$props = this.props,
            maxPagesCount = _this$props.maxPagesCount,
            pageCount = _this$props.pageCount;
        return pageCount <= PAGES_LIMITER || pageCount <= maxPagesCount
    };
    _proto.onPageClick = function(pageIndex) {
        var _this$props$pageIndex, _this$props2;
        null === (_this$props$pageIndex = (_this$props2 = this.props).pageIndexChange) || void 0 === _this$props$pageIndex ? void 0 : _this$props$pageIndex.call(_this$props2, pageIndex)
    };
    _proto.render = function() {
        var props = this.props;
        return viewFunction({
            props: _extends({}, props, {
                pageIndex: this.__state_pageIndex
            }),
            config: this.config,
            pageIndexes: this.pageIndexes,
            pages: this.pages,
            restAttributes: this.restAttributes
        })
    };
    _createClass(PagesLarge, [{
        key: "config",
        get: function() {
            if ("ConfigContext" in this.context) {
                return this.context.ConfigContext
            }
            return _config_context.ConfigContext
        }
    }, {
        key: "__state_pageIndex",
        get: function() {
            var state = this._currentState || this.state;
            return void 0 !== this.props.pageIndex ? this.props.pageIndex : state.pageIndex
        }
    }, {
        key: "slidingWindowState",
        get: function() {
            var slidingWindowState = this.slidingWindowStateHolder;
            if (!slidingWindowState) {
                return {
                    indexesForReuse: [],
                    slidingWindowIndexes: []
                }
            }
            return slidingWindowState
        }
    }, {
        key: "pageIndexes",
        get: function() {
            var pageCount = this.props.pageCount;
            if (this.isSlidingWindowMode()) {
                return createPageIndexes(0, pageCount, pageCount, "none").pageIndexes
            }
            if (this.canReuseSlidingWindow(pageCount, this.__state_pageIndex)) {
                var slidingWindowIndexes = this.slidingWindowState.slidingWindowIndexes;
                var delimiter = getDelimiterType(slidingWindowIndexes[0], PAGES_LIMITER, pageCount);
                return createPageIndexesBySlidingWindowIndexes(slidingWindowIndexes, pageCount, delimiter).pageIndexes
            }
            return this.generatePageIndexes()
        }
    }, {
        key: "pages",
        get: function() {
            var _this$config, _this3 = this;
            var rtlPageIndexes = null !== (_this$config = this.config) && void 0 !== _this$config && _this$config.rtlEnabled ? _toConsumableArray(this.pageIndexes).reverse() : this.pageIndexes;
            return rtlPageIndexes.map((function(index) {
                return function(index) {
                    var pagerProps = "low" === index || "high" === index ? null : {
                        index: index,
                        onClick: function() {
                            return _this3.onPageClick(index)
                        },
                        selected: _this3.__state_pageIndex === index
                    };
                    return {
                        key: index.toString(),
                        pageProps: pagerProps
                    }
                }(index)
            }))
        }
    }, {
        key: "restAttributes",
        get: function() {
            var _this$props$pageIndex2 = _extends({}, this.props, {
                    pageIndex: this.__state_pageIndex
                }),
                restProps = (_this$props$pageIndex2.defaultPageIndex, _this$props$pageIndex2.maxPagesCount, _this$props$pageIndex2.pageCount, _this$props$pageIndex2.pageIndex, _this$props$pageIndex2.pageIndexChange, _objectWithoutProperties(_this$props$pageIndex2, _excluded2));
            return restProps
        }
    }]);
    return PagesLarge
}(_vdom.BaseInfernoComponent);
exports.PagesLarge = PagesLarge;
PagesLarge.defaultProps = _extends({}, PagesLargePropsType);
