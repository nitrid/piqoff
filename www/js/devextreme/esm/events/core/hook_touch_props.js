/**
 * DevExtreme (esm/events/core/hook_touch_props.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
var touchPropsToHook = ["pageX", "pageY", "screenX", "screenY", "clientX", "clientY"];
var touchPropHook = function(name, event) {
    if (event[name] && !event.touches || !event.touches) {
        return event[name]
    }
    var touches = event.touches.length ? event.touches : event.changedTouches;
    if (!touches.length) {
        return
    }
    return touches[0][name]
};
export default function(callback) {
    touchPropsToHook.forEach((function(name) {
        callback(name, (function(event) {
            return touchPropHook(name, event)
        }))
    }), this)
}
