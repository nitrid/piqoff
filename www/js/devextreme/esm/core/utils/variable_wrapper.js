/**
 * DevExtreme (esm/core/utils/variable_wrapper.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import {
    logger
} from "./console";
import dependencyInjector from "./dependency_injector";
export default dependencyInjector({
    isWrapped: function() {
        return false
    },
    isWritableWrapped: function() {
        return false
    },
    wrap: function(value) {
        return value
    },
    unwrap: function(value) {
        return value
    },
    assign: function() {
        logger.error("Method 'assign' should not be used for not wrapped variables. Use 'isWrapped' method for ensuring.")
    }
});
