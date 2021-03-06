/**
 * DevExtreme (cjs/viz/sankey/data_validator.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.default = void 0;
var _graph = _interopRequireDefault(require("./graph"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}
var validator = {
    validate: function(data, incidentOccurred) {
        var result = null;
        if (this._hasCycle(data)) {
            result = "E2006";
            incidentOccurred("E2006")
        }
        return result
    },
    _hasCycle: function(data) {
        return _graph.default.struct.hasCycle(data)
    }
};
var _default = validator;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;
