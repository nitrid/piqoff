/**
 * DevExtreme (renovation/ui/scroll_view/animated_scrollbar.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.AnimatedScrollbar = exports.AnimatedScrollbarProps = exports.viewFunction = exports.BOUNCE_ACCELERATION_SUM = exports.BOUNCE_MIN_VELOCITY_LIMIT = exports.MIN_VELOCITY_LIMIT = exports.ACCELERATION = exports.OUT_BOUNDS_ACCELERATION = void 0;
var _inferno = require("inferno");
var _vdom = require("@devextreme/vdom");
var _type = require("../../../core/utils/type");
var _devices = _interopRequireDefault(require("../../../core/devices"));
var _scrollbar = require("./scrollbar");
var _frame = require("../../../animation/frame");
var _scrollbar_props = require("./scrollbar_props");
var _scrollable_simulated_props = require("./scrollable_simulated_props");
var _scrollable_props = require("./scrollable_props");
var _excluded = ["activeStateEnabled", "bottomPocketSize", "bounceEnabled", "containerSize", "contentSize", "contentTranslateOffsetChange", "defaultPocketState", "direction", "forceGeneratePockets", "forceUpdateScrollbarLocation", "forceVisibility", "hoverStateEnabled", "inertiaEnabled", "isScrollableHovered", "onAnimatorCancel", "onAnimatorStart", "onBounce", "onPullDown", "onReachBottom", "onRelease", "pocketState", "pocketStateChange", "pullDownEnabled", "reachBottomEnabled", "rtlEnabled", "scrollByThumb", "scrollLocation", "scrollLocationChange", "scrollableOffset", "showScrollbar", "topPocketSize"];

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
var OUT_BOUNDS_ACCELERATION = .5;
exports.OUT_BOUNDS_ACCELERATION = OUT_BOUNDS_ACCELERATION;
var isSluggishPlatform = "android" === _devices.default.real().platform;
var ACCELERATION = isSluggishPlatform ? .95 : .92;
exports.ACCELERATION = ACCELERATION;
var MIN_VELOCITY_LIMIT = 1;
exports.MIN_VELOCITY_LIMIT = MIN_VELOCITY_LIMIT;
var BOUNCE_MIN_VELOCITY_LIMIT = MIN_VELOCITY_LIMIT / 5;
exports.BOUNCE_MIN_VELOCITY_LIMIT = BOUNCE_MIN_VELOCITY_LIMIT;
var FRAME_DURATION = 17;
var BOUNCE_DURATION = isSluggishPlatform ? 300 : 400;
var BOUNCE_FRAMES = BOUNCE_DURATION / FRAME_DURATION;
var BOUNCE_ACCELERATION_SUM = (1 - Math.pow(ACCELERATION, BOUNCE_FRAMES)) / (1 - ACCELERATION);
exports.BOUNCE_ACCELERATION_SUM = BOUNCE_ACCELERATION_SUM;
var viewFunction = function(viewModel) {
    var cancel = viewModel.cancel,
        _viewModel$props = viewModel.props,
        bottomPocketSize = _viewModel$props.bottomPocketSize,
        bounceEnabled = _viewModel$props.bounceEnabled,
        containerSize = _viewModel$props.containerSize,
        contentSize = _viewModel$props.contentSize,
        contentTranslateOffsetChange = _viewModel$props.contentTranslateOffsetChange,
        direction = _viewModel$props.direction,
        forceGeneratePockets = _viewModel$props.forceGeneratePockets,
        forceUpdateScrollbarLocation = _viewModel$props.forceUpdateScrollbarLocation,
        isScrollableHovered = _viewModel$props.isScrollableHovered,
        onPullDown = _viewModel$props.onPullDown,
        onReachBottom = _viewModel$props.onReachBottom,
        onRelease = _viewModel$props.onRelease,
        pocketState = _viewModel$props.pocketState,
        pocketStateChange = _viewModel$props.pocketStateChange,
        pullDownEnabled = _viewModel$props.pullDownEnabled,
        reachBottomEnabled = _viewModel$props.reachBottomEnabled,
        rtlEnabled = _viewModel$props.rtlEnabled,
        scrollByThumb = _viewModel$props.scrollByThumb,
        scrollLocation = _viewModel$props.scrollLocation,
        scrollLocationChange = _viewModel$props.scrollLocationChange,
        scrollableOffset = _viewModel$props.scrollableOffset,
        showScrollbar = _viewModel$props.showScrollbar,
        topPocketSize = _viewModel$props.topPocketSize,
        scrollbarRef = viewModel.scrollbarRef,
        start = viewModel.start;
    return (0, _inferno.createComponentVNode)(2, _scrollbar.Scrollbar, {
        direction: direction,
        onAnimatorStart: start,
        onAnimatorCancel: cancel,
        scrollableOffset: scrollableOffset,
        contentSize: contentSize,
        containerSize: containerSize,
        isScrollableHovered: isScrollableHovered,
        scrollLocation: scrollLocation,
        scrollLocationChange: scrollLocationChange,
        contentTranslateOffsetChange: contentTranslateOffsetChange,
        scrollByThumb: scrollByThumb,
        bounceEnabled: bounceEnabled,
        showScrollbar: showScrollbar,
        forceUpdateScrollbarLocation: forceUpdateScrollbarLocation,
        rtlEnabled: rtlEnabled,
        forceGeneratePockets: forceGeneratePockets,
        topPocketSize: topPocketSize,
        bottomPocketSize: bottomPocketSize,
        onPullDown: onPullDown,
        onRelease: onRelease,
        onReachBottom: onReachBottom,
        pullDownEnabled: pullDownEnabled,
        reachBottomEnabled: reachBottomEnabled,
        pocketState: pocketState,
        pocketStateChange: pocketStateChange
    }, null, scrollbarRef)
};
exports.viewFunction = viewFunction;
var AnimatedScrollbarProps = _extends({}, _scrollbar_props.ScrollbarProps);
exports.AnimatedScrollbarProps = AnimatedScrollbarProps;
var AnimatedScrollbarPropsType = {
    activeStateEnabled: AnimatedScrollbarProps.activeStateEnabled,
    containerSize: AnimatedScrollbarProps.containerSize,
    contentSize: AnimatedScrollbarProps.contentSize,
    topPocketSize: AnimatedScrollbarProps.topPocketSize,
    bottomPocketSize: AnimatedScrollbarProps.bottomPocketSize,
    scrollableOffset: AnimatedScrollbarProps.scrollableOffset,
    isScrollableHovered: AnimatedScrollbarProps.isScrollableHovered,
    forceVisibility: AnimatedScrollbarProps.forceVisibility,
    forceUpdateScrollbarLocation: AnimatedScrollbarProps.forceUpdateScrollbarLocation,
    scrollLocation: AnimatedScrollbarProps.scrollLocation,
    onAnimatorCancel: AnimatedScrollbarProps.onAnimatorCancel,
    onPullDown: AnimatedScrollbarProps.onPullDown,
    onReachBottom: AnimatedScrollbarProps.onReachBottom,
    onRelease: AnimatedScrollbarProps.onRelease,
    defaultPocketState: AnimatedScrollbarProps.defaultPocketState,
    direction: _scrollable_props.ScrollableProps.direction,
    showScrollbar: _scrollable_props.ScrollableProps.showScrollbar,
    scrollByThumb: _scrollable_props.ScrollableProps.scrollByThumb,
    pullDownEnabled: _scrollable_props.ScrollableProps.pullDownEnabled,
    reachBottomEnabled: _scrollable_props.ScrollableProps.reachBottomEnabled,
    forceGeneratePockets: _scrollable_props.ScrollableProps.forceGeneratePockets,
    inertiaEnabled: _scrollable_simulated_props.ScrollableSimulatedProps.inertiaEnabled,
    bounceEnabled: _scrollable_simulated_props.ScrollableSimulatedProps.bounceEnabled
};
var AnimatedScrollbar = function(_BaseInfernoComponent) {
    _inheritsLoose(AnimatedScrollbar, _BaseInfernoComponent);

    function AnimatedScrollbar(props) {
        var _this;
        _this = _BaseInfernoComponent.call(this, props) || this;
        _this._currentState = null;
        _this.scrollbarRef = (0, _inferno.createRef)();
        _this.stepAnimationFrame = 0;
        _this.finished = true;
        _this.stopped = false;
        _this.velocity = 0;
        _this.animator = "inertia";
        _this.state = {
            pocketState: void 0 !== _this.props.pocketState ? _this.props.pocketState : _this.props.defaultPocketState
        };
        _this.start = _this.start.bind(_assertThisInitialized(_this));
        _this.cancel = _this.cancel.bind(_assertThisInitialized(_this));
        _this.stepCore = _this.stepCore.bind(_assertThisInitialized(_this));
        _this.getStepAnimationFrame = _this.getStepAnimationFrame.bind(_assertThisInitialized(_this));
        _this.step = _this.step.bind(_assertThisInitialized(_this));
        _this.setupBounce = _this.setupBounce.bind(_assertThisInitialized(_this));
        _this.complete = _this.complete.bind(_assertThisInitialized(_this));
        _this.stop = _this.stop.bind(_assertThisInitialized(_this));
        _this.suppressInertia = _this.suppressInertia.bind(_assertThisInitialized(_this));
        _this.crossBoundOnNextStep = _this.crossBoundOnNextStep.bind(_assertThisInitialized(_this));
        _this.inBounds = _this.inBounds.bind(_assertThisInitialized(_this));
        _this.getMaxOffset = _this.getMaxOffset.bind(_assertThisInitialized(_this));
        _this.scrollStep = _this.scrollStep.bind(_assertThisInitialized(_this));
        _this.moveTo = _this.moveTo.bind(_assertThisInitialized(_this));
        _this.stopComplete = _this.stopComplete.bind(_assertThisInitialized(_this));
        _this.scrollComplete = _this.scrollComplete.bind(_assertThisInitialized(_this));
        _this.boundLocation = _this.boundLocation.bind(_assertThisInitialized(_this));
        _this.getMinOffset = _this.getMinOffset.bind(_assertThisInitialized(_this));
        _this.validateEvent = _this.validateEvent.bind(_assertThisInitialized(_this));
        _this.isThumb = _this.isThumb.bind(_assertThisInitialized(_this));
        _this.reachedMin = _this.reachedMin.bind(_assertThisInitialized(_this));
        _this.reachedMax = _this.reachedMax.bind(_assertThisInitialized(_this));
        _this.initHandler = _this.initHandler.bind(_assertThisInitialized(_this));
        _this.startHandler = _this.startHandler.bind(_assertThisInitialized(_this));
        _this.moveHandler = _this.moveHandler.bind(_assertThisInitialized(_this));
        _this.endHandler = _this.endHandler.bind(_assertThisInitialized(_this));
        _this.stopHandler = _this.stopHandler.bind(_assertThisInitialized(_this));
        _this.scrollByHandler = _this.scrollByHandler.bind(_assertThisInitialized(_this));
        _this.releaseHandler = _this.releaseHandler.bind(_assertThisInitialized(_this));
        return _this
    }
    var _proto = AnimatedScrollbar.prototype;
    _proto.set_pocketState = function(value) {
        var _this2 = this;
        this.setState((function(state) {
            var _this2$props$pocketSt, _this2$props;
            _this2._currentState = state;
            var newValue = value();
            null === (_this2$props$pocketSt = (_this2$props = _this2.props).pocketStateChange) || void 0 === _this2$props$pocketSt ? void 0 : _this2$props$pocketSt.call(_this2$props, newValue);
            _this2._currentState = null;
            return {
                pocketState: newValue
            }
        }))
    };
    _proto.start = function(animatorName, receivedVelocity, thumbScrolling, crossThumbScrolling) {
        this.animator = animatorName;
        if (this.isBounceAnimator) {
            var _this$props$onBounce, _this$props;
            null === (_this$props$onBounce = (_this$props = this.props).onBounce) || void 0 === _this$props$onBounce ? void 0 : _this$props$onBounce.call(_this$props);
            this.setupBounce()
        } else {
            if (!thumbScrolling && crossThumbScrolling) {
                this.velocity = 0
            } else {
                this.velocity = receivedVelocity || 0
            }
            this.suppressInertia(thumbScrolling)
        }
        this.stopped = false;
        this.finished = false;
        this.stepCore()
    };
    _proto.cancel = function() {
        this.stopped = true;
        (0, _frame.cancelAnimationFrame)(this.stepAnimationFrame)
    };
    _proto.stepCore = function() {
        if (this.stopped) {
            this.stop();
            return
        }
        if (this.isFinished) {
            this.finished = true;
            this.complete();
            return
        }
        this.step();
        this.stepAnimationFrame = this.getStepAnimationFrame()
    };
    _proto.getStepAnimationFrame = function() {
        return (0, _frame.requestAnimationFrame)(this.stepCore)
    };
    _proto.step = function() {
        if (!this.props.bounceEnabled && !this.inBounds()) {
            this.velocity = 0
        }
        this.scrollStep(this.velocity);
        this.velocity *= this.acceleration
    };
    _proto.setupBounce = function() {
        var bounceDistance = this.boundLocation() - this.props.scrollLocation;
        this.velocity = bounceDistance / BOUNCE_ACCELERATION_SUM
    };
    _proto.complete = function() {
        if (this.isBounceAnimator) {
            this.moveTo(this.boundLocation())
        }
        this.scrollComplete()
    };
    _proto.stop = function() {
        this.stopComplete()
    };
    _proto.suppressInertia = function(thumbScrolling) {
        if (!this.props.inertiaEnabled || thumbScrolling) {
            this.velocity = 0
        }
    };
    _proto.crossBoundOnNextStep = function() {
        var location = this.props.scrollLocation;
        var nextLocation = location + this.velocity;
        var minOffset = this.getMinOffset();
        var maxOffset = this.getMaxOffset();
        return location < minOffset && nextLocation >= minOffset || location > maxOffset && nextLocation <= maxOffset
    };
    _proto.inBounds = function() {
        var scrollbar = this.scrollbarRef.current;
        if (!(0, _type.isDefined)(scrollbar)) {
            return false
        }
        return scrollbar.inBounds()
    };
    _proto.getMaxOffset = function() {
        return this.scrollbar.getMaxOffset()
    };
    _proto.scrollStep = function(delta) {
        this.scrollbar.scrollStep(delta)
    };
    _proto.moveTo = function(location) {
        this.scrollbar.moveTo(location)
    };
    _proto.stopComplete = function() {
        this.scrollbar.stopComplete()
    };
    _proto.scrollComplete = function() {
        this.scrollbar.scrollComplete()
    };
    _proto.boundLocation = function(value) {
        return this.scrollbar.boundLocation(value)
    };
    _proto.getMinOffset = function() {
        return this.scrollbar.getMinOffset()
    };
    _proto.validateEvent = function(e) {
        return this.scrollbar.validateEvent(e)
    };
    _proto.isThumb = function(element) {
        return this.scrollbar.isThumb(element)
    };
    _proto.reachedMin = function() {
        return this.scrollbar.reachedMin()
    };
    _proto.reachedMax = function() {
        return this.scrollbar.reachedMax()
    };
    _proto.initHandler = function(e, crossThumbScrolling) {
        this.scrollbar.initHandler(e, crossThumbScrolling)
    };
    _proto.startHandler = function() {
        this.scrollbar.startHandler()
    };
    _proto.moveHandler = function(delta) {
        this.scrollbar.moveHandler(delta)
    };
    _proto.endHandler = function(velocity) {
        this.scrollbar.endHandler(velocity)
    };
    _proto.stopHandler = function() {
        this.scrollbar.stopHandler()
    };
    _proto.scrollByHandler = function(delta) {
        this.scrollbar.scrollByHandler(delta)
    };
    _proto.releaseHandler = function() {
        this.scrollbar.releaseHandler()
    };
    _proto.render = function() {
        var props = this.props;
        return viewFunction({
            props: _extends({}, props, {
                pocketState: this.__state_pocketState
            }),
            scrollbarRef: this.scrollbarRef,
            start: this.start,
            cancel: this.cancel,
            stepCore: this.stepCore,
            getStepAnimationFrame: this.getStepAnimationFrame,
            step: this.step,
            setupBounce: this.setupBounce,
            complete: this.complete,
            isBounceAnimator: this.isBounceAnimator,
            isFinished: this.isFinished,
            inProgress: this.inProgress,
            acceleration: this.acceleration,
            stop: this.stop,
            suppressInertia: this.suppressInertia,
            crossBoundOnNextStep: this.crossBoundOnNextStep,
            inBounds: this.inBounds,
            getMaxOffset: this.getMaxOffset,
            scrollStep: this.scrollStep,
            moveTo: this.moveTo,
            stopComplete: this.stopComplete,
            scrollComplete: this.scrollComplete,
            scrollbar: this.scrollbar,
            restAttributes: this.restAttributes
        })
    };
    _createClass(AnimatedScrollbar, [{
        key: "__state_pocketState",
        get: function() {
            var state = this._currentState || this.state;
            return void 0 !== this.props.pocketState ? this.props.pocketState : state.pocketState
        }
    }, {
        key: "isBounceAnimator",
        get: function() {
            return "bounce" === this.animator
        }
    }, {
        key: "isFinished",
        get: function() {
            if (this.isBounceAnimator) {
                return this.crossBoundOnNextStep() || Math.abs(this.velocity) <= BOUNCE_MIN_VELOCITY_LIMIT
            }
            return Math.abs(this.velocity) <= MIN_VELOCITY_LIMIT
        }
    }, {
        key: "inProgress",
        get: function() {
            return !(this.stopped || this.finished)
        }
    }, {
        key: "acceleration",
        get: function() {
            var _this$scrollbarRef;
            if (!(0, _type.isDefined)(null === (_this$scrollbarRef = this.scrollbarRef) || void 0 === _this$scrollbarRef ? void 0 : _this$scrollbarRef.current)) {
                return 0
            }
            return this.inBounds() || this.isBounceAnimator ? ACCELERATION : OUT_BOUNDS_ACCELERATION
        }
    }, {
        key: "scrollbar",
        get: function() {
            return this.scrollbarRef.current
        }
    }, {
        key: "restAttributes",
        get: function() {
            var _this$props$pocketSta = _extends({}, this.props, {
                    pocketState: this.__state_pocketState
                }),
                restProps = (_this$props$pocketSta.activeStateEnabled, _this$props$pocketSta.bottomPocketSize, _this$props$pocketSta.bounceEnabled, _this$props$pocketSta.containerSize, _this$props$pocketSta.contentSize, _this$props$pocketSta.contentTranslateOffsetChange, _this$props$pocketSta.defaultPocketState, _this$props$pocketSta.direction, _this$props$pocketSta.forceGeneratePockets, _this$props$pocketSta.forceUpdateScrollbarLocation, _this$props$pocketSta.forceVisibility, _this$props$pocketSta.hoverStateEnabled, _this$props$pocketSta.inertiaEnabled, _this$props$pocketSta.isScrollableHovered, _this$props$pocketSta.onAnimatorCancel, _this$props$pocketSta.onAnimatorStart, _this$props$pocketSta.onBounce, _this$props$pocketSta.onPullDown, _this$props$pocketSta.onReachBottom, _this$props$pocketSta.onRelease, _this$props$pocketSta.pocketState, _this$props$pocketSta.pocketStateChange, _this$props$pocketSta.pullDownEnabled, _this$props$pocketSta.reachBottomEnabled, _this$props$pocketSta.rtlEnabled, _this$props$pocketSta.scrollByThumb, _this$props$pocketSta.scrollLocation, _this$props$pocketSta.scrollLocationChange, _this$props$pocketSta.scrollableOffset, _this$props$pocketSta.showScrollbar, _this$props$pocketSta.topPocketSize, _objectWithoutProperties(_this$props$pocketSta, _excluded));
            return restProps
        }
    }]);
    return AnimatedScrollbar
}(_vdom.BaseInfernoComponent);
exports.AnimatedScrollbar = AnimatedScrollbar;
AnimatedScrollbar.defaultProps = _extends({}, AnimatedScrollbarPropsType);
