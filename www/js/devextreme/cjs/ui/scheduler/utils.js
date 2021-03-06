/**
 * DevExtreme (cjs/ui/scheduler/utils.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _constants = require("./constants");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}
var utils = {
    dataAccessors: {
        getAppointmentSettings: function(element) {
            return (0, _renderer.default)(element).data(_constants.APPOINTMENT_SETTINGS_KEY)
        },
        getAppointmentInfo: function(element) {
            var settings = utils.dataAccessors.getAppointmentSettings(element);
            return null === settings || void 0 === settings ? void 0 : settings.info
        }
    }
};
var _default = utils;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;
