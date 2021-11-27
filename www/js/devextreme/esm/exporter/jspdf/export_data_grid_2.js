/**
 * DevExtreme (esm/exporter/jspdf/export_data_grid_2.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import {
    isDefined
} from "../../core/utils/type";
import {
    extend
} from "../../core/utils/extend";
import {
    PdfGrid
} from "./pdf_grid";
import {
    createRowInfo,
    createPdfCell
} from "./export_data_grid_row_info";

function _getFullOptions(options) {
    var fullOptions = extend({}, options);
    if (!isDefined(fullOptions.topLeft)) {
        throw "options.topLeft is required"
    }
    if (!isDefined(fullOptions.indent)) {
        fullOptions.indent = 10
    }
    return fullOptions
}

function exportDataGrid(doc, dataGrid, options) {
    options = extend({}, _getFullOptions(options));
    var dataProvider = dataGrid.getDataProvider();
    return new Promise(resolve => {
        dataProvider.ready().done(() => {
            var pdfGrid = new PdfGrid(options.splitToTablesByColumns, options.columnWidths);
            pdfGrid.startNewTable(options.drawTableBorder, options.topLeft);
            var dataRowsCount = dataProvider.getRowsCount();
            var rowOptions = options.rowOptions || {};
            var currentRowInfo;
            var prevRowInfo;
            var _loop = function(rowIndex) {
                prevRowInfo = currentRowInfo;
                currentRowInfo = createRowInfo({
                    dataProvider: dataProvider,
                    rowIndex: rowIndex,
                    rowOptions: rowOptions,
                    prevRowInfo: prevRowInfo
                });
                var currentRowPdfCells = [];
                currentRowInfo.cellsInfo.forEach(cellInfo => {
                    var pdfCell = createPdfCell(cellInfo);
                    if (options.onCellExporting) {
                        options.onCellExporting({
                            gridCell: {
                                value: cellInfo.value
                            },
                            pdfCell: pdfCell
                        })
                    }
                    currentRowPdfCells.push(pdfCell)
                });
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
                    var {
                        startNewTable: startNewTable,
                        addPage: addPage,
                        tableTopLeft: _tableTopLeft,
                        splitToTablesByColumns: splitToTablesByColumns
                    } = args.drawNewTableFromThisRow;
                    if (true === startNewTable) {
                        pdfGrid.startNewTable(options.drawTableBorder, _tableTopLeft, true === addPage, splitToTablesByColumns)
                    }
                    if (isDefined(args.rowHeight)) {
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
        })
    })
}
export {
    exportDataGrid
};
