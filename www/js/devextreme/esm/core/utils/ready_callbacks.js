/**
 * DevExtreme (esm/core/utils/ready_callbacks.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import domAdapter from "../dom_adapter";
import injector from "./dependency_injector";
import {
    hasWindow
} from "./window";
import callOnce from "./call_once";
var callbacks = [];
var isReady = () => "complete" === domAdapter.getReadyState() || "loading" !== domAdapter.getReadyState() && !domAdapter.getDocumentElement().doScroll;
var subscribeReady = callOnce(() => {
    var removeListener = domAdapter.listen(domAdapter.getDocument(), "DOMContentLoaded", () => {
        readyCallbacks.fire();
        removeListener()
    })
});
var readyCallbacks = {
    add: callback => {
        var windowExists = hasWindow();
        if (windowExists && isReady()) {
            callback()
        } else {
            callbacks.push(callback);
            windowExists && subscribeReady()
        }
    },
    fire: () => {
        callbacks.forEach(callback => callback());
        callbacks = []
    }
};
export default injector(readyCallbacks);
