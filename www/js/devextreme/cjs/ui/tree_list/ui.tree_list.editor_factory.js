/**
 * DevExtreme (cjs/ui/tree_list/ui.tree_list.editor_factory.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _uiTree_list = _interopRequireDefault(require("./ui.tree_list.core"));
var _uiGrid_core = require("../grid_core/ui.grid_core.editor_factory");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}
_uiTree_list.default.registerModule("editorFactory", _uiGrid_core.editorFactoryModule);
