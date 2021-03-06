/**
 * DevExtreme (renovation/utils/render_template.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.renderTemplate = renderTemplate;
var _inferno = require("inferno");
var _infernoCreateElement = require("inferno-create-element");

function renderTemplate(template, props, container) {
    setTimeout((function() {
        (0, _inferno.render)((0, _infernoCreateElement.createElement)(template, props), null === container || void 0 === container ? void 0 : container.get(0))
    }), 0)
}
