/**
 * DevExtreme (cjs/events/short.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.keyboard = exports.dxPointerUp = exports.dxPointerDown = exports.dxScrollCancel = exports.dxScrollStop = exports.dxScrollEnd = exports.dxScrollMove = exports.dxScrollStart = exports.dxScrollInit = exports.click = exports.dxClick = exports.focus = exports.visibility = exports.hover = exports.resize = exports.active = void 0;
var _dom_adapter = _interopRequireDefault(require("../core/dom_adapter"));
var _events_engine = _interopRequireDefault(require("./core/events_engine"));
var _keyboard_processor = _interopRequireDefault(require("./core/keyboard_processor"));
var _index = require("./utils/index");
var _pointer = _interopRequireDefault(require("./pointer"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}

function addNamespace(event, namespace) {
    return namespace ? (0, _index.addNamespace)(event, namespace) : event
}

function executeAction(action, args) {
    return "function" === typeof action ? action(args) : action.execute(args)
}
var active = {
    on: function($el, active, inactive, opts) {
        var selector = opts.selector,
            showTimeout = opts.showTimeout,
            hideTimeout = opts.hideTimeout,
            namespace = opts.namespace;
        _events_engine.default.on($el, addNamespace("dxactive", namespace), selector, {
            timeout: showTimeout
        }, (function(event) {
            return executeAction(active, {
                event: event,
                element: event.currentTarget
            })
        }));
        _events_engine.default.on($el, addNamespace("dxinactive", namespace), selector, {
            timeout: hideTimeout
        }, (function(event) {
            return executeAction(inactive, {
                event: event,
                element: event.currentTarget
            })
        }))
    },
    off: function($el, _ref) {
        var namespace = _ref.namespace,
            selector = _ref.selector;
        _events_engine.default.off($el, addNamespace("dxactive", namespace), selector);
        _events_engine.default.off($el, addNamespace("dxinactive", namespace), selector)
    }
};
exports.active = active;
var resize = {
    on: function($el, resize) {
        var _ref2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
            namespace = _ref2.namespace;
        _events_engine.default.on($el, addNamespace("dxresize", namespace), resize)
    },
    off: function($el) {
        var _ref3 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
            namespace = _ref3.namespace;
        _events_engine.default.off($el, addNamespace("dxresize", namespace))
    }
};
exports.resize = resize;
var hover = {
    on: function($el, start, end, _ref4) {
        var selector = _ref4.selector,
            namespace = _ref4.namespace;
        _events_engine.default.on($el, addNamespace("dxhoverend", namespace), selector, (function(event) {
            return end(event)
        }));
        _events_engine.default.on($el, addNamespace("dxhoverstart", namespace), selector, (function(event) {
            return executeAction(start, {
                element: event.target,
                event: event
            })
        }))
    },
    off: function($el, _ref5) {
        var selector = _ref5.selector,
            namespace = _ref5.namespace;
        _events_engine.default.off($el, addNamespace("dxhoverstart", namespace), selector);
        _events_engine.default.off($el, addNamespace("dxhoverend", namespace), selector)
    }
};
exports.hover = hover;
var visibility = {
    on: function($el, shown, hiding, _ref6) {
        var namespace = _ref6.namespace;
        _events_engine.default.on($el, addNamespace("dxhiding", namespace), hiding);
        _events_engine.default.on($el, addNamespace("dxshown", namespace), shown)
    },
    off: function($el, _ref7) {
        var namespace = _ref7.namespace;
        _events_engine.default.off($el, addNamespace("dxhiding", namespace));
        _events_engine.default.off($el, addNamespace("dxshown", namespace))
    }
};
exports.visibility = visibility;
var focus = {
    on: function($el, focusIn, focusOut, _ref8) {
        var namespace = _ref8.namespace,
            isFocusable = _ref8.isFocusable;
        _events_engine.default.on($el, addNamespace("focusin", namespace), focusIn);
        _events_engine.default.on($el, addNamespace("focusout", namespace), focusOut);
        if (_dom_adapter.default.hasDocumentProperty("onbeforeactivate")) {
            _events_engine.default.on($el, addNamespace("beforeactivate", namespace), (function(e) {
                return isFocusable(null, e.target) || e.preventDefault()
            }))
        }
    },
    off: function($el, _ref9) {
        var namespace = _ref9.namespace;
        _events_engine.default.off($el, addNamespace("focusin", namespace));
        _events_engine.default.off($el, addNamespace("focusout", namespace));
        if (_dom_adapter.default.hasDocumentProperty("onbeforeactivate")) {
            _events_engine.default.off($el, addNamespace("beforeactivate", namespace))
        }
    },
    trigger: function($el) {
        return _events_engine.default.trigger($el, "focus")
    }
};
exports.focus = focus;
var dxClick = {
    on: function($el, click) {
        var _ref10 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
            namespace = _ref10.namespace;
        _events_engine.default.on($el, addNamespace("dxclick", namespace), click)
    },
    off: function($el) {
        var _ref11 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
            namespace = _ref11.namespace;
        _events_engine.default.off($el, addNamespace("dxclick", namespace))
    }
};
exports.dxClick = dxClick;
var click = {
    on: function($el, click) {
        var _ref12 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
            namespace = _ref12.namespace;
        _events_engine.default.on($el, addNamespace("click", namespace), click)
    },
    off: function($el) {
        var _ref13 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
            namespace = _ref13.namespace;
        _events_engine.default.off($el, addNamespace("click", namespace))
    }
};
exports.click = click;
var dxScrollInit = {
    on: function($el, onInit, eventData) {
        var _ref14 = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {},
            namespace = _ref14.namespace;
        _events_engine.default.on($el, addNamespace("dxscrollinit", namespace), eventData, onInit)
    },
    off: function($el) {
        var _ref15 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
            namespace = _ref15.namespace;
        _events_engine.default.off($el, addNamespace("dxscrollinit", namespace))
    }
};
exports.dxScrollInit = dxScrollInit;
var dxScrollStart = {
    on: function($el, onStart) {
        var _ref16 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
            namespace = _ref16.namespace;
        _events_engine.default.on($el, addNamespace("dxscrollstart", namespace), onStart)
    },
    off: function($el) {
        var _ref17 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
            namespace = _ref17.namespace;
        _events_engine.default.off($el, addNamespace("dxscrollstart", namespace))
    }
};
exports.dxScrollStart = dxScrollStart;
var dxScrollMove = {
    on: function($el, onScroll) {
        var _ref18 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
            namespace = _ref18.namespace;
        _events_engine.default.on($el, addNamespace("dxscroll", namespace), onScroll)
    },
    off: function($el) {
        var _ref19 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
            namespace = _ref19.namespace;
        _events_engine.default.off($el, addNamespace("dxscroll", namespace))
    }
};
exports.dxScrollMove = dxScrollMove;
var dxScrollEnd = {
    on: function($el, onEnd) {
        var _ref20 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
            namespace = _ref20.namespace;
        _events_engine.default.on($el, addNamespace("dxscrollend", namespace), onEnd)
    },
    off: function($el) {
        var _ref21 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
            namespace = _ref21.namespace;
        _events_engine.default.off($el, addNamespace("dxscrollend", namespace))
    }
};
exports.dxScrollEnd = dxScrollEnd;
var dxScrollStop = {
    on: function($el, onStop) {
        var _ref22 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
            namespace = _ref22.namespace;
        _events_engine.default.on($el, addNamespace("dxscrollstop", namespace), onStop)
    },
    off: function($el) {
        var _ref23 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
            namespace = _ref23.namespace;
        _events_engine.default.off($el, addNamespace("dxscrollstop", namespace))
    }
};
exports.dxScrollStop = dxScrollStop;
var dxScrollCancel = {
    on: function($el, onCancel) {
        var _ref24 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
            namespace = _ref24.namespace;
        _events_engine.default.on($el, addNamespace("dxscrollcancel", namespace), onCancel)
    },
    off: function($el) {
        var _ref25 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
            namespace = _ref25.namespace;
        _events_engine.default.off($el, addNamespace("dxscrollcancel", namespace))
    }
};
exports.dxScrollCancel = dxScrollCancel;
var dxPointerDown = {
    on: function($el, onPointerDown) {
        var _ref26 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
            namespace = _ref26.namespace;
        _events_engine.default.on($el, addNamespace(_pointer.default.down, namespace), onPointerDown)
    },
    off: function($el) {
        var _ref27 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
            namespace = _ref27.namespace;
        _events_engine.default.off($el, addNamespace(_pointer.default.down, namespace))
    }
};
exports.dxPointerDown = dxPointerDown;
var dxPointerUp = {
    on: function($el, onPointerUp) {
        var _ref28 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
            namespace = _ref28.namespace;
        _events_engine.default.on($el, addNamespace(_pointer.default.up, namespace), onPointerUp)
    },
    off: function($el) {
        var _ref29 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
            namespace = _ref29.namespace;
        _events_engine.default.off($el, addNamespace(_pointer.default.up, namespace))
    }
};
exports.dxPointerUp = dxPointerUp;
var index = 0;
var keyboardProcessors = {};
var generateListenerId = function() {
    return "keyboardProcessorId".concat(index++)
};
var keyboard = {
    on: function(element, focusTarget, handler) {
        var listenerId = generateListenerId();
        keyboardProcessors[listenerId] = new _keyboard_processor.default({
            element: element,
            focusTarget: focusTarget,
            handler: handler
        });
        return listenerId
    },
    off: function(listenerId) {
        if (listenerId && keyboardProcessors[listenerId]) {
            keyboardProcessors[listenerId].dispose();
            delete keyboardProcessors[listenerId]
        }
    },
    _getProcessor: function(listenerId) {
        return keyboardProcessors[listenerId]
    }
};
exports.keyboard = keyboard;
