/**
 * DevExtreme (cjs/renovation/ui/scroll_view/scrollable.j.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../../core/component_registrator"));
var _component = _interopRequireDefault(require("../../component_wrapper/component"));
var _scrollable = require("./scrollable");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
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
var Scrollable = function(_BaseComponent) {
    _inheritsLoose(Scrollable, _BaseComponent);

    function Scrollable() {
        return _BaseComponent.apply(this, arguments) || this
    }
    var _proto = Scrollable.prototype;
    _proto.content = function() {
        var _this$viewRef;
        return this._toPublicElement(null === (_this$viewRef = this.viewRef) || void 0 === _this$viewRef ? void 0 : _this$viewRef.content())
    };
    _proto.scrollBy = function(distance) {
        var _this$viewRef2;
        return null === (_this$viewRef2 = this.viewRef) || void 0 === _this$viewRef2 ? void 0 : _this$viewRef2.scrollBy(distance)
    };
    _proto.update = function() {
        var _this$viewRef3;
        return null === (_this$viewRef3 = this.viewRef) || void 0 === _this$viewRef3 ? void 0 : _this$viewRef3.update()
    };
    _proto.release = function() {
        var _this$viewRef4;
        return null === (_this$viewRef4 = this.viewRef) || void 0 === _this$viewRef4 ? void 0 : _this$viewRef4.release()
    };
    _proto.refresh = function() {
        var _this$viewRef5;
        return null === (_this$viewRef5 = this.viewRef) || void 0 === _this$viewRef5 ? void 0 : _this$viewRef5.refresh()
    };
    _proto.scrollTo = function(targetLocation) {
        var _this$viewRef6;
        return null === (_this$viewRef6 = this.viewRef) || void 0 === _this$viewRef6 ? void 0 : _this$viewRef6.scrollTo(targetLocation)
    };
    _proto.scrollToElement = function(element) {
        var _this$viewRef7;
        return null === (_this$viewRef7 = this.viewRef) || void 0 === _this$viewRef7 ? void 0 : _this$viewRef7.scrollToElement(this._patchElementParam(element))
    };
    _proto.scrollHeight = function() {
        var _this$viewRef8;
        return null === (_this$viewRef8 = this.viewRef) || void 0 === _this$viewRef8 ? void 0 : _this$viewRef8.scrollHeight()
    };
    _proto.scrollWidth = function() {
        var _this$viewRef9;
        return null === (_this$viewRef9 = this.viewRef) || void 0 === _this$viewRef9 ? void 0 : _this$viewRef9.scrollWidth()
    };
    _proto.scrollOffset = function() {
        var _this$viewRef10;
        return null === (_this$viewRef10 = this.viewRef) || void 0 === _this$viewRef10 ? void 0 : _this$viewRef10.scrollOffset()
    };
    _proto.scrollTop = function() {
        var _this$viewRef11;
        return null === (_this$viewRef11 = this.viewRef) || void 0 === _this$viewRef11 ? void 0 : _this$viewRef11.scrollTop()
    };
    _proto.scrollLeft = function() {
        var _this$viewRef12;
        return null === (_this$viewRef12 = this.viewRef) || void 0 === _this$viewRef12 ? void 0 : _this$viewRef12.scrollLeft()
    };
    _proto.clientHeight = function() {
        var _this$viewRef13;
        return null === (_this$viewRef13 = this.viewRef) || void 0 === _this$viewRef13 ? void 0 : _this$viewRef13.clientHeight()
    };
    _proto.clientWidth = function() {
        var _this$viewRef14;
        return null === (_this$viewRef14 = this.viewRef) || void 0 === _this$viewRef14 ? void 0 : _this$viewRef14.clientWidth()
    };
    _proto.getScrollElementPosition = function(element, direction) {
        var _this$viewRef15;
        return null === (_this$viewRef15 = this.viewRef) || void 0 === _this$viewRef15 ? void 0 : _this$viewRef15.getScrollElementPosition(this._patchElementParam(element), direction)
    };
    _proto._getActionConfigs = function() {
        return {
            onScroll: {},
            onUpdated: {},
            onPullDown: {},
            onReachBottom: {},
            onStart: {},
            onEnd: {},
            onBounce: {},
            onStop: {}
        }
    };
    _createClass(Scrollable, [{
        key: "_propsInfo",
        get: function() {
            return {
                twoWay: [],
                allowNull: [],
                elements: [],
                templates: [],
                props: ["useNative", "direction", "showScrollbar", "bounceEnabled", "scrollByContent", "scrollByThumb", "updateManually", "classes", "pullDownEnabled", "reachBottomEnabled", "forceGeneratePockets", "needScrollViewContentWrapper", "needScrollViewLoadPanel", "onScroll", "onUpdated", "onPullDown", "onReachBottom", "pullingDownText", "pulledDownText", "refreshingText", "reachBottomText", "aria", "disabled", "height", "rtlEnabled", "visible", "width", "useSimulatedScrollbar", "inertiaEnabled", "useKeyboard", "onStart", "onEnd", "onBounce", "onStop"]
            }
        }
    }, {
        key: "_viewComponent",
        get: function() {
            return _scrollable.Scrollable
        }
    }]);
    return Scrollable
}(_component.default);
exports.default = Scrollable;
(0, _component_registrator.default)("dxScrollable", Scrollable);
module.exports = exports.default;
module.exports.default = exports.default;
