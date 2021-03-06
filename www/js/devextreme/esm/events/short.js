/**
 * DevExtreme (esm/events/short.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import domAdapter from "../core/dom_adapter";
import eventsEngine from "./core/events_engine";
import KeyboardProcessor from "./core/keyboard_processor";
import {
    addNamespace as pureAddNamespace
} from "./utils/index";
import pointerEvents from "./pointer";

function addNamespace(event, namespace) {
    return namespace ? pureAddNamespace(event, namespace) : event
}

function executeAction(action, args) {
    return "function" === typeof action ? action(args) : action.execute(args)
}
export var active = {
    on: ($el, active, inactive, opts) => {
        var {
            selector: selector,
            showTimeout: showTimeout,
            hideTimeout: hideTimeout,
            namespace: namespace
        } = opts;
        eventsEngine.on($el, addNamespace("dxactive", namespace), selector, {
            timeout: showTimeout
        }, event => executeAction(active, {
            event: event,
            element: event.currentTarget
        }));
        eventsEngine.on($el, addNamespace("dxinactive", namespace), selector, {
            timeout: hideTimeout
        }, event => executeAction(inactive, {
            event: event,
            element: event.currentTarget
        }))
    },
    off: ($el, _ref) => {
        var {
            namespace: namespace,
            selector: selector
        } = _ref;
        eventsEngine.off($el, addNamespace("dxactive", namespace), selector);
        eventsEngine.off($el, addNamespace("dxinactive", namespace), selector)
    }
};
export var resize = {
    on: function($el, resize) {
        var {
            namespace: namespace
        } = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
        eventsEngine.on($el, addNamespace("dxresize", namespace), resize)
    },
    off: function($el) {
        var {
            namespace: namespace
        } = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        eventsEngine.off($el, addNamespace("dxresize", namespace))
    }
};
export var hover = {
    on: ($el, start, end, _ref2) => {
        var {
            selector: selector,
            namespace: namespace
        } = _ref2;
        eventsEngine.on($el, addNamespace("dxhoverend", namespace), selector, event => end(event));
        eventsEngine.on($el, addNamespace("dxhoverstart", namespace), selector, event => executeAction(start, {
            element: event.target,
            event: event
        }))
    },
    off: ($el, _ref3) => {
        var {
            selector: selector,
            namespace: namespace
        } = _ref3;
        eventsEngine.off($el, addNamespace("dxhoverstart", namespace), selector);
        eventsEngine.off($el, addNamespace("dxhoverend", namespace), selector)
    }
};
export var visibility = {
    on: ($el, shown, hiding, _ref4) => {
        var {
            namespace: namespace
        } = _ref4;
        eventsEngine.on($el, addNamespace("dxhiding", namespace), hiding);
        eventsEngine.on($el, addNamespace("dxshown", namespace), shown)
    },
    off: ($el, _ref5) => {
        var {
            namespace: namespace
        } = _ref5;
        eventsEngine.off($el, addNamespace("dxhiding", namespace));
        eventsEngine.off($el, addNamespace("dxshown", namespace))
    }
};
export var focus = {
    on: ($el, focusIn, focusOut, _ref6) => {
        var {
            namespace: namespace,
            isFocusable: isFocusable
        } = _ref6;
        eventsEngine.on($el, addNamespace("focusin", namespace), focusIn);
        eventsEngine.on($el, addNamespace("focusout", namespace), focusOut);
        if (domAdapter.hasDocumentProperty("onbeforeactivate")) {
            eventsEngine.on($el, addNamespace("beforeactivate", namespace), e => isFocusable(null, e.target) || e.preventDefault())
        }
    },
    off: ($el, _ref7) => {
        var {
            namespace: namespace
        } = _ref7;
        eventsEngine.off($el, addNamespace("focusin", namespace));
        eventsEngine.off($el, addNamespace("focusout", namespace));
        if (domAdapter.hasDocumentProperty("onbeforeactivate")) {
            eventsEngine.off($el, addNamespace("beforeactivate", namespace))
        }
    },
    trigger: $el => eventsEngine.trigger($el, "focus")
};
export var dxClick = {
    on: function($el, click) {
        var {
            namespace: namespace
        } = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
        eventsEngine.on($el, addNamespace("dxclick", namespace), click)
    },
    off: function($el) {
        var {
            namespace: namespace
        } = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        eventsEngine.off($el, addNamespace("dxclick", namespace))
    }
};
export var click = {
    on: function($el, click) {
        var {
            namespace: namespace
        } = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
        eventsEngine.on($el, addNamespace("click", namespace), click)
    },
    off: function($el) {
        var {
            namespace: namespace
        } = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        eventsEngine.off($el, addNamespace("click", namespace))
    }
};
export var dxScrollInit = {
    on: function($el, onInit, eventData) {
        var {
            namespace: namespace
        } = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {};
        eventsEngine.on($el, addNamespace("dxscrollinit", namespace), eventData, onInit)
    },
    off: function($el) {
        var {
            namespace: namespace
        } = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        eventsEngine.off($el, addNamespace("dxscrollinit", namespace))
    }
};
export var dxScrollStart = {
    on: function($el, onStart) {
        var {
            namespace: namespace
        } = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
        eventsEngine.on($el, addNamespace("dxscrollstart", namespace), onStart)
    },
    off: function($el) {
        var {
            namespace: namespace
        } = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        eventsEngine.off($el, addNamespace("dxscrollstart", namespace))
    }
};
export var dxScrollMove = {
    on: function($el, onScroll) {
        var {
            namespace: namespace
        } = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
        eventsEngine.on($el, addNamespace("dxscroll", namespace), onScroll)
    },
    off: function($el) {
        var {
            namespace: namespace
        } = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        eventsEngine.off($el, addNamespace("dxscroll", namespace))
    }
};
export var dxScrollEnd = {
    on: function($el, onEnd) {
        var {
            namespace: namespace
        } = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
        eventsEngine.on($el, addNamespace("dxscrollend", namespace), onEnd)
    },
    off: function($el) {
        var {
            namespace: namespace
        } = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        eventsEngine.off($el, addNamespace("dxscrollend", namespace))
    }
};
export var dxScrollStop = {
    on: function($el, onStop) {
        var {
            namespace: namespace
        } = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
        eventsEngine.on($el, addNamespace("dxscrollstop", namespace), onStop)
    },
    off: function($el) {
        var {
            namespace: namespace
        } = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        eventsEngine.off($el, addNamespace("dxscrollstop", namespace))
    }
};
export var dxScrollCancel = {
    on: function($el, onCancel) {
        var {
            namespace: namespace
        } = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
        eventsEngine.on($el, addNamespace("dxscrollcancel", namespace), onCancel)
    },
    off: function($el) {
        var {
            namespace: namespace
        } = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        eventsEngine.off($el, addNamespace("dxscrollcancel", namespace))
    }
};
export var dxPointerDown = {
    on: function($el, onPointerDown) {
        var {
            namespace: namespace
        } = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
        eventsEngine.on($el, addNamespace(pointerEvents.down, namespace), onPointerDown)
    },
    off: function($el) {
        var {
            namespace: namespace
        } = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        eventsEngine.off($el, addNamespace(pointerEvents.down, namespace))
    }
};
export var dxPointerUp = {
    on: function($el, onPointerUp) {
        var {
            namespace: namespace
        } = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
        eventsEngine.on($el, addNamespace(pointerEvents.up, namespace), onPointerUp)
    },
    off: function($el) {
        var {
            namespace: namespace
        } = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        eventsEngine.off($el, addNamespace(pointerEvents.up, namespace))
    }
};
var index = 0;
var keyboardProcessors = {};
var generateListenerId = () => "keyboardProcessorId".concat(index++);
export var keyboard = {
    on: (element, focusTarget, handler) => {
        var listenerId = generateListenerId();
        keyboardProcessors[listenerId] = new KeyboardProcessor({
            element: element,
            focusTarget: focusTarget,
            handler: handler
        });
        return listenerId
    },
    off: listenerId => {
        if (listenerId && keyboardProcessors[listenerId]) {
            keyboardProcessors[listenerId].dispose();
            delete keyboardProcessors[listenerId]
        }
    },
    _getProcessor: listenerId => keyboardProcessors[listenerId]
};
