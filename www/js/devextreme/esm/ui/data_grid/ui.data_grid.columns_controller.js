/**
 * DevExtreme (esm/ui/data_grid/ui.data_grid.columns_controller.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import gridCore from "./ui.data_grid.core";
import {
    columnsControllerModule
} from "../grid_core/ui.grid_core.columns_controller";
import {
    extend
} from "../../core/utils/extend";
gridCore.registerModule("columns", {
    defaultOptions: function() {
        return extend(true, {}, columnsControllerModule.defaultOptions(), {
            commonColumnSettings: {
                allowExporting: true
            }
        })
    },
    controllers: columnsControllerModule.controllers
});
