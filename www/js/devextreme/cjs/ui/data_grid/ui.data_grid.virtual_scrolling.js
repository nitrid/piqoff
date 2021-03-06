/**
 * DevExtreme (cjs/ui/data_grid/ui.data_grid.virtual_scrolling.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _uiData_grid = _interopRequireDefault(require("./ui.data_grid.core"));
var _uiData_grid2 = _interopRequireDefault(require("./ui.data_grid.data_source_adapter"));
var _uiGrid_core = require("../grid_core/ui.grid_core.virtual_scrolling");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}
_uiData_grid.default.registerModule("virtualScrolling", _uiGrid_core.virtualScrollingModule);
_uiData_grid2.default.extend(_uiGrid_core.virtualScrollingModule.extenders.dataSourceAdapter);
