/**
 * DevExtreme (esm/ui/tree_list/ui.tree_list.state_storing.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import treeListCore from "./ui.tree_list.core";
import {
    extend
} from "../../core/utils/extend";
import {
    stateStoringModule
} from "../grid_core/ui.grid_core.state_storing";
var origApplyState = stateStoringModule.extenders.controllers.stateStoring.applyState;
treeListCore.registerModule("stateStoring", extend(true, {}, stateStoringModule, {
    extenders: {
        controllers: {
            stateStoring: {
                applyState: function(state) {
                    origApplyState.apply(this, arguments);
                    if (Object.prototype.hasOwnProperty.call(state, "expandedRowKeys")) {
                        this.option("expandedRowKeys", state.expandedRowKeys && state.expandedRowKeys.slice())
                    }
                }
            },
            data: {
                getUserState: function() {
                    var state = this.callBase.apply(this, arguments);
                    if (!this.option("autoExpandAll")) {
                        state.expandedRowKeys = this.option("expandedRowKeys")
                    }
                    return state
                }
            }
        }
    }
}));
