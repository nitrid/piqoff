/**
 * DevExtreme (esm/ui/popover.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import $ from "../core/renderer";
import {
    getWindow,
    hasWindow
} from "../core/utils/window";
var window = getWindow();
import {
    getPublicElement
} from "../core/element";
import domAdapter from "../core/dom_adapter";
import eventsEngine from "../events/core/events_engine";
import registerComponent from "../core/component_registrator";
import {
    noop,
    pairToObject
} from "../core/utils/common";
import {
    extend
} from "../core/utils/extend";
import {
    move
} from "../animation/translator";
import positionUtils from "../animation/position";
import {
    isObject,
    isString
} from "../core/utils/type";
import {
    fitIntoRange
} from "../core/utils/math";
import {
    addNamespace
} from "../events/utils/index";
import Popup from "./popup";
import {
    getBoundingRect
} from "../core/utils/position";
import {
    POPOVER_BOUNDARY_OFFSET
} from "./popover_contants";
var POPOVER_CLASS = "dx-popover";
var POPOVER_WRAPPER_CLASS = "dx-popover-wrapper";
var POPOVER_ARROW_CLASS = "dx-popover-arrow";
var POPOVER_WITHOUT_TITLE_CLASS = "dx-popover-without-title";
var POSITION_FLIP_MAP = {
    left: "right",
    top: "bottom",
    right: "left",
    bottom: "top",
    center: "center"
};
var WEIGHT_OF_SIDES = {
    left: -1,
    top: -1,
    center: 0,
    right: 1,
    bottom: 1
};
var POSITION_ALIASES = {
    top: {
        my: "bottom center",
        at: "top center",
        collision: "fit flip"
    },
    bottom: {
        my: "top center",
        at: "bottom center",
        collision: "fit flip"
    },
    right: {
        my: "left center",
        at: "right center",
        collision: "flip fit"
    },
    left: {
        my: "right center",
        at: "left center",
        collision: "flip fit"
    }
};
var SIDE_BORDER_WIDTH_STYLES = {
    left: "borderLeftWidth",
    top: "borderTopWidth",
    right: "borderRightWidth",
    bottom: "borderBottomWidth"
};
var getEventNameByOption = function(optionValue) {
    return isObject(optionValue) ? optionValue.name : optionValue
};
var getEventName = function(that, optionName) {
    var optionValue = that.option(optionName);
    return getEventNameByOption(optionValue)
};
var getEventDelay = function(that, optionName) {
    var optionValue = that.option(optionName);
    return isObject(optionValue) && optionValue.delay
};
var attachEvent = function(that, name) {
    var target = that.option("target");
    var isSelector = isString(target);
    var event = getEventName(that, name + "Event");
    if (!event || that.option("disabled")) {
        return
    }
    var eventName = addNamespace(event, that.NAME);
    var action = that._createAction(function() {
        var delay = getEventDelay(that, name + "Event");
        this._clearEventsTimeouts();
        if (delay) {
            this._timeouts[name] = setTimeout((function() {
                that[name]()
            }), delay)
        } else {
            that[name]()
        }
    }.bind(that), {
        validatingTargetName: "target"
    });
    var handler = function(e) {
        action({
            event: e,
            target: $(e.currentTarget)
        })
    };
    var EVENT_HANDLER_NAME = "_" + name + "EventHandler";
    if (isSelector) {
        that[EVENT_HANDLER_NAME] = handler;
        eventsEngine.on(domAdapter.getDocument(), eventName, target, handler)
    } else {
        var targetElement = getPublicElement($(target));
        that[EVENT_HANDLER_NAME] = void 0;
        eventsEngine.on(targetElement, eventName, handler)
    }
};
var detachEvent = function(that, target, name, event) {
    var eventName = event || getEventName(that, name + "Event");
    if (!eventName) {
        return
    }
    eventName = addNamespace(eventName, that.NAME);
    var EVENT_HANDLER_NAME = "_" + name + "EventHandler";
    if (that[EVENT_HANDLER_NAME]) {
        eventsEngine.off(domAdapter.getDocument(), eventName, target, that[EVENT_HANDLER_NAME])
    } else {
        eventsEngine.off(getPublicElement($(target)), eventName)
    }
};
var Popover = Popup.inherit({
    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            target: window,
            shading: false,
            position: "bottom",
            closeOnOutsideClick: true,
            animation: {
                show: {
                    type: "fade",
                    from: 0,
                    to: 1
                },
                hide: {
                    type: "fade",
                    to: 0
                }
            },
            showTitle: false,
            width: "auto",
            height: "auto",
            dragEnabled: false,
            resizeEnabled: false,
            fullScreen: false,
            closeOnTargetScroll: true,
            arrowPosition: "",
            arrowOffset: 0,
            boundaryOffset: {
                h: POPOVER_BOUNDARY_OFFSET,
                v: POPOVER_BOUNDARY_OFFSET
            },
            _fixedPosition: true
        })
    },
    _defaultOptionsRules: function() {
        return [{
            device: {
                platform: "ios"
            },
            options: {
                arrowPosition: {
                    boundaryOffset: {
                        h: 20,
                        v: -10
                    },
                    collision: "fit"
                }
            }
        }, {
            device: function() {
                return !hasWindow()
            },
            options: {
                animation: null
            }
        }]
    },
    _init: function() {
        this.callBase();
        this._renderArrow();
        this._timeouts = {};
        this.$element().addClass(POPOVER_CLASS);
        this.$wrapper().addClass(POPOVER_WRAPPER_CLASS)
    },
    _render: function() {
        this.callBase.apply(this, arguments);
        this._detachEvents(this.option("target"));
        this._attachEvents()
    },
    _detachEvents: function(target) {
        detachEvent(this, target, "show");
        detachEvent(this, target, "hide")
    },
    _attachEvents: function() {
        attachEvent(this, "show");
        attachEvent(this, "hide")
    },
    _renderArrow: function() {
        this._$arrow = $("<div>").addClass(POPOVER_ARROW_CLASS).prependTo(this.$overlayContent())
    },
    _documentDownHandler: function(e) {
        if (this._isOutsideClick(e)) {
            return this.callBase(e)
        }
        return true
    },
    _isOutsideClick: function(e) {
        return !$(e.target).closest(this.option("target")).length
    },
    _animate: function(animation) {
        if (animation && animation.to && "object" === typeof animation.to) {
            extend(animation.to, {
                position: this._getContainerPosition()
            })
        }
        this.callBase.apply(this, arguments)
    },
    _stopAnimation: function() {
        this.callBase.apply(this, arguments)
    },
    _renderTitle: function() {
        this.$wrapper().toggleClass(POPOVER_WITHOUT_TITLE_CLASS, !this.option("showTitle"));
        this.callBase()
    },
    _renderPosition: function() {
        this.callBase();
        this._renderOverlayPosition()
    },
    _renderOverlayBoundaryOffset: noop,
    _renderOverlayPosition: function() {
        this._resetOverlayPosition();
        this._updateContentSize();
        var contentPosition = this._getContainerPosition();
        var resultLocation = positionUtils.setup(this.$overlayContent(), contentPosition);
        var positionSide = this._getSideByLocation(resultLocation);
        this._togglePositionClass("dx-position-" + positionSide);
        this._toggleFlippedClass(resultLocation.h.flip, resultLocation.v.flip);
        var isArrowVisible = this._isHorizontalSide() || this._isVerticalSide();
        if (isArrowVisible) {
            this._renderArrowPosition(positionSide)
        }
    },
    _resetOverlayPosition: function() {
        this._setContentHeight(true);
        this._togglePositionClass("dx-position-" + this._positionSide);
        move(this.$overlayContent(), {
            left: 0,
            top: 0
        });
        this._$arrow.css({
            top: "auto",
            right: "auto",
            bottom: "auto",
            left: "auto"
        })
    },
    _updateContentSize: function() {
        if (!this.$content()) {
            return
        }
        var containerLocation = positionUtils.calculate(this.$overlayContent(), this._getContainerPosition());
        if (containerLocation.h.oversize > 0 && this._isHorizontalSide() && !containerLocation.h.fit) {
            var newContainerWidth = this.$overlayContent().width() - containerLocation.h.oversize;
            this.$overlayContent().width(newContainerWidth)
        }
        if (containerLocation.v.oversize > 0 && this._isVerticalSide() && !containerLocation.v.fit) {
            var newOverlayContentHeight = this.$overlayContent().height() - containerLocation.v.oversize;
            var newPopupContentHeight = this.$content().height() - containerLocation.v.oversize;
            this.$overlayContent().height(newOverlayContentHeight);
            this.$content().height(newPopupContentHeight)
        }
    },
    _getContainerPosition: function() {
        var offset = pairToObject(this._position.offset || "");
        var hOffset = offset.h;
        var vOffset = offset.v;
        var isVerticalSide = this._isVerticalSide();
        var isHorizontalSide = this._isHorizontalSide();
        if (isVerticalSide || isHorizontalSide) {
            var isPopoverInside = this._isPopoverInside();
            var sign = (isPopoverInside ? -1 : 1) * WEIGHT_OF_SIDES[this._positionSide];
            var arrowSize = isVerticalSide ? this._$arrow.height() : this._$arrow.width();
            var arrowSizeCorrection = this._getContentBorderWidth(this._positionSide);
            var arrowOffset = sign * (arrowSize - arrowSizeCorrection);
            isVerticalSide ? vOffset += arrowOffset : hOffset += arrowOffset
        }
        return extend({}, this._position, {
            offset: hOffset + " " + vOffset
        })
    },
    _getContentBorderWidth: function(side) {
        var borderWidth = this.$overlayContent().css(SIDE_BORDER_WIDTH_STYLES[side]);
        return parseInt(borderWidth) || 0
    },
    _getSideByLocation: function(location) {
        var isFlippedByVertical = location.v.flip;
        var isFlippedByHorizontal = location.h.flip;
        return this._isVerticalSide() && isFlippedByVertical || this._isHorizontalSide() && isFlippedByHorizontal || this._isPopoverInside() ? POSITION_FLIP_MAP[this._positionSide] : this._positionSide
    },
    _togglePositionClass: function(positionClass) {
        this.$wrapper().removeClass("dx-position-left dx-position-right dx-position-top dx-position-bottom").addClass(positionClass)
    },
    _toggleFlippedClass: function(isFlippedHorizontal, isFlippedVertical) {
        this.$wrapper().toggleClass("dx-popover-flipped-horizontal", isFlippedHorizontal).toggleClass("dx-popover-flipped-vertical", isFlippedVertical)
    },
    _renderArrowPosition: function(side) {
        var arrowRect = getBoundingRect(this._$arrow.get(0));
        var arrowFlip = -(this._isVerticalSide(side) ? arrowRect.height : arrowRect.width);
        this._$arrow.css(POSITION_FLIP_MAP[side], arrowFlip);
        var axis = this._isVerticalSide(side) ? "left" : "top";
        var sizeProperty = this._isVerticalSide(side) ? "width" : "height";
        var $target = $(this._position.of);
        var targetOffset = positionUtils.offset($target) || {
            top: 0,
            left: 0
        };
        var contentOffset = positionUtils.offset(this.$overlayContent());
        var arrowSize = arrowRect[sizeProperty];
        var contentLocation = contentOffset[axis];
        var contentSize = getBoundingRect(this.$overlayContent().get(0))[sizeProperty];
        var targetLocation = targetOffset[axis];
        var targetSize = $target.get(0).preventDefault ? 0 : getBoundingRect($target.get(0))[sizeProperty];
        var min = Math.max(contentLocation, targetLocation);
        var max = Math.min(contentLocation + contentSize, targetLocation + targetSize);
        var arrowLocation;
        if ("start" === this.option("arrowPosition")) {
            arrowLocation = min - contentLocation
        } else if ("end" === this.option("arrowPosition")) {
            arrowLocation = max - contentLocation - arrowSize
        } else {
            arrowLocation = (min + max) / 2 - contentLocation - arrowSize / 2
        }
        var borderWidth = this._getContentBorderWidth(side);
        var finalArrowLocation = fitIntoRange(arrowLocation - borderWidth + this.option("arrowOffset"), borderWidth, contentSize - arrowSize - 2 * borderWidth);
        this._$arrow.css(axis, finalArrowLocation)
    },
    _isPopoverInside: function() {
        var position = this._transformStringPosition(this.option("position"), POSITION_ALIASES);
        var my = positionUtils.setup.normalizeAlign(position.my);
        var at = positionUtils.setup.normalizeAlign(position.at);
        return my.h === at.h && my.v === at.v
    },
    _setContentHeight: function(fullUpdate) {
        if (fullUpdate) {
            this.callBase()
        }
    },
    _renderWrapperPosition: function() {
        if (this.option("shading")) {
            this.$wrapper().css({
                top: 0,
                left: 0
            })
        }
    },
    _renderWrapperDimensions: function() {
        if (this.option("shading")) {
            this.$wrapper().css({
                width: "100%",
                height: "100%"
            })
        }
    },
    _normalizePosition: function() {
        var position = extend({}, this._transformStringPosition(this.option("position"), POSITION_ALIASES));
        if (!position.of) {
            position.of = this.option("target")
        }
        if (!position.collision) {
            position.collision = "flip"
        }
        if (!position.boundaryOffset) {
            position.boundaryOffset = this.option("boundaryOffset")
        }
        this._positionSide = this._getDisplaySide(position);
        this._position = position
    },
    _getDisplaySide: function(position) {
        var my = positionUtils.setup.normalizeAlign(position.my);
        var at = positionUtils.setup.normalizeAlign(position.at);
        var weightSign = WEIGHT_OF_SIDES[my.h] === WEIGHT_OF_SIDES[at.h] && WEIGHT_OF_SIDES[my.v] === WEIGHT_OF_SIDES[at.v] ? -1 : 1;
        var horizontalWeight = Math.abs(WEIGHT_OF_SIDES[my.h] - weightSign * WEIGHT_OF_SIDES[at.h]);
        var verticalWeight = Math.abs(WEIGHT_OF_SIDES[my.v] - weightSign * WEIGHT_OF_SIDES[at.v]);
        return horizontalWeight > verticalWeight ? at.h : at.v
    },
    _isVerticalSide: function(side) {
        side = side || this._positionSide;
        return "top" === side || "bottom" === side
    },
    _isHorizontalSide: function(side) {
        side = side || this._positionSide;
        return "left" === side || "right" === side
    },
    _clearEventTimeout: function(name) {
        clearTimeout(this._timeouts[name])
    },
    _clearEventsTimeouts: function() {
        this._clearEventTimeout("show");
        this._clearEventTimeout("hide")
    },
    _clean: function() {
        this._detachEvents(this.option("target"));
        this.callBase.apply(this, arguments)
    },
    _optionChanged: function(args) {
        switch (args.name) {
            case "boundaryOffset":
            case "arrowPosition":
            case "arrowOffset":
                this._renderGeometry();
                break;
            case "fullScreen":
                if (args.value) {
                    this.option("fullScreen", false)
                }
                break;
            case "target":
                args.previousValue && this._detachEvents(args.previousValue);
                this.callBase(args);
                break;
            case "showEvent":
            case "hideEvent":
                var name = args.name.substring(0, 4);
                var event = getEventNameByOption(args.previousValue);
                this.hide();
                detachEvent(this, this.option("target"), name, event);
                attachEvent(this, name);
                break;
            case "visible":
                this._clearEventTimeout(args.value ? "show" : "hide");
                this.callBase(args);
                break;
            default:
                this.callBase(args)
        }
    },
    show: function(target) {
        if (target) {
            this.option("target", target)
        }
        return this.callBase()
    }
});
registerComponent("dxPopover", Popover);
export default Popover;
