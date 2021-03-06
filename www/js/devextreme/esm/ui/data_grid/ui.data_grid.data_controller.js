/**
 * DevExtreme (esm/ui/data_grid/ui.data_grid.data_controller.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import gridCore from "./ui.data_grid.core";
import errors from "../widget/ui.errors";
import dataSourceAdapterProvider from "./ui.data_grid.data_source_adapter";
import {
    dataControllerModule
} from "../grid_core/ui.grid_core.data_controller";
export var DataController = dataControllerModule.controllers.data.inherit({
    _getDataSourceAdapter: function() {
        return dataSourceAdapterProvider
    },
    _getSpecificDataSourceOption: function() {
        var dataSource = this.option("dataSource");
        if (dataSource && !Array.isArray(dataSource) && this.option("keyExpr")) {
            errors.log("W1011")
        }
        return this.callBase()
    }
});
gridCore.registerModule("data", {
    defaultOptions: dataControllerModule.defaultOptions,
    controllers: {
        data: DataController
    }
});
