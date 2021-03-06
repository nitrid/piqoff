/**
 * DevExtreme (esm/ui/data_grid/ui.data_grid.column_chooser.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import gridCore from "./ui.data_grid.core";
import {
    columnChooserModule
} from "../grid_core/ui.grid_core.column_chooser";
export var ColumnChooserController = columnChooserModule.controllers.columnChooser;
export var ColumnChooserView = columnChooserModule.views.columnChooserView;
gridCore.registerModule("columnChooser", columnChooserModule);
