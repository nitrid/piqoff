/**
 * DevExtreme (esm/ui/text_box/utils.support.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import domAdapter from "../../core/dom_adapter";
import devices from "../../core/devices";

function isModernAndroidDevice() {
    var {
        android: android,
        version: version
    } = devices.real();
    return android && version[0] > 4
}
export function isInputEventsL2Supported() {
    return "onbeforeinput" in domAdapter.createElement("input") || isModernAndroidDevice()
}
