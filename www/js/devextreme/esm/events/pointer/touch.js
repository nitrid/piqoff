/**
 * DevExtreme (esm/events/pointer/touch.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import devices from "../../core/devices";
import {
    extend
} from "../../core/utils/extend";
import {
    each
} from "../../core/utils/iterator";
import BaseStrategy from "./base";
var eventMap = {
    dxpointerdown: "touchstart",
    dxpointermove: "touchmove",
    dxpointerup: "touchend",
    dxpointercancel: "touchcancel",
    dxpointerover: "",
    dxpointerout: "",
    dxpointerenter: "",
    dxpointerleave: ""
};
var normalizeTouchEvent = function(e) {
    var pointers = [];
    each(e.touches, (function(_, touch) {
        pointers.push(extend({
            pointerId: touch.identifier
        }, touch))
    }));
    return {
        pointers: pointers,
        pointerId: e.changedTouches[0].identifier
    }
};
var skipTouchWithSameIdentifier = function(pointerEvent) {
    return "ios" === devices.real().platform && ("dxpointerdown" === pointerEvent || "dxpointerup" === pointerEvent)
};
var TouchStrategy = BaseStrategy.inherit({
    ctor: function() {
        this.callBase.apply(this, arguments);
        this._pointerId = 0
    },
    _handler: function(e) {
        if (skipTouchWithSameIdentifier(this._eventName)) {
            var touch = e.changedTouches[0];
            if (this._pointerId === touch.identifier && 0 !== this._pointerId) {
                return
            }
            this._pointerId = touch.identifier
        }
        return this.callBase.apply(this, arguments)
    },
    _fireEvent: function(args) {
        return this.callBase(extend(normalizeTouchEvent(args.originalEvent), args))
    }
});
TouchStrategy.map = eventMap;
TouchStrategy.normalize = normalizeTouchEvent;
export default TouchStrategy;
