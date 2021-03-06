/**
 * DevExtreme (cjs/renovation/utils/resolve_rtl.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.resolveRtlEnabled = resolveRtlEnabled;
exports.resolveRtlEnabledDefinition = resolveRtlEnabledDefinition;
var _type = require("../../core/utils/type");
var _config = _interopRequireDefault(require("../../core/config"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}

function resolveRtlEnabled(rtlProp, config) {
    if (void 0 !== rtlProp) {
        return rtlProp
    }
    if (void 0 !== (null === config || void 0 === config ? void 0 : config.rtlEnabled)) {
        return config.rtlEnabled
    }
    return (0, _config.default)().rtlEnabled
}

function resolveRtlEnabledDefinition(rtlProp, config) {
    var isPropDefined = (0, _type.isDefined)(rtlProp);
    var onlyGlobalDefined = (0, _type.isDefined)((0, _config.default)().rtlEnabled) && !isPropDefined && !(0, _type.isDefined)(null === config || void 0 === config ? void 0 : config.rtlEnabled);
    return isPropDefined && rtlProp !== (null === config || void 0 === config ? void 0 : config.rtlEnabled) || onlyGlobalDefined
}
