/**
 * DevExtreme (esm/renovation/ui/scroll_view/scrollable.j.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import registerComponent from "../../../core/component_registrator";
import BaseComponent from "../../component_wrapper/component";
import {
    Scrollable as ScrollableComponent
} from "./scrollable";
export default class Scrollable extends BaseComponent {
    content() {
        var _this$viewRef;
        return this._toPublicElement(null === (_this$viewRef = this.viewRef) || void 0 === _this$viewRef ? void 0 : _this$viewRef.content())
    }
    scrollBy(distance) {
        var _this$viewRef2;
        return null === (_this$viewRef2 = this.viewRef) || void 0 === _this$viewRef2 ? void 0 : _this$viewRef2.scrollBy(distance)
    }
    update() {
        var _this$viewRef3;
        return null === (_this$viewRef3 = this.viewRef) || void 0 === _this$viewRef3 ? void 0 : _this$viewRef3.update()
    }
    release() {
        var _this$viewRef4;
        return null === (_this$viewRef4 = this.viewRef) || void 0 === _this$viewRef4 ? void 0 : _this$viewRef4.release()
    }
    refresh() {
        var _this$viewRef5;
        return null === (_this$viewRef5 = this.viewRef) || void 0 === _this$viewRef5 ? void 0 : _this$viewRef5.refresh()
    }
    scrollTo(targetLocation) {
        var _this$viewRef6;
        return null === (_this$viewRef6 = this.viewRef) || void 0 === _this$viewRef6 ? void 0 : _this$viewRef6.scrollTo(targetLocation)
    }
    scrollToElement(element) {
        var _this$viewRef7;
        return null === (_this$viewRef7 = this.viewRef) || void 0 === _this$viewRef7 ? void 0 : _this$viewRef7.scrollToElement(this._patchElementParam(element))
    }
    scrollHeight() {
        var _this$viewRef8;
        return null === (_this$viewRef8 = this.viewRef) || void 0 === _this$viewRef8 ? void 0 : _this$viewRef8.scrollHeight()
    }
    scrollWidth() {
        var _this$viewRef9;
        return null === (_this$viewRef9 = this.viewRef) || void 0 === _this$viewRef9 ? void 0 : _this$viewRef9.scrollWidth()
    }
    scrollOffset() {
        var _this$viewRef10;
        return null === (_this$viewRef10 = this.viewRef) || void 0 === _this$viewRef10 ? void 0 : _this$viewRef10.scrollOffset()
    }
    scrollTop() {
        var _this$viewRef11;
        return null === (_this$viewRef11 = this.viewRef) || void 0 === _this$viewRef11 ? void 0 : _this$viewRef11.scrollTop()
    }
    scrollLeft() {
        var _this$viewRef12;
        return null === (_this$viewRef12 = this.viewRef) || void 0 === _this$viewRef12 ? void 0 : _this$viewRef12.scrollLeft()
    }
    clientHeight() {
        var _this$viewRef13;
        return null === (_this$viewRef13 = this.viewRef) || void 0 === _this$viewRef13 ? void 0 : _this$viewRef13.clientHeight()
    }
    clientWidth() {
        var _this$viewRef14;
        return null === (_this$viewRef14 = this.viewRef) || void 0 === _this$viewRef14 ? void 0 : _this$viewRef14.clientWidth()
    }
    getScrollElementPosition(element, direction) {
        var _this$viewRef15;
        return null === (_this$viewRef15 = this.viewRef) || void 0 === _this$viewRef15 ? void 0 : _this$viewRef15.getScrollElementPosition(this._patchElementParam(element), direction)
    }
    _getActionConfigs() {
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
    }
    get _propsInfo() {
        return {
            twoWay: [],
            allowNull: [],
            elements: [],
            templates: [],
            props: ["useNative", "direction", "showScrollbar", "bounceEnabled", "scrollByContent", "scrollByThumb", "updateManually", "classes", "pullDownEnabled", "reachBottomEnabled", "forceGeneratePockets", "needScrollViewContentWrapper", "needScrollViewLoadPanel", "onScroll", "onUpdated", "onPullDown", "onReachBottom", "pullingDownText", "pulledDownText", "refreshingText", "reachBottomText", "aria", "disabled", "height", "rtlEnabled", "visible", "width", "useSimulatedScrollbar", "inertiaEnabled", "useKeyboard", "onStart", "onEnd", "onBounce", "onStop"]
        }
    }
    get _viewComponent() {
        return ScrollableComponent
    }
}
registerComponent("dxScrollable", Scrollable);
