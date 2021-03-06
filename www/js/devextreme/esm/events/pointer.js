/**
 * DevExtreme (esm/events/pointer.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import * as support from "../core/utils/support";
import {
    each
} from "../core/utils/iterator";
import browser from "../core/utils/browser";
import devices from "../core/devices";
import registerEvent from "./core/event_registrator";
import TouchStrategy from "./pointer/touch";
import MsPointerStrategy from "./pointer/mspointer";
import MouseStrategy from "./pointer/mouse";
import MouseAndTouchStrategy from "./pointer/mouse_and_touch";
var getStrategy = (support, device, browser) => {
    if (support.pointerEvents && browser.msie) {
        return MsPointerStrategy
    }
    var {
        tablet: tablet,
        phone: phone
    } = device;
    if (support.touch && !(tablet || phone)) {
        return MouseAndTouchStrategy
    }
    if (support.touch) {
        return TouchStrategy
    }
    return MouseStrategy
};
var EventStrategy = getStrategy(support, devices.real(), browser);
each(EventStrategy.map, (pointerEvent, originalEvents) => {
    registerEvent(pointerEvent, new EventStrategy(pointerEvent, originalEvents))
});
var pointer = {
    down: "dxpointerdown",
    up: "dxpointerup",
    move: "dxpointermove",
    cancel: "dxpointercancel",
    enter: "dxpointerenter",
    leave: "dxpointerleave",
    over: "dxpointerover",
    out: "dxpointerout"
};
export default pointer;
