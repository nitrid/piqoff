/**
 * DevExtreme (cjs/exporter/jspdf/export_data_grid_2.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.exportDataGrid = exportDataGrid;
var _type = require("../../core/utils/type");
var _extend = require("../../core/utils/extend");
var _pdf_grid = require("./pdf_grid");
var _export_data_grid_row_info = require("./export_data_grid_row_info");

function _getFullOptions(options) {
    var fullOptions = (0, _extend.extend)({}, options);
    if (!(0, _type.isDefined)(fullOptions.topLeft)) {
        throw "options.topLeft is required"
    }
    if (!(0, _type.isDefined)(fullOptions.indent)) {
        fullOptions.indent = 10
    }
    return fullOptions
}

function exportDataGrid(doc, dataGrid, options) {
    options = (0, _extend.extend)({}, _getFullOptions(options));
    var dataProvider = dataGrid.getDataProvider();
    return new Promise((function(resolve) {
        dataProvider.ready().done((function() {
            var pdfGrid = new _pdf_grid.PdfGrid(options.splitToTablesByColumns, options.columnWidths);
            pdfGrid.startNewTable(options.drawTableBorder, options.topLeft);
            var dataRowsCount = dataProvider.getRowsCount();
            var rowOptions = options.rowOptions || {};
            var currentRowInfo;
            var prevRowInfo;
            var _loop = function(rowIndex) {
                prevRowInfo = currentRowInfo;
                currentRowInfo = (0, _export_data_grid_row_info.createRowInfo)({
                    dataProvider: dataProvider,
                    rowIndex: rowIndex,
                    rowOptions: rowOptions,
                    prevRowInfo: prevRowInfo
                });
                var currentRowPdfCells = [];
                currentRowInfo.cellsInfo.forEach((function(cellInfo) {
                    var pdfCell = (0, _export_data_grid_row_info.createPdfCell)(cellInfo);
                    if (options.onCellExporting) {
                        options.onCellExporting({
                            gridCell: {
                                value: cellInfo.value
                            },
                            pdfCell: pdfCell
                        })
                    }
                    currentRowPdfCells.push(pdfCell)
                }));
                if (currentRowInfo.startNewTableWithIndent) {
                    var indent = currentRowInfo.indentLevel * options.indent;
                    var prevTable = pdfGrid._currentHorizontalTables[0];
                    var firstColumnWidth = options.columnWidths[0] - indent;
                    var tableTopLeft = {
                        x: options.topLeft.x + indent,
                        y: prevTable.rect.y + prevTable.rect.h
                    };
                    pdfGrid.startNewTable(options.drawTableBorder, tableTopLeft, null, null, firstColumnWidth)
                }
                var rowHeight = currentRowInfo.rowHeight;
                if (options.onRowExporting) {
                    var args = {
                        drawNewTableFromThisRow: {},
                        rowCells: currentRowPdfCells
                    };
                    options.onRowExporting(args);
                    var _args$drawNewTableFro = args.drawNewTableFromThisRow,
                        startNewTable = _args$drawNewTableFro.startNewTable,
                        addPage = _args$drawNewTableFro.addPage,
                        _tableTopLeft = _args$drawNewTableFro.tableTopLeft,
                        splitToTablesByColumns = _args$drawNewTableFro.splitToTablesByColumns;
                    if (true === startNewTable) {
                        pdfGrid.startNewTable(options.drawTableBorder, _tableTopLeft, true === addPage, splitToTablesByColumns)
                    }
                    if ((0, _type.isDefined)(args.rowHeight)) {
                        rowHeight = args.rowHeight
                    }
                }
                pdfGrid.addRow(currentRowPdfCells, rowHeight)
            };
            for (var rowIndex = 0; rowIndex < dataRowsCount; rowIndex++) {
                _loop(rowIndex)
            }
            pdfGrid.mergeCellsBySpanAttributes();
            pdfGrid.drawTo(doc);
            resolve()
        }))
    }))
}
