/**
 * DevExtreme (esm/exporter/jspdf/export_data_grid_row_info.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import {
    isDefined
} from "../../core/utils/type";

function createRowInfo(_ref) {
    var {
        dataProvider: dataProvider,
        rowIndex: rowIndex,
        rowOptions: rowOptions,
        prevRowInfo: prevRowInfo
    } = _ref;
    var rowType = dataProvider.getCellData(rowIndex, 0, true).cellSourceData.rowType;
    var indentLevel = "header" !== rowType ? dataProvider.getGroupLevel(rowIndex) : 0;
    if ("groupFooter" === rowType && "groupFooter" === (null === prevRowInfo || void 0 === prevRowInfo ? void 0 : prevRowInfo.rowType)) {
        indentLevel = prevRowInfo.indentLevel - 1
    }
    var startNewTableWithIndent = void 0 !== (null === prevRowInfo || void 0 === prevRowInfo ? void 0 : prevRowInfo.indentLevel) && prevRowInfo.indentLevel !== indentLevel;
    var columns = dataProvider.getColumns();
    var rowInfo = {
        rowType: rowType,
        rowHeight: rowOptions.rowHeight,
        indentLevel: indentLevel,
        startNewTableWithIndent: startNewTableWithIndent,
        cellsInfo: [],
        rowIndex: rowIndex
    };
    _fillRowCellsInfo({
        rowInfo: rowInfo,
        rowOptions: rowOptions,
        dataProvider: dataProvider,
        columns: columns
    });
    return rowInfo
}

function createPdfCell(cellInfo) {
    return {
        text: cellInfo.text,
        rowSpan: cellInfo.rowSpan,
        colSpan: cellInfo.colSpan,
        drawLeftBorder: cellInfo.drawLeftBorder,
        drawRightBorder: cellInfo.drawRightBorder,
        backgroundColor: cellInfo.backgroundColor
    }
}

function _createCellInfo(_ref2) {
    var {
        rowInfo: rowInfo,
        rowOptions: rowOptions,
        dataProvider: dataProvider,
        cellIndex: cellIndex
    } = _ref2;
    var cellData = dataProvider.getCellData(rowInfo.rowIndex, cellIndex, true);
    var cellInfo = {
        value: cellData.value,
        text: cellData.value
    };
    if ("header" === rowInfo.rowType) {
        var _rowOptions$headerSty;
        var cellMerging = dataProvider.getCellMerging(rowInfo.rowIndex, cellIndex);
        if (cellMerging && cellMerging.rowspan > 0) {
            cellInfo.rowSpan = cellMerging.rowspan
        }
        if (cellMerging && cellMerging.colspan > 0) {
            cellInfo.colSpan = cellMerging.colspan
        }
        if (isDefined(null === (_rowOptions$headerSty = rowOptions.headerStyles) || void 0 === _rowOptions$headerSty ? void 0 : _rowOptions$headerSty.backgroundColor)) {
            cellInfo.backgroundColor = rowOptions.headerStyles.backgroundColor
        }
    } else if ("group" === rowInfo.rowType) {
        var _rowOptions$groupStyl;
        cellInfo.drawLeftBorder = false;
        cellInfo.drawRightBorder = false;
        if (cellIndex > 0) {
            var isEmptyCellsExceptFirst = rowInfo.cellsInfo.slice(1).reduce((accumulate, pdfCell) => accumulate && !isDefined(pdfCell.text), true);
            if (!isDefined(cellInfo.text) && isEmptyCellsExceptFirst) {
                for (var i = 0; i < rowInfo.cellsInfo.length; i++) {
                    rowInfo.cellsInfo[i].colSpan = rowInfo.cellsInfo.length
                }
                cellInfo.colSpan = rowInfo.cellsInfo.length
            }
        }
        if (isDefined(null === (_rowOptions$groupStyl = rowOptions.groupStyles) || void 0 === _rowOptions$groupStyl ? void 0 : _rowOptions$groupStyl.backgroundColor)) {
            cellInfo.backgroundColor = rowOptions.groupStyles.backgroundColor
        }
    } else if ("groupFooter" === rowInfo.rowType || "totalFooter" === rowInfo.rowType) {
        var _rowOptions$totalStyl;
        if (isDefined(null === (_rowOptions$totalStyl = rowOptions.totalStyles) || void 0 === _rowOptions$totalStyl ? void 0 : _rowOptions$totalStyl.backgroundColor)) {
            cellInfo.backgroundColor = rowOptions.totalStyles.backgroundColor
        }
    }
    return cellInfo
}

function _fillRowCellsInfo(_ref3) {
    var {
        rowInfo: rowInfo,
        rowOptions: rowOptions,
        dataProvider: dataProvider,
        columns: columns
    } = _ref3;
    for (var cellIndex = 0; cellIndex < columns.length; cellIndex++) {
        rowInfo.cellsInfo.push(_createCellInfo({
            rowInfo: rowInfo,
            rowOptions: rowOptions,
            dataProvider: dataProvider,
            cellIndex: cellIndex
        }))
    }
    if ("group" === rowInfo.rowType) {
        rowInfo.cellsInfo[0].drawLeftBorder = true;
        if (rowInfo.cellsInfo[0].colSpan === rowInfo.cellsInfo.length - 1) {
            rowInfo.cellsInfo[0].drawRightBorder = true
        }
        var lastCell = rowInfo.cellsInfo[rowInfo.cellsInfo.length - 1];
        if (!isDefined(lastCell.colSpan)) {
            lastCell.drawRightBorder = true
        }
    }
}
export {
    createRowInfo,
    createPdfCell
};
