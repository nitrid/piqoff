/**
 * DevExtreme (cjs/exporter/jspdf/pdf_table.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.PdfTable = void 0;
var _type = require("../../core/utils/type");
var _draw_pdf_table = require("./draw_pdf_table");
var PdfTable = function() {
    function PdfTable(drawTableBorder, topLeft, columnWidths) {
        if (!(0, _type.isDefined)(columnWidths)) {
            throw "columnWidths is required"
        }
        if (!(0, _type.isDefined)(topLeft)) {
            throw "topLeft is required"
        }
        this.drawTableBorder = drawTableBorder;
        this.rect = {
            x: topLeft.x,
            y: topLeft.y,
            w: columnWidths.reduce((function(a, b) {
                return a + b
            }), 0),
            h: 0
        };
        this.columnWidths = columnWidths;
        this.rowHeights = [];
        this.rows = []
    }
    var _proto = PdfTable.prototype;
    _proto.getCellX = function(cellIndex) {
        return this.rect.x + this.columnWidths.slice(0, cellIndex).reduce((function(a, b) {
            return a + b
        }), 0)
    };
    _proto.getCellY = function(rowIndex) {
        return this.rect.y + this.rowHeights.slice(0, rowIndex).reduce((function(a, b) {
            return a + b
        }), 0)
    };
    _proto.addRow = function(cells, rowHeight) {
        if (!(0, _type.isDefined)(cells)) {
            throw "cells is required"
        }
        if (cells.length !== this.columnWidths.length) {
            throw "the length of the cells must be equal to the length of the column"
        }
        if (!(0, _type.isDefined)(rowHeight)) {
            throw "rowHeight is required"
        }
        this.rows.push(cells);
        this.rowHeights.push(rowHeight);
        for (var i = 0; i < cells.length; i++) {
            var currentCell = cells[i];
            if (false === currentCell.drawLeftBorder && !(0, _type.isDefined)(currentCell.colSpan)) {
                if (i >= 1) {
                    cells[i - 1].drawRightBorder = false
                }
            } else if (!(0, _type.isDefined)(currentCell.drawLeftBorder)) {
                if (i >= 1 && false === cells[i - 1].drawRightBorder) {
                    currentCell.drawLeftBorder = false
                }
            }
            if (false === currentCell.drawTopBorder) {
                if (this.rows.length >= 2) {
                    this.rows[this.rows.length - 2][i].drawBottomBorder = false
                }
            } else if (!(0, _type.isDefined)(currentCell.drawTopBorder)) {
                if (this.rows.length >= 2 && false === this.rows[this.rows.length - 2][i].drawBottomBorder) {
                    currentCell.drawTopBorder = false
                }
            }
            var columnWidth = this.columnWidths[i];
            if (!(0, _type.isDefined)(columnWidth)) {
                throw "column width is required"
            }
            currentCell._rect = {
                x: this.getCellX(i),
                y: this.getCellY(this.rows.length - 1),
                w: columnWidth,
                h: rowHeight
            }
        }
        this.rect.h = this.rowHeights.reduce((function(a, b) {
            return a + b
        }), 0)
    };
    _proto.drawTo = function(doc) {
        (0, _draw_pdf_table.drawPdfTable)(doc, this)
    };
    return PdfTable
}();
exports.PdfTable = PdfTable;
