/**
 * DevExtreme (renovation/ui/scroll_view/scrollbar.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.Scrollbar = exports.ScrollbarPropsType = exports.viewFunction = void 0;
var _inferno = require("inferno");
var _vdom = require("@devextreme/vdom");
var _widget = require("../common/widget");
var _combine_classes = require("../../utils/combine_classes");
var _dom_adapter = _interopRequireDefault(require("../../../core/dom_adapter"));
var _type = require("../../../core/utils/type");
var _index = require("../../../events/utils/index");
var _scrollbar_props = require("./scrollbar_props");
var _consts = require("./common/consts");
var _short = require("../../../events/short");
var _scrollable_simulated_props = require("./scrollable_simulated_props");
var _scrollable_props = require("./scrollable_props");
var _excluded = ["activeStateEnabled", "bottomPocketSize", "bounceEnabled", "containerSize", "contentSize", "contentTranslateOffsetChange", "defaultPocketState", "direction", "forceGeneratePockets", "forceUpdateScrollbarLocation", "forceVisibility", "hoverStateEnabled", "isScrollableHovered", "onAnimatorCancel", "onAnimatorStart", "onPullDown", "onReachBottom", "onRelease", "pocketState", "pocketStateChange", "pullDownEnabled", "reachBottomEnabled", "rtlEnabled", "scrollByThumb", "scrollLocation", "scrollLocationChange", "scrollableOffset", "showScrollbar", "topPocketSize"];

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
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

function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        })
    } else {
        obj[key] = value
    }
    return obj
}

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
var OUT_BOUNDS_ACCELERATION = .5;
var THUMB_MIN_SIZE = 15;
var viewFunction = function(viewModel) {
    var cssClasses = viewModel.cssClasses,
        hoverStateEnabled = viewModel.hoverStateEnabled,
        isVisible = viewModel.isVisible,
        onHoverEnd = viewModel.onHoverEnd,
        onHoverStart = viewModel.onHoverStart,
        activeStateEnabled = viewModel.props.activeStateEnabled,
        scrollRef = viewModel.scrollRef,
        scrollStyles = viewModel.scrollStyles,
        scrollbarRef = viewModel.scrollbarRef;
    return (0, _inferno.createComponentVNode)(2, _widget.Widget, {
        rootElementRef: scrollbarRef,
        classes: cssClasses,
        activeStateEnabled: activeStateEnabled,
        hoverStateEnabled: hoverStateEnabled,
        visible: isVisible,
        onHoverStart: onHoverStart,
        onHoverEnd: onHoverEnd,
        children: (0, _inferno.createVNode)(1, "div", viewModel.scrollClasses, (0, _inferno.createVNode)(1, "div", _consts.SCROLLABLE_SCROLL_CONTENT_CLASS), 2, {
            style: (0, _vdom.normalizeStyles)(scrollStyles)
        }, null, scrollRef)
    })
};
exports.viewFunction = viewFunction;
var ScrollbarPropsType = {
    activeStateEnabled: _scrollbar_props.ScrollbarProps.activeStateEnabled,
    containerSize: _scrollbar_props.ScrollbarProps.containerSize,
    contentSize: _scrollbar_props.ScrollbarProps.contentSize,
    topPocketSize: _scrollbar_props.ScrollbarProps.topPocketSize,
    bottomPocketSize: _scrollbar_props.ScrollbarProps.bottomPocketSize,
    scrollableOffset: _scrollbar_props.ScrollbarProps.scrollableOffset,
    isScrollableHovered: _scrollbar_props.ScrollbarProps.isScrollableHovered,
    forceVisibility: _scrollbar_props.ScrollbarProps.forceVisibility,
    forceUpdateScrollbarLocation: _scrollbar_props.ScrollbarProps.forceUpdateScrollbarLocation,
    scrollLocation: _scrollbar_props.ScrollbarProps.scrollLocation,
    onAnimatorCancel: _scrollbar_props.ScrollbarProps.onAnimatorCancel,
    onPullDown: _scrollbar_props.ScrollbarProps.onPullDown,
    onReachBottom: _scrollbar_props.ScrollbarProps.onReachBottom,
    onRelease: _scrollbar_props.ScrollbarProps.onRelease,
    defaultPocketState: _scrollbar_props.ScrollbarProps.defaultPocketState,
    direction: _scrollable_props.ScrollableProps.direction,
    showScrollbar: _scrollable_props.ScrollableProps.showScrollbar,
    scrollByThumb: _scrollable_props.ScrollableProps.scrollByThumb,
    pullDownEnabled: _scrollable_props.ScrollableProps.pullDownEnabled,
    reachBottomEnabled: _scrollable_props.ScrollableProps.reachBottomEnabled,
    forceGeneratePockets: _scrollable_props.ScrollableProps.forceGeneratePockets,
    bounceEnabled: _scrollable_simulated_props.ScrollableSimulatedProps.bounceEnabled
};
exports.ScrollbarPropsType = ScrollbarPropsType;
var Scrollbar = function(_InfernoComponent) {
    _inheritsLoose(Scrollbar, _InfernoComponent);

    function Scrollbar(props) {
        var _this;
        _this = _InfernoComponent.call(this, props) || this;
        _this._currentState = null;
        _this.thumbScrolling = false;
        _this.crossThumbScrolling = false;
        _this.initialTopPocketSize = 0;
        _this.scrollbarRef = (0, _inferno.createRef)();
        _this.scrollRef = (0, _inferno.createRef)();
        _this.state = {
            showOnScrollByWheel: void 0,
            hovered: false,
            expanded: false,
            visibility: false,
            boundaryOffset: 0,
            maxOffset: 0,
            pocketState: void 0 !== _this.props.pocketState ? _this.props.pocketState : _this.props.defaultPocketState
        };
        _this.updateBoundaryOffset = _this.updateBoundaryOffset.bind(_assertThisInitialized(_this));
        _this.pointerDownEffect = _this.pointerDownEffect.bind(_assertThisInitialized(_this));
        _this.pointerUpEffect = _this.pointerUpEffect.bind(_assertThisInitialized(_this));
        _this.isThumb = _this.isThumb.bind(_assertThisInitialized(_this));
        _this.isScrollbar = _this.isScrollbar.bind(_assertThisInitialized(_this));
        _this.validateEvent = _this.validateEvent.bind(_assertThisInitialized(_this));
        _this.reachedMin = _this.reachedMin.bind(_assertThisInitialized(_this));
        _this.reachedMax = _this.reachedMax.bind(_assertThisInitialized(_this));
        _this.inBounds = _this.inBounds.bind(_assertThisInitialized(_this));
        _this.boundLocation = _this.boundLocation.bind(_assertThisInitialized(_this));
        _this.getMinOffset = _this.getMinOffset.bind(_assertThisInitialized(_this));
        _this.getMaxOffset = _this.getMaxOffset.bind(_assertThisInitialized(_this));
        _this.initHandler = _this.initHandler.bind(_assertThisInitialized(_this));
        _this.startHandler = _this.startHandler.bind(_assertThisInitialized(_this));
        _this.moveHandler = _this.moveHandler.bind(_assertThisInitialized(_this));
        _this.hide = _this.hide.bind(_assertThisInitialized(_this));
        _this.endHandler = _this.endHandler.bind(_assertThisInitialized(_this));
        _this.onInertiaAnimatorStart = _this.onInertiaAnimatorStart.bind(_assertThisInitialized(_this));
        _this.onBounceAnimatorStart = _this.onBounceAnimatorStart.bind(_assertThisInitialized(_this));
        _this.stopHandler = _this.stopHandler.bind(_assertThisInitialized(_this));
        _this.scrollByHandler = _this.scrollByHandler.bind(_assertThisInitialized(_this));
        _this.scrollComplete = _this.scrollComplete.bind(_assertThisInitialized(_this));
        _this.pullDownRefreshing = _this.pullDownRefreshing.bind(_assertThisInitialized(_this));
        _this.reachBottomLoading = _this.reachBottomLoading.bind(_assertThisInitialized(_this));
        _this.onPullDown = _this.onPullDown.bind(_assertThisInitialized(_this));
        _this.onReachBottom = _this.onReachBottom.bind(_assertThisInitialized(_this));
        _this.scrollToBounds = _this.scrollToBounds.bind(_assertThisInitialized(_this));
        _this.stopComplete = _this.stopComplete.bind(_assertThisInitialized(_this));
        _this.resetThumbScrolling = _this.resetThumbScrolling.bind(_assertThisInitialized(_this));
        _this.scrollBy = _this.scrollBy.bind(_assertThisInitialized(_this));
        _this.stopScrolling = _this.stopScrolling.bind(_assertThisInitialized(_this));
        _this.onAnimatorCancel = _this.onAnimatorCancel.bind(_assertThisInitialized(_this));
        _this.prepareThumbScrolling = _this.prepareThumbScrolling.bind(_assertThisInitialized(_this));
        _this.moveToMouseLocation = _this.moveToMouseLocation.bind(_assertThisInitialized(_this));
        _this.scrollStep = _this.scrollStep.bind(_assertThisInitialized(_this));
        _this.moveToBoundaryOnSizeChange = _this.moveToBoundaryOnSizeChange.bind(_assertThisInitialized(_this));
        _this.updateContent = _this.updateContent.bind(_assertThisInitialized(_this));
        _this.updateContentTranslate = _this.updateContentTranslate.bind(_assertThisInitialized(_this));
        _this.moveTo = _this.moveTo.bind(_assertThisInitialized(_this));
        _this.releaseHandler = _this.releaseHandler.bind(_assertThisInitialized(_this));
        _this.release = _this.release.bind(_assertThisInitialized(_this));
        _this.stateReleased = _this.stateReleased.bind(_assertThisInitialized(_this));
        _this.onRelease = _this.onRelease.bind(_assertThisInitialized(_this));
        _this.setPocketState = _this.setPocketState.bind(_assertThisInitialized(_this));
        _this.isPullDown = _this.isPullDown.bind(_assertThisInitialized(_this));
        _this.isReachBottom = _this.isReachBottom.bind(_assertThisInitialized(_this));
        _this.expand = _this.expand.bind(_assertThisInitialized(_this));
        _this.collapse = _this.collapse.bind(_assertThisInitialized(_this));
        _this.onHoverStart = _this.onHoverStart.bind(_assertThisInitialized(_this));
        _this.onHoverEnd = _this.onHoverEnd.bind(_assertThisInitialized(_this));
        return _this
    }
    var _proto = Scrollbar.prototype;
    _proto.createEffects = function() {
        return [new _vdom.InfernoEffect(this.updateBoundaryOffset, [this.props.forceGeneratePockets, this.props.scrollLocation, this.props.pullDownEnabled, this.props.topPocketSize, this.boundaryOffset]), new _vdom.InfernoEffect(this.pointerDownEffect, []), new _vdom.InfernoEffect(this.pointerUpEffect, []), new _vdom.InfernoEffect(this.moveToBoundaryOnSizeChange, [this.props.forceUpdateScrollbarLocation, this.props.scrollLocation, this.maxOffset, this.props.scrollLocationChange, this.props.direction, this.props.forceGeneratePockets, this.props.contentSize, this.props.reachBottomEnabled, this.props.bottomPocketSize, this.props.pullDownEnabled, this.props.topPocketSize, this.props.containerSize, this.props.contentTranslateOffsetChange, this.props.bounceEnabled, this.boundaryOffset, this.__state_pocketState, this.props.pocketStateChange, this.props.onRelease]), new _vdom.InfernoEffect(this.updateContentTranslate, [this.props.forceGeneratePockets, this.props.pullDownEnabled, this.props.topPocketSize, this.props.contentSize, this.props.reachBottomEnabled, this.props.bottomPocketSize, this.props.containerSize, this.props.contentTranslateOffsetChange, this.props.direction, this.props.scrollLocation])]
    };
    _proto.updateEffects = function() {
        var _this$_effects$, _this$_effects$2, _this$_effects$3, _this$_effects$4, _this$_effects$5;
        null === (_this$_effects$ = this._effects[0]) || void 0 === _this$_effects$ ? void 0 : _this$_effects$.update([this.props.forceGeneratePockets, this.props.scrollLocation, this.props.pullDownEnabled, this.props.topPocketSize, this.boundaryOffset]);
        null === (_this$_effects$2 = this._effects[1]) || void 0 === _this$_effects$2 ? void 0 : _this$_effects$2.update([]);
        null === (_this$_effects$3 = this._effects[2]) || void 0 === _this$_effects$3 ? void 0 : _this$_effects$3.update([]);
        null === (_this$_effects$4 = this._effects[3]) || void 0 === _this$_effects$4 ? void 0 : _this$_effects$4.update([this.props.forceUpdateScrollbarLocation, this.props.scrollLocation, this.maxOffset, this.props.scrollLocationChange, this.props.direction, this.props.forceGeneratePockets, this.props.contentSize, this.props.reachBottomEnabled, this.props.bottomPocketSize, this.props.pullDownEnabled, this.props.topPocketSize, this.props.containerSize, this.props.contentTranslateOffsetChange, this.props.bounceEnabled, this.boundaryOffset, this.__state_pocketState, this.props.pocketStateChange, this.props.onRelease]);
        null === (_this$_effects$5 = this._effects[4]) || void 0 === _this$_effects$5 ? void 0 : _this$_effects$5.update([this.props.forceGeneratePockets, this.props.pullDownEnabled, this.props.topPocketSize, this.props.contentSize, this.props.reachBottomEnabled, this.props.bottomPocketSize, this.props.containerSize, this.props.contentTranslateOffsetChange, this.props.direction, this.props.scrollLocation])
    };
    _proto.set_showOnScrollByWheel = function(value) {
        var _this2 = this;
        this.setState((function(state) {
            _this2._currentState = state;
            var newValue = value();
            _this2._currentState = null;
            return {
                showOnScrollByWheel: newValue
            }
        }))
    };
    _proto.set_hovered = function(value) {
        var _this3 = this;
        this.setState((function(state) {
            _this3._currentState = state;
            var newValue = value();
            _this3._currentState = null;
            return {
                hovered: newValue
            }
        }))
    };
    _proto.set_expanded = function(value) {
        var _this4 = this;
        this.setState((function(state) {
            _this4._currentState = state;
            var newValue = value();
            _this4._currentState = null;
            return {
                expanded: newValue
            }
        }))
    };
    _proto.set_visibility = function(value) {
        var _this5 = this;
        this.setState((function(state) {
            _this5._currentState = state;
            var newValue = value();
            _this5._currentState = null;
            return {
                visibility: newValue
            }
        }))
    };
    _proto.set_boundaryOffset = function(value) {
        var _this6 = this;
        this.setState((function(state) {
            _this6._currentState = state;
            var newValue = value();
            _this6._currentState = null;
            return {
                boundaryOffset: newValue
            }
        }))
    };
    _proto.set_maxOffset = function(value) {
        var _this7 = this;
        this.setState((function(state) {
            _this7._currentState = state;
            var newValue = value();
            _this7._currentState = null;
            return {
                maxOffset: newValue
            }
        }))
    };
    _proto.set_pocketState = function(value) {
        var _this8 = this;
        this.setState((function(state) {
            var _this8$props$pocketSt, _this8$props;
            _this8._currentState = state;
            var newValue = value();
            null === (_this8$props$pocketSt = (_this8$props = _this8.props).pocketStateChange) || void 0 === _this8$props$pocketSt ? void 0 : _this8$props$pocketSt.call(_this8$props, newValue);
            _this8._currentState = null;
            return {
                pocketState: newValue
            }
        }))
    };
    _proto.updateBoundaryOffset = function() {
        var _this9 = this;
        if (this.props.forceGeneratePockets) {
            this.set_boundaryOffset((function() {
                return _this9.props.scrollLocation - _this9.topPocketSize
            }));
            this.set_maxOffset((function() {
                return _this9.boundaryOffset > 0 ? _this9.topPocketSize : 0
            }))
        }
    };
    _proto.pointerDownEffect = function() {
        var _this10 = this;
        _short.dxPointerDown.on(this.scrollRef.current, (function() {
            _this10.expand()
        }), {
            namespace: "dxScrollbar"
        });
        return function() {
            return _short.dxPointerDown.off(_this10.scrollRef.current, {
                namespace: "dxScrollbar"
            })
        }
    };
    _proto.pointerUpEffect = function() {
        var _this11 = this;
        _short.dxPointerUp.on(_dom_adapter.default.getDocument(), (function() {
            _this11.collapse()
        }), {
            namespace: "dxScrollbar"
        });
        return function() {
            return _short.dxPointerUp.off(_this11.scrollRef.current, {
                namespace: "dxScrollbar"
            })
        }
    };
    _proto.moveToBoundaryOnSizeChange = function() {
        if (this.props.forceUpdateScrollbarLocation) {
            if (this.props.scrollLocation <= this.maxOffset) {
                this.moveTo(this.boundLocation(this.props.scrollLocation))
            }
        }
    };
    _proto.updateContentTranslate = function() {
        if (this.props.forceGeneratePockets && this.props.pullDownEnabled) {
            if (this.initialTopPocketSize !== this.topPocketSize) {
                this.updateContent(this.props.scrollLocation);
                this.initialTopPocketSize = this.topPocketSize
            }
        }
    };
    _proto.hide = function() {
        var _this12 = this;
        this.set_visibility((function() {
            return false
        }));
        if ((0, _type.isDefined)(this.showOnScrollByWheel) && "onScroll" === this.props.showScrollbar) {
            setTimeout((function() {
                _this12.set_showOnScrollByWheel((function() {
                    return
                }))
            }), _consts.HIDE_SCROLLBAR_TIMEOUT)
        }
    };
    _proto.onInertiaAnimatorStart = function(velocity) {
        var _this$props$onAnimato, _this$props;
        null === (_this$props$onAnimato = (_this$props = this.props).onAnimatorStart) || void 0 === _this$props$onAnimato ? void 0 : _this$props$onAnimato.call(_this$props, "inertia", velocity, this.thumbScrolling, this.crossThumbScrolling)
    };
    _proto.onBounceAnimatorStart = function() {
        var _this$props$onAnimato2, _this$props2;
        null === (_this$props$onAnimato2 = (_this$props2 = this.props).onAnimatorStart) || void 0 === _this$props$onAnimato2 ? void 0 : _this$props$onAnimato2.call(_this$props2, "bounce")
    };
    _proto.pullDownRefreshing = function() {
        this.setPocketState(_consts.TopPocketState.STATE_REFRESHING);
        this.onPullDown()
    };
    _proto.reachBottomLoading = function() {
        this.onReachBottom()
    };
    _proto.onPullDown = function() {
        var _this$props$onPullDow, _this$props3;
        null === (_this$props$onPullDow = (_this$props3 = this.props).onPullDown) || void 0 === _this$props$onPullDow ? void 0 : _this$props$onPullDow.call(_this$props3)
    };
    _proto.onReachBottom = function() {
        var _this$props$onReachBo, _this$props4;
        null === (_this$props$onReachBo = (_this$props4 = this.props).onReachBottom) || void 0 === _this$props$onReachBo ? void 0 : _this$props$onReachBo.call(_this$props4)
    };
    _proto.scrollToBounds = function() {
        if (this.inBounds()) {
            this.hide();
            return
        }
        this.onBounceAnimatorStart()
    };
    _proto.resetThumbScrolling = function() {
        this.thumbScrolling = false;
        this.crossThumbScrolling = false
    };
    _proto.scrollBy = function(delta) {
        var distance = delta[this.axis];
        if (!this.inBounds()) {
            distance *= OUT_BOUNDS_ACCELERATION
        }
        this.scrollStep(distance)
    };
    _proto.stopScrolling = function() {
        this.hide();
        this.onAnimatorCancel()
    };
    _proto.onAnimatorCancel = function() {
        var _this$props$onAnimato3, _this$props5;
        null === (_this$props$onAnimato3 = (_this$props5 = this.props).onAnimatorCancel) || void 0 === _this$props$onAnimato3 ? void 0 : _this$props$onAnimato3.call(_this$props5)
    };
    _proto.prepareThumbScrolling = function(e, currentCrossThumbScrolling) {
        if ((0, _index.isDxMouseWheelEvent)(e.originalEvent)) {
            if ("onScroll" === this.props.showScrollbar) {
                this.set_showOnScrollByWheel((function() {
                    return true
                }))
            }
            return
        }
        var target = e.originalEvent.target;
        var scrollbarClicked = this.props.scrollByThumb && this.isScrollbar(target);
        if (scrollbarClicked) {
            this.moveToMouseLocation(e)
        }
        var currentThumbScrolling = scrollbarClicked || this.props.scrollByThumb && this.isThumb(target);
        this.thumbScrolling = currentThumbScrolling;
        this.crossThumbScrolling = !currentThumbScrolling && currentCrossThumbScrolling;
        if (currentThumbScrolling) {
            this.expand()
        }
    };
    _proto.moveToMouseLocation = function(e) {
        var mouseLocation = e["page".concat(this.axis.toUpperCase())] - this.props.scrollableOffset;
        var delta = this.props.scrollLocation + mouseLocation / this.containerToContentRatio - this.props.containerSize / 2;
        this.scrollStep(-Math.round(delta))
    };
    _proto.updateContent = function(location) {
        var _this$props$contentTr, _this$props6;
        var contentTranslateOffset;
        if (location > 0) {
            contentTranslateOffset = location
        } else if (location <= this.minOffset) {
            contentTranslateOffset = location - this.minOffset
        } else {
            contentTranslateOffset = location % 1
        }
        if (this.props.forceGeneratePockets && this.props.pullDownEnabled) {
            contentTranslateOffset -= this.topPocketSize
        }
        null === (_this$props$contentTr = (_this$props6 = this.props).contentTranslateOffsetChange) || void 0 === _this$props$contentTr ? void 0 : _this$props$contentTr.call(_this$props6, this.scrollProp, contentTranslateOffset)
    };
    _proto.release = function() {
        this.stateReleased();
        this.scrollComplete()
    };
    _proto.stateReleased = function() {
        this.setPocketState(_consts.TopPocketState.STATE_RELEASED);
        this.onRelease()
    };
    _proto.onRelease = function() {
        var _this$props$onRelease, _this$props7;
        null === (_this$props$onRelease = (_this$props7 = this.props).onRelease) || void 0 === _this$props$onRelease ? void 0 : _this$props$onRelease.call(_this$props7)
    };
    _proto.setPocketState = function(state) {
        var _this$props$pocketSta, _this$props8;
        null === (_this$props$pocketSta = (_this$props8 = this.props).pocketStateChange) || void 0 === _this$props$pocketSta ? void 0 : _this$props$pocketSta.call(_this$props8, state)
    };
    _proto.isPullDown = function() {
        return this.props.pullDownEnabled && this.props.bounceEnabled && this.boundaryOffset >= 0
    };
    _proto.isReachBottom = function() {
        return this.props.reachBottomEnabled && this.props.scrollLocation - this.minOffset - this.bottomPocketSize <= .5
    };
    _proto.expand = function() {
        this.set_expanded((function() {
            return true
        }))
    };
    _proto.collapse = function() {
        this.set_expanded((function() {
            return false
        }))
    };
    _proto.onHoverStart = function() {
        if ("onHover" === this.props.showScrollbar) {
            this.set_hovered((function() {
                return true
            }))
        }
    };
    _proto.onHoverEnd = function() {
        if ("onHover" === this.props.showScrollbar) {
            this.set_hovered((function() {
                return false
            }))
        }
    };
    _proto.isThumb = function(element) {
        var _this$scrollbarRef$cu, _this$scrollbarRef$cu2;
        return (null === (_this$scrollbarRef$cu = this.scrollbarRef.current) || void 0 === _this$scrollbarRef$cu ? void 0 : _this$scrollbarRef$cu.querySelector(".".concat(_consts.SCROLLABLE_SCROLL_CLASS))) === element || (null === (_this$scrollbarRef$cu2 = this.scrollbarRef.current) || void 0 === _this$scrollbarRef$cu2 ? void 0 : _this$scrollbarRef$cu2.querySelector(".".concat(_consts.SCROLLABLE_SCROLL_CONTENT_CLASS))) === element
    };
    _proto.isScrollbar = function(element) {
        return element === this.scrollbarRef.current
    };
    _proto.validateEvent = function(e) {
        var target = e.originalEvent.target;
        return this.isThumb(target) || this.isScrollbar(target)
    };
    _proto.reachedMin = function() {
        return this.props.scrollLocation <= this.minOffset
    };
    _proto.reachedMax = function() {
        return this.props.scrollLocation >= this.maxOffset
    };
    _proto.inBounds = function() {
        return this.boundLocation() === this.props.scrollLocation
    };
    _proto.boundLocation = function(value) {
        var currentLocation = (0, _type.isDefined)(value) ? value : this.props.scrollLocation;
        return Math.max(Math.min(currentLocation, this.maxOffset), this.minOffset)
    };
    _proto.getMinOffset = function() {
        return this.minOffset
    };
    _proto.getMaxOffset = function() {
        return this.maxOffset
    };
    _proto.initHandler = function(e, crossThumbScrolling) {
        this.stopScrolling();
        this.prepareThumbScrolling(e, crossThumbScrolling)
    };
    _proto.startHandler = function() {
        this.set_visibility((function() {
            return true
        }))
    };
    _proto.moveHandler = function(delta) {
        if (this.crossThumbScrolling) {
            return
        }
        var distance = delta;
        if (this.thumbScrolling) {
            distance[this.axis] = -Math.round(distance[this.axis] / this.containerToContentRatio)
        }
        this.scrollBy(distance)
    };
    _proto.endHandler = function(velocity) {
        this.onInertiaAnimatorStart(velocity[this.axis]);
        this.resetThumbScrolling()
    };
    _proto.stopHandler = function() {
        this.hide();
        if (this.thumbScrolling) {
            this.scrollComplete()
        } else {
            this.scrollToBounds()
        }
        this.resetThumbScrolling()
    };
    _proto.scrollByHandler = function(delta) {
        this.scrollBy(delta);
        this.scrollComplete()
    };
    _proto.scrollComplete = function() {
        if (this.props.forceGeneratePockets) {
            if (this.inBounds()) {
                if (this.__state_pocketState === _consts.TopPocketState.STATE_READY) {
                    this.pullDownRefreshing();
                    return
                }
                if (this.__state_pocketState === _consts.TopPocketState.STATE_LOADING) {
                    this.reachBottomLoading();
                    return
                }
            }
        }
        this.scrollToBounds()
    };
    _proto.stopComplete = function() {};
    _proto.scrollStep = function(delta) {
        if (this.props.bounceEnabled) {
            this.moveTo(this.props.scrollLocation + delta)
        } else {
            this.moveTo(this.boundLocation(this.props.scrollLocation + delta))
        }
    };
    _proto.moveTo = function(location) {
        var _this$props$scrollLoc, _this$props9;
        null === (_this$props$scrollLoc = (_this$props9 = this.props).scrollLocationChange) || void 0 === _this$props$scrollLoc ? void 0 : _this$props$scrollLoc.call(_this$props9, this.fullScrollProp, location);
        this.updateContent(location);
        if (this.props.forceGeneratePockets) {
            if (this.isPullDown()) {
                if (this.__state_pocketState !== _consts.TopPocketState.STATE_READY) {
                    this.setPocketState(_consts.TopPocketState.STATE_READY)
                }
            } else if (this.isReachBottom()) {
                if (this.__state_pocketState !== _consts.TopPocketState.STATE_LOADING) {
                    this.setPocketState(_consts.TopPocketState.STATE_LOADING)
                }
            } else if (this.__state_pocketState !== _consts.TopPocketState.STATE_RELEASED) {
                this.stateReleased()
            }
        }
    };
    _proto.releaseHandler = function() {
        this.release()
    };
    _proto.render = function() {
        var props = this.props;
        return viewFunction({
            props: _extends({}, props, {
                pocketState: this.__state_pocketState
            }),
            showOnScrollByWheel: this.showOnScrollByWheel,
            hovered: this.hovered,
            expanded: this.expanded,
            visibility: this.visibility,
            boundaryOffset: this.boundaryOffset,
            maxOffset: this.maxOffset,
            scrollbarRef: this.scrollbarRef,
            scrollRef: this.scrollRef,
            axis: this.axis,
            scrollProp: this.scrollProp,
            fullScrollProp: this.fullScrollProp,
            dimension: this.dimension,
            isHorizontal: this.isHorizontal,
            hide: this.hide,
            onInertiaAnimatorStart: this.onInertiaAnimatorStart,
            onBounceAnimatorStart: this.onBounceAnimatorStart,
            pullDownRefreshing: this.pullDownRefreshing,
            reachBottomLoading: this.reachBottomLoading,
            onPullDown: this.onPullDown,
            onReachBottom: this.onReachBottom,
            scrollToBounds: this.scrollToBounds,
            resetThumbScrolling: this.resetThumbScrolling,
            scrollBy: this.scrollBy,
            stopScrolling: this.stopScrolling,
            onAnimatorCancel: this.onAnimatorCancel,
            prepareThumbScrolling: this.prepareThumbScrolling,
            moveToMouseLocation: this.moveToMouseLocation,
            updateContent: this.updateContent,
            release: this.release,
            stateReleased: this.stateReleased,
            onRelease: this.onRelease,
            setPocketState: this.setPocketState,
            isPullDown: this.isPullDown,
            isReachBottom: this.isReachBottom,
            minOffset: this.minOffset,
            scrollSize: this.scrollSize,
            scrollRatio: this.scrollRatio,
            contentSize: this.contentSize,
            containerToContentRatio: this.containerToContentRatio,
            expand: this.expand,
            collapse: this.collapse,
            onHoverStart: this.onHoverStart,
            onHoverEnd: this.onHoverEnd,
            topPocketSize: this.topPocketSize,
            bottomPocketSize: this.bottomPocketSize,
            bottomBoundaryOffset: this.bottomBoundaryOffset,
            cssClasses: this.cssClasses,
            scrollStyles: this.scrollStyles,
            scrollTransform: this.scrollTransform,
            scrollClasses: this.scrollClasses,
            isVisible: this.isVisible,
            visible: this.visible,
            hoverStateEnabled: this.hoverStateEnabled,
            restAttributes: this.restAttributes
        })
    };
    _createClass(Scrollbar, [{
        key: "showOnScrollByWheel",
        get: function() {
            var state = this._currentState || this.state;
            return state.showOnScrollByWheel
        }
    }, {
        key: "hovered",
        get: function() {
            var state = this._currentState || this.state;
            return state.hovered
        }
    }, {
        key: "expanded",
        get: function() {
            var state = this._currentState || this.state;
            return state.expanded
        }
    }, {
        key: "visibility",
        get: function() {
            var state = this._currentState || this.state;
            return state.visibility
        }
    }, {
        key: "boundaryOffset",
        get: function() {
            var state = this._currentState || this.state;
            return state.boundaryOffset
        }
    }, {
        key: "maxOffset",
        get: function() {
            var state = this._currentState || this.state;
            return state.maxOffset
        }
    }, {
        key: "__state_pocketState",
        get: function() {
            var state = this._currentState || this.state;
            return void 0 !== this.props.pocketState ? this.props.pocketState : state.pocketState
        }
    }, {
        key: "axis",
        get: function() {
            return this.isHorizontal ? "x" : "y"
        }
    }, {
        key: "scrollProp",
        get: function() {
            return this.isHorizontal ? "left" : "top"
        }
    }, {
        key: "fullScrollProp",
        get: function() {
            return this.isHorizontal ? "scrollLeft" : "scrollTop"
        }
    }, {
        key: "dimension",
        get: function() {
            return this.isHorizontal ? "width" : "height"
        }
    }, {
        key: "isHorizontal",
        get: function() {
            return this.props.direction === _consts.DIRECTION_HORIZONTAL
        }
    }, {
        key: "minOffset",
        get: function() {
            if (this.props.forceGeneratePockets) {
                return -Math.max(this.bottomBoundaryOffset + this.bottomPocketSize, 0)
            }
            return -Math.max(this.bottomBoundaryOffset, 0)
        }
    }, {
        key: "scrollSize",
        get: function() {
            return Math.max(this.props.containerSize * this.containerToContentRatio, THUMB_MIN_SIZE)
        }
    }, {
        key: "scrollRatio",
        get: function() {
            if (this.bottomBoundaryOffset) {
                return (this.props.containerSize - this.scrollSize) / this.bottomBoundaryOffset
            }
            return 1
        }
    }, {
        key: "contentSize",
        get: function() {
            if (this.props.contentSize) {
                return this.props.contentSize - this.bottomPocketSize - this.topPocketSize
            }
            return 0
        }
    }, {
        key: "containerToContentRatio",
        get: function() {
            return this.contentSize ? this.props.containerSize / this.contentSize : this.props.containerSize
        }
    }, {
        key: "topPocketSize",
        get: function() {
            if (this.props.pullDownEnabled) {
                return this.props.topPocketSize
            }
            return 0
        }
    }, {
        key: "bottomPocketSize",
        get: function() {
            if (this.props.reachBottomEnabled) {
                return this.props.bottomPocketSize
            }
            return 0
        }
    }, {
        key: "bottomBoundaryOffset",
        get: function() {
            return this.contentSize - this.props.containerSize
        }
    }, {
        key: "cssClasses",
        get: function() {
            var _classesMap;
            var direction = this.props.direction;
            var classesMap = (_classesMap = {}, _defineProperty(_classesMap, _consts.SCROLLABLE_SCROLLBAR_CLASS, true), _defineProperty(_classesMap, "dx-scrollbar-".concat(direction), true), _defineProperty(_classesMap, _consts.SCROLLABLE_SCROLLBAR_ACTIVE_CLASS, !!this.expanded), _defineProperty(_classesMap, _consts.HOVER_ENABLED_STATE, !!this.hoverStateEnabled), _classesMap);
            return (0, _combine_classes.combineClasses)(classesMap)
        }
    }, {
        key: "scrollStyles",
        get: function() {
            var _ref;
            return _ref = {}, _defineProperty(_ref, this.dimension, this.scrollSize || THUMB_MIN_SIZE), _defineProperty(_ref, "transform", this.scrollTransform), _ref
        }
    }, {
        key: "scrollTransform",
        get: function() {
            if ("never" === this.props.showScrollbar) {
                return "none"
            }
            var translateValue = -this.props.scrollLocation * this.scrollRatio;
            if (this.isHorizontal) {
                return "translate(".concat(translateValue, "px, 0px)")
            }
            return "translate(0px, ".concat(translateValue, "px)")
        }
    }, {
        key: "scrollClasses",
        get: function() {
            var _combineClasses;
            return (0, _combine_classes.combineClasses)((_combineClasses = {}, _defineProperty(_combineClasses, _consts.SCROLLABLE_SCROLL_CLASS, true), _defineProperty(_combineClasses, "dx-state-invisible", !this.visible), _combineClasses))
        }
    }, {
        key: "isVisible",
        get: function() {
            return "never" !== this.props.showScrollbar && this.containerToContentRatio < 1
        }
    }, {
        key: "visible",
        get: function() {
            var _this$props10 = this.props,
                forceVisibility = _this$props10.forceVisibility,
                showScrollbar = _this$props10.showScrollbar;
            if (!this.isVisible) {
                return false
            }
            if ("onHover" === showScrollbar) {
                return this.visibility || this.props.isScrollableHovered || this.hovered
            }
            if ("always" === showScrollbar) {
                return true
            }
            return forceVisibility || this.visibility || !!this.showOnScrollByWheel
        }
    }, {
        key: "hoverStateEnabled",
        get: function() {
            var _this$props11 = this.props,
                scrollByThumb = _this$props11.scrollByThumb,
                showScrollbar = _this$props11.showScrollbar;
            return ("onHover" === showScrollbar || "always" === showScrollbar) && scrollByThumb
        }
    }, {
        key: "restAttributes",
        get: function() {
            var _this$props$pocketSta2 = _extends({}, this.props, {
                    pocketState: this.__state_pocketState
                }),
                restProps = (_this$props$pocketSta2.activeStateEnabled, _this$props$pocketSta2.bottomPocketSize, _this$props$pocketSta2.bounceEnabled, _this$props$pocketSta2.containerSize, _this$props$pocketSta2.contentSize, _this$props$pocketSta2.contentTranslateOffsetChange, _this$props$pocketSta2.defaultPocketState, _this$props$pocketSta2.direction, _this$props$pocketSta2.forceGeneratePockets, _this$props$pocketSta2.forceUpdateScrollbarLocation, _this$props$pocketSta2.forceVisibility, _this$props$pocketSta2.hoverStateEnabled, _this$props$pocketSta2.isScrollableHovered, _this$props$pocketSta2.onAnimatorCancel, _this$props$pocketSta2.onAnimatorStart, _this$props$pocketSta2.onPullDown, _this$props$pocketSta2.onReachBottom, _this$props$pocketSta2.onRelease, _this$props$pocketSta2.pocketState, _this$props$pocketSta2.pocketStateChange, _this$props$pocketSta2.pullDownEnabled, _this$props$pocketSta2.reachBottomEnabled, _this$props$pocketSta2.rtlEnabled, _this$props$pocketSta2.scrollByThumb, _this$props$pocketSta2.scrollLocation, _this$props$pocketSta2.scrollLocationChange, _this$props$pocketSta2.scrollableOffset, _this$props$pocketSta2.showScrollbar, _this$props$pocketSta2.topPocketSize, _objectWithoutProperties(_this$props$pocketSta2, _excluded));
            return restProps
        }
    }]);
    return Scrollbar
}(_vdom.InfernoComponent);
exports.Scrollbar = Scrollbar;
Scrollbar.defaultProps = _extends({}, ScrollbarPropsType);
