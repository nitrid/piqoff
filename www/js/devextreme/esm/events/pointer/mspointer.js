/**
 * DevExtreme (esm/events/pointer/mspointer.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import BaseStrategy from "./base";
import Observer from "./observer";
import {
    extend
} from "../../core/utils/extend";
var eventMap = {
    dxpointerdown: "pointerdown",
    dxpointermove: "pointermove",
    dxpointerup: "pointerup",
    dxpointercancel: "pointercancel",
    dxpointerover: "pointerover",
    dxpointerout: "pointerout",
    dxpointerenter: "pointerenter",
    dxpointerleave: "pointerleave"
};
var observer;
var activated = false;
var activateStrategy = function() {
    if (activated) {
        return
    }
    observer = new Observer(eventMap, (function(a, b) {
        return a.pointerId === b.pointerId
    }), (function(e) {
        if (e.isPrimary) {
            observer.reset()
        }
    }));
    activated = true
};
var MsPointerStrategy = BaseStrategy.inherit({
    ctor: function() {
        this.callBase.apply(this, arguments);
        activateStrategy()
    },
    _fireEvent: function(args) {
        return this.callBase(extend({
            pointers: observer.pointers(),
            pointerId: args.originalEvent.pointerId
        }, args))
    }
});
MsPointerStrategy.map = eventMap;
MsPointerStrategy.resetObserver = function() {
    observer.reset()
};
export default MsPointerStrategy;
