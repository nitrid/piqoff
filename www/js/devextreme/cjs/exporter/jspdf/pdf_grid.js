/**
 * DevExtreme (cjs/exporter/jspdf/pdf_grid.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.PdfGrid = void 0;
var _type = require("../../core/utils/type");
var _pdf_table = require("./pdf_table");

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
var PdfGrid = function() {
    function PdfGrid(splitByColumns, columnWidths) {
        this._splitByColumns = null !== splitByColumns && void 0 !== splitByColumns ? splitByColumns : [];
        this._columnWidths = null !== columnWidths && void 0 !== columnWidths ? columnWidths : [];
        this._newPageTables = [];
        this._tables = [];
        this._currentHorizontalTables = null
    }
    var _proto = PdfGrid.prototype;
    _proto._addLastTableToNewPages = function() {
        this._newPageTables.push(this._currentHorizontalTables[this._currentHorizontalTables.length - 1])
    };
    _proto.startNewTable = function(drawTableBorder, firstTableTopLeft, firstTableOnNewPage, splitByColumns, firstColumnWidth) {
        var _this$_splitByColumns, _this$_splitByColumns2, _this$_tables;
        if ((0, _type.isDefined)(splitByColumns)) {
            this._splitByColumns = splitByColumns
        }
        var firstTableEndColumnIndex = null !== (_this$_splitByColumns = null === (_this$_splitByColumns2 = this._splitByColumns[0]) || void 0 === _this$_splitByColumns2 ? void 0 : _this$_splitByColumns2.columnIndex) && void 0 !== _this$_splitByColumns ? _this$_splitByColumns : this._columnWidths.length;
        var firstTableColumnWidths = this._columnWidths.slice(0, firstTableEndColumnIndex);
        if ((0, _type.isDefined)(firstColumnWidth)) {
            firstTableColumnWidths[0] = firstColumnWidth
        }
        this._currentHorizontalTables = [new _pdf_table.PdfTable(drawTableBorder, firstTableTopLeft, firstTableColumnWidths)];
        if (firstTableOnNewPage) {
            this._addLastTableToNewPages()
        }
        if ((0, _type.isDefined)(this._splitByColumns)) {
            for (var i = 0; i < this._splitByColumns.length; i++) {
                var _this$_splitByColumns3, _this$_splitByColumns4;
                var beginColumnIndex = this._splitByColumns[i].columnIndex;
                var endColumnIndex = null !== (_this$_splitByColumns3 = null === (_this$_splitByColumns4 = this._splitByColumns[i + 1]) || void 0 === _this$_splitByColumns4 ? void 0 : _this$_splitByColumns4.columnIndex) && void 0 !== _this$_splitByColumns3 ? _this$_splitByColumns3 : this._columnWidths.length;
                this._currentHorizontalTables.push(new _pdf_table.PdfTable(drawTableBorder, this._splitByColumns[i].tableTopLeft, this._columnWidths.slice(beginColumnIndex, endColumnIndex)));
                if (this._splitByColumns[i].drawOnNewPage) {
                    this._addLastTableToNewPages()
                }
            }
        }(_this$_tables = this._tables).push.apply(_this$_tables, _toConsumableArray(this._currentHorizontalTables))
    };
    _proto.addRow = function(cells, rowHeight) {
        var _this = this;
        var currentTableIndex = 0;
        var currentTableCells = [];
        var _loop = function(cellIndex) {
            var isNewTableColumn = _this._splitByColumns.filter((function(splitByColumn) {
                return splitByColumn.columnIndex === cellIndex
            }))[0];
            if (isNewTableColumn) {
                _this._currentHorizontalTables[currentTableIndex].addRow(currentTableCells, rowHeight);
                _this._trySplitColSpanArea(cells, cellIndex);
                currentTableIndex++;
                currentTableCells = []
            }
            currentTableCells.push(cells[cellIndex])
        };
        for (var cellIndex = 0; cellIndex < cells.length; cellIndex++) {
            _loop(cellIndex)
        }
        this._currentHorizontalTables[currentTableIndex].addRow(currentTableCells, rowHeight)
    };
    _proto._trySplitColSpanArea = function(cells, splitIndex) {
        var colSpanArea = this._findColSpanArea(cells, splitIndex);
        if ((0, _type.isDefined)(colSpanArea)) {
            var leftAreaColSpan = splitIndex - colSpanArea.startIndex - 1;
            var rightAreaColSpan = colSpanArea.endIndex - splitIndex;
            cells[splitIndex].text = cells[colSpanArea.startIndex].text;
            for (var index = colSpanArea.startIndex; index <= colSpanArea.endIndex; index++) {
                var colSpan = index < splitIndex ? leftAreaColSpan : rightAreaColSpan;
                if (colSpan > 0) {
                    cells[index].colSpan = colSpan
                } else {
                    delete cells[index].colSpan
                }
            }
        }
    };
    _proto._findColSpanArea = function(cells, targetCellIndex) {
        for (var index = 0; index < cells.length; index++) {
            if (cells[index].colSpan > 0) {
                var colSpan = cells[index].colSpan;
                var startIndex = index;
                var endIndex = startIndex + colSpan;
                if (startIndex < targetCellIndex && targetCellIndex <= endIndex) {
                    return {
                        colSpan: colSpan,
                        startIndex: startIndex,
                        endIndex: endIndex
                    }
                } else {
                    index = endIndex
                }
            }
        }
        return null
    };
    _proto.mergeCellsBySpanAttributes = function() {
        this._tables.forEach((function(table) {
            for (var rowIndex = 0; rowIndex < table.rows.length; rowIndex++) {
                for (var cellIndex = 0; cellIndex < table.rows[rowIndex].length; cellIndex++) {
                    var cell = table.rows[rowIndex][cellIndex];
                    if (!cell.skip) {
                        if ((0, _type.isDefined)(cell.rowSpan)) {
                            for (var i = 1; i <= cell.rowSpan; i++) {
                                var mergedCell = table.rows[rowIndex + i][cellIndex];
                                if ((0, _type.isDefined)(mergedCell)) {
                                    cell._rect.h += mergedCell._rect.h;
                                    mergedCell.skip = true
                                }
                            }
                        }
                        if ((0, _type.isDefined)(cell.colSpan)) {
                            for (var _i = 1; _i <= cell.colSpan; _i++) {
                                var _mergedCell = table.rows[rowIndex][cellIndex + _i];
                                if ((0, _type.isDefined)(_mergedCell)) {
                                    cell._rect.w += _mergedCell._rect.w;
                                    _mergedCell.skip = true
                                }
                            }
                        }
                    }
                }
            }
        }))
    };
    _proto.drawTo = function(doc) {
        var _this2 = this;
        this._tables.forEach((function(table) {
            if (-1 !== _this2._newPageTables.indexOf(table)) {
                doc.addPage()
            }
            table.drawTo(doc)
        }))
    };
    return PdfGrid
}();
exports.PdfGrid = PdfGrid;
