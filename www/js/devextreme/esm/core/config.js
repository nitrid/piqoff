/**
 * DevExtreme (esm/core/config.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import {
    extend
} from "./utils/extend";
import errors from "./errors";
var config = {
    rtlEnabled: false,
    defaultCurrency: "USD",
    oDataFilterToLower: true,
    serverDecimalSeparator: ".",
    decimalSeparator: ".",
    thousandsSeparator: ",",
    forceIsoDateParsing: true,
    wrapActionsBeforeExecute: true,
    useLegacyStoreResult: false,
    useJQuery: void 0,
    editorStylingMode: void 0,
    useLegacyVisibleIndex: false,
    floatingActionButtonConfig: {
        icon: "add",
        closeIcon: "close",
        label: "",
        position: {
            at: "right bottom",
            my: "right bottom",
            offset: {
                x: -16,
                y: -16
            }
        },
        maxSpeedDialActionCount: 5,
        shading: false,
        direction: "auto"
    },
    optionsParser: optionsString => {
        if ("{" !== optionsString.trim().charAt(0)) {
            optionsString = "{" + optionsString + "}"
        }
        try {
            return new Function("return " + optionsString)()
        } catch (ex) {
            throw errors.Error("E3018", ex, optionsString)
        }
    }
};
var deprecatedFields = ["decimalSeparator", "thousandsSeparator"];
var configMethod = function() {
    if (!arguments.length) {
        return config
    }
    var newConfig = arguments.length <= 0 ? void 0 : arguments[0];
    deprecatedFields.forEach(deprecatedField => {
        if (newConfig[deprecatedField]) {
            var message = "Now, the ".concat(deprecatedField, " is selected based on the specified locale.");
            errors.log("W0003", "config", deprecatedField, "19.2", message)
        }
    });
    extend(config, newConfig)
};
if ("undefined" !== typeof DevExpress && DevExpress.config) {
    configMethod(DevExpress.config)
}
export default configMethod;
