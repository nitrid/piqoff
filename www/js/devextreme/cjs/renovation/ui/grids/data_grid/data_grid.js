/**
 * DevExtreme (cjs/renovation/ui/grids/data_grid/data_grid.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.DataGrid = exports.viewFunction = void 0;
var _inferno = require("inferno");
var _vdom = require("@devextreme/vdom");
var _data_grid_props = require("./common/data_grid_props");
require("../../../../ui/data_grid/ui.data_grid");
var _widget = require("../../common/widget");
var _datagrid_component = require("./datagrid_component");
var _data_grid_views = require("./data_grid_views");
var _get_updated_options = require("./utils/get_updated_options");
var _excluded = ["onOptionChanged"],
    _excluded2 = ["accessKey", "activeStateEnabled", "allowColumnReordering", "allowColumnResizing", "autoNavigateToFocusedRow", "cacheEnabled", "cellHintEnabled", "columnAutoWidth", "columnChooser", "columnFixing", "columnHidingEnabled", "columnMinWidth", "columnResizingMode", "columnWidth", "columns", "commonColumnSettings", "customizeColumns", "customizeExportData", "dataSource", "dateSerializationFormat", "defaultFilterValue", "defaultFocusedColumnIndex", "defaultFocusedRowIndex", "defaultFocusedRowKey", "defaultSelectedRowKeys", "defaultSelectionFilter", "disabled", "editing", "errorRowEnabled", "export", "filterBuilder", "filterBuilderPopup", "filterPanel", "filterRow", "filterSyncEnabled", "filterValue", "filterValueChange", "focusStateEnabled", "focusedColumnIndex", "focusedColumnIndexChange", "focusedRowEnabled", "focusedRowIndex", "focusedRowIndexChange", "focusedRowKey", "focusedRowKeyChange", "groupPanel", "grouping", "headerFilter", "height", "highlightChanges", "hint", "hoverStateEnabled", "keyExpr", "keyboardNavigation", "loadPanel", "loadingTimeout", "masterDetail", "noDataText", "onAdaptiveDetailRowPreparing", "onCellClick", "onCellDblClick", "onCellHoverChanged", "onCellPrepared", "onClick", "onContentReady", "onContextMenuPreparing", "onDataErrorOccurred", "onEditingStart", "onEditorPrepared", "onEditorPreparing", "onExported", "onExporting", "onFileSaving", "onFocusedCellChanged", "onFocusedCellChanging", "onFocusedRowChanged", "onFocusedRowChanging", "onInitNewRow", "onKeyDown", "onRowClick", "onRowCollapsed", "onRowCollapsing", "onRowDblClick", "onRowExpanded", "onRowExpanding", "onRowInserted", "onRowInserting", "onRowPrepared", "onRowRemoved", "onRowRemoving", "onRowUpdated", "onRowUpdating", "onRowValidating", "onSelectionChanged", "onToolbarPreparing", "pager", "paging", "remoteOperations", "renderAsync", "repaintChangesOnly", "rowAlternationEnabled", "rowDragging", "rowTemplate", "rtlEnabled", "scrolling", "searchPanel", "selectedRowKeys", "selectedRowKeysChange", "selection", "selectionFilter", "selectionFilterChange", "showBorders", "showColumnHeaders", "showColumnLines", "showRowLines", "sortByGroupSummaryInfo", "sorting", "stateStoring", "summary", "tabIndex", "twoWayBindingEnabled", "useKeyboard", "visible", "width", "wordWrapEnabled"];

function _objectWithoutProperties(source, excluded) {
    if (null == source) {
        return {}
    }
    var target = _objectWithoutPropertiesLoose(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for (i = 0; i < sourceSymbolKeys.length; i++) {
            key = sourceSymbolKeys[i];
            if (excluded.indexOf(key) >= 0) {
                continue
            }
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) {
                continue
            }
            target[key] = source[key]
        }
    }
    return target
}

function _objectWithoutPropertiesLoose(source, excluded) {
    if (null == source) {
        return {}
    }
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for (i = 0; i < sourceKeys.length; i++) {
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) {
            continue
        }
        target[key] = source[key]
    }
    return target
}

function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread()
}

function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
}

function _unsupportedIterableToArray(o, minLen) {
    if (!o) {
        return
    }
    if ("string" === typeof o) {
        return _arrayLikeToArray(o, minLen)
    }
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if ("Object" === n && o.constructor) {
        n = o.constructor.name
    }
    if ("Map" === n || "Set" === n) {
        return Array.from(o)
    }
    if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) {
        return _arrayLikeToArray(o, minLen)
    }
}

function _iterableToArray(iter) {
    if ("undefined" !== typeof Symbol && null != iter[Symbol.iterator] || null != iter["@@iterator"]) {
        return Array.from(iter)
    }
}

function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
        return _arrayLikeToArray(arr)
    }
}

function _arrayLikeToArray(arr, len) {
    if (null == len || len > arr.length) {
        len = arr.length
    }
    for (var i = 0, arr2 = new Array(len); i < len; i++) {
        arr2[i] = arr[i]
    }
    return arr2
}

function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) {
            descriptor.writable = true
        }
        Object.defineProperty(target, descriptor.key, descriptor)
    }
}

function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) {
        _defineProperties(Constructor.prototype, protoProps)
    }
    if (staticProps) {
        _defineProperties(Constructor, staticProps)
    }
    return Constructor
}

function _assertThisInitialized(self) {
    if (void 0 === self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
    }
    return self
}

function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    _setPrototypeOf(subClass, superClass)
}

function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function(o, p) {
        o.__proto__ = p;
        return o
    };
    return _setPrototypeOf(o, p)
}

function _extends() {
    _extends = Object.assign || function(target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key]
                }
            }
        }
        return target
    };
    return _extends.apply(this, arguments)
}
var aria = {
    role: "presentation"
};
var rowSelector = ".dx-row";
var viewFunction = function(_ref) {
    var instance = _ref.instance,
        onDimensionChanged = _ref.onDimensionChanged,
        onHoverEnd = _ref.onHoverEnd,
        onHoverStart = _ref.onHoverStart,
        _ref$props = _ref.props,
        accessKey = _ref$props.accessKey,
        activeStateEnabled = _ref$props.activeStateEnabled,
        disabled = _ref$props.disabled,
        focusStateEnabled = _ref$props.focusStateEnabled,
        height = _ref$props.height,
        hint = _ref$props.hint,
        hoverStateEnabled = _ref$props.hoverStateEnabled,
        onContentReady = _ref$props.onContentReady,
        rtlEnabled = _ref$props.rtlEnabled,
        showBorders = _ref$props.showBorders,
        tabIndex = _ref$props.tabIndex,
        visible = _ref$props.visible,
        width = _ref$props.width,
        restAttributes = _ref.restAttributes,
        widgetElementRef = _ref.widgetElementRef;
    return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, _widget.Widget, _extends({
        rootElementRef: widgetElementRef,
        accessKey: accessKey,
        activeStateEnabled: activeStateEnabled,
        activeStateUnit: rowSelector,
        aria: aria,
        disabled: disabled,
        focusStateEnabled: focusStateEnabled,
        height: height,
        hint: hint,
        hoverStateEnabled: hoverStateEnabled,
        onContentReady: onContentReady,
        rtlEnabled: rtlEnabled,
        tabIndex: tabIndex,
        visible: visible,
        width: width,
        onHoverStart: onHoverStart,
        onHoverEnd: onHoverEnd,
        onDimensionChanged: onDimensionChanged
    }, restAttributes, {
        children: (0, _inferno.createComponentVNode)(2, _data_grid_views.DataGridViews, {
            instance: instance,
            showBorders: showBorders
        })
    })))
};
exports.viewFunction = viewFunction;
var getTemplate = function(TemplateProp) {
    return TemplateProp && (TemplateProp.defaultProps ? function(props) {
        return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, TemplateProp, _extends({}, props)))
    } : TemplateProp)
};
var DataGrid = function(_InfernoWrapperCompon) {
    _inheritsLoose(DataGrid, _InfernoWrapperCompon);

    function DataGrid(props) {
        var _this;
        _this = _InfernoWrapperCompon.call(this, props) || this;
        _this._currentState = null;
        _this.widgetElementRef = (0, _inferno.createRef)();
        _this.isTwoWayPropUpdating = false;
        _this.state = {
            instance: void 0,
            filterValue: void 0 !== _this.props.filterValue ? _this.props.filterValue : _this.props.defaultFilterValue,
            focusedColumnIndex: void 0 !== _this.props.focusedColumnIndex ? _this.props.focusedColumnIndex : _this.props.defaultFocusedColumnIndex,
            focusedRowIndex: void 0 !== _this.props.focusedRowIndex ? _this.props.focusedRowIndex : _this.props.defaultFocusedRowIndex,
            focusedRowKey: void 0 !== _this.props.focusedRowKey ? _this.props.focusedRowKey : _this.props.defaultFocusedRowKey,
            selectedRowKeys: void 0 !== _this.props.selectedRowKeys ? _this.props.selectedRowKeys : _this.props.defaultSelectedRowKeys,
            selectionFilter: void 0 !== _this.props.selectionFilter ? _this.props.selectionFilter : _this.props.defaultSelectionFilter
        };
        _this.getComponentInstance = _this.getComponentInstance.bind(_assertThisInitialized(_this));
        _this.beginCustomLoading = _this.beginCustomLoading.bind(_assertThisInitialized(_this));
        _this.byKey = _this.byKey.bind(_assertThisInitialized(_this));
        _this.cancelEditData = _this.cancelEditData.bind(_assertThisInitialized(_this));
        _this.cellValue = _this.cellValue.bind(_assertThisInitialized(_this));
        _this.clearFilter = _this.clearFilter.bind(_assertThisInitialized(_this));
        _this.clearSelection = _this.clearSelection.bind(_assertThisInitialized(_this));
        _this.clearSorting = _this.clearSorting.bind(_assertThisInitialized(_this));
        _this.closeEditCell = _this.closeEditCell.bind(_assertThisInitialized(_this));
        _this.collapseAdaptiveDetailRow = _this.collapseAdaptiveDetailRow.bind(_assertThisInitialized(_this));
        _this.columnCount = _this.columnCount.bind(_assertThisInitialized(_this));
        _this.callMethod = _this.callMethod.bind(_assertThisInitialized(_this));
        _this.columnOption = _this.columnOption.bind(_assertThisInitialized(_this));
        _this.deleteColumn = _this.deleteColumn.bind(_assertThisInitialized(_this));
        _this.deleteRow = _this.deleteRow.bind(_assertThisInitialized(_this));
        _this.deselectAll = _this.deselectAll.bind(_assertThisInitialized(_this));
        _this.deselectRows = _this.deselectRows.bind(_assertThisInitialized(_this));
        _this.editCell = _this.editCell.bind(_assertThisInitialized(_this));
        _this.editRow = _this.editRow.bind(_assertThisInitialized(_this));
        _this.endCustomLoading = _this.endCustomLoading.bind(_assertThisInitialized(_this));
        _this.expandAdaptiveDetailRow = _this.expandAdaptiveDetailRow.bind(_assertThisInitialized(_this));
        _this.filter = _this.filter.bind(_assertThisInitialized(_this));
        _this.focus = _this.focus.bind(_assertThisInitialized(_this));
        _this.getCellElement = _this.getCellElement.bind(_assertThisInitialized(_this));
        _this.getCombinedFilter = _this.getCombinedFilter.bind(_assertThisInitialized(_this));
        _this.getDataSource = _this.getDataSource.bind(_assertThisInitialized(_this));
        _this.getKeyByRowIndex = _this.getKeyByRowIndex.bind(_assertThisInitialized(_this));
        _this.getRowElement = _this.getRowElement.bind(_assertThisInitialized(_this));
        _this.getRowIndexByKey = _this.getRowIndexByKey.bind(_assertThisInitialized(_this));
        _this.getScrollable = _this.getScrollable.bind(_assertThisInitialized(_this));
        _this.getVisibleColumnIndex = _this.getVisibleColumnIndex.bind(_assertThisInitialized(_this));
        _this.hasEditData = _this.hasEditData.bind(_assertThisInitialized(_this));
        _this.hideColumnChooser = _this.hideColumnChooser.bind(_assertThisInitialized(_this));
        _this.isAdaptiveDetailRowExpanded = _this.isAdaptiveDetailRowExpanded.bind(_assertThisInitialized(_this));
        _this.isRowFocused = _this.isRowFocused.bind(_assertThisInitialized(_this));
        _this.isRowSelected = _this.isRowSelected.bind(_assertThisInitialized(_this));
        _this.keyOf = _this.keyOf.bind(_assertThisInitialized(_this));
        _this.navigateToRow = _this.navigateToRow.bind(_assertThisInitialized(_this));
        _this.pageCount = _this.pageCount.bind(_assertThisInitialized(_this));
        _this.pageIndex = _this.pageIndex.bind(_assertThisInitialized(_this));
        _this.pageSize = _this.pageSize.bind(_assertThisInitialized(_this));
        _this.refresh = _this.refresh.bind(_assertThisInitialized(_this));
        _this.repaintRows = _this.repaintRows.bind(_assertThisInitialized(_this));
        _this.saveEditData = _this.saveEditData.bind(_assertThisInitialized(_this));
        _this.searchByText = _this.searchByText.bind(_assertThisInitialized(_this));
        _this.selectAll = _this.selectAll.bind(_assertThisInitialized(_this));
        _this.selectRows = _this.selectRows.bind(_assertThisInitialized(_this));
        _this.selectRowsByIndexes = _this.selectRowsByIndexes.bind(_assertThisInitialized(_this));
        _this.showColumnChooser = _this.showColumnChooser.bind(_assertThisInitialized(_this));
        _this.undeleteRow = _this.undeleteRow.bind(_assertThisInitialized(_this));
        _this.updateDimensions = _this.updateDimensions.bind(_assertThisInitialized(_this));
        _this.resize = _this.resize.bind(_assertThisInitialized(_this));
        _this.addColumn = _this.addColumn.bind(_assertThisInitialized(_this));
        _this.addRow = _this.addRow.bind(_assertThisInitialized(_this));
        _this.clearGrouping = _this.clearGrouping.bind(_assertThisInitialized(_this));
        _this.collapseAll = _this.collapseAll.bind(_assertThisInitialized(_this));
        _this.collapseRow = _this.collapseRow.bind(_assertThisInitialized(_this));
        _this.expandAll = _this.expandAll.bind(_assertThisInitialized(_this));
        _this.expandRow = _this.expandRow.bind(_assertThisInitialized(_this));
        _this.exportToExcel = _this.exportToExcel.bind(_assertThisInitialized(_this));
        _this.getSelectedRowKeys = _this.getSelectedRowKeys.bind(_assertThisInitialized(_this));
        _this.getSelectedRowsData = _this.getSelectedRowsData.bind(_assertThisInitialized(_this));
        _this.getTotalSummaryValue = _this.getTotalSummaryValue.bind(_assertThisInitialized(_this));
        _this.getVisibleColumns = _this.getVisibleColumns.bind(_assertThisInitialized(_this));
        _this.getVisibleRows = _this.getVisibleRows.bind(_assertThisInitialized(_this));
        _this.isRowExpanded = _this.isRowExpanded.bind(_assertThisInitialized(_this));
        _this.totalCount = _this.totalCount.bind(_assertThisInitialized(_this));
        _this.isScrollbarVisible = _this.isScrollbarVisible.bind(_assertThisInitialized(_this));
        _this.getTopVisibleRowData = _this.getTopVisibleRowData.bind(_assertThisInitialized(_this));
        _this.getScrollbarWidth = _this.getScrollbarWidth.bind(_assertThisInitialized(_this));
        _this.updateOptions = _this.updateOptions.bind(_assertThisInitialized(_this));
        _this.dispose = _this.dispose.bind(_assertThisInitialized(_this));
        _this.initInstanceElement = _this.initInstanceElement.bind(_assertThisInitialized(_this));
        _this.subscribeOptionChanged = _this.subscribeOptionChanged.bind(_assertThisInitialized(_this));
        _this.instanceOptionChangedHandler = _this.instanceOptionChangedHandler.bind(_assertThisInitialized(_this));
        _this.updateTwoWayValue = _this.updateTwoWayValue.bind(_assertThisInitialized(_this));
        _this.onHoverStart = _this.onHoverStart.bind(_assertThisInitialized(_this));
        _this.onHoverEnd = _this.onHoverEnd.bind(_assertThisInitialized(_this));
        _this.onDimensionChanged = _this.onDimensionChanged.bind(_assertThisInitialized(_this));
        _this.normalizeProps = _this.normalizeProps.bind(_assertThisInitialized(_this));
        _this.createInstance = _this.createInstance.bind(_assertThisInitialized(_this));
        return _this
    }
    var _proto = DataGrid.prototype;
    _proto.createEffects = function() {
        return [new _vdom.InfernoEffect(this.updateOptions, [this.instance, this.props, this.__state_filterValue, this.__state_focusedColumnIndex, this.__state_focusedRowIndex, this.__state_focusedRowKey, this.__state_selectedRowKeys, this.__state_selectionFilter]), new _vdom.InfernoEffect(this.dispose, []), new _vdom.InfernoEffect(this.initInstanceElement, []), new _vdom.InfernoEffect(this.subscribeOptionChanged, [this.instance, this.props.editing, this.props.searchPanel, this.props.focusedRowKeyChange, this.props.focusedRowIndexChange, this.props.focusedColumnIndexChange, this.props.filterValueChange, this.props.selectedRowKeysChange, this.props.selectionFilterChange])]
    };
    _proto.updateEffects = function() {
        var _this$_effects$, _this$_effects$2;
        null === (_this$_effects$ = this._effects[0]) || void 0 === _this$_effects$ ? void 0 : _this$_effects$.update([this.instance, this.props, this.__state_filterValue, this.__state_focusedColumnIndex, this.__state_focusedRowIndex, this.__state_focusedRowKey, this.__state_selectedRowKeys, this.__state_selectionFilter]);
        null === (_this$_effects$2 = this._effects[3]) || void 0 === _this$_effects$2 ? void 0 : _this$_effects$2.update([this.instance, this.props.editing, this.props.searchPanel, this.props.focusedRowKeyChange, this.props.focusedRowIndexChange, this.props.focusedColumnIndexChange, this.props.filterValueChange, this.props.selectedRowKeysChange, this.props.selectionFilterChange])
    };
    _proto.set_instance = function(value) {
        var _this2 = this;
        this.setState((function(state) {
            _this2._currentState = state;
            var newValue = value();
            _this2._currentState = null;
            return {
                instance: newValue
            }
        }))
    };
    _proto.set_filterValue = function(value) {
        var _this3 = this;
        this.setState((function(state) {
            _this3._currentState = state;
            var newValue = value();
            _this3.props.filterValueChange(newValue);
            _this3._currentState = null;
            return {
                filterValue: newValue
            }
        }))
    };
    _proto.set_focusedColumnIndex = function(value) {
        var _this4 = this;
        this.setState((function(state) {
            _this4._currentState = state;
            var newValue = value();
            _this4.props.focusedColumnIndexChange(newValue);
            _this4._currentState = null;
            return {
                focusedColumnIndex: newValue
            }
        }))
    };
    _proto.set_focusedRowIndex = function(value) {
        var _this5 = this;
        this.setState((function(state) {
            _this5._currentState = state;
            var newValue = value();
            _this5.props.focusedRowIndexChange(newValue);
            _this5._currentState = null;
            return {
                focusedRowIndex: newValue
            }
        }))
    };
    _proto.set_focusedRowKey = function(value) {
        var _this6 = this;
        this.setState((function(state) {
            _this6._currentState = state;
            var newValue = value();
            _this6.props.focusedRowKeyChange(newValue);
            _this6._currentState = null;
            return {
                focusedRowKey: newValue
            }
        }))
    };
    _proto.set_selectedRowKeys = function(value) {
        var _this7 = this;
        this.setState((function(state) {
            _this7._currentState = state;
            var newValue = value();
            _this7.props.selectedRowKeysChange(newValue);
            _this7._currentState = null;
            return {
                selectedRowKeys: newValue
            }
        }))
    };
    _proto.set_selectionFilter = function(value) {
        var _this8 = this;
        this.setState((function(state) {
            _this8._currentState = state;
            var newValue = value();
            _this8.props.selectionFilterChange(newValue);
            _this8._currentState = null;
            return {
                selectionFilter: newValue
            }
        }))
    };
    _proto.updateOptions = function() {
        var _this9 = this;
        if (this.instance && this.prevProps && !this.isTwoWayPropUpdating) {
            var updatedOptions = (0, _get_updated_options.getUpdatedOptions)(this.prevProps, _extends({}, this.props, {
                filterValue: this.__state_filterValue,
                focusedColumnIndex: this.__state_focusedColumnIndex,
                focusedRowIndex: this.__state_focusedRowIndex,
                focusedRowKey: this.__state_focusedRowKey,
                selectedRowKeys: this.__state_selectedRowKeys,
                selectionFilter: this.__state_selectionFilter
            }));
            this.instance.beginUpdate();
            updatedOptions.forEach((function(_ref2) {
                var path = _ref2.path,
                    previousValue = _ref2.previousValue,
                    value = _ref2.value;
                _this9.instance._options.silent(path, previousValue);
                _this9.instance.option(path, value)
            }));
            this.prevProps = _extends({}, this.props, {
                filterValue: this.__state_filterValue,
                focusedColumnIndex: this.__state_focusedColumnIndex,
                focusedRowIndex: this.__state_focusedRowIndex,
                focusedRowKey: this.__state_focusedRowKey,
                selectedRowKeys: this.__state_selectedRowKeys,
                selectionFilter: this.__state_selectionFilter
            });
            this.instance.endUpdate()
        } else {
            this.prevProps = _extends({}, this.props, {
                filterValue: this.__state_filterValue,
                focusedColumnIndex: this.__state_focusedColumnIndex,
                focusedRowIndex: this.__state_focusedRowIndex,
                focusedRowKey: this.__state_focusedRowKey,
                selectedRowKeys: this.__state_selectedRowKeys,
                selectionFilter: this.__state_selectionFilter
            })
        }
    };
    _proto.dispose = function() {
        var _this10 = this;
        return function() {
            _this10.instance.dispose()
        }
    };
    _proto.initInstanceElement = function() {
        var _this11 = this;
        this.set_instance((function() {
            return _this11.createInstance()
        }))
    };
    _proto.subscribeOptionChanged = function() {
        var _this$instance;
        null === (_this$instance = this.instance) || void 0 === _this$instance ? void 0 : _this$instance.on("optionChanged", this.instanceOptionChangedHandler.bind(this))
    };
    _proto.callMethod = function(funcName, args) {
        var _this$instance2;
        var normalizedArgs = _toConsumableArray(args).filter((function(arg) {
            return void 0 !== arg
        }));
        return null === (_this$instance2 = this.instance) || void 0 === _this$instance2 ? void 0 : _this$instance2[funcName].apply(_this$instance2, _toConsumableArray(normalizedArgs))
    };
    _proto.instanceOptionChangedHandler = function(e) {
        try {
            this.isTwoWayPropUpdating = true;
            this.updateTwoWayValue(e)
        } finally {
            this.isTwoWayPropUpdating = false
        }
    };
    _proto.updateTwoWayValue = function(e) {
        var isValueCorrect = e.value === e.component.option(e.fullName);
        if (e.value !== e.previousValue && isValueCorrect) {
            if ("editing" === e.name && this.props.editing) {
                if ("editing.changes" === e.fullName) {
                    this.props.editing.changes = e.value
                }
                if ("editing.editRowKey" === e.fullName) {
                    this.props.editing.editRowKey = e.value
                }
                if ("editing.editColumnName" === e.fullName) {
                    this.props.editing.editColumnName = e.value
                }
            }
            if ("searchPanel.text" === e.fullName && this.props.searchPanel) {
                this.props.searchPanel.text = e.value
            }
            if ("focusedRowKey" === e.fullName) {
                this.set_focusedRowKey((function() {
                    return e.value
                }))
            }
            if ("focusedRowIndex" === e.fullName) {
                this.set_focusedRowIndex((function() {
                    return e.value
                }))
            }
            if ("focusedColumnIndex" === e.fullName) {
                this.set_focusedColumnIndex((function() {
                    return e.value
                }))
            }
            if ("filterValue" === e.fullName) {
                this.set_filterValue((function() {
                    return e.value
                }))
            }
            if ("selectedRowKeys" === e.fullName) {
                this.set_selectedRowKeys((function() {
                    return e.value
                }))
            }
            if ("selectionFilter" === e.fullName) {
                this.set_selectionFilter((function() {
                    return e.value
                }))
            }
        }
    };
    _proto.onHoverStart = function(event) {
        event.currentTarget.classList.add("dx-state-hover")
    };
    _proto.onHoverEnd = function(event) {
        event.currentTarget.classList.remove("dx-state-hover")
    };
    _proto.onDimensionChanged = function() {
        var _this$instance3;
        null === (_this$instance3 = this.instance) || void 0 === _this$instance3 ? void 0 : _this$instance3.updateDimensions(true)
    };
    _proto.normalizeProps = function(props) {
        var _this12 = this;
        var result = {};
        Object.keys(props).forEach((function(key) {
            if (void 0 !== _extends({}, _this12.props, {
                    filterValue: _this12.__state_filterValue,
                    focusedColumnIndex: _this12.__state_focusedColumnIndex,
                    focusedRowIndex: _this12.__state_focusedRowIndex,
                    focusedRowKey: _this12.__state_focusedRowKey,
                    selectedRowKeys: _this12.__state_selectedRowKeys,
                    selectionFilter: _this12.__state_selectionFilter
                })[key]) {
                result[key] = props[key]
            }
        }));
        return result
    };
    _proto.createInstance = function() {
        var _this$widgetElementRe;
        var element = null === (_this$widgetElementRe = this.widgetElementRef) || void 0 === _this$widgetElementRe ? void 0 : _this$widgetElementRe.current;
        var _this$props$filterVal = _extends({}, this.props, {
                filterValue: this.__state_filterValue,
                focusedColumnIndex: this.__state_focusedColumnIndex,
                focusedRowIndex: this.__state_focusedRowIndex,
                focusedRowKey: this.__state_focusedRowKey,
                selectedRowKeys: this.__state_selectedRowKeys,
                selectionFilter: this.__state_selectionFilter
            }),
            restProps = (_this$props$filterVal.onOptionChanged, _objectWithoutProperties(_this$props$filterVal, _excluded));
        var instance = new _datagrid_component.DataGridComponent(element, this.normalizeProps(restProps));
        instance.getController("resizing").updateSize(element);
        return instance
    };
    _proto.getComponentInstance = function() {
        return this.instance
    };
    _proto.beginCustomLoading = function(messageText) {
        var _this$instance4;
        return null === (_this$instance4 = this.instance) || void 0 === _this$instance4 ? void 0 : _this$instance4.beginCustomLoading(messageText)
    };
    _proto.byKey = function(key) {
        var _this$instance5;
        return null === (_this$instance5 = this.instance) || void 0 === _this$instance5 ? void 0 : _this$instance5.byKey(key)
    };
    _proto.cancelEditData = function() {
        var _this$instance6;
        return null === (_this$instance6 = this.instance) || void 0 === _this$instance6 ? void 0 : _this$instance6.cancelEditData()
    };
    _proto.cellValue = function(rowIndex, dataField, value) {
        var _this$instance7;
        return null === (_this$instance7 = this.instance) || void 0 === _this$instance7 ? void 0 : _this$instance7.cellValue(rowIndex, dataField, value)
    };
    _proto.clearFilter = function(filterName) {
        var _this$instance8;
        return null === (_this$instance8 = this.instance) || void 0 === _this$instance8 ? void 0 : _this$instance8.clearFilter(filterName)
    };
    _proto.clearSelection = function() {
        var _this$instance9;
        return null === (_this$instance9 = this.instance) || void 0 === _this$instance9 ? void 0 : _this$instance9.clearSelection()
    };
    _proto.clearSorting = function() {
        var _this$instance10;
        return null === (_this$instance10 = this.instance) || void 0 === _this$instance10 ? void 0 : _this$instance10.clearSorting()
    };
    _proto.closeEditCell = function() {
        var _this$instance11;
        return null === (_this$instance11 = this.instance) || void 0 === _this$instance11 ? void 0 : _this$instance11.closeEditCell()
    };
    _proto.collapseAdaptiveDetailRow = function() {
        var _this$instance12;
        return null === (_this$instance12 = this.instance) || void 0 === _this$instance12 ? void 0 : _this$instance12.collapseAdaptiveDetailRow()
    };
    _proto.columnCount = function() {
        var _this$instance13;
        return null === (_this$instance13 = this.instance) || void 0 === _this$instance13 ? void 0 : _this$instance13.columnCount()
    };
    _proto.columnOption = function(id, optionName, optionValue) {
        return this.callMethod("columnOption", arguments)
    };
    _proto.deleteColumn = function(id) {
        var _this$instance14;
        return null === (_this$instance14 = this.instance) || void 0 === _this$instance14 ? void 0 : _this$instance14.deleteColumn(id)
    };
    _proto.deleteRow = function(rowIndex) {
        var _this$instance15;
        return null === (_this$instance15 = this.instance) || void 0 === _this$instance15 ? void 0 : _this$instance15.deleteRow(rowIndex)
    };
    _proto.deselectAll = function() {
        var _this$instance16;
        return null === (_this$instance16 = this.instance) || void 0 === _this$instance16 ? void 0 : _this$instance16.deselectAll()
    };
    _proto.deselectRows = function(keys) {
        var _this$instance17;
        return null === (_this$instance17 = this.instance) || void 0 === _this$instance17 ? void 0 : _this$instance17.deselectRows(keys)
    };
    _proto.editCell = function(rowIndex, dataFieldColumnIndex) {
        var _this$instance18;
        return null === (_this$instance18 = this.instance) || void 0 === _this$instance18 ? void 0 : _this$instance18.editCell(rowIndex, dataFieldColumnIndex)
    };
    _proto.editRow = function(rowIndex) {
        var _this$instance19;
        return null === (_this$instance19 = this.instance) || void 0 === _this$instance19 ? void 0 : _this$instance19.editRow(rowIndex)
    };
    _proto.endCustomLoading = function() {
        var _this$instance20;
        return null === (_this$instance20 = this.instance) || void 0 === _this$instance20 ? void 0 : _this$instance20.endCustomLoading()
    };
    _proto.expandAdaptiveDetailRow = function(key) {
        var _this$instance21;
        return null === (_this$instance21 = this.instance) || void 0 === _this$instance21 ? void 0 : _this$instance21.expandAdaptiveDetailRow(key)
    };
    _proto.filter = function(filterExpr) {
        var _this$instance22;
        return null === (_this$instance22 = this.instance) || void 0 === _this$instance22 ? void 0 : _this$instance22.filter(filterExpr)
    };
    _proto.focus = function(element) {
        var _this$instance23;
        return null === (_this$instance23 = this.instance) || void 0 === _this$instance23 ? void 0 : _this$instance23.focus(element)
    };
    _proto.getCellElement = function(rowIndex, dataField) {
        var _this$instance24;
        return null === (_this$instance24 = this.instance) || void 0 === _this$instance24 ? void 0 : _this$instance24.getCellElement(rowIndex, dataField)
    };
    _proto.getCombinedFilter = function(returnDataField) {
        var _this$instance25;
        return null === (_this$instance25 = this.instance) || void 0 === _this$instance25 ? void 0 : _this$instance25.getCombinedFilter(returnDataField)
    };
    _proto.getDataSource = function() {
        var _this$instance26;
        return null === (_this$instance26 = this.instance) || void 0 === _this$instance26 ? void 0 : _this$instance26.getDataSource()
    };
    _proto.getKeyByRowIndex = function(rowIndex) {
        var _this$instance27;
        return null === (_this$instance27 = this.instance) || void 0 === _this$instance27 ? void 0 : _this$instance27.getKeyByRowIndex(rowIndex)
    };
    _proto.getRowElement = function(rowIndex) {
        var _this$instance28;
        return null === (_this$instance28 = this.instance) || void 0 === _this$instance28 ? void 0 : _this$instance28.getRowElement(rowIndex)
    };
    _proto.getRowIndexByKey = function(key) {
        var _this$instance29;
        return null === (_this$instance29 = this.instance) || void 0 === _this$instance29 ? void 0 : _this$instance29.getRowIndexByKey(key)
    };
    _proto.getScrollable = function() {
        var _this$instance30;
        return null === (_this$instance30 = this.instance) || void 0 === _this$instance30 ? void 0 : _this$instance30.getScrollable()
    };
    _proto.getVisibleColumnIndex = function(id) {
        var _this$instance31;
        return null === (_this$instance31 = this.instance) || void 0 === _this$instance31 ? void 0 : _this$instance31.getVisibleColumnIndex(id)
    };
    _proto.hasEditData = function() {
        var _this$instance32;
        return null === (_this$instance32 = this.instance) || void 0 === _this$instance32 ? void 0 : _this$instance32.hasEditData()
    };
    _proto.hideColumnChooser = function() {
        var _this$instance33;
        return null === (_this$instance33 = this.instance) || void 0 === _this$instance33 ? void 0 : _this$instance33.hideColumnChooser()
    };
    _proto.isAdaptiveDetailRowExpanded = function(key) {
        var _this$instance34;
        return null === (_this$instance34 = this.instance) || void 0 === _this$instance34 ? void 0 : _this$instance34.isAdaptiveDetailRowExpanded(key)
    };
    _proto.isRowFocused = function(key) {
        var _this$instance35;
        return null === (_this$instance35 = this.instance) || void 0 === _this$instance35 ? void 0 : _this$instance35.isRowFocused(key)
    };
    _proto.isRowSelected = function(key) {
        var _this$instance36;
        return null === (_this$instance36 = this.instance) || void 0 === _this$instance36 ? void 0 : _this$instance36.isRowSelected(key)
    };
    _proto.keyOf = function(obj) {
        var _this$instance37;
        return null === (_this$instance37 = this.instance) || void 0 === _this$instance37 ? void 0 : _this$instance37.keyOf(obj)
    };
    _proto.navigateToRow = function(key) {
        var _this$instance38;
        return null === (_this$instance38 = this.instance) || void 0 === _this$instance38 ? void 0 : _this$instance38.navigateToRow(key)
    };
    _proto.pageCount = function() {
        var _this$instance39;
        return null === (_this$instance39 = this.instance) || void 0 === _this$instance39 ? void 0 : _this$instance39.pageCount()
    };
    _proto.pageIndex = function(newIndex) {
        var _this$instance40;
        return null === (_this$instance40 = this.instance) || void 0 === _this$instance40 ? void 0 : _this$instance40.pageIndex(newIndex)
    };
    _proto.pageSize = function(value) {
        var _this$instance41;
        return null === (_this$instance41 = this.instance) || void 0 === _this$instance41 ? void 0 : _this$instance41.pageSize(value)
    };
    _proto.refresh = function(changesOnly) {
        var _this$instance42;
        return null === (_this$instance42 = this.instance) || void 0 === _this$instance42 ? void 0 : _this$instance42.refresh(changesOnly)
    };
    _proto.repaintRows = function(rowIndexes) {
        var _this$instance43;
        return null === (_this$instance43 = this.instance) || void 0 === _this$instance43 ? void 0 : _this$instance43.repaintRows(rowIndexes)
    };
    _proto.saveEditData = function() {
        var _this$instance44;
        return null === (_this$instance44 = this.instance) || void 0 === _this$instance44 ? void 0 : _this$instance44.saveEditData()
    };
    _proto.searchByText = function(text) {
        var _this$instance45;
        return null === (_this$instance45 = this.instance) || void 0 === _this$instance45 ? void 0 : _this$instance45.searchByText(text)
    };
    _proto.selectAll = function() {
        var _this$instance46;
        return null === (_this$instance46 = this.instance) || void 0 === _this$instance46 ? void 0 : _this$instance46.selectAll()
    };
    _proto.selectRows = function(keys, preserve) {
        var _this$instance47;
        return null === (_this$instance47 = this.instance) || void 0 === _this$instance47 ? void 0 : _this$instance47.selectRows(keys, preserve)
    };
    _proto.selectRowsByIndexes = function(indexes) {
        var _this$instance48;
        return null === (_this$instance48 = this.instance) || void 0 === _this$instance48 ? void 0 : _this$instance48.selectRowsByIndexes(indexes)
    };
    _proto.showColumnChooser = function() {
        var _this$instance49;
        return null === (_this$instance49 = this.instance) || void 0 === _this$instance49 ? void 0 : _this$instance49.showColumnChooser()
    };
    _proto.undeleteRow = function(rowIndex) {
        var _this$instance50;
        return null === (_this$instance50 = this.instance) || void 0 === _this$instance50 ? void 0 : _this$instance50.undeleteRow(rowIndex)
    };
    _proto.updateDimensions = function() {
        var _this$instance51;
        return null === (_this$instance51 = this.instance) || void 0 === _this$instance51 ? void 0 : _this$instance51.updateDimensions()
    };
    _proto.resize = function() {
        var _this$instance52;
        return null === (_this$instance52 = this.instance) || void 0 === _this$instance52 ? void 0 : _this$instance52.resize()
    };
    _proto.addColumn = function(columnOptions) {
        var _this$instance53;
        return null === (_this$instance53 = this.instance) || void 0 === _this$instance53 ? void 0 : _this$instance53.addColumn(columnOptions)
    };
    _proto.addRow = function() {
        var _this$instance54;
        return null === (_this$instance54 = this.instance) || void 0 === _this$instance54 ? void 0 : _this$instance54.addRow()
    };
    _proto.clearGrouping = function() {
        var _this$instance55;
        return null === (_this$instance55 = this.instance) || void 0 === _this$instance55 ? void 0 : _this$instance55.clearGrouping()
    };
    _proto.collapseAll = function(groupIndex) {
        var _this$instance56;
        return null === (_this$instance56 = this.instance) || void 0 === _this$instance56 ? void 0 : _this$instance56.collapseAll(groupIndex)
    };
    _proto.collapseRow = function(key) {
        var _this$instance57;
        return null === (_this$instance57 = this.instance) || void 0 === _this$instance57 ? void 0 : _this$instance57.collapseRow(key)
    };
    _proto.expandAll = function(groupIndex) {
        var _this$instance58;
        return null === (_this$instance58 = this.instance) || void 0 === _this$instance58 ? void 0 : _this$instance58.expandAll(groupIndex)
    };
    _proto.expandRow = function(key) {
        var _this$instance59;
        return null === (_this$instance59 = this.instance) || void 0 === _this$instance59 ? void 0 : _this$instance59.expandRow(key)
    };
    _proto.exportToExcel = function(selectionOnly) {
        var _this$instance60;
        return null === (_this$instance60 = this.instance) || void 0 === _this$instance60 ? void 0 : _this$instance60.exportToExcel(selectionOnly)
    };
    _proto.getSelectedRowKeys = function() {
        var _this$instance61;
        return null === (_this$instance61 = this.instance) || void 0 === _this$instance61 ? void 0 : _this$instance61.getSelectedRowKeys()
    };
    _proto.getSelectedRowsData = function() {
        var _this$instance62;
        return null === (_this$instance62 = this.instance) || void 0 === _this$instance62 ? void 0 : _this$instance62.getSelectedRowsData()
    };
    _proto.getTotalSummaryValue = function(summaryItemName) {
        var _this$instance63;
        return null === (_this$instance63 = this.instance) || void 0 === _this$instance63 ? void 0 : _this$instance63.getTotalSummaryValue(summaryItemName)
    };
    _proto.getVisibleColumns = function(headerLevel) {
        var _this$instance64;
        return null === (_this$instance64 = this.instance) || void 0 === _this$instance64 ? void 0 : _this$instance64.getVisibleColumns(headerLevel)
    };
    _proto.getVisibleRows = function() {
        var _this$instance65;
        return null === (_this$instance65 = this.instance) || void 0 === _this$instance65 ? void 0 : _this$instance65.getVisibleRows()
    };
    _proto.isRowExpanded = function(key) {
        var _this$instance66;
        return null === (_this$instance66 = this.instance) || void 0 === _this$instance66 ? void 0 : _this$instance66.isRowExpanded(key)
    };
    _proto.totalCount = function() {
        var _this$instance67;
        return null === (_this$instance67 = this.instance) || void 0 === _this$instance67 ? void 0 : _this$instance67.totalCount()
    };
    _proto.isScrollbarVisible = function() {
        var _this$instance68;
        return null === (_this$instance68 = this.instance) || void 0 === _this$instance68 ? void 0 : _this$instance68.isScrollbarVisible()
    };
    _proto.getTopVisibleRowData = function() {
        var _this$instance69;
        return null === (_this$instance69 = this.instance) || void 0 === _this$instance69 ? void 0 : _this$instance69.getTopVisibleRowData()
    };
    _proto.getScrollbarWidth = function(isHorizontal) {
        var _this$instance70;
        return null === (_this$instance70 = this.instance) || void 0 === _this$instance70 ? void 0 : _this$instance70.getScrollbarWidth(isHorizontal)
    };
    _proto.render = function() {
        var props = this.props;
        return viewFunction({
            props: _extends({}, props, {
                filterValue: this.__state_filterValue,
                focusedColumnIndex: this.__state_focusedColumnIndex,
                focusedRowIndex: this.__state_focusedRowIndex,
                focusedRowKey: this.__state_focusedRowKey,
                selectedRowKeys: this.__state_selectedRowKeys,
                selectionFilter: this.__state_selectionFilter,
                rowTemplate: getTemplate(props.rowTemplate)
            }),
            instance: this.instance,
            widgetElementRef: this.widgetElementRef,
            callMethod: this.callMethod,
            instanceOptionChangedHandler: this.instanceOptionChangedHandler,
            updateTwoWayValue: this.updateTwoWayValue,
            onHoverStart: this.onHoverStart,
            onHoverEnd: this.onHoverEnd,
            onDimensionChanged: this.onDimensionChanged,
            normalizeProps: this.normalizeProps,
            createInstance: this.createInstance,
            restAttributes: this.restAttributes
        })
    };
    _createClass(DataGrid, [{
        key: "instance",
        get: function() {
            var state = this._currentState || this.state;
            return state.instance
        }
    }, {
        key: "__state_filterValue",
        get: function() {
            var state = this._currentState || this.state;
            return void 0 !== this.props.filterValue ? this.props.filterValue : state.filterValue
        }
    }, {
        key: "__state_focusedColumnIndex",
        get: function() {
            var state = this._currentState || this.state;
            return void 0 !== this.props.focusedColumnIndex ? this.props.focusedColumnIndex : state.focusedColumnIndex
        }
    }, {
        key: "__state_focusedRowIndex",
        get: function() {
            var state = this._currentState || this.state;
            return void 0 !== this.props.focusedRowIndex ? this.props.focusedRowIndex : state.focusedRowIndex
        }
    }, {
        key: "__state_focusedRowKey",
        get: function() {
            var state = this._currentState || this.state;
            return void 0 !== this.props.focusedRowKey ? this.props.focusedRowKey : state.focusedRowKey
        }
    }, {
        key: "__state_selectedRowKeys",
        get: function() {
            var state = this._currentState || this.state;
            return void 0 !== this.props.selectedRowKeys ? this.props.selectedRowKeys : state.selectedRowKeys
        }
    }, {
        key: "__state_selectionFilter",
        get: function() {
            var state = this._currentState || this.state;
            return void 0 !== this.props.selectionFilter ? this.props.selectionFilter : state.selectionFilter
        }
    }, {
        key: "restAttributes",
        get: function() {
            var _this$props$filterVal2 = _extends({}, this.props, {
                    filterValue: this.__state_filterValue,
                    focusedColumnIndex: this.__state_focusedColumnIndex,
                    focusedRowIndex: this.__state_focusedRowIndex,
                    focusedRowKey: this.__state_focusedRowKey,
                    selectedRowKeys: this.__state_selectedRowKeys,
                    selectionFilter: this.__state_selectionFilter
                }),
                restProps = (_this$props$filterVal2.accessKey, _this$props$filterVal2.activeStateEnabled, _this$props$filterVal2.allowColumnReordering, _this$props$filterVal2.allowColumnResizing, _this$props$filterVal2.autoNavigateToFocusedRow, _this$props$filterVal2.cacheEnabled, _this$props$filterVal2.cellHintEnabled, _this$props$filterVal2.columnAutoWidth, _this$props$filterVal2.columnChooser, _this$props$filterVal2.columnFixing, _this$props$filterVal2.columnHidingEnabled, _this$props$filterVal2.columnMinWidth, _this$props$filterVal2.columnResizingMode, _this$props$filterVal2.columnWidth, _this$props$filterVal2.columns, _this$props$filterVal2.commonColumnSettings, _this$props$filterVal2.customizeColumns, _this$props$filterVal2.customizeExportData, _this$props$filterVal2.dataSource, _this$props$filterVal2.dateSerializationFormat, _this$props$filterVal2.defaultFilterValue, _this$props$filterVal2.defaultFocusedColumnIndex, _this$props$filterVal2.defaultFocusedRowIndex, _this$props$filterVal2.defaultFocusedRowKey, _this$props$filterVal2.defaultSelectedRowKeys, _this$props$filterVal2.defaultSelectionFilter, _this$props$filterVal2.disabled, _this$props$filterVal2.editing, _this$props$filterVal2.errorRowEnabled, _this$props$filterVal2.export, _this$props$filterVal2.filterBuilder, _this$props$filterVal2.filterBuilderPopup, _this$props$filterVal2.filterPanel, _this$props$filterVal2.filterRow, _this$props$filterVal2.filterSyncEnabled, _this$props$filterVal2.filterValue, _this$props$filterVal2.filterValueChange, _this$props$filterVal2.focusStateEnabled, _this$props$filterVal2.focusedColumnIndex, _this$props$filterVal2.focusedColumnIndexChange, _this$props$filterVal2.focusedRowEnabled, _this$props$filterVal2.focusedRowIndex, _this$props$filterVal2.focusedRowIndexChange, _this$props$filterVal2.focusedRowKey, _this$props$filterVal2.focusedRowKeyChange, _this$props$filterVal2.groupPanel, _this$props$filterVal2.grouping, _this$props$filterVal2.headerFilter, _this$props$filterVal2.height, _this$props$filterVal2.highlightChanges, _this$props$filterVal2.hint, _this$props$filterVal2.hoverStateEnabled, _this$props$filterVal2.keyExpr, _this$props$filterVal2.keyboardNavigation, _this$props$filterVal2.loadPanel, _this$props$filterVal2.loadingTimeout, _this$props$filterVal2.masterDetail, _this$props$filterVal2.noDataText, _this$props$filterVal2.onAdaptiveDetailRowPreparing, _this$props$filterVal2.onCellClick, _this$props$filterVal2.onCellDblClick, _this$props$filterVal2.onCellHoverChanged, _this$props$filterVal2.onCellPrepared, _this$props$filterVal2.onClick, _this$props$filterVal2.onContentReady, _this$props$filterVal2.onContextMenuPreparing, _this$props$filterVal2.onDataErrorOccurred, _this$props$filterVal2.onEditingStart, _this$props$filterVal2.onEditorPrepared, _this$props$filterVal2.onEditorPreparing, _this$props$filterVal2.onExported, _this$props$filterVal2.onExporting, _this$props$filterVal2.onFileSaving, _this$props$filterVal2.onFocusedCellChanged, _this$props$filterVal2.onFocusedCellChanging, _this$props$filterVal2.onFocusedRowChanged, _this$props$filterVal2.onFocusedRowChanging, _this$props$filterVal2.onInitNewRow, _this$props$filterVal2.onKeyDown, _this$props$filterVal2.onRowClick, _this$props$filterVal2.onRowCollapsed, _this$props$filterVal2.onRowCollapsing, _this$props$filterVal2.onRowDblClick, _this$props$filterVal2.onRowExpanded, _this$props$filterVal2.onRowExpanding, _this$props$filterVal2.onRowInserted, _this$props$filterVal2.onRowInserting, _this$props$filterVal2.onRowPrepared, _this$props$filterVal2.onRowRemoved, _this$props$filterVal2.onRowRemoving, _this$props$filterVal2.onRowUpdated, _this$props$filterVal2.onRowUpdating, _this$props$filterVal2.onRowValidating, _this$props$filterVal2.onSelectionChanged, _this$props$filterVal2.onToolbarPreparing, _this$props$filterVal2.pager, _this$props$filterVal2.paging, _this$props$filterVal2.remoteOperations, _this$props$filterVal2.renderAsync, _this$props$filterVal2.repaintChangesOnly, _this$props$filterVal2.rowAlternationEnabled, _this$props$filterVal2.rowDragging, _this$props$filterVal2.rowTemplate, _this$props$filterVal2.rtlEnabled, _this$props$filterVal2.scrolling, _this$props$filterVal2.searchPanel, _this$props$filterVal2.selectedRowKeys, _this$props$filterVal2.selectedRowKeysChange, _this$props$filterVal2.selection, _this$props$filterVal2.selectionFilter, _this$props$filterVal2.selectionFilterChange, _this$props$filterVal2.showBorders, _this$props$filterVal2.showColumnHeaders, _this$props$filterVal2.showColumnLines, _this$props$filterVal2.showRowLines, _this$props$filterVal2.sortByGroupSummaryInfo, _this$props$filterVal2.sorting, _this$props$filterVal2.stateStoring, _this$props$filterVal2.summary, _this$props$filterVal2.tabIndex, _this$props$filterVal2.twoWayBindingEnabled, _this$props$filterVal2.useKeyboard, _this$props$filterVal2.visible, _this$props$filterVal2.width, _this$props$filterVal2.wordWrapEnabled, _objectWithoutProperties(_this$props$filterVal2, _excluded2));
            return restProps
        }
    }]);
    return DataGrid
}(_vdom.InfernoWrapperComponent);
exports.DataGrid = DataGrid;
DataGrid.defaultProps = _extends({}, _data_grid_props.DataGridProps);
