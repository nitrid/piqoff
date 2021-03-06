/**
 * DevExtreme (esm/renovation/ui/scroll_view/scrollable_native.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
var _excluded = ["aria", "bounceEnabled", "children", "classes", "direction", "disabled", "forceGeneratePockets", "height", "needScrollViewContentWrapper", "needScrollViewLoadPanel", "onKeyDown", "onPullDown", "onReachBottom", "onScroll", "onUpdated", "pullDownEnabled", "pulledDownText", "pullingDownText", "reachBottomEnabled", "reachBottomText", "refreshingText", "rtlEnabled", "scrollByContent", "scrollByThumb", "showScrollbar", "updateManually", "useNative", "useSimulatedScrollbar", "visible", "width"];
import {
    createVNode,
    createComponentVNode,
    normalizeProps
} from "inferno";
import {
    InfernoEffect,
    InfernoComponent,
    normalizeStyles
} from "@devextreme/vdom";
import {
    subscribeToScrollEvent
} from "../../utils/subscribe_to_event";
import {
    Widget,
    WidgetProps
} from "../common/widget";
import {
    ScrollViewLoadPanel
} from "./load_panel";
import {
    combineClasses
} from "../../utils/combine_classes";
import {
    getScrollLeftMax
} from "./utils/get_scroll_left_max";
import {
    getAugmentedLocation
} from "./utils/get_augmented_location";
import {
    getBoundaryProps,
    isReachedBottom
} from "./utils/get_boundary_props";
import devices from "../../../core/devices";
import browser from "../../../core/utils/browser";
import {
    isDefined
} from "../../../core/utils/type";
import {
    BaseWidgetProps
} from "../common/base_props";
import {
    ScrollableProps
} from "./scrollable_props";
import {
    TopPocket
} from "./top_pocket";
import {
    BottomPocket
} from "./bottom_pocket";
import {
    nativeScrolling
} from "../../../core/utils/support";
import "../../../events/gesture/emitter.gesture.scroll";
import {
    isDxMouseWheelEvent
} from "../../../events/utils/index";
import {
    getScrollSign,
    getLocation,
    normalizeOffsetLeft
} from "./scrollable_utils";
import {
    ScrollDirection
} from "./utils/scroll_direction";
import {
    DIRECTION_VERTICAL,
    DIRECTION_HORIZONTAL,
    DIRECTION_BOTH,
    SCROLLABLE_CONTAINER_CLASS,
    SCROLLABLE_CONTENT_CLASS,
    SCROLLABLE_WRAPPER_CLASS,
    SCROLLVIEW_CONTENT_CLASS,
    SCROLLABLE_DISABLED_CLASS,
    SCROLLABLE_SCROLLBAR_SIMULATED,
    SCROLLABLE_SCROLLBARS_HIDDEN,
    TopPocketState
} from "./common/consts";
import {
    Scrollbar
} from "./scrollbar";
import {
    dxScrollInit,
    dxScrollMove,
    dxScrollEnd,
    dxScrollStop
} from "../../../events/short";
import {
    getOffsetDistance
} from "./utils/get_offset_distance";
var HIDE_SCROLLBAR_TIMEOUT = 500;
export var viewFunction = viewModel => {
    var {
        bottomPocketRef: bottomPocketRef,
        containerClientHeight: containerClientHeight,
        containerClientWidth: containerClientWidth,
        containerRef: containerRef,
        contentClientHeight: contentClientHeight,
        contentClientWidth: contentClientWidth,
        contentRef: contentRef,
        contentStyles: contentStyles,
        contentTranslateTop: contentTranslateTop,
        cssClasses: cssClasses,
        direction: direction,
        hScrollLocation: hScrollLocation,
        hScrollbarRef: hScrollbarRef,
        isLoadPanelVisible: isLoadPanelVisible,
        needForceScrollbarsVisibility: needForceScrollbarsVisibility,
        props: {
            aria: aria,
            children: children,
            disabled: disabled,
            forceGeneratePockets: forceGeneratePockets,
            height: height,
            needScrollViewContentWrapper: needScrollViewContentWrapper,
            needScrollViewLoadPanel: needScrollViewLoadPanel,
            pullDownEnabled: pullDownEnabled,
            pulledDownText: pulledDownText,
            pullingDownText: pullingDownText,
            reachBottomEnabled: reachBottomEnabled,
            reachBottomText: reachBottomText,
            refreshingText: refreshingText,
            rtlEnabled: rtlEnabled,
            scrollByThumb: scrollByThumb,
            showScrollbar: showScrollbar,
            visible: visible,
            width: width
        },
        pullDownIconAngle: pullDownIconAngle,
        pullDownOpacity: pullDownOpacity,
        pullDownTranslateTop: pullDownTranslateTop,
        refreshStrategy: refreshStrategy,
        restAttributes: restAttributes,
        scrollViewContentRef: scrollViewContentRef,
        scrollableRef: scrollableRef,
        topPocketRef: topPocketRef,
        topPocketState: topPocketState,
        topPocketTop: topPocketTop,
        useSimulatedScrollbar: useSimulatedScrollbar,
        vScrollLocation: vScrollLocation,
        vScrollbarRef: vScrollbarRef,
        windowResizeHandler: windowResizeHandler,
        wrapperRef: wrapperRef
    } = viewModel;
    return normalizeProps(createComponentVNode(2, Widget, _extends({
        rootElementRef: scrollableRef,
        aria: aria,
        classes: cssClasses,
        disabled: disabled,
        rtlEnabled: rtlEnabled,
        height: height,
        width: width,
        visible: visible,
        onDimensionChanged: windowResizeHandler
    }, restAttributes, {
        children: [createVNode(1, "div", SCROLLABLE_WRAPPER_CLASS, createVNode(1, "div", SCROLLABLE_CONTAINER_CLASS, createVNode(1, "div", SCROLLABLE_CONTENT_CLASS, [forceGeneratePockets && createComponentVNode(2, TopPocket, {
            topPocketRef: topPocketRef,
            pullingDownText: pullingDownText,
            pulledDownText: pulledDownText,
            refreshingText: refreshingText,
            pocketState: topPocketState,
            refreshStrategy: refreshStrategy,
            pullDownTranslateTop: pullDownTranslateTop,
            pullDownIconAngle: pullDownIconAngle,
            topPocketTranslateTop: contentTranslateTop,
            pullDownOpacity: pullDownOpacity,
            pocketTop: topPocketTop,
            visible: !!pullDownEnabled
        }), needScrollViewContentWrapper ? createVNode(1, "div", SCROLLVIEW_CONTENT_CLASS, children, 0, {
            style: normalizeStyles(contentStyles)
        }, null, scrollViewContentRef) : createVNode(1, "div", null, children, 0), forceGeneratePockets && createComponentVNode(2, BottomPocket, {
            bottomPocketRef: bottomPocketRef,
            reachBottomText: reachBottomText,
            visible: !!reachBottomEnabled
        })], 0, null, null, contentRef), 2, null, null, containerRef), 2, null, null, wrapperRef), needScrollViewLoadPanel && createComponentVNode(2, ScrollViewLoadPanel, {
            targetElement: scrollableRef,
            refreshingText: refreshingText,
            visible: isLoadPanelVisible
        }), showScrollbar && useSimulatedScrollbar && direction.isHorizontal && createComponentVNode(2, Scrollbar, {
            direction: "horizontal",
            scrollByThumb: scrollByThumb,
            contentSize: contentClientWidth,
            containerSize: containerClientWidth,
            scrollLocation: hScrollLocation,
            forceVisibility: needForceScrollbarsVisibility
        }, null, hScrollbarRef), showScrollbar && useSimulatedScrollbar && direction.isVertical && createComponentVNode(2, Scrollbar, {
            direction: "vertical",
            scrollByThumb: scrollByThumb,
            contentSize: contentClientHeight,
            containerSize: containerClientHeight,
            scrollLocation: vScrollLocation,
            forceVisibility: needForceScrollbarsVisibility
        }, null, vScrollbarRef)]
    })))
};
export var ScrollableNativeProps = _extends({}, ScrollableProps);
export var ScrollableNativePropsType = {
    useNative: ScrollableNativeProps.useNative,
    direction: ScrollableNativeProps.direction,
    showScrollbar: ScrollableNativeProps.showScrollbar,
    bounceEnabled: ScrollableNativeProps.bounceEnabled,
    scrollByContent: ScrollableNativeProps.scrollByContent,
    scrollByThumb: ScrollableNativeProps.scrollByThumb,
    updateManually: ScrollableNativeProps.updateManually,
    pullDownEnabled: ScrollableNativeProps.pullDownEnabled,
    reachBottomEnabled: ScrollableNativeProps.reachBottomEnabled,
    forceGeneratePockets: ScrollableNativeProps.forceGeneratePockets,
    needScrollViewContentWrapper: ScrollableNativeProps.needScrollViewContentWrapper,
    needScrollViewLoadPanel: ScrollableNativeProps.needScrollViewLoadPanel,
    aria: WidgetProps.aria,
    disabled: BaseWidgetProps.disabled,
    visible: BaseWidgetProps.visible
};
import {
    createRef as infernoCreateRef
} from "inferno";
export class ScrollableNative extends InfernoComponent {
    constructor(props) {
        super(props);
        this._currentState = null;
        this.scrollableRef = infernoCreateRef();
        this.wrapperRef = infernoCreateRef();
        this.contentRef = infernoCreateRef();
        this.scrollViewContentRef = infernoCreateRef();
        this.containerRef = infernoCreateRef();
        this.vScrollbarRef = infernoCreateRef();
        this.hScrollbarRef = infernoCreateRef();
        this.topPocketRef = infernoCreateRef();
        this.bottomPocketRef = infernoCreateRef();
        this.locked = false;
        this.loadingIndicatorEnabled = true;
        this.initPageY = 0;
        this.deltaY = 0;
        this.lastLocation = {
            top: 0,
            left: 0
        };
        this.locationTop = 0;
        this.state = {
            containerClientWidth: 0,
            containerClientHeight: 0,
            contentClientWidth: 0,
            contentClientHeight: 0,
            needForceScrollbarsVisibility: false,
            topPocketState: TopPocketState.STATE_RELEASED,
            isLoadPanelVisible: false,
            pullDownTranslateTop: 0,
            pullDownIconAngle: 0,
            pullDownOpacity: 0,
            topPocketTop: -80,
            contentTranslateTop: 0,
            vScrollLocation: 0,
            hScrollLocation: 0
        };
        this.content = this.content.bind(this);
        this.update = this.update.bind(this);
        this.refresh = this.refresh.bind(this);
        this.release = this.release.bind(this);
        this.clearReleaseTimeout = this.clearReleaseTimeout.bind(this);
        this.disposeReleaseTimeout = this.disposeReleaseTimeout.bind(this);
        this.onRelease = this.onRelease.bind(this);
        this.onUpdated = this.onUpdated.bind(this);
        this.startLoading = this.startLoading.bind(this);
        this.finishLoading = this.finishLoading.bind(this);
        this.scrollTo = this.scrollTo.bind(this);
        this.scrollBy = this.scrollBy.bind(this);
        this.scrollToElement = this.scrollToElement.bind(this);
        this.getElementLocation = this.getElementLocation.bind(this);
        this.scrollHeight = this.scrollHeight.bind(this);
        this.scrollWidth = this.scrollWidth.bind(this);
        this.scrollOffset = this.scrollOffset.bind(this);
        this.scrollTop = this.scrollTop.bind(this);
        this.scrollLeft = this.scrollLeft.bind(this);
        this.clientHeight = this.clientHeight.bind(this);
        this.clientWidth = this.clientWidth.bind(this);
        this.scrollEffect = this.scrollEffect.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.handlePocketState = this.handlePocketState.bind(this);
        this.pullDownReady = this.pullDownReady.bind(this);
        this.onReachBottom = this.onReachBottom.bind(this);
        this.onPullDown = this.onPullDown.bind(this);
        this.stateReleased = this.stateReleased.bind(this);
        this.getEventArgs = this.getEventArgs.bind(this);
        this.effectDisabledState = this.effectDisabledState.bind(this);
        this.lock = this.lock.bind(this);
        this.unlock = this.unlock.bind(this);
        this.effectResetInactiveState = this.effectResetInactiveState.bind(this);
        this.updateScrollbarSize = this.updateScrollbarSize.bind(this);
        this.windowResizeHandler = this.windowResizeHandler.bind(this);
        this.updateSizes = this.updateSizes.bind(this);
        this.moveScrollbars = this.moveScrollbars.bind(this);
        this.disposeHideScrollbarTimeout = this.disposeHideScrollbarTimeout.bind(this);
        this.clearHideScrollbarTimeout = this.clearHideScrollbarTimeout.bind(this);
        this.scrollLocation = this.scrollLocation.bind(this);
        this.initEffect = this.initEffect.bind(this);
        this.getInitEventData = this.getInitEventData.bind(this);
        this.moveEffect = this.moveEffect.bind(this);
        this.endEffect = this.endEffect.bind(this);
        this.stopEffect = this.stopEffect.bind(this);
        this.handleInit = this.handleInit.bind(this);
        this.handleMove = this.handleMove.bind(this);
        this.handleEnd = this.handleEnd.bind(this);
        this.handleStop = this.handleStop.bind(this);
        this.pullDownComplete = this.pullDownComplete.bind(this);
        this.clearRefreshTimeout = this.clearRefreshTimeout.bind(this);
        this.disposeRefreshTimeout = this.disposeRefreshTimeout.bind(this);
        this.pullDownRefreshing = this.pullDownRefreshing.bind(this);
        this.movePullDown = this.movePullDown.bind(this);
        this.getPullDownHeight = this.getPullDownHeight.bind(this);
        this.getPullDownStartPosition = this.getPullDownStartPosition.bind(this);
        this.complete = this.complete.bind(this);
        this.releaseState = this.releaseState.bind(this);
        this.isSwipeDown = this.isSwipeDown.bind(this);
        this.isPullDown = this.isPullDown.bind(this);
        this.isReachBottom = this.isReachBottom.bind(this);
        this.tryGetAllowedDirection = this.tryGetAllowedDirection.bind(this);
        this.validate = this.validate.bind(this);
        this.isLocked = this.isLocked.bind(this);
        this.isScrollingOutOfBound = this.isScrollingOutOfBound.bind(this)
    }
    createEffects() {
        return [new InfernoEffect(this.disposeReleaseTimeout, []), new InfernoEffect(this.scrollEffect, [this.props.useSimulatedScrollbar, this.props.onScroll, this.props.rtlEnabled, this.props.direction, this.props.forceGeneratePockets, this.topPocketState, this.props.reachBottomEnabled, this.props.onReachBottom, this.props.pullDownEnabled]), new InfernoEffect(this.effectDisabledState, [this.props.disabled]), new InfernoEffect(this.effectResetInactiveState, [this.props.direction]), new InfernoEffect(this.updateScrollbarSize, [this.containerClientWidth, this.containerClientHeight, this.contentClientWidth, this.contentClientHeight, this.needForceScrollbarsVisibility, this.topPocketState, this.isLoadPanelVisible, this.pullDownTranslateTop, this.pullDownIconAngle, this.pullDownOpacity, this.topPocketTop, this.contentTranslateTop, this.vScrollLocation, this.hScrollLocation, this.props.useSimulatedScrollbar, this.props.children, this.props.useNative, this.props.direction, this.props.showScrollbar, this.props.bounceEnabled, this.props.scrollByContent, this.props.scrollByThumb, this.props.updateManually, this.props.classes, this.props.pullDownEnabled, this.props.reachBottomEnabled, this.props.forceGeneratePockets, this.props.needScrollViewContentWrapper, this.props.needScrollViewLoadPanel, this.props.onScroll, this.props.onUpdated, this.props.onPullDown, this.props.onReachBottom, this.props.pullingDownText, this.props.pulledDownText, this.props.refreshingText, this.props.reachBottomText, this.props.aria, this.props.disabled, this.props.height, this.props.onKeyDown, this.props.rtlEnabled, this.props.visible, this.props.width]), new InfernoEffect(this.disposeHideScrollbarTimeout, []), new InfernoEffect(this.initEffect, [this.props.forceGeneratePockets, this.topPocketState, this.props.direction, this.props.pullDownEnabled, this.props.disabled, this.props.updateManually, this.props.onUpdated, this.props.rtlEnabled, this.props.needScrollViewContentWrapper]), new InfernoEffect(this.moveEffect, [this.props.direction, this.props.pullDownEnabled, this.props.forceGeneratePockets, this.topPocketState]), new InfernoEffect(this.endEffect, [this.props.forceGeneratePockets, this.props.pullDownEnabled, this.topPocketState, this.props.onPullDown]), new InfernoEffect(this.stopEffect, [this.props.forceGeneratePockets, this.topPocketState, this.props.onPullDown]), new InfernoEffect(this.disposeRefreshTimeout, [])]
    }
    updateEffects() {
        var _this$_effects$, _this$_effects$2, _this$_effects$3, _this$_effects$4, _this$_effects$5, _this$_effects$6, _this$_effects$7, _this$_effects$8;
        null === (_this$_effects$ = this._effects[1]) || void 0 === _this$_effects$ ? void 0 : _this$_effects$.update([this.props.useSimulatedScrollbar, this.props.onScroll, this.props.rtlEnabled, this.props.direction, this.props.forceGeneratePockets, this.topPocketState, this.props.reachBottomEnabled, this.props.onReachBottom, this.props.pullDownEnabled]);
        null === (_this$_effects$2 = this._effects[2]) || void 0 === _this$_effects$2 ? void 0 : _this$_effects$2.update([this.props.disabled]);
        null === (_this$_effects$3 = this._effects[3]) || void 0 === _this$_effects$3 ? void 0 : _this$_effects$3.update([this.props.direction]);
        null === (_this$_effects$4 = this._effects[4]) || void 0 === _this$_effects$4 ? void 0 : _this$_effects$4.update([this.containerClientWidth, this.containerClientHeight, this.contentClientWidth, this.contentClientHeight, this.needForceScrollbarsVisibility, this.topPocketState, this.isLoadPanelVisible, this.pullDownTranslateTop, this.pullDownIconAngle, this.pullDownOpacity, this.topPocketTop, this.contentTranslateTop, this.vScrollLocation, this.hScrollLocation, this.props.useSimulatedScrollbar, this.props.children, this.props.useNative, this.props.direction, this.props.showScrollbar, this.props.bounceEnabled, this.props.scrollByContent, this.props.scrollByThumb, this.props.updateManually, this.props.classes, this.props.pullDownEnabled, this.props.reachBottomEnabled, this.props.forceGeneratePockets, this.props.needScrollViewContentWrapper, this.props.needScrollViewLoadPanel, this.props.onScroll, this.props.onUpdated, this.props.onPullDown, this.props.onReachBottom, this.props.pullingDownText, this.props.pulledDownText, this.props.refreshingText, this.props.reachBottomText, this.props.aria, this.props.disabled, this.props.height, this.props.onKeyDown, this.props.rtlEnabled, this.props.visible, this.props.width]);
        null === (_this$_effects$5 = this._effects[6]) || void 0 === _this$_effects$5 ? void 0 : _this$_effects$5.update([this.props.forceGeneratePockets, this.topPocketState, this.props.direction, this.props.pullDownEnabled, this.props.disabled, this.props.updateManually, this.props.onUpdated, this.props.rtlEnabled, this.props.needScrollViewContentWrapper]);
        null === (_this$_effects$6 = this._effects[7]) || void 0 === _this$_effects$6 ? void 0 : _this$_effects$6.update([this.props.direction, this.props.pullDownEnabled, this.props.forceGeneratePockets, this.topPocketState]);
        null === (_this$_effects$7 = this._effects[8]) || void 0 === _this$_effects$7 ? void 0 : _this$_effects$7.update([this.props.forceGeneratePockets, this.props.pullDownEnabled, this.topPocketState, this.props.onPullDown]);
        null === (_this$_effects$8 = this._effects[9]) || void 0 === _this$_effects$8 ? void 0 : _this$_effects$8.update([this.props.forceGeneratePockets, this.topPocketState, this.props.onPullDown])
    }
    get containerClientWidth() {
        var state = this._currentState || this.state;
        return state.containerClientWidth
    }
    set_containerClientWidth(value) {
        this.setState(state => {
            this._currentState = state;
            var newValue = value();
            this._currentState = null;
            return {
                containerClientWidth: newValue
            }
        })
    }
    get containerClientHeight() {
        var state = this._currentState || this.state;
        return state.containerClientHeight
    }
    set_containerClientHeight(value) {
        this.setState(state => {
            this._currentState = state;
            var newValue = value();
            this._currentState = null;
            return {
                containerClientHeight: newValue
            }
        })
    }
    get contentClientWidth() {
        var state = this._currentState || this.state;
        return state.contentClientWidth
    }
    set_contentClientWidth(value) {
        this.setState(state => {
            this._currentState = state;
            var newValue = value();
            this._currentState = null;
            return {
                contentClientWidth: newValue
            }
        })
    }
    get contentClientHeight() {
        var state = this._currentState || this.state;
        return state.contentClientHeight
    }
    set_contentClientHeight(value) {
        this.setState(state => {
            this._currentState = state;
            var newValue = value();
            this._currentState = null;
            return {
                contentClientHeight: newValue
            }
        })
    }
    get needForceScrollbarsVisibility() {
        var state = this._currentState || this.state;
        return state.needForceScrollbarsVisibility
    }
    set_needForceScrollbarsVisibility(value) {
        this.setState(state => {
            this._currentState = state;
            var newValue = value();
            this._currentState = null;
            return {
                needForceScrollbarsVisibility: newValue
            }
        })
    }
    get topPocketState() {
        var state = this._currentState || this.state;
        return state.topPocketState
    }
    set_topPocketState(value) {
        this.setState(state => {
            this._currentState = state;
            var newValue = value();
            this._currentState = null;
            return {
                topPocketState: newValue
            }
        })
    }
    get isLoadPanelVisible() {
        var state = this._currentState || this.state;
        return state.isLoadPanelVisible
    }
    set_isLoadPanelVisible(value) {
        this.setState(state => {
            this._currentState = state;
            var newValue = value();
            this._currentState = null;
            return {
                isLoadPanelVisible: newValue
            }
        })
    }
    get pullDownTranslateTop() {
        var state = this._currentState || this.state;
        return state.pullDownTranslateTop
    }
    set_pullDownTranslateTop(value) {
        this.setState(state => {
            this._currentState = state;
            var newValue = value();
            this._currentState = null;
            return {
                pullDownTranslateTop: newValue
            }
        })
    }
    get pullDownIconAngle() {
        var state = this._currentState || this.state;
        return state.pullDownIconAngle
    }
    set_pullDownIconAngle(value) {
        this.setState(state => {
            this._currentState = state;
            var newValue = value();
            this._currentState = null;
            return {
                pullDownIconAngle: newValue
            }
        })
    }
    get pullDownOpacity() {
        var state = this._currentState || this.state;
        return state.pullDownOpacity
    }
    set_pullDownOpacity(value) {
        this.setState(state => {
            this._currentState = state;
            var newValue = value();
            this._currentState = null;
            return {
                pullDownOpacity: newValue
            }
        })
    }
    get topPocketTop() {
        var state = this._currentState || this.state;
        return state.topPocketTop
    }
    set_topPocketTop(value) {
        this.setState(state => {
            this._currentState = state;
            var newValue = value();
            this._currentState = null;
            return {
                topPocketTop: newValue
            }
        })
    }
    get contentTranslateTop() {
        var state = this._currentState || this.state;
        return state.contentTranslateTop
    }
    set_contentTranslateTop(value) {
        this.setState(state => {
            this._currentState = state;
            var newValue = value();
            this._currentState = null;
            return {
                contentTranslateTop: newValue
            }
        })
    }
    get vScrollLocation() {
        var state = this._currentState || this.state;
        return state.vScrollLocation
    }
    set_vScrollLocation(value) {
        this.setState(state => {
            this._currentState = state;
            var newValue = value();
            this._currentState = null;
            return {
                vScrollLocation: newValue
            }
        })
    }
    get hScrollLocation() {
        var state = this._currentState || this.state;
        return state.hScrollLocation
    }
    set_hScrollLocation(value) {
        this.setState(state => {
            this._currentState = state;
            var newValue = value();
            this._currentState = null;
            return {
                hScrollLocation: newValue
            }
        })
    }
    disposeReleaseTimeout() {
        return () => this.clearReleaseTimeout()
    }
    scrollEffect() {
        return subscribeToScrollEvent(this.containerRef.current, e => {
            this.handleScroll(e)
        })
    }
    effectDisabledState() {
        if (this.props.disabled) {
            this.lock()
        } else {
            this.unlock()
        }
    }
    effectResetInactiveState() {
        var containerEl = this.containerRef.current;
        if (this.props.direction === DIRECTION_BOTH || !isDefined(containerEl)) {
            return
        }
        containerEl[this.fullScrollInactiveProp] = 0
    }
    updateScrollbarSize() {
        this.updateSizes()
    }
    disposeHideScrollbarTimeout() {
        return () => this.clearHideScrollbarTimeout()
    }
    initEffect() {
        dxScrollInit.on(this.wrapperRef.current, e => {
            this.handleInit(e)
        }, this.getInitEventData(), {
            namespace: "dxScrollable"
        });
        return () => dxScrollInit.off(this.wrapperRef.current, {
            namespace: "dxScrollable"
        })
    }
    moveEffect() {
        dxScrollMove.on(this.wrapperRef.current, e => {
            this.handleMove(e)
        }, {
            namespace: "dxScrollable"
        });
        return () => dxScrollMove.off(this.wrapperRef.current, {
            namespace: "dxScrollable"
        })
    }
    endEffect() {
        dxScrollEnd.on(this.wrapperRef.current, () => {
            this.handleEnd()
        }, {
            namespace: "dxScrollable"
        });
        return () => dxScrollEnd.off(this.wrapperRef.current, {
            namespace: "dxScrollable"
        })
    }
    stopEffect() {
        dxScrollStop.on(this.wrapperRef.current, () => {
            this.handleStop()
        }, {
            namespace: "dxScrollable"
        });
        return () => dxScrollStop.off(this.wrapperRef.current, {
            namespace: "dxScrollable"
        })
    }
    disposeRefreshTimeout() {
        return () => this.clearRefreshTimeout()
    }
    clearReleaseTimeout() {
        clearTimeout(this.releaseTimeout);
        this.releaseTimeout = void 0
    }
    onRelease() {
        this.loadingIndicatorEnabled = true;
        this.finishLoading();
        this.onUpdated()
    }
    onUpdated() {
        var _this$props$onUpdated, _this$props;
        null === (_this$props$onUpdated = (_this$props = this.props).onUpdated) || void 0 === _this$props$onUpdated ? void 0 : _this$props$onUpdated.call(_this$props, this.getEventArgs())
    }
    startLoading() {
        if (this.loadingIndicatorEnabled) {
            this.set_isLoadPanelVisible(() => true)
        }
        this.lock()
    }
    finishLoading() {
        this.set_isLoadPanelVisible(() => false);
        this.unlock()
    }
    handleScroll(e) {
        var _this$props$onScroll, _this$props2;
        this.eventForUserAction = e;
        if (this.useSimulatedScrollbar) {
            this.moveScrollbars()
        }
        null === (_this$props$onScroll = (_this$props2 = this.props).onScroll) || void 0 === _this$props$onScroll ? void 0 : _this$props$onScroll.call(_this$props2, this.getEventArgs());
        this.lastLocation = this.scrollLocation();
        this.handlePocketState()
    }
    handlePocketState() {
        if (this.props.forceGeneratePockets) {
            if (this.topPocketState === TopPocketState.STATE_REFRESHING) {
                return
            }
            var currentLocation = -this.scrollLocation().top;
            var scrollDelta = this.locationTop - currentLocation;
            this.locationTop = currentLocation;
            if (this.isSwipeDownStrategy && scrollDelta > 0 && this.isReachBottom()) {
                this.onReachBottom();
                return
            }
            if (this.isPullDownStrategy) {
                if (this.isPullDown()) {
                    this.pullDownReady();
                    return
                }
                if (scrollDelta > 0 && this.isReachBottom()) {
                    if (this.topPocketState !== TopPocketState.STATE_LOADING) {
                        this.set_topPocketState(() => TopPocketState.STATE_LOADING);
                        this.onReachBottom()
                    }
                    return
                }
            }
            this.stateReleased()
        }
    }
    pullDownReady() {
        if (this.topPocketState === TopPocketState.STATE_READY) {
            return
        }
        this.set_topPocketState(() => TopPocketState.STATE_READY)
    }
    onReachBottom() {
        var _this$props$onReachBo, _this$props3;
        null === (_this$props$onReachBo = (_this$props3 = this.props).onReachBottom) || void 0 === _this$props$onReachBo ? void 0 : _this$props$onReachBo.call(_this$props3, {})
    }
    onPullDown() {
        var _this$props$onPullDow, _this$props4;
        null === (_this$props$onPullDow = (_this$props4 = this.props).onPullDown) || void 0 === _this$props$onPullDow ? void 0 : _this$props$onPullDow.call(_this$props4, {})
    }
    stateReleased() {
        if (this.topPocketState === TopPocketState.STATE_RELEASED) {
            return
        }
        this.releaseState()
    }
    getEventArgs() {
        var scrollOffset = this.scrollOffset();
        return _extends({
            event: this.eventForUserAction,
            scrollOffset: scrollOffset
        }, getBoundaryProps(this.props.direction, scrollOffset, this.containerRef.current, 0))
    }
    lock() {
        this.locked = true
    }
    unlock() {
        if (!this.props.disabled) {
            this.locked = false
        }
    }
    get fullScrollInactiveProp() {
        return this.props.direction === DIRECTION_HORIZONTAL ? "scrollTop" : "scrollLeft"
    }
    windowResizeHandler() {
        this.update()
    }
    updateSizes() {
        var containerEl = this.containerRef.current;
        var contentEl = this.contentRef.current;
        if (isDefined(containerEl)) {
            this.set_containerClientWidth(() => containerEl.clientWidth);
            this.set_containerClientHeight(() => containerEl.clientHeight)
        }
        if (isDefined(contentEl)) {
            this.set_contentClientWidth(() => contentEl.clientWidth);
            this.set_contentClientHeight(() => contentEl.clientHeight)
        }
    }
    moveScrollbars() {
        var {
            left: left,
            top: top
        } = this.scrollOffset();
        this.set_hScrollLocation(() => -left);
        this.set_vScrollLocation(() => -top);
        this.set_needForceScrollbarsVisibility(() => true);
        this.clearHideScrollbarTimeout();
        this.hideScrollbarTimeout = setTimeout(() => {
            this.set_needForceScrollbarsVisibility(() => false)
        }, HIDE_SCROLLBAR_TIMEOUT)
    }
    clearHideScrollbarTimeout() {
        clearTimeout(this.hideScrollbarTimeout);
        this.hideScrollbarTimeout = void 0
    }
    scrollLocation() {
        return {
            top: this.containerRef.current.scrollTop,
            left: this.containerRef.current.scrollLeft
        }
    }
    getInitEventData() {
        return {
            getDirection: this.tryGetAllowedDirection,
            validate: this.validate,
            isNative: true,
            scrollTarget: this.containerRef.current
        }
    }
    handleInit(e) {
        if (this.props.forceGeneratePockets && this.isSwipeDownStrategy) {
            if (this.topPocketState === TopPocketState.STATE_RELEASED && 0 === this.scrollLocation().top) {
                this.initPageY = e.originalEvent.pageY;
                this.set_topPocketState(() => TopPocketState.STATE_TOUCHED)
            }
        }
    }
    handleMove(e) {
        if (this.locked) {
            e.cancel = true;
            return
        }
        if (isDefined(this.tryGetAllowedDirection())) {
            e.originalEvent.isScrollingEvent = true
        }
        if (this.props.forceGeneratePockets && this.isSwipeDownStrategy) {
            this.deltaY = e.originalEvent.pageY - this.initPageY;
            if (this.topPocketState === TopPocketState.STATE_TOUCHED) {
                if (this.pullDownEnabled && this.deltaY > 0) {
                    this.set_topPocketState(() => TopPocketState.STATE_PULLED)
                } else {
                    this.complete()
                }
            }
            if (this.topPocketState === TopPocketState.STATE_PULLED) {
                e.preventDefault();
                this.movePullDown()
            }
        }
    }
    handleEnd() {
        if (this.props.forceGeneratePockets) {
            if (this.isSwipeDownStrategy) {
                if (this.isSwipeDown()) {
                    this.pullDownRefreshing()
                }
                this.complete()
            }
            if (this.isPullDownStrategy) {
                this.pullDownComplete()
            }
        }
    }
    handleStop() {
        if (this.props.forceGeneratePockets) {
            if (this.isSwipeDownStrategy) {
                this.complete()
            }
            if (this.isPullDownStrategy) {
                this.pullDownComplete()
            }
        }
    }
    pullDownComplete() {
        if (this.topPocketState === TopPocketState.STATE_READY) {
            this.set_contentTranslateTop(() => this.topPocketHeight);
            this.clearRefreshTimeout();
            this.refreshTimeout = setTimeout(() => {
                this.pullDownRefreshing()
            }, 400)
        }
    }
    clearRefreshTimeout() {
        clearTimeout(this.refreshTimeout);
        this.refreshTimeout = void 0
    }
    get topPocketHeight() {
        var _this$topPocketRef$cu;
        return (null === (_this$topPocketRef$cu = this.topPocketRef.current) || void 0 === _this$topPocketRef$cu ? void 0 : _this$topPocketRef$cu.clientHeight) || 0
    }
    pullDownRefreshing() {
        if (this.topPocketState === TopPocketState.STATE_REFRESHING) {
            return
        }
        this.set_topPocketState(() => TopPocketState.STATE_REFRESHING);
        if (this.isSwipeDownStrategy) {
            this.set_pullDownTranslateTop(() => this.getPullDownHeight())
        }
        this.onPullDown()
    }
    movePullDown() {
        var pullDownHeight = this.getPullDownHeight();
        var top = Math.min(3 * pullDownHeight, this.deltaY + this.getPullDownStartPosition());
        var angle = 180 * top / pullDownHeight / 3;
        this.set_pullDownOpacity(() => 1);
        this.set_pullDownTranslateTop(() => top);
        this.set_pullDownIconAngle(() => angle)
    }
    getPullDownHeight() {
        return Math.round(.05 * this.scrollableRef.current.offsetHeight)
    }
    getPullDownStartPosition() {
        return -Math.round(1.5 * this.topPocketRef.current.clientHeight)
    }
    complete() {
        if (this.topPocketState === TopPocketState.STATE_TOUCHED || this.topPocketState === TopPocketState.STATE_PULLED) {
            this.releaseState()
        }
    }
    releaseState() {
        this.set_topPocketState(() => TopPocketState.STATE_RELEASED);
        this.set_pullDownOpacity(() => 0)
    }
    get refreshStrategy() {
        return "android" === this.platform ? "swipeDown" : "pullDown"
    }
    get isSwipeDownStrategy() {
        return "swipeDown" === this.refreshStrategy
    }
    get isPullDownStrategy() {
        return "pullDown" === this.refreshStrategy
    }
    isSwipeDown() {
        return this.pullDownEnabled && this.topPocketState === TopPocketState.STATE_PULLED && this.deltaY >= this.getPullDownHeight() - this.getPullDownStartPosition()
    }
    isPullDown() {
        return this.pullDownEnabled && this.scrollLocation().top <= -this.topPocketHeight
    }
    isReachBottom() {
        var {
            top: top
        } = this.scrollLocation();
        return this.props.reachBottomEnabled && isReachedBottom(this.containerRef.current, top, this.bottomPocketHeight)
    }
    get bottomPocketHeight() {
        if (this.props.reachBottomEnabled && this.bottomPocketRef.current) {
            return this.bottomPocketRef.current.clientHeight
        }
        return 0
    }
    tryGetAllowedDirection() {
        var {
            isBoth: isBoth,
            isHorizontal: isHorizontal,
            isVertical: isVertical
        } = new ScrollDirection(this.props.direction);
        var contentEl = this.contentRef.current;
        var containerEl = this.containerRef.current;
        var isOverflowVertical = isVertical && contentEl.clientHeight > containerEl.clientHeight || this.pullDownEnabled;
        var isOverflowHorizontal = isHorizontal && contentEl.clientWidth > containerEl.clientWidth || this.pullDownEnabled;
        if (isBoth && isOverflowVertical && isOverflowHorizontal) {
            return DIRECTION_BOTH
        }
        if (isHorizontal && isOverflowHorizontal) {
            return DIRECTION_HORIZONTAL
        }
        if (isVertical && isOverflowVertical) {
            return DIRECTION_VERTICAL
        }
        return
    }
    isLocked() {
        return this.locked
    }
    isScrollingOutOfBound(e) {
        var {
            delta: delta,
            shiftKey: shiftKey
        } = e;
        var {
            clientHeight: clientHeight,
            clientWidth: clientWidth,
            scrollHeight: scrollHeight,
            scrollLeft: scrollLeft,
            scrollTop: scrollTop,
            scrollWidth: scrollWidth
        } = this.containerRef.current;
        if (delta > 0) {
            return shiftKey ? !scrollLeft : !scrollTop
        }
        return shiftKey ? clientWidth >= scrollWidth - scrollLeft : clientHeight >= scrollHeight - scrollTop
    }
    get cssClasses() {
        var {
            classes: classes,
            direction: direction,
            disabled: disabled,
            showScrollbar: showScrollbar
        } = this.props;
        var classesMap = {
            ["dx-scrollable dx-scrollable-native dx-scrollable-native-".concat(this.platform, " dx-scrollable-renovated")]: true,
            ["dx-scrollable-".concat(direction)]: true,
            [SCROLLABLE_DISABLED_CLASS]: !!disabled,
            [SCROLLABLE_SCROLLBAR_SIMULATED]: showScrollbar && this.useSimulatedScrollbar,
            [SCROLLABLE_SCROLLBARS_HIDDEN]: !showScrollbar,
            ["".concat(classes)]: !!classes
        };
        return combineClasses(classesMap)
    }
    get platform() {
        return devices.real().platform
    }
    get direction() {
        return new ScrollDirection(this.props.direction)
    }
    get useSimulatedScrollbar() {
        if (!isDefined(this.props.useSimulatedScrollbar)) {
            return nativeScrolling && "android" === this.platform && !browser.mozilla
        }
        return this.props.useSimulatedScrollbar
    }
    get pullDownEnabled() {
        return this.props.pullDownEnabled && "generic" !== this.platform
    }
    get contentStyles() {
        if (this.props.forceGeneratePockets && this.isPullDownStrategy) {
            return {
                transform: "translate(0px, ".concat(this.contentTranslateTop, "px)")
            }
        }
        return
    }
    get restAttributes() {
        var _this$props5 = this.props,
            restProps = _objectWithoutPropertiesLoose(_this$props5, _excluded);
        return restProps
    }
    content() {
        if (this.props.needScrollViewContentWrapper) {
            return this.scrollViewContentRef.current
        }
        return this.contentRef.current
    }
    update() {
        if (!this.props.updateManually) {
            this.updateSizes();
            this.onUpdated()
        }
    }
    refresh() {
        this.set_topPocketState(() => TopPocketState.STATE_READY);
        this.startLoading();
        this.onPullDown()
    }
    release() {
        this.clearReleaseTimeout();
        if (this.isPullDownStrategy) {
            if (this.topPocketState === TopPocketState.STATE_LOADING) {
                this.set_topPocketState(() => TopPocketState.STATE_RELEASED)
            }
        }
        this.releaseTimeout = setTimeout(() => {
            if (this.isPullDownStrategy) {
                this.set_contentTranslateTop(() => 0)
            }
            this.stateReleased();
            this.onRelease()
        }, this.isSwipeDownStrategy ? 800 : 400)
    }
    scrollTo(targetLocation) {
        var {
            direction: direction
        } = this.props;
        var distance = getOffsetDistance(targetLocation, direction, this.scrollOffset());
        this.scrollBy(distance)
    }
    scrollBy(distance) {
        var location = getAugmentedLocation(distance);
        if (!location.top && !location.left) {
            return
        }
        var containerEl = this.containerRef.current;
        if (this.direction.isVertical) {
            containerEl.scrollTop += location.top
        }
        if (this.direction.isHorizontal) {
            containerEl.scrollLeft += getScrollSign(!!this.props.rtlEnabled) * location.left
        }
    }
    scrollToElement(element) {
        if (!isDefined(element)) {
            return
        }
        var {
            left: left,
            top: top
        } = this.scrollOffset();
        element.scrollIntoView({
            block: "nearest",
            inline: "nearest"
        });
        var distance = getOffsetDistance({
            top: top,
            left: left
        }, this.props.direction, this.scrollOffset());
        var containerEl = this.containerRef.current;
        if (!this.direction.isHorizontal) {
            containerEl.scrollLeft += getScrollSign(!!this.props.rtlEnabled) * distance.left
        }
        if (!this.direction.isVertical) {
            containerEl.scrollTop += distance.top
        }
    }
    getElementLocation(element, direction, offset) {
        var scrollOffset = _extends({
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        }, offset);
        return getLocation(element, scrollOffset, direction, this.containerRef.current)
    }
    scrollHeight() {
        return this.content().offsetHeight
    }
    scrollWidth() {
        return this.content().offsetWidth
    }
    scrollOffset() {
        var {
            left: left,
            top: top
        } = this.scrollLocation();
        var scrollLeftMax = getScrollLeftMax(this.containerRef.current);
        return {
            top: top,
            left: normalizeOffsetLeft(left, scrollLeftMax, !!this.props.rtlEnabled)
        }
    }
    scrollTop() {
        return this.scrollOffset().top
    }
    scrollLeft() {
        return this.scrollOffset().left
    }
    clientHeight() {
        return this.containerRef.current.clientHeight
    }
    clientWidth() {
        return this.containerRef.current.clientWidth
    }
    validate(e) {
        var {
            disabled: disabled
        } = this.props;
        if (this.isLocked()) {
            return false
        }
        this.update();
        if (disabled || isDxMouseWheelEvent(e) && this.isScrollingOutOfBound(e)) {
            return false
        }
        return isDefined(this.tryGetAllowedDirection())
    }
    render() {
        var props = this.props;
        return viewFunction({
            props: _extends({}, props),
            containerClientWidth: this.containerClientWidth,
            containerClientHeight: this.containerClientHeight,
            contentClientWidth: this.contentClientWidth,
            contentClientHeight: this.contentClientHeight,
            needForceScrollbarsVisibility: this.needForceScrollbarsVisibility,
            topPocketState: this.topPocketState,
            isLoadPanelVisible: this.isLoadPanelVisible,
            pullDownTranslateTop: this.pullDownTranslateTop,
            pullDownIconAngle: this.pullDownIconAngle,
            pullDownOpacity: this.pullDownOpacity,
            topPocketTop: this.topPocketTop,
            contentTranslateTop: this.contentTranslateTop,
            vScrollLocation: this.vScrollLocation,
            hScrollLocation: this.hScrollLocation,
            scrollableRef: this.scrollableRef,
            wrapperRef: this.wrapperRef,
            contentRef: this.contentRef,
            scrollViewContentRef: this.scrollViewContentRef,
            containerRef: this.containerRef,
            topPocketRef: this.topPocketRef,
            bottomPocketRef: this.bottomPocketRef,
            vScrollbarRef: this.vScrollbarRef,
            hScrollbarRef: this.hScrollbarRef,
            clearReleaseTimeout: this.clearReleaseTimeout,
            onRelease: this.onRelease,
            onUpdated: this.onUpdated,
            startLoading: this.startLoading,
            finishLoading: this.finishLoading,
            handleScroll: this.handleScroll,
            handlePocketState: this.handlePocketState,
            pullDownReady: this.pullDownReady,
            onReachBottom: this.onReachBottom,
            onPullDown: this.onPullDown,
            stateReleased: this.stateReleased,
            getEventArgs: this.getEventArgs,
            lock: this.lock,
            unlock: this.unlock,
            fullScrollInactiveProp: this.fullScrollInactiveProp,
            windowResizeHandler: this.windowResizeHandler,
            updateSizes: this.updateSizes,
            moveScrollbars: this.moveScrollbars,
            clearHideScrollbarTimeout: this.clearHideScrollbarTimeout,
            scrollLocation: this.scrollLocation,
            getInitEventData: this.getInitEventData,
            handleInit: this.handleInit,
            handleMove: this.handleMove,
            handleEnd: this.handleEnd,
            handleStop: this.handleStop,
            pullDownComplete: this.pullDownComplete,
            clearRefreshTimeout: this.clearRefreshTimeout,
            topPocketHeight: this.topPocketHeight,
            pullDownRefreshing: this.pullDownRefreshing,
            movePullDown: this.movePullDown,
            getPullDownHeight: this.getPullDownHeight,
            getPullDownStartPosition: this.getPullDownStartPosition,
            complete: this.complete,
            releaseState: this.releaseState,
            refreshStrategy: this.refreshStrategy,
            isSwipeDownStrategy: this.isSwipeDownStrategy,
            isPullDownStrategy: this.isPullDownStrategy,
            isSwipeDown: this.isSwipeDown,
            isPullDown: this.isPullDown,
            isReachBottom: this.isReachBottom,
            bottomPocketHeight: this.bottomPocketHeight,
            tryGetAllowedDirection: this.tryGetAllowedDirection,
            isLocked: this.isLocked,
            isScrollingOutOfBound: this.isScrollingOutOfBound,
            cssClasses: this.cssClasses,
            platform: this.platform,
            direction: this.direction,
            useSimulatedScrollbar: this.useSimulatedScrollbar,
            pullDownEnabled: this.pullDownEnabled,
            contentStyles: this.contentStyles,
            restAttributes: this.restAttributes
        })
    }
}
ScrollableNative.defaultProps = _extends({}, ScrollableNativePropsType);
