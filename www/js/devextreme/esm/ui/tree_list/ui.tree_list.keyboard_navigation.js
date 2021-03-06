/**
 * DevExtreme (esm/ui/tree_list/ui.tree_list.keyboard_navigation.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import core from "./ui.tree_list.core";
import {
    keyboardNavigationModule
} from "../grid_core/ui.grid_core.keyboard_navigation";
import {
    extend
} from "../../core/utils/extend";
core.registerModule("keyboardNavigation", extend(true, {}, keyboardNavigationModule, {
    extenders: {
        controllers: {
            keyboardNavigation: {
                _leftRightKeysHandler: function(eventArgs, isEditing) {
                    var rowIndex = this.getVisibleRowIndex();
                    var dataController = this._dataController;
                    if (eventArgs.ctrl) {
                        var directionCode = this._getDirectionCodeByKey(eventArgs.keyName);
                        var key = dataController.getKeyByRowIndex(rowIndex);
                        if ("nextInRow" === directionCode) {
                            dataController.expandRow(key)
                        } else {
                            dataController.collapseRow(key)
                        }
                    } else {
                        return this.callBase.apply(this, arguments)
                    }
                }
            }
        }
    }
}));
