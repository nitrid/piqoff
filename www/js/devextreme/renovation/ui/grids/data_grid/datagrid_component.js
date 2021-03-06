/**
 * DevExtreme (renovation/ui/grids/data_grid/datagrid_component.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.DataGridComponent = void 0;
var _uiData_grid = _interopRequireDefault(require("../../../../ui/data_grid/ui.data_grid.base"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
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
var DATA_GRID_NAME = "dxDataGrid";
var DataGridComponent = function(_DataGridBase) {
    _inheritsLoose(DataGridComponent, _DataGridBase);

    function DataGridComponent(element, options) {
        var _this;
        _this = _DataGridBase.call(this, element, options) || this;
        _this.NAME = DATA_GRID_NAME;
        return _this
    }
    var _proto = DataGridComponent.prototype;
    _proto._initTemplates = function() {};
    _proto._updateDOMComponent = function() {};
    _proto._isDimensionChangeSupported = function() {
        return false
    };
    return DataGridComponent
}(_uiData_grid.default);
exports.DataGridComponent = DataGridComponent;
