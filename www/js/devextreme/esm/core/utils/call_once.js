/**
 * DevExtreme (esm/core/utils/call_once.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
var callOnce = function(handler) {
    var result;
    var _wrappedHandler = function() {
        result = handler.apply(this, arguments);
        _wrappedHandler = function() {
            return result
        };
        return result
    };
    return function() {
        return _wrappedHandler.apply(this, arguments)
    }
};
export default callOnce;
