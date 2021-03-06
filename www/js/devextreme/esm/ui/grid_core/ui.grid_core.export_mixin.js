/**
 * DevExtreme (esm/ui/grid_core/ui.grid_core.export_mixin.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import {
    extend
} from "../../core/utils/extend";
export default {
    _getEmptyCell: function() {
        return {
            text: "",
            value: void 0,
            colspan: 1,
            rowspan: 1
        }
    },
    _defaultSetter: function(value) {
        return !value ? 1 : value
    },
    _cloneItem: function(item) {
        return extend({}, item, this._getEmptyCell())
    },
    _prepareItems: function(items) {
        var that = this;
        var resultItems = [];
        var cols = (items[0] || []).reduce((sum, item) => sum + that._defaultSetter(item.colspan), 0);
        var getItem = function(items) {
            var rowIndex = 0;
            var cellIndex = 0;
            return function() {
                var row = items[rowIndex] || [];
                var item = row[cellIndex++];
                if (cellIndex >= row.length) {
                    rowIndex++;
                    cellIndex = 0
                }
                if (item) {
                    item.colspan = that._defaultSetter(item.colspan);
                    item.rowspan = that._defaultSetter(item.rowspan)
                }
                return item
            }
        }(items);

        function addItem(rowIndex, cellIndex, item) {
            var row = resultItems[rowIndex] = resultItems[rowIndex] || [];
            row[cellIndex] = item;
            if (item.colspan > 1 || item.rowspan > 1) {
                var clone = that._cloneItem(item);
                for (var c = 1; c < item.colspan; c++) {
                    addItem(rowIndex, cellIndex + c, clone)
                }
                for (var r = 1; r < item.rowspan; r++) {
                    for (var _c = 0; _c < item.colspan; _c++) {
                        addItem(rowIndex + r, cellIndex + _c, clone)
                    }
                }
            }
        }
        var item = getItem();
        var rowIndex = 0;
        while (item) {
            for (var cellIndex = 0; cellIndex < cols; cellIndex++) {
                if (!item) {
                    break
                }
                if (resultItems[rowIndex] && resultItems[rowIndex][cellIndex]) {
                    continue
                }
                addItem(rowIndex, cellIndex, item);
                cellIndex += item.colspan - 1;
                item = getItem()
            }
            rowIndex++
        }
        return resultItems
    }
};
