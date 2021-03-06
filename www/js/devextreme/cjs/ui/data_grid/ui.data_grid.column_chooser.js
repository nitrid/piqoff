/**
 * DevExtreme (cjs/ui/data_grid/ui.data_grid.column_chooser.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.ColumnChooserView = exports.ColumnChooserController = void 0;
var _uiData_grid = _interopRequireDefault(require("./ui.data_grid.core"));
var _uiGrid_core = require("../grid_core/ui.grid_core.column_chooser");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}
var ColumnChooserController = _uiGrid_core.columnChooserModule.controllers.columnChooser;
exports.ColumnChooserController = ColumnChooserController;
var ColumnChooserView = _uiGrid_core.columnChooserModule.views.columnChooserView;
exports.ColumnChooserView = ColumnChooserView;
_uiData_grid.default.registerModule("columnChooser", _uiGrid_core.columnChooserModule);
