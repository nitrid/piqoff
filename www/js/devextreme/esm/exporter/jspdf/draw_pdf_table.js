/**
 * DevExtreme (esm/exporter/jspdf/draw_pdf_table.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import {
    extend
} from "../../core/utils/extend";
import {
    isDefined
} from "../../core/utils/type";
export function drawPdfTable(doc, table) {
    if (!isDefined(doc)) {
        throw "doc is required"
    }

    function drawBorder(rect) {
        var drawLeftBorder = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : true;
        var drawRightBorder = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : true;
        var drawTopBorder = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : true;
        var drawBottomBorder = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : true;
        if (!isDefined(rect)) {
            throw "rect is required"
        }
        var defaultBorderLineWidth = 1;
        if (!drawLeftBorder && !drawRightBorder && !drawTopBorder && !drawBottomBorder) {
            return
        } else if (drawLeftBorder && drawRightBorder && drawTopBorder && drawBottomBorder) {
            doc.setLineWidth(defaultBorderLineWidth);
            doc.rect(rect.x, rect.y, rect.w, rect.h)
        } else {
            doc.setLineWidth(defaultBorderLineWidth);
            if (drawTopBorder) {
                doc.line(rect.x, rect.y, rect.x + rect.w, rect.y)
            }
            if (drawLeftBorder) {
                doc.line(rect.x, rect.y, rect.x, rect.y + rect.h)
            }
            if (drawRightBorder) {
                doc.line(rect.x + rect.w, rect.y, rect.x + rect.w, rect.y + rect.h)
            }
            if (drawBottomBorder) {
                doc.line(rect.x, rect.y + rect.h, rect.x + rect.w, rect.y + rect.h)
            }
        }
    }

    function drawRow(rowCells) {
        if (!isDefined(rowCells)) {
            throw "rowCells is required"
        }
        rowCells.forEach(cell => {
            if (true === cell.skip) {
                return
            }
            if (!isDefined(cell._rect)) {
                throw "cell._rect is required"
            }
            if (isDefined(cell.backgroundColor)) {
                doc.setFillColor(cell.backgroundColor);
                doc.rect(cell._rect.x, cell._rect.y, cell._rect.w, cell._rect.h, "F")
            }
            if (isDefined(cell.text) && "" !== cell.text) {
                var textY = cell._rect.y + cell._rect.h / 2;
                doc.text(cell.text, cell._rect.x, textY, extend({
                    baseline: "middle"
                }, cell.textOptions))
            }
            drawBorder(cell._rect, cell.drawLeftBorder, cell.drawRightBorder, cell.drawTopBorder, cell.drawBottomBorder)
        })
    }
    if (!isDefined(table)) {
        return Promise.resolve()
    }
    if (!isDefined(table.rect)) {
        throw "table.rect is required"
    }
    if (isDefined(table.rows)) {
        for (var rowIndex = 0; rowIndex < table.rows.length; rowIndex++) {
            drawRow(table.rows[rowIndex])
        }
    }
    if (isDefined(table.drawTableBorder) ? table.drawTableBorder : isDefined(table.rows) && 0 === table.rows.length) {
        drawBorder(table.rect)
    }
}
