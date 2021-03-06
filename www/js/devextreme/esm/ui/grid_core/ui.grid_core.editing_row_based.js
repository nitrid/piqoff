/**
 * DevExtreme (esm/ui/grid_core/ui.grid_core.editing_row_based.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import {
    EDIT_MODE_ROW,
    MODES_WITH_DELAYED_FOCUS,
    ROW_SELECTED_CLASS,
    EDIT_FORM_CLASS
} from "./ui.grid_core.editing_constants";
var EDIT_ROW = "dx-edit-row";
export var editingRowBasedModule = {
    extenders: {
        controllers: {
            editing: {
                isRowEditMode: function() {
                    return this.getEditMode() === EDIT_MODE_ROW
                },
                _afterCancelEditData: function(rowIndex) {
                    var dataController = this._dataController;
                    if (this.isRowBasedEditMode() && rowIndex >= 0) {
                        dataController.updateItems({
                            changeType: "update",
                            rowIndices: [rowIndex, rowIndex + 1]
                        })
                    } else {
                        this.callBase.apply(this, arguments)
                    }
                },
                _isDefaultButtonVisible: function(button, options) {
                    var isRowMode = this.isRowBasedEditMode();
                    var isEditRow = options.row && options.row.rowIndex === this._getVisibleEditRowIndex();
                    if (isRowMode) {
                        switch (button.name) {
                            case "edit":
                                return !isEditRow && this.allowUpdating(options);
                            case "delete":
                                return this.callBase.apply(this, arguments) && !isEditRow;
                            case "save":
                            case "cancel":
                                return isEditRow;
                            default:
                                return this.callBase.apply(this, arguments)
                        }
                    }
                    return this.callBase.apply(this, arguments)
                },
                isEditRow: function(rowIndex) {
                    return this.isRowBasedEditMode() && this._isEditRowByIndex(rowIndex)
                },
                _cancelSaving: function() {
                    if (this.isRowBasedEditMode()) {
                        if (!this.hasChanges()) {
                            this._cancelEditDataCore()
                        }
                    }
                    this.callBase.apply(this, arguments)
                },
                _refreshCore: function() {
                    if (this.isRowBasedEditMode()) {
                        this.init()
                    }
                    this.callBase.apply(this, arguments)
                },
                _isEditColumnVisible: function() {
                    var result = this.callBase.apply(this, arguments);
                    var editingOptions = this.option("editing");
                    var isRowEditMode = this.isRowEditMode();
                    var isVisibleInRowEditMode = editingOptions.allowUpdating || editingOptions.allowAdding;
                    return result || isRowEditMode && isVisibleInRowEditMode
                },
                _focusEditorIfNeed: function() {
                    var editMode = this.getEditMode();
                    if (this._needFocusEditor) {
                        if (-1 !== MODES_WITH_DELAYED_FOCUS.indexOf(editMode)) {
                            var $editingCell = this.getFocusedCellInRow(this._getVisibleEditRowIndex());
                            this._delayedInputFocus($editingCell, () => {
                                $editingCell && this.component.focus($editingCell)
                            })
                        }
                        this._needFocusEditor = false
                    }
                }
            },
            data: {
                _getChangedColumnIndices: function(oldItem, newItem, rowIndex, isLiveUpdate) {
                    var editingController = this.getController("editing");
                    if (editingController.isRowBasedEditMode() && oldItem.isEditing !== newItem.isEditing) {
                        return
                    }
                    return this.callBase.apply(this, arguments)
                }
            }
        },
        views: {
            rowsView: {
                _createRow: function(row) {
                    var $row = this.callBase(row);
                    if (row) {
                        var editingController = this._editingController;
                        var isEditRow = editingController.isEditRow(row.rowIndex);
                        if (isEditRow) {
                            $row.addClass(EDIT_ROW);
                            $row.removeClass(ROW_SELECTED_CLASS);
                            if ("detail" === row.rowType) {
                                $row.addClass(this.addWidgetPrefix(EDIT_FORM_CLASS))
                            }
                        }
                    }
                    return $row
                },
                _update: function(change) {
                    this.callBase(change);
                    if ("updateSelection" === change.changeType) {
                        this.getTableElements().children("tbody").children("." + EDIT_ROW).removeClass(ROW_SELECTED_CLASS)
                    }
                }
            }
        }
    }
};
