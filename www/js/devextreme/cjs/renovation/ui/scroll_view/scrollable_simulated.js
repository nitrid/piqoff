/**
 * DevExtreme (cjs/renovation/ui/scroll_view/scrollable_simulated.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.ScrollableSimulated = exports.viewFunction = void 0;
var _inferno = require("inferno");
var _vdom = require("@devextreme/vdom");
var _subscribe_to_event = require("../../utils/subscribe_to_event");
var _load_panel = require("./load_panel");
var _animated_scrollbar = require("./animated_scrollbar");
var _widget = require("../common/widget");
var _combine_classes = require("../../utils/combine_classes");
var _get_boundary_props = require("./utils/get_boundary_props");
var _index = require("../../../events/utils/index");
var _window = require("../../../core/utils/window");
var _type = require("../../../core/utils/type");
var _scrollable_simulated_props = require("./scrollable_simulated_props");
require("../../../events/gesture/emitter.gesture.scroll");
var _events_engine = _interopRequireDefault(require("../../../events/core/events_engine"));
var _scrollable_utils = require("./scrollable_utils");
var _scroll_direction = require("./utils/scroll_direction");
var _consts = require("./common/consts");
var _get_element_offset = require("./utils/get_element_offset");
var _get_element_style = require("./utils/get_element_style");
var _top_pocket = require("./top_pocket");
var _bottom_pocket = require("./bottom_pocket");
var _short = require("../../../events/short");
var _get_offset_distance = require("./utils/get_offset_distance");
var _restore_location = require("./utils/restore_location");
var _get_scroll_top_max = require("./utils/get_scroll_top_max");
var _get_scroll_left_max = require("./utils/get_scroll_left_max");
var _excluded = ["aria", "bounceEnabled", "children", "classes", "contentTranslateOffsetChange", "direction", "disabled", "forceGeneratePockets", "height", "inertiaEnabled", "needScrollViewContentWrapper", "needScrollViewLoadPanel", "onBounce", "onEnd", "onKeyDown", "onPullDown", "onReachBottom", "onScroll", "onStart", "onStop", "onUpdated", "pullDownEnabled", "pulledDownText", "pullingDownText", "reachBottomEnabled", "reachBottomText", "refreshingText", "rtlEnabled", "scrollByContent", "scrollByThumb", "scrollLocationChange", "showScrollbar", "updateManually", "useKeyboard", "useNative", "visible", "width"];

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
var viewFunction = function(viewModel) {
    var bottomPocketClientHeight = viewModel.bottomPocketClientHeight,
        bottomPocketRef = viewModel.bottomPocketRef,
        containerClientHeight = viewModel.containerClientHeight,
        containerClientWidth = viewModel.containerClientWidth,
        containerRef = viewModel.containerRef,
        containerStyles = viewModel.containerStyles,
        contentHeight = viewModel.contentHeight,
        contentRef = viewModel.contentRef,
        contentStyles = viewModel.contentStyles,
        contentTranslateOffsetChange = viewModel.contentTranslateOffsetChange,
        contentWidth = viewModel.contentWidth,
        cssClasses = viewModel.cssClasses,
        cursorEnterHandler = viewModel.cursorEnterHandler,
        cursorLeaveHandler = viewModel.cursorLeaveHandler,
        direction = viewModel.direction,
        forceUpdateHScrollbarLocation = viewModel.forceUpdateHScrollbarLocation,
        forceUpdateVScrollbarLocation = viewModel.forceUpdateVScrollbarLocation,
        hScrollLocation = viewModel.hScrollLocation,
        hScrollbarRef = viewModel.hScrollbarRef,
        isHovered = viewModel.isHovered,
        isLoadPanelVisible = viewModel.isLoadPanelVisible,
        onBounce = viewModel.onBounce,
        onPullDown = viewModel.onPullDown,
        onReachBottom = viewModel.onReachBottom,
        onRelease = viewModel.onRelease,
        onWidgetKeyDown = viewModel.onWidgetKeyDown,
        pocketStateChange = viewModel.pocketStateChange,
        _viewModel$props = viewModel.props,
        aria = _viewModel$props.aria,
        bounceEnabled = _viewModel$props.bounceEnabled,
        children = _viewModel$props.children,
        disabled = _viewModel$props.disabled,
        forceGeneratePockets = _viewModel$props.forceGeneratePockets,
        height = _viewModel$props.height,
        inertiaEnabled = _viewModel$props.inertiaEnabled,
        needScrollViewContentWrapper = _viewModel$props.needScrollViewContentWrapper,
        needScrollViewLoadPanel = _viewModel$props.needScrollViewLoadPanel,
        pullDownEnabled = _viewModel$props.pullDownEnabled,
        pulledDownText = _viewModel$props.pulledDownText,
        pullingDownText = _viewModel$props.pullingDownText,
        reachBottomEnabled = _viewModel$props.reachBottomEnabled,
        reachBottomText = _viewModel$props.reachBottomText,
        refreshingText = _viewModel$props.refreshingText,
        rtlEnabled = _viewModel$props.rtlEnabled,
        scrollByThumb = _viewModel$props.scrollByThumb,
        showScrollbar = _viewModel$props.showScrollbar,
        useKeyboard = _viewModel$props.useKeyboard,
        visible = _viewModel$props.visible,
        width = _viewModel$props.width,
        restAttributes = viewModel.restAttributes,
        scrollLocationChange = viewModel.scrollLocationChange,
        scrollViewContentRef = viewModel.scrollViewContentRef,
        scrollableOffsetLeft = viewModel.scrollableOffsetLeft,
        scrollableOffsetTop = viewModel.scrollableOffsetTop,
        scrollableRef = viewModel.scrollableRef,
        topPocketClientHeight = viewModel.topPocketClientHeight,
        topPocketRef = viewModel.topPocketRef,
        topPocketState = viewModel.topPocketState,
        vScrollLocation = viewModel.vScrollLocation,
        vScrollbarRef = viewModel.vScrollbarRef,
        windowResizeHandler = viewModel.windowResizeHandler,
        wrapperRef = viewModel.wrapperRef;
    return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, _widget.Widget, _extends({
        rootElementRef: scrollableRef,
        focusStateEnabled: useKeyboard,
        hoverStateEnabled: true,
        aria: aria,
        classes: cssClasses,
        disabled: disabled,
        rtlEnabled: rtlEnabled,
        height: height,
        width: width,
        visible: visible,
        onKeyDown: onWidgetKeyDown,
        onHoverStart: cursorEnterHandler,
        onHoverEnd: cursorLeaveHandler,
        onDimensionChanged: windowResizeHandler
    }, restAttributes, {
        children: [(0, _inferno.createVNode)(1, "div", _consts.SCROLLABLE_WRAPPER_CLASS, (0, _inferno.createVNode)(1, "div", _consts.SCROLLABLE_CONTAINER_CLASS, [(0, _inferno.createVNode)(1, "div", _consts.SCROLLABLE_CONTENT_CLASS, [forceGeneratePockets && (0, _inferno.createComponentVNode)(2, _top_pocket.TopPocket, {
            topPocketRef: topPocketRef,
            pullingDownText: pullingDownText,
            pulledDownText: pulledDownText,
            refreshingText: refreshingText,
            refreshStrategy: "simulated",
            pocketState: topPocketState,
            visible: !!pullDownEnabled
        }), needScrollViewContentWrapper ? (0, _inferno.createVNode)(1, "div", _consts.SCROLLVIEW_CONTENT_CLASS, children, 0, null, null, scrollViewContentRef) : (0, _inferno.createVNode)(1, "div", null, children, 0), forceGeneratePockets && (0, _inferno.createComponentVNode)(2, _bottom_pocket.BottomPocket, {
            bottomPocketRef: bottomPocketRef,
            reachBottomText: reachBottomText,
            visible: !!reachBottomEnabled
        })], 0, {
            style: (0, _vdom.normalizeStyles)(contentStyles)
        }, null, contentRef), direction.isHorizontal && (0, _inferno.createComponentVNode)(2, _animated_scrollbar.AnimatedScrollbar, {
            direction: "horizontal",
            scrollableOffset: scrollableOffsetLeft,
            contentSize: contentWidth,
            containerSize: containerClientWidth,
            isScrollableHovered: isHovered,
            scrollLocation: hScrollLocation,
            scrollLocationChange: scrollLocationChange,
            contentTranslateOffsetChange: contentTranslateOffsetChange,
            scrollByThumb: scrollByThumb,
            bounceEnabled: bounceEnabled,
            showScrollbar: showScrollbar,
            inertiaEnabled: inertiaEnabled,
            onBounce: onBounce,
            forceUpdateScrollbarLocation: forceUpdateHScrollbarLocation
        }, null, hScrollbarRef), direction.isVertical && (0, _inferno.createComponentVNode)(2, _animated_scrollbar.AnimatedScrollbar, {
            direction: "vertical",
            scrollableOffset: scrollableOffsetTop,
            contentSize: contentHeight,
            containerSize: containerClientHeight,
            isScrollableHovered: isHovered,
            scrollLocation: vScrollLocation,
            scrollLocationChange: scrollLocationChange,
            contentTranslateOffsetChange: contentTranslateOffsetChange,
            scrollByThumb: scrollByThumb,
            bounceEnabled: bounceEnabled,
            showScrollbar: showScrollbar,
            inertiaEnabled: inertiaEnabled,
            onBounce: onBounce,
            forceUpdateScrollbarLocation: forceUpdateVScrollbarLocation,
            forceGeneratePockets: forceGeneratePockets,
            topPocketSize: topPocketClientHeight,
            bottomPocketSize: bottomPocketClientHeight,
            onPullDown: onPullDown,
            onRelease: onRelease,
            onReachBottom: onReachBottom,
            pullDownEnabled: pullDownEnabled,
            reachBottomEnabled: reachBottomEnabled,
            pocketState: topPocketState,
            pocketStateChange: pocketStateChange
        }, null, vScrollbarRef)], 0, {
            style: (0, _vdom.normalizeStyles)(containerStyles)
        }, null, containerRef), 2, null, null, wrapperRef), needScrollViewLoadPanel && (0, _inferno.createComponentVNode)(2, _load_panel.ScrollViewLoadPanel, {
            targetElement: scrollableRef,
            refreshingText: refreshingText,
            visible: isLoadPanelVisible
        })]
    })))
};
exports.viewFunction = viewFunction;
var ScrollableSimulated = function(_InfernoComponent) {
    _inheritsLoose(ScrollableSimulated, _InfernoComponent);

    function ScrollableSimulated(props) {
        var _this;
        _this = _InfernoComponent.call(this, props) || this;
        _this._currentState = null;
        _this.locked = false;
        _this.loadingIndicatorEnabled = true;
        _this.validDirections = {};
        _this.prevContainerClientWidth = 0;
        _this.prevContainerClientHeight = 0;
        _this.prevContentClientWidth = 0;
        _this.prevContentClientHeight = 0;
        _this.scrollableRef = (0, _inferno.createRef)();
        _this.wrapperRef = (0, _inferno.createRef)();
        _this.contentRef = (0, _inferno.createRef)();
        _this.scrollViewContentRef = (0, _inferno.createRef)();
        _this.containerRef = (0, _inferno.createRef)();
        _this.vScrollbarRef = (0, _inferno.createRef)();
        _this.hScrollbarRef = (0, _inferno.createRef)();
        _this.topPocketRef = (0, _inferno.createRef)();
        _this.bottomPocketRef = (0, _inferno.createRef)();
        _this.state = {
            isHovered: false,
            scrollableOffsetLeft: 0,
            scrollableOffsetTop: 0,
            containerClientWidth: 0,
            containerClientHeight: 0,
            contentScrollWidth: 0,
            contentScrollHeight: 0,
            contentClientWidth: 0,
            contentClientHeight: 0,
            topPocketClientHeight: 0,
            bottomPocketClientHeight: 0,
            topPocketState: _consts.TopPocketState.STATE_RELEASED,
            isLoadPanelVisible: false,
            vScrollLocation: 0,
            hScrollLocation: 0,
            vContentTranslateOffset: 0,
            hContentTranslateOffset: 0,
            forceUpdateHScrollbarLocation: false,
            forceUpdateVScrollbarLocation: false
        };
        _this.content = _this.content.bind(_assertThisInitialized(_this));
        _this.update = _this.update.bind(_assertThisInitialized(_this));
        _this.refresh = _this.refresh.bind(_assertThisInitialized(_this));
        _this.startLoading = _this.startLoading.bind(_assertThisInitialized(_this));
        _this.finishLoading = _this.finishLoading.bind(_assertThisInitialized(_this));
        _this.release = _this.release.bind(_assertThisInitialized(_this));
        _this.scrollBy = _this.scrollBy.bind(_assertThisInitialized(_this));
        _this.scrollTo = _this.scrollTo.bind(_assertThisInitialized(_this));
        _this.scrollToElement = _this.scrollToElement.bind(_assertThisInitialized(_this));
        _this.getElementLocation = _this.getElementLocation.bind(_assertThisInitialized(_this));
        _this.scrollHeight = _this.scrollHeight.bind(_assertThisInitialized(_this));
        _this.scrollWidth = _this.scrollWidth.bind(_assertThisInitialized(_this));
        _this.scrollOffset = _this.scrollOffset.bind(_assertThisInitialized(_this));
        _this.scrollTop = _this.scrollTop.bind(_assertThisInitialized(_this));
        _this.scrollLeft = _this.scrollLeft.bind(_assertThisInitialized(_this));
        _this.clientHeight = _this.clientHeight.bind(_assertThisInitialized(_this));
        _this.clientWidth = _this.clientWidth.bind(_assertThisInitialized(_this));
        _this.disposeWheelTimer = _this.disposeWheelTimer.bind(_assertThisInitialized(_this));
        _this.scrollEffect = _this.scrollEffect.bind(_assertThisInitialized(_this));
        _this.handleScroll = _this.handleScroll.bind(_assertThisInitialized(_this));
        _this.getEventArgs = _this.getEventArgs.bind(_assertThisInitialized(_this));
        _this.initEffect = _this.initEffect.bind(_assertThisInitialized(_this));
        _this.getInitEventData = _this.getInitEventData.bind(_assertThisInitialized(_this));
        _this.startEffect = _this.startEffect.bind(_assertThisInitialized(_this));
        _this.moveEffect = _this.moveEffect.bind(_assertThisInitialized(_this));
        _this.endEffect = _this.endEffect.bind(_assertThisInitialized(_this));
        _this.stopEffect = _this.stopEffect.bind(_assertThisInitialized(_this));
        _this.cancelEffect = _this.cancelEffect.bind(_assertThisInitialized(_this));
        _this.onStart = _this.onStart.bind(_assertThisInitialized(_this));
        _this.onEnd = _this.onEnd.bind(_assertThisInitialized(_this));
        _this.onStop = _this.onStop.bind(_assertThisInitialized(_this));
        _this.onUpdated = _this.onUpdated.bind(_assertThisInitialized(_this));
        _this.onBounce = _this.onBounce.bind(_assertThisInitialized(_this));
        _this.onPullDown = _this.onPullDown.bind(_assertThisInitialized(_this));
        _this.onRelease = _this.onRelease.bind(_assertThisInitialized(_this));
        _this.onReachBottom = _this.onReachBottom.bind(_assertThisInitialized(_this));
        _this.pocketStateChange = _this.pocketStateChange.bind(_assertThisInitialized(_this));
        _this.scrollLocationChange = _this.scrollLocationChange.bind(_assertThisInitialized(_this));
        _this.triggerScrollEvent = _this.triggerScrollEvent.bind(_assertThisInitialized(_this));
        _this.contentTranslateOffsetChange = _this.contentTranslateOffsetChange.bind(_assertThisInitialized(_this));
        _this.cursorEnterHandler = _this.cursorEnterHandler.bind(_assertThisInitialized(_this));
        _this.cursorLeaveHandler = _this.cursorLeaveHandler.bind(_assertThisInitialized(_this));
        _this.handleInit = _this.handleInit.bind(_assertThisInitialized(_this));
        _this.handleStart = _this.handleStart.bind(_assertThisInitialized(_this));
        _this.handleMove = _this.handleMove.bind(_assertThisInitialized(_this));
        _this.handleEnd = _this.handleEnd.bind(_assertThisInitialized(_this));
        _this.handleStop = _this.handleStop.bind(_assertThisInitialized(_this));
        _this.handleCancel = _this.handleCancel.bind(_assertThisInitialized(_this));
        _this.isCrossThumbScrolling = _this.isCrossThumbScrolling.bind(_assertThisInitialized(_this));
        _this.adjustDistance = _this.adjustDistance.bind(_assertThisInitialized(_this));
        _this.suppressDirections = _this.suppressDirections.bind(_assertThisInitialized(_this));
        _this.validateEvent = _this.validateEvent.bind(_assertThisInitialized(_this));
        _this.prepareDirections = _this.prepareDirections.bind(_assertThisInitialized(_this));
        _this.isContent = _this.isContent.bind(_assertThisInitialized(_this));
        _this.eventHandler = _this.eventHandler.bind(_assertThisInitialized(_this));
        _this.getDirection = _this.getDirection.bind(_assertThisInitialized(_this));
        _this.allowedDirection = _this.allowedDirection.bind(_assertThisInitialized(_this));
        _this.validate = _this.validate.bind(_assertThisInitialized(_this));
        _this.isLocked = _this.isLocked.bind(_assertThisInitialized(_this));
        _this.validateWheel = _this.validateWheel.bind(_assertThisInitialized(_this));
        _this.clearWheelValidationTimer = _this.clearWheelValidationTimer.bind(_assertThisInitialized(_this));
        _this.validateMove = _this.validateMove.bind(_assertThisInitialized(_this));
        _this.onWidgetKeyDown = _this.onWidgetKeyDown.bind(_assertThisInitialized(_this));
        _this.keyDownHandler = _this.keyDownHandler.bind(_assertThisInitialized(_this));
        _this.scrollByLine = _this.scrollByLine.bind(_assertThisInitialized(_this));
        _this.tryGetDevicePixelRatio = _this.tryGetDevicePixelRatio.bind(_assertThisInitialized(_this));
        _this.scrollByPage = _this.scrollByPage.bind(_assertThisInitialized(_this));
        _this.wheelDirection = _this.wheelDirection.bind(_assertThisInitialized(_this));
        _this.scrollToHome = _this.scrollToHome.bind(_assertThisInitialized(_this));
        _this.scrollToEnd = _this.scrollToEnd.bind(_assertThisInitialized(_this));
        _this.effectDisabledState = _this.effectDisabledState.bind(_assertThisInitialized(_this));
        _this.lock = _this.lock.bind(_assertThisInitialized(_this));
        _this.unlock = _this.unlock.bind(_assertThisInitialized(_this));
        _this.effectResetInactiveState = _this.effectResetInactiveState.bind(_assertThisInitialized(_this));
        _this.updateScrollbarSize = _this.updateScrollbarSize.bind(_assertThisInitialized(_this));
        _this.windowResizeHandler = _this.windowResizeHandler.bind(_assertThisInitialized(_this));
        _this.updateSizes = _this.updateSizes.bind(_assertThisInitialized(_this));
        return _this
    }
    var _proto = ScrollableSimulated.prototype;
    _proto.createEffects = function() {
        return [new _vdom.InfernoEffect(this.disposeWheelTimer, []), new _vdom.InfernoEffect(this.scrollEffect, [this.props.onScroll, this.props.direction, this.topPocketClientHeight]), new _vdom.InfernoEffect(this.initEffect, [this.props.direction, this.props.scrollByContent, this.props.scrollByThumb, this.props.onStop, this.topPocketClientHeight, this.contentScrollHeight, this.contentClientHeight, this.containerClientHeight, this.props.bounceEnabled, this.contentScrollWidth, this.contentClientWidth, this.containerClientWidth, this.props.updateManually, this.props.forceGeneratePockets, this.props.pullDownEnabled, this.props.reachBottomEnabled, this.vScrollLocation, this.props.onUpdated, this.props.disabled]), new _vdom.InfernoEffect(this.startEffect, [this.props.direction, this.props.onStart, this.topPocketClientHeight]), new _vdom.InfernoEffect(this.moveEffect, [this.props.direction]), new _vdom.InfernoEffect(this.endEffect, [this.props.direction, this.props.onEnd, this.topPocketClientHeight]), new _vdom.InfernoEffect(this.stopEffect, [this.props.direction]), new _vdom.InfernoEffect(this.cancelEffect, [this.props.direction]), new _vdom.InfernoEffect(this.effectDisabledState, [this.props.disabled]), new _vdom.InfernoEffect(this.effectResetInactiveState, [this.props.direction]), new _vdom.InfernoEffect(this.updateScrollbarSize, [this.isHovered, this.scrollableOffsetLeft, this.scrollableOffsetTop, this.containerClientWidth, this.containerClientHeight, this.contentScrollWidth, this.contentScrollHeight, this.contentClientWidth, this.contentClientHeight, this.topPocketClientHeight, this.bottomPocketClientHeight, this.topPocketState, this.isLoadPanelVisible, this.vScrollLocation, this.hScrollLocation, this.vContentTranslateOffset, this.hContentTranslateOffset, this.forceUpdateHScrollbarLocation, this.forceUpdateVScrollbarLocation, this.props.inertiaEnabled, this.props.useKeyboard, this.props.onStart, this.props.onEnd, this.props.onBounce, this.props.onStop, this.props.contentTranslateOffsetChange, this.props.scrollLocationChange, this.props.children, this.props.useNative, this.props.direction, this.props.showScrollbar, this.props.bounceEnabled, this.props.scrollByContent, this.props.scrollByThumb, this.props.updateManually, this.props.classes, this.props.pullDownEnabled, this.props.reachBottomEnabled, this.props.forceGeneratePockets, this.props.needScrollViewContentWrapper, this.props.needScrollViewLoadPanel, this.props.onScroll, this.props.onUpdated, this.props.onPullDown, this.props.onReachBottom, this.props.pullingDownText, this.props.pulledDownText, this.props.refreshingText, this.props.reachBottomText, this.props.aria, this.props.disabled, this.props.height, this.props.onKeyDown, this.props.rtlEnabled, this.props.visible, this.props.width])]
    };
    _proto.updateEffects = function() {
        var _this$_effects$, _this$_effects$2, _this$_effects$3, _this$_effects$4, _this$_effects$5, _this$_effects$6, _this$_effects$7, _this$_effects$8, _this$_effects$9, _this$_effects$10;
        null === (_this$_effects$ = this._effects[1]) || void 0 === _this$_effects$ ? void 0 : _this$_effects$.update([this.props.onScroll, this.props.direction, this.topPocketClientHeight]);
        null === (_this$_effects$2 = this._effects[2]) || void 0 === _this$_effects$2 ? void 0 : _this$_effects$2.update([this.props.direction, this.props.scrollByContent, this.props.scrollByThumb, this.props.onStop, this.topPocketClientHeight, this.contentScrollHeight, this.contentClientHeight, this.containerClientHeight, this.props.bounceEnabled, this.contentScrollWidth, this.contentClientWidth, this.containerClientWidth, this.props.updateManually, this.props.forceGeneratePockets, this.props.pullDownEnabled, this.props.reachBottomEnabled, this.vScrollLocation, this.props.onUpdated, this.props.disabled]);
        null === (_this$_effects$3 = this._effects[3]) || void 0 === _this$_effects$3 ? void 0 : _this$_effects$3.update([this.props.direction, this.props.onStart, this.topPocketClientHeight]);
        null === (_this$_effects$4 = this._effects[4]) || void 0 === _this$_effects$4 ? void 0 : _this$_effects$4.update([this.props.direction]);
        null === (_this$_effects$5 = this._effects[5]) || void 0 === _this$_effects$5 ? void 0 : _this$_effects$5.update([this.props.direction, this.props.onEnd, this.topPocketClientHeight]);
        null === (_this$_effects$6 = this._effects[6]) || void 0 === _this$_effects$6 ? void 0 : _this$_effects$6.update([this.props.direction]);
        null === (_this$_effects$7 = this._effects[7]) || void 0 === _this$_effects$7 ? void 0 : _this$_effects$7.update([this.props.direction]);
        null === (_this$_effects$8 = this._effects[8]) || void 0 === _this$_effects$8 ? void 0 : _this$_effects$8.update([this.props.disabled]);
        null === (_this$_effects$9 = this._effects[9]) || void 0 === _this$_effects$9 ? void 0 : _this$_effects$9.update([this.props.direction]);
        null === (_this$_effects$10 = this._effects[10]) || void 0 === _this$_effects$10 ? void 0 : _this$_effects$10.update([this.isHovered, this.scrollableOffsetLeft, this.scrollableOffsetTop, this.containerClientWidth, this.containerClientHeight, this.contentScrollWidth, this.contentScrollHeight, this.contentClientWidth, this.contentClientHeight, this.topPocketClientHeight, this.bottomPocketClientHeight, this.topPocketState, this.isLoadPanelVisible, this.vScrollLocation, this.hScrollLocation, this.vContentTranslateOffset, this.hContentTranslateOffset, this.forceUpdateHScrollbarLocation, this.forceUpdateVScrollbarLocation, this.props.inertiaEnabled, this.props.useKeyboard, this.props.onStart, this.props.onEnd, this.props.onBounce, this.props.onStop, this.props.contentTranslateOffsetChange, this.props.scrollLocationChange, this.props.children, this.props.useNative, this.props.direction, this.props.showScrollbar, this.props.bounceEnabled, this.props.scrollByContent, this.props.scrollByThumb, this.props.updateManually, this.props.classes, this.props.pullDownEnabled, this.props.reachBottomEnabled, this.props.forceGeneratePockets, this.props.needScrollViewContentWrapper, this.props.needScrollViewLoadPanel, this.props.onScroll, this.props.onUpdated, this.props.onPullDown, this.props.onReachBottom, this.props.pullingDownText, this.props.pulledDownText, this.props.refreshingText, this.props.reachBottomText, this.props.aria, this.props.disabled, this.props.height, this.props.onKeyDown, this.props.rtlEnabled, this.props.visible, this.props.width])
    };
    _proto.set_isHovered = function(value) {
        var _this2 = this;
        this.setState((function(state) {
            _this2._currentState = state;
            var newValue = value();
            _this2._currentState = null;
            return {
                isHovered: newValue
            }
        }))
    };
    _proto.set_scrollableOffsetLeft = function(value) {
        var _this3 = this;
        this.setState((function(state) {
            _this3._currentState = state;
            var newValue = value();
            _this3._currentState = null;
            return {
                scrollableOffsetLeft: newValue
            }
        }))
    };
    _proto.set_scrollableOffsetTop = function(value) {
        var _this4 = this;
        this.setState((function(state) {
            _this4._currentState = state;
            var newValue = value();
            _this4._currentState = null;
            return {
                scrollableOffsetTop: newValue
            }
        }))
    };
    _proto.set_containerClientWidth = function(value) {
        var _this5 = this;
        this.setState((function(state) {
            _this5._currentState = state;
            var newValue = value();
            _this5._currentState = null;
            return {
                containerClientWidth: newValue
            }
        }))
    };
    _proto.set_containerClientHeight = function(value) {
        var _this6 = this;
        this.setState((function(state) {
            _this6._currentState = state;
            var newValue = value();
            _this6._currentState = null;
            return {
                containerClientHeight: newValue
            }
        }))
    };
    _proto.set_contentScrollWidth = function(value) {
        var _this7 = this;
        this.setState((function(state) {
            _this7._currentState = state;
            var newValue = value();
            _this7._currentState = null;
            return {
                contentScrollWidth: newValue
            }
        }))
    };
    _proto.set_contentScrollHeight = function(value) {
        var _this8 = this;
        this.setState((function(state) {
            _this8._currentState = state;
            var newValue = value();
            _this8._currentState = null;
            return {
                contentScrollHeight: newValue
            }
        }))
    };
    _proto.set_contentClientWidth = function(value) {
        var _this9 = this;
        this.setState((function(state) {
            _this9._currentState = state;
            var newValue = value();
            _this9._currentState = null;
            return {
                contentClientWidth: newValue
            }
        }))
    };
    _proto.set_contentClientHeight = function(value) {
        var _this10 = this;
        this.setState((function(state) {
            _this10._currentState = state;
            var newValue = value();
            _this10._currentState = null;
            return {
                contentClientHeight: newValue
            }
        }))
    };
    _proto.set_topPocketClientHeight = function(value) {
        var _this11 = this;
        this.setState((function(state) {
            _this11._currentState = state;
            var newValue = value();
            _this11._currentState = null;
            return {
                topPocketClientHeight: newValue
            }
        }))
    };
    _proto.set_bottomPocketClientHeight = function(value) {
        var _this12 = this;
        this.setState((function(state) {
            _this12._currentState = state;
            var newValue = value();
            _this12._currentState = null;
            return {
                bottomPocketClientHeight: newValue
            }
        }))
    };
    _proto.set_topPocketState = function(value) {
        var _this13 = this;
        this.setState((function(state) {
            _this13._currentState = state;
            var newValue = value();
            _this13._currentState = null;
            return {
                topPocketState: newValue
            }
        }))
    };
    _proto.set_isLoadPanelVisible = function(value) {
        var _this14 = this;
        this.setState((function(state) {
            _this14._currentState = state;
            var newValue = value();
            _this14._currentState = null;
            return {
                isLoadPanelVisible: newValue
            }
        }))
    };
    _proto.set_vScrollLocation = function(value) {
        var _this15 = this;
        this.setState((function(state) {
            _this15._currentState = state;
            var newValue = value();
            _this15._currentState = null;
            return {
                vScrollLocation: newValue
            }
        }))
    };
    _proto.set_hScrollLocation = function(value) {
        var _this16 = this;
        this.setState((function(state) {
            _this16._currentState = state;
            var newValue = value();
            _this16._currentState = null;
            return {
                hScrollLocation: newValue
            }
        }))
    };
    _proto.set_vContentTranslateOffset = function(value) {
        var _this17 = this;
        this.setState((function(state) {
            _this17._currentState = state;
            var newValue = value();
            _this17._currentState = null;
            return {
                vContentTranslateOffset: newValue
            }
        }))
    };
    _proto.set_hContentTranslateOffset = function(value) {
        var _this18 = this;
        this.setState((function(state) {
            _this18._currentState = state;
            var newValue = value();
            _this18._currentState = null;
            return {
                hContentTranslateOffset: newValue
            }
        }))
    };
    _proto.set_forceUpdateHScrollbarLocation = function(value) {
        var _this19 = this;
        this.setState((function(state) {
            _this19._currentState = state;
            var newValue = value();
            _this19._currentState = null;
            return {
                forceUpdateHScrollbarLocation: newValue
            }
        }))
    };
    _proto.set_forceUpdateVScrollbarLocation = function(value) {
        var _this20 = this;
        this.setState((function(state) {
            _this20._currentState = state;
            var newValue = value();
            _this20._currentState = null;
            return {
                forceUpdateVScrollbarLocation: newValue
            }
        }))
    };
    _proto.disposeWheelTimer = function() {
        var _this21 = this;
        return function() {
            return _this21.clearWheelValidationTimer()
        }
    };
    _proto.scrollEffect = function() {
        var _this22 = this;
        return (0, _subscribe_to_event.subscribeToScrollEvent)(this.containerElement, (function() {
            _this22.handleScroll()
        }))
    };
    _proto.initEffect = function() {
        var _this23 = this;
        _short.dxScrollInit.on(this.wrapperRef.current, (function(e) {
            _this23.handleInit(e)
        }), this.getInitEventData(), {
            namespace: "dxScrollable"
        });
        return function() {
            return _short.dxScrollInit.off(_this23.wrapperRef.current, {
                namespace: "dxScrollable"
            })
        }
    };
    _proto.startEffect = function() {
        var _this24 = this;
        _short.dxScrollStart.on(this.wrapperRef.current, (function(e) {
            _this24.handleStart(e)
        }), {
            namespace: "dxScrollable"
        });
        return function() {
            return _short.dxScrollStart.off(_this24.wrapperRef.current, {
                namespace: "dxScrollable"
            })
        }
    };
    _proto.moveEffect = function() {
        var _this25 = this;
        _short.dxScrollMove.on(this.wrapperRef.current, (function(e) {
            _this25.handleMove(e)
        }), {
            namespace: "dxScrollable"
        });
        return function() {
            return _short.dxScrollMove.off(_this25.wrapperRef.current, {
                namespace: "dxScrollable"
            })
        }
    };
    _proto.endEffect = function() {
        var _this26 = this;
        _short.dxScrollEnd.on(this.wrapperRef.current, (function(e) {
            _this26.handleEnd(e)
        }), {
            namespace: "dxScrollable"
        });
        return function() {
            return _short.dxScrollEnd.off(_this26.wrapperRef.current, {
                namespace: "dxScrollable"
            })
        }
    };
    _proto.stopEffect = function() {
        var _this27 = this;
        _short.dxScrollStop.on(this.wrapperRef.current, (function() {
            _this27.handleStop()
        }), {
            namespace: "dxScrollable"
        });
        return function() {
            return _short.dxScrollStop.off(_this27.wrapperRef.current, {
                namespace: "dxScrollable"
            })
        }
    };
    _proto.cancelEffect = function() {
        var _this28 = this;
        _short.dxScrollCancel.on(this.wrapperRef.current, (function(event) {
            _this28.handleCancel(event)
        }), {
            namespace: "dxScrollable"
        });
        return function() {
            return _short.dxScrollCancel.off(_this28.wrapperRef.current, {
                namespace: "dxScrollable"
            })
        }
    };
    _proto.effectDisabledState = function() {
        if (this.props.disabled) {
            this.lock()
        } else {
            this.unlock()
        }
    };
    _proto.effectResetInactiveState = function() {
        var containerEl = this.containerRef.current;
        if (this.props.direction === _consts.DIRECTION_BOTH || !(0, _type.isDefined)(containerEl)) {
            return
        }
        containerEl[this.fullScrollInactiveProp] = 0
    };
    _proto.updateScrollbarSize = function() {
        var _this29 = this;
        this.set_scrollableOffsetLeft((function() {
            return _this29.scrollableOffset.left
        }));
        this.set_scrollableOffsetTop((function() {
            return _this29.scrollableOffset.top
        }));
        this.updateSizes()
    };
    _proto.startLoading = function() {
        if (this.loadingIndicatorEnabled) {
            this.set_isLoadPanelVisible((function() {
                return true
            }))
        }
        this.lock()
    };
    _proto.finishLoading = function() {
        this.set_isLoadPanelVisible((function() {
            return false
        }));
        this.unlock()
    };
    _proto.handleScroll = function() {
        var _this$props$onScroll, _this$props;
        null === (_this$props$onScroll = (_this$props = this.props).onScroll) || void 0 === _this$props$onScroll ? void 0 : _this$props$onScroll.call(_this$props, this.getEventArgs())
    };
    _proto.getEventArgs = function() {
        var scrollOffset = this.scrollOffset();
        return _extends({
            event: this.eventForUserAction,
            scrollOffset: scrollOffset
        }, (0, _get_boundary_props.getBoundaryProps)(this.props.direction, scrollOffset, this.containerElement, this.topPocketClientHeight))
    };
    _proto.getInitEventData = function() {
        return {
            getDirection: this.getDirection,
            validate: this.validate,
            isNative: false,
            scrollTarget: this.containerRef.current
        }
    };
    _proto.onStart = function() {
        var _this$props$onStart, _this$props2;
        null === (_this$props$onStart = (_this$props2 = this.props).onStart) || void 0 === _this$props$onStart ? void 0 : _this$props$onStart.call(_this$props2, this.getEventArgs())
    };
    _proto.onEnd = function() {
        var _this$props$onEnd, _this$props3;
        null === (_this$props$onEnd = (_this$props3 = this.props).onEnd) || void 0 === _this$props$onEnd ? void 0 : _this$props$onEnd.call(_this$props3, this.getEventArgs())
    };
    _proto.onStop = function() {
        var _this$props$onStop, _this$props4;
        null === (_this$props$onStop = (_this$props4 = this.props).onStop) || void 0 === _this$props$onStop ? void 0 : _this$props$onStop.call(_this$props4, this.getEventArgs())
    };
    _proto.onUpdated = function() {
        var _this$props$onUpdated, _this$props5;
        null === (_this$props$onUpdated = (_this$props5 = this.props).onUpdated) || void 0 === _this$props$onUpdated ? void 0 : _this$props$onUpdated.call(_this$props5, this.getEventArgs())
    };
    _proto.onBounce = function() {
        var _this$props$onBounce, _this$props6;
        null === (_this$props$onBounce = (_this$props6 = this.props).onBounce) || void 0 === _this$props$onBounce ? void 0 : _this$props$onBounce.call(_this$props6, this.getEventArgs())
    };
    _proto.onPullDown = function() {
        var _this$props$onPullDow, _this$props7;
        this.loadingIndicatorEnabled = false;
        this.startLoading();
        null === (_this$props$onPullDow = (_this$props7 = this.props).onPullDown) || void 0 === _this$props$onPullDow ? void 0 : _this$props$onPullDow.call(_this$props7, {})
    };
    _proto.onRelease = function() {
        this.loadingIndicatorEnabled = true;
        this.finishLoading();
        this.onUpdated()
    };
    _proto.onReachBottom = function() {
        var _this$props$onReachBo, _this$props8;
        this.loadingIndicatorEnabled = false;
        this.startLoading();
        null === (_this$props$onReachBo = (_this$props8 = this.props).onReachBottom) || void 0 === _this$props$onReachBo ? void 0 : _this$props$onReachBo.call(_this$props8, {})
    };
    _proto.pocketStateChange = function(state) {
        this.set_topPocketState((function() {
            return state
        }))
    };
    _proto.scrollLocationChange = function(scrollProp, location) {
        var containerEl = this.containerElement;
        containerEl[scrollProp] = -location;
        if ("scrollLeft" === scrollProp) {
            this.set_hScrollLocation((function() {
                return location
            }))
        } else {
            this.set_vScrollLocation((function() {
                return location
            }))
        }
        this.set_forceUpdateHScrollbarLocation((function() {
            return false
        }));
        this.set_forceUpdateVScrollbarLocation((function() {
            return false
        }));
        this.triggerScrollEvent()
    };
    _proto.triggerScrollEvent = function() {
        _events_engine.default.triggerHandler(this.containerElement, {
            type: "scroll"
        })
    };
    _proto.contentTranslateOffsetChange = function(prop, translateOffset) {
        if ("top" === prop) {
            this.set_vContentTranslateOffset((function() {
                return translateOffset
            }))
        } else {
            this.set_hContentTranslateOffset((function() {
                return translateOffset
            }))
        }
    };
    _proto.cursorEnterHandler = function() {
        if ("onHover" === this.props.showScrollbar) {
            this.set_isHovered((function() {
                return true
            }))
        }
    };
    _proto.cursorLeaveHandler = function() {
        if ("onHover" === this.props.showScrollbar) {
            this.set_isHovered((function() {
                return false
            }))
        }
    };
    _proto.handleInit = function(e) {
        this.suppressDirections(e);
        this.eventForUserAction = e;
        var crossThumbScrolling = this.isCrossThumbScrolling(e);
        this.eventHandler((function(scrollbar) {
            return scrollbar.initHandler(e, crossThumbScrolling)
        }));
        this.onStop()
    };
    _proto.handleStart = function(e) {
        this.eventForUserAction = e;
        this.eventHandler((function(scrollbar) {
            return scrollbar.startHandler()
        }));
        this.onStart()
    };
    _proto.handleMove = function(e) {
        if (this.isLocked()) {
            e.cancel = true;
            return
        }
        e.preventDefault();
        this.adjustDistance(e, "delta");
        this.eventForUserAction = e;
        this.eventHandler((function(scrollbar) {
            return scrollbar.moveHandler(e.delta)
        }))
    };
    _proto.handleEnd = function(e) {
        this.adjustDistance(e, "velocity");
        this.eventForUserAction = e;
        this.eventHandler((function(scrollbar) {
            return scrollbar.endHandler(e.velocity)
        }));
        this.onEnd()
    };
    _proto.handleStop = function() {
        this.eventHandler((function(scrollbar) {
            return scrollbar.stopHandler()
        }))
    };
    _proto.handleCancel = function(e) {
        this.eventForUserAction = e;
        this.eventHandler((function(scrollbar) {
            return scrollbar.endHandler({
                x: 0,
                y: 0
            })
        }))
    };
    _proto.isCrossThumbScrolling = function(e) {
        var target = e.originalEvent.target;
        var verticalScrolling;
        var horizontalScrolling;
        if (this.direction.isVertical) {
            verticalScrolling = this.props.scrollByThumb && this.vScrollbarRef.current.isThumb(target)
        }
        if (this.direction.isHorizontal) {
            horizontalScrolling = this.props.scrollByThumb && this.hScrollbarRef.current.isThumb(target)
        }
        return verticalScrolling || horizontalScrolling
    };
    _proto.adjustDistance = function(e, property) {
        var distance = e[property];
        distance.x *= this.validDirections[_consts.DIRECTION_HORIZONTAL] ? 1 : 0;
        distance.y *= this.validDirections[_consts.DIRECTION_VERTICAL] ? 1 : 0;
        var devicePixelRatio = this.tryGetDevicePixelRatio();
        if (devicePixelRatio && (0, _index.isDxMouseWheelEvent)(e.originalEvent)) {
            distance.x = Math.round(distance.x / devicePixelRatio * 100) / 100;
            distance.y = Math.round(distance.y / devicePixelRatio * 100) / 100
        }
    };
    _proto.suppressDirections = function(e) {
        if ((0, _index.isDxMouseWheelEvent)(e.originalEvent)) {
            this.prepareDirections(true);
            return
        }
        this.prepareDirections(false);
        if (this.direction.isVertical && (0, _type.isDefined)(this.vScrollbarRef.current)) {
            var isValid = this.validateEvent(e, this.vScrollbarRef.current);
            this.validDirections[_consts.DIRECTION_VERTICAL] = isValid
        }
        if (this.direction.isHorizontal && (0, _type.isDefined)(this.hScrollbarRef.current)) {
            var _isValid = this.validateEvent(e, this.hScrollbarRef.current);
            this.validDirections[_consts.DIRECTION_HORIZONTAL] = _isValid
        }
    };
    _proto.validateEvent = function(e, scrollbarRef) {
        var _this$props9 = this.props,
            scrollByContent = _this$props9.scrollByContent,
            scrollByThumb = _this$props9.scrollByThumb;
        return scrollByThumb && scrollbarRef.validateEvent(e) || scrollByContent && this.isContent(e.originalEvent.target)
    };
    _proto.prepareDirections = function(value) {
        this.validDirections[_consts.DIRECTION_HORIZONTAL] = value;
        this.validDirections[_consts.DIRECTION_VERTICAL] = value
    };
    _proto.isContent = function(element) {
        var closest = element.closest(".dx-scrollable-simulated");
        if ((0, _type.isDefined)(closest)) {
            return closest === this.scrollableRef.current
        }
        return false
    };
    _proto.eventHandler = function(handler) {
        if (this.direction.isHorizontal) {
            handler(this.hScrollbarRef.current)
        }
        if (this.direction.isVertical) {
            handler(this.vScrollbarRef.current)
        }
    };
    _proto.getDirection = function(e) {
        return (0, _index.isDxMouseWheelEvent)(e) ? this.wheelDirection(e) : this.allowedDirection()
    };
    _proto.allowedDirection = function() {
        return (0, _scrollable_utils.updateAllowedDirection)(this.allowedDirections, this.props.direction)
    };
    _proto.isLocked = function() {
        return this.locked
    };
    _proto.validateWheel = function(e) {
        var scrollbar = "horizontal" === this.wheelDirection(e) ? this.hScrollbarRef.current : this.vScrollbarRef.current;
        var reachedMin = scrollbar.reachedMin();
        var reachedMax = scrollbar.reachedMax();
        var contentGreaterThanContainer = !reachedMin || !reachedMax;
        var locatedNotAtBound = !reachedMin && !reachedMax;
        var delta = e.delta;
        var scrollFromMin = reachedMin && delta > 0;
        var scrollFromMax = reachedMax && delta < 0;
        var validated = contentGreaterThanContainer && (locatedNotAtBound || scrollFromMin || scrollFromMax);
        validated = validated || void 0 !== this.validateWheelTimer;
        if (validated) {
            this.clearWheelValidationTimer();
            this.validateWheelTimer = setTimeout(this.clearWheelValidationTimer, _consts.VALIDATE_WHEEL_TIMEOUT)
        }
        return validated
    };
    _proto.clearWheelValidationTimer = function() {
        clearTimeout(this.validateWheelTimer);
        this.validateWheelTimer = void 0
    };
    _proto.validateMove = function(e) {
        if (!this.props.scrollByContent && !(0, _type.isDefined)(e.target.closest(".".concat(_consts.SCROLLABLE_SCROLLBAR_CLASS)))) {
            return false
        }
        return (0, _type.isDefined)(this.allowedDirection())
    };
    _proto.onWidgetKeyDown = function(options) {
        var onKeyDown = this.props.onKeyDown;
        var originalEvent = options.originalEvent;
        var result = null === onKeyDown || void 0 === onKeyDown ? void 0 : onKeyDown(options);
        if (null !== result && void 0 !== result && result.cancel) {
            return result
        }
        this.keyDownHandler(originalEvent);
        return
    };
    _proto.keyDownHandler = function(e) {
        var handled = true;
        switch ((0, _index.normalizeKeyName)(e)) {
            case _consts.KEY_CODES.DOWN:
                this.scrollByLine({
                    y: 1
                });
                break;
            case _consts.KEY_CODES.UP:
                this.scrollByLine({
                    y: -1
                });
                break;
            case _consts.KEY_CODES.RIGHT:
                this.scrollByLine({
                    x: 1
                });
                break;
            case _consts.KEY_CODES.LEFT:
                this.scrollByLine({
                    x: -1
                });
                break;
            case _consts.KEY_CODES.PAGE_DOWN:
                this.scrollByPage(1);
                break;
            case _consts.KEY_CODES.PAGE_UP:
                this.scrollByPage(-1);
                break;
            case _consts.KEY_CODES.HOME:
                this.scrollToHome();
                break;
            case _consts.KEY_CODES.END:
                this.scrollToEnd();
                break;
            default:
                handled = false
        }
        if (handled) {
            e.stopPropagation();
            e.preventDefault()
        }
    };
    _proto.scrollByLine = function(lines) {
        var devicePixelRatio = this.tryGetDevicePixelRatio();
        var scrollOffset = _consts.SCROLL_LINE_HEIGHT;
        if (devicePixelRatio) {
            scrollOffset = Math.abs(scrollOffset / devicePixelRatio * 100) / 100
        }
        this.scrollBy({
            top: (lines.y || 0) * scrollOffset,
            left: (lines.x || 0) * scrollOffset
        })
    };
    _proto.tryGetDevicePixelRatio = function() {
        if ((0, _window.hasWindow)()) {
            return (0, _window.getWindow)().devicePixelRatio
        }
        return
    };
    _proto.scrollByPage = function(page) {
        var _ScrollDirection = new _scroll_direction.ScrollDirection(this.wheelDirection()),
            isVertical = _ScrollDirection.isVertical;
        var distance = {};
        var _this$containerElemen = this.containerElement,
            clientHeight = _this$containerElemen.clientHeight,
            clientWidth = _this$containerElemen.clientWidth;
        if (isVertical) {
            distance.top = page * clientHeight
        } else {
            distance.left = page * clientWidth
        }
        this.scrollBy(distance)
    };
    _proto.wheelDirection = function(e) {
        switch (this.props.direction) {
            case _consts.DIRECTION_HORIZONTAL:
                return _consts.DIRECTION_HORIZONTAL;
            case _consts.DIRECTION_VERTICAL:
                return _consts.DIRECTION_VERTICAL;
            default:
                return null !== e && void 0 !== e && e.shiftKey ? _consts.DIRECTION_HORIZONTAL : _consts.DIRECTION_VERTICAL
        }
    };
    _proto.scrollToHome = function() {
        var distance = _defineProperty({}, this.direction.isVertical ? "top" : "left", 0);
        this.scrollTo(distance)
    };
    _proto.scrollToEnd = function() {
        var _ScrollDirection2 = new _scroll_direction.ScrollDirection(this.wheelDirection()),
            isVertical = _ScrollDirection2.isVertical;
        var distance = {};
        if (isVertical) {
            distance.top = (0, _get_scroll_top_max.getScrollTopMax)(this.containerElement)
        } else {
            distance.left = (0, _get_scroll_left_max.getScrollLeftMax)(this.containerElement)
        }
        this.scrollTo(distance)
    };
    _proto.lock = function() {
        this.locked = true
    };
    _proto.unlock = function() {
        if (!this.props.disabled) {
            this.locked = false
        }
    };
    _proto.windowResizeHandler = function() {
        this.update()
    };
    _proto.updateSizes = function() {
        var containerEl = this.containerElement;
        var contentEl = this.contentRef.current;
        if ((0, _type.isDefined)(containerEl)) {
            this.set_containerClientWidth((function() {
                return containerEl.clientWidth
            }));
            this.set_containerClientHeight((function() {
                return containerEl.clientHeight
            }))
        }
        if ((0, _type.isDefined)(contentEl)) {
            this.set_contentClientWidth((function() {
                return contentEl.clientWidth
            }));
            this.set_contentClientHeight((function() {
                return contentEl.clientHeight
            }));
            this.set_contentScrollWidth((function() {
                return contentEl.scrollWidth
            }));
            this.set_contentScrollHeight((function() {
                return contentEl.scrollHeight
            }))
        }
        if (this.props.forceGeneratePockets) {
            if (this.props.pullDownEnabled) {
                var topPocketEl = this.topPocketRef.current;
                if ((0, _type.isDefined)(topPocketEl)) {
                    this.set_topPocketClientHeight((function() {
                        return topPocketEl.clientHeight
                    }))
                }
            }
            if (this.props.reachBottomEnabled) {
                var bottomPocketEl = this.bottomPocketRef.current;
                if ((0, _type.isDefined)(bottomPocketEl)) {
                    this.set_bottomPocketClientHeight((function() {
                        return bottomPocketEl.clientHeight
                    }))
                }
            }
        }
        if (this.prevContentClientWidth !== this.contentClientWidth || this.prevContainerClientWidth !== this.containerClientWidth) {
            this.set_forceUpdateHScrollbarLocation((function() {
                return true
            }));
            this.prevContentClientWidth = this.contentClientWidth;
            this.prevContainerClientWidth = this.containerClientWidth;
            this.set_hScrollLocation((function() {
                return -containerEl.scrollLeft
            }))
        }
        if (this.prevContentClientHeight !== this.contentClientHeight || this.prevContainerClientHeight !== this.containerClientHeight) {
            this.set_forceUpdateVScrollbarLocation((function() {
                return true
            }));
            this.prevContentClientHeight = this.contentClientHeight;
            this.prevContainerClientHeight = this.containerClientHeight;
            if (this.vScrollLocation <= 0) {
                this.set_vScrollLocation((function() {
                    return -containerEl.scrollTop
                }))
            }
        }
    };
    _proto.content = function() {
        if (this.props.needScrollViewContentWrapper) {
            return this.scrollViewContentRef.current
        }
        return this.contentRef.current
    };
    _proto.update = function() {
        if (!this.props.updateManually) {
            this.updateSizes();
            this.onUpdated()
        }
    };
    _proto.refresh = function() {
        var _this$props$onPullDow2, _this$props10;
        this.set_topPocketState((function() {
            return _consts.TopPocketState.STATE_READY
        }));
        this.startLoading();
        null === (_this$props$onPullDow2 = (_this$props10 = this.props).onPullDown) || void 0 === _this$props$onPullDow2 ? void 0 : _this$props$onPullDow2.call(_this$props10, {})
    };
    _proto.release = function() {
        this.eventHandler((function(scrollbar) {
            return scrollbar.releaseHandler()
        }))
    };
    _proto.scrollBy = function(distance) {
        var location = (0, _restore_location.restoreLocation)(distance, this.props.direction);
        if (!location.top && !location.left) {
            return
        }
        this.update();
        if (this.direction.isVertical) {
            var scrollbar = this.vScrollbarRef.current;
            location.top = scrollbar.boundLocation(location.top + this.vScrollLocation) - this.vScrollLocation
        }
        if (this.direction.isHorizontal) {
            var _scrollbar = this.hScrollbarRef.current;
            location.left = _scrollbar.boundLocation(location.left + this.hScrollLocation) - this.hScrollLocation
        }
        this.prepareDirections(true);
        this.onStart();
        this.eventHandler((function(scrollbar) {
            return scrollbar.scrollByHandler({
                x: location.left || 0,
                y: location.top || 0
            })
        }));
        this.onEnd()
    };
    _proto.scrollTo = function(targetLocation) {
        this.update();
        var direction = this.props.direction;
        var distance = (0, _get_offset_distance.getOffsetDistance)(targetLocation, direction, this.scrollOffset());
        this.scrollBy(distance)
    };
    _proto.scrollToElement = function(element) {
        if (!(0, _type.isDefined)(element)) {
            return
        }
        var _this$scrollOffset = this.scrollOffset(),
            left = _this$scrollOffset.left,
            top = _this$scrollOffset.top;
        element.scrollIntoView({
            block: "nearest",
            inline: "nearest"
        });
        var containerEl = this.containerElement;
        var direction = this.props.direction;
        var distance = (0, _get_offset_distance.getOffsetDistance)({
            top: top,
            left: left
        }, direction, this.scrollOffset());
        if (!this.direction.isHorizontal) {
            containerEl.scrollLeft += distance.left
        }
        if (!this.direction.isVertical) {
            containerEl.scrollTop += distance.top
        }
        this.set_vScrollLocation((function() {
            return -containerEl.scrollTop
        }));
        this.set_hScrollLocation((function() {
            return -containerEl.scrollLeft
        }))
    };
    _proto.getElementLocation = function(element, direction, offset) {
        var scrollOffset = _extends({
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        }, offset);
        return (0, _scrollable_utils.getLocation)(element, scrollOffset, direction, this.containerElement)
    };
    _proto.scrollHeight = function() {
        return this.content().offsetHeight
    };
    _proto.scrollWidth = function() {
        return this.content().offsetWidth
    };
    _proto.scrollOffset = function() {
        var _this$containerElemen2 = this.containerElement,
            scrollLeft = _this$containerElemen2.scrollLeft,
            scrollTop = _this$containerElemen2.scrollTop;
        return {
            top: scrollTop,
            left: scrollLeft
        }
    };
    _proto.scrollTop = function() {
        return this.scrollOffset().top
    };
    _proto.scrollLeft = function() {
        return this.scrollOffset().left
    };
    _proto.clientHeight = function() {
        return this.containerElement.clientHeight
    };
    _proto.clientWidth = function() {
        return this.containerElement.clientWidth
    };
    _proto.validate = function(e) {
        if (this.isLocked()) {
            return false
        }
        this.update();
        if (this.props.disabled || (0, _index.isDxMouseWheelEvent)(e) && (0, _index.isCommandKeyPressed)({
                ctrlKey: e.ctrlKey,
                metaKey: e.metaKey
            })) {
            return false
        }
        if (this.props.bounceEnabled) {
            return true
        }
        return (0, _index.isDxMouseWheelEvent)(e) ? this.validateWheel(e) : this.validateMove(e)
    };
    _proto.render = function() {
        var props = this.props;
        return viewFunction({
            props: _extends({}, props),
            isHovered: this.isHovered,
            scrollableOffsetLeft: this.scrollableOffsetLeft,
            scrollableOffsetTop: this.scrollableOffsetTop,
            containerClientWidth: this.containerClientWidth,
            containerClientHeight: this.containerClientHeight,
            contentScrollWidth: this.contentScrollWidth,
            contentScrollHeight: this.contentScrollHeight,
            contentClientWidth: this.contentClientWidth,
            contentClientHeight: this.contentClientHeight,
            topPocketClientHeight: this.topPocketClientHeight,
            bottomPocketClientHeight: this.bottomPocketClientHeight,
            topPocketState: this.topPocketState,
            isLoadPanelVisible: this.isLoadPanelVisible,
            vScrollLocation: this.vScrollLocation,
            hScrollLocation: this.hScrollLocation,
            vContentTranslateOffset: this.vContentTranslateOffset,
            hContentTranslateOffset: this.hContentTranslateOffset,
            forceUpdateHScrollbarLocation: this.forceUpdateHScrollbarLocation,
            forceUpdateVScrollbarLocation: this.forceUpdateVScrollbarLocation,
            scrollableRef: this.scrollableRef,
            wrapperRef: this.wrapperRef,
            contentRef: this.contentRef,
            scrollViewContentRef: this.scrollViewContentRef,
            containerRef: this.containerRef,
            vScrollbarRef: this.vScrollbarRef,
            hScrollbarRef: this.hScrollbarRef,
            topPocketRef: this.topPocketRef,
            bottomPocketRef: this.bottomPocketRef,
            startLoading: this.startLoading,
            finishLoading: this.finishLoading,
            handleScroll: this.handleScroll,
            getEventArgs: this.getEventArgs,
            getInitEventData: this.getInitEventData,
            onStart: this.onStart,
            onEnd: this.onEnd,
            onStop: this.onStop,
            onUpdated: this.onUpdated,
            onBounce: this.onBounce,
            onPullDown: this.onPullDown,
            onRelease: this.onRelease,
            onReachBottom: this.onReachBottom,
            pocketStateChange: this.pocketStateChange,
            scrollLocationChange: this.scrollLocationChange,
            triggerScrollEvent: this.triggerScrollEvent,
            contentTranslateOffsetChange: this.contentTranslateOffsetChange,
            cursorEnterHandler: this.cursorEnterHandler,
            cursorLeaveHandler: this.cursorLeaveHandler,
            handleInit: this.handleInit,
            handleStart: this.handleStart,
            handleMove: this.handleMove,
            handleEnd: this.handleEnd,
            handleStop: this.handleStop,
            handleCancel: this.handleCancel,
            isCrossThumbScrolling: this.isCrossThumbScrolling,
            adjustDistance: this.adjustDistance,
            suppressDirections: this.suppressDirections,
            validateEvent: this.validateEvent,
            prepareDirections: this.prepareDirections,
            isContent: this.isContent,
            eventHandler: this.eventHandler,
            getDirection: this.getDirection,
            allowedDirection: this.allowedDirection,
            allowedDirections: this.allowedDirections,
            isLocked: this.isLocked,
            validateWheel: this.validateWheel,
            clearWheelValidationTimer: this.clearWheelValidationTimer,
            validateMove: this.validateMove,
            onWidgetKeyDown: this.onWidgetKeyDown,
            keyDownHandler: this.keyDownHandler,
            scrollByLine: this.scrollByLine,
            tryGetDevicePixelRatio: this.tryGetDevicePixelRatio,
            scrollByPage: this.scrollByPage,
            wheelDirection: this.wheelDirection,
            scrollToHome: this.scrollToHome,
            scrollToEnd: this.scrollToEnd,
            lock: this.lock,
            unlock: this.unlock,
            fullScrollInactiveProp: this.fullScrollInactiveProp,
            windowResizeHandler: this.windowResizeHandler,
            updateSizes: this.updateSizes,
            containerElement: this.containerElement,
            contentWidth: this.contentWidth,
            contentHeight: this.contentHeight,
            scrollableOffset: this.scrollableOffset,
            contentStyles: this.contentStyles,
            containerStyles: this.containerStyles,
            cssClasses: this.cssClasses,
            direction: this.direction,
            restAttributes: this.restAttributes
        })
    };
    _createClass(ScrollableSimulated, [{
        key: "isHovered",
        get: function() {
            var state = this._currentState || this.state;
            return state.isHovered
        }
    }, {
        key: "scrollableOffsetLeft",
        get: function() {
            var state = this._currentState || this.state;
            return state.scrollableOffsetLeft
        }
    }, {
        key: "scrollableOffsetTop",
        get: function() {
            var state = this._currentState || this.state;
            return state.scrollableOffsetTop
        }
    }, {
        key: "containerClientWidth",
        get: function() {
            var state = this._currentState || this.state;
            return state.containerClientWidth
        }
    }, {
        key: "containerClientHeight",
        get: function() {
            var state = this._currentState || this.state;
            return state.containerClientHeight
        }
    }, {
        key: "contentScrollWidth",
        get: function() {
            var state = this._currentState || this.state;
            return state.contentScrollWidth
        }
    }, {
        key: "contentScrollHeight",
        get: function() {
            var state = this._currentState || this.state;
            return state.contentScrollHeight
        }
    }, {
        key: "contentClientWidth",
        get: function() {
            var state = this._currentState || this.state;
            return state.contentClientWidth
        }
    }, {
        key: "contentClientHeight",
        get: function() {
            var state = this._currentState || this.state;
            return state.contentClientHeight
        }
    }, {
        key: "topPocketClientHeight",
        get: function() {
            var state = this._currentState || this.state;
            return state.topPocketClientHeight
        }
    }, {
        key: "bottomPocketClientHeight",
        get: function() {
            var state = this._currentState || this.state;
            return state.bottomPocketClientHeight
        }
    }, {
        key: "topPocketState",
        get: function() {
            var state = this._currentState || this.state;
            return state.topPocketState
        }
    }, {
        key: "isLoadPanelVisible",
        get: function() {
            var state = this._currentState || this.state;
            return state.isLoadPanelVisible
        }
    }, {
        key: "vScrollLocation",
        get: function() {
            var state = this._currentState || this.state;
            return state.vScrollLocation
        }
    }, {
        key: "hScrollLocation",
        get: function() {
            var state = this._currentState || this.state;
            return state.hScrollLocation
        }
    }, {
        key: "vContentTranslateOffset",
        get: function() {
            var state = this._currentState || this.state;
            return state.vContentTranslateOffset
        }
    }, {
        key: "hContentTranslateOffset",
        get: function() {
            var state = this._currentState || this.state;
            return state.hContentTranslateOffset
        }
    }, {
        key: "forceUpdateHScrollbarLocation",
        get: function() {
            var state = this._currentState || this.state;
            return state.forceUpdateHScrollbarLocation
        }
    }, {
        key: "forceUpdateVScrollbarLocation",
        get: function() {
            var state = this._currentState || this.state;
            return state.forceUpdateVScrollbarLocation
        }
    }, {
        key: "allowedDirections",
        get: function() {
            return {
                vertical: this.direction.isVertical && (Math.round(-Math.max(this.contentHeight - this.containerClientHeight, 0)) < 0 || this.props.bounceEnabled),
                horizontal: this.direction.isHorizontal && (Math.round(-Math.max(this.contentWidth - this.containerClientWidth, 0)) < 0 || this.props.bounceEnabled)
            }
        }
    }, {
        key: "fullScrollInactiveProp",
        get: function() {
            return this.props.direction === _consts.DIRECTION_HORIZONTAL ? "scrollTop" : "scrollLeft"
        }
    }, {
        key: "containerElement",
        get: function() {
            return this.containerRef.current
        }
    }, {
        key: "contentWidth",
        get: function() {
            if (!(0, _type.isDefined)(this.contentRef) || !(0, _type.isDefined)(this.contentRef.current)) {
                return 0
            }
            var isOverflowHidden = "hidden" === (0, _get_element_style.getElementStyle)("overflowX", this.contentRef.current);
            if (!isOverflowHidden) {
                var containerScrollSize = this.contentScrollWidth;
                return Math.max(containerScrollSize, this.contentClientWidth)
            }
            return this.contentClientWidth
        }
    }, {
        key: "contentHeight",
        get: function() {
            if (!(0, _type.isDefined)(this.contentRef) || !(0, _type.isDefined)(this.contentRef.current)) {
                return 0
            }
            var isOverflowHidden = "hidden" === (0, _get_element_style.getElementStyle)("overflowY", this.contentRef.current);
            if (!isOverflowHidden) {
                var containerScrollSize = this.contentScrollHeight;
                return Math.max(containerScrollSize, this.contentClientHeight)
            }
            return this.contentClientHeight
        }
    }, {
        key: "scrollableOffset",
        get: function() {
            return (0, _get_element_offset.getElementOffset)(this.scrollableRef.current)
        }
    }, {
        key: "contentStyles",
        get: function() {
            return {
                transform: "translate(".concat(this.hContentTranslateOffset, "px, ").concat(this.vContentTranslateOffset, "px)")
            }
        }
    }, {
        key: "containerStyles",
        get: function() {
            var touchDirection = this.allowedDirections.vertical ? "pan-x" : "";
            touchDirection = this.allowedDirections.horizontal ? "pan-y" : touchDirection;
            touchDirection = this.allowedDirections.vertical && this.allowedDirections.horizontal ? "none" : touchDirection;
            return {
                touchAction: touchDirection
            }
        }
    }, {
        key: "cssClasses",
        get: function() {
            var _classesMap;
            var _this$props11 = this.props,
                classes = _this$props11.classes,
                direction = _this$props11.direction,
                disabled = _this$props11.disabled,
                showScrollbar = _this$props11.showScrollbar;
            var classesMap = (_classesMap = {
                "dx-scrollable dx-scrollable-renovated": true
            }, _defineProperty(_classesMap, _consts.SCROLLABLE_SIMULATED_CLASS, true), _defineProperty(_classesMap, "dx-scrollable-".concat(direction), true), _defineProperty(_classesMap, _consts.SCROLLABLE_DISABLED_CLASS, !!disabled), _defineProperty(_classesMap, _consts.SCROLLABLE_SCROLLBARS_ALWAYSVISIBLE, "always" === showScrollbar), _defineProperty(_classesMap, _consts.SCROLLABLE_SCROLLBARS_HIDDEN, !showScrollbar), _defineProperty(_classesMap, "".concat(classes), !!classes), _classesMap);
            return (0, _combine_classes.combineClasses)(classesMap)
        }
    }, {
        key: "direction",
        get: function() {
            return new _scroll_direction.ScrollDirection(this.props.direction)
        }
    }, {
        key: "restAttributes",
        get: function() {
            var _this$props12 = this.props,
                restProps = (_this$props12.aria, _this$props12.bounceEnabled, _this$props12.children, _this$props12.classes, _this$props12.contentTranslateOffsetChange, _this$props12.direction, _this$props12.disabled, _this$props12.forceGeneratePockets, _this$props12.height, _this$props12.inertiaEnabled, _this$props12.needScrollViewContentWrapper, _this$props12.needScrollViewLoadPanel, _this$props12.onBounce, _this$props12.onEnd, _this$props12.onKeyDown, _this$props12.onPullDown, _this$props12.onReachBottom, _this$props12.onScroll, _this$props12.onStart, _this$props12.onStop, _this$props12.onUpdated, _this$props12.pullDownEnabled, _this$props12.pulledDownText, _this$props12.pullingDownText, _this$props12.reachBottomEnabled, _this$props12.reachBottomText, _this$props12.refreshingText, _this$props12.rtlEnabled, _this$props12.scrollByContent, _this$props12.scrollByThumb, _this$props12.scrollLocationChange, _this$props12.showScrollbar, _this$props12.updateManually, _this$props12.useKeyboard, _this$props12.useNative, _this$props12.visible, _this$props12.width, _objectWithoutProperties(_this$props12, _excluded));
            return restProps
        }
    }]);
    return ScrollableSimulated
}(_vdom.InfernoComponent);
exports.ScrollableSimulated = ScrollableSimulated;
ScrollableSimulated.defaultProps = _extends({}, _scrollable_simulated_props.ScrollableSimulatedPropsType);
