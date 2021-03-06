/**
* DevExtreme (pdf_exporter.d.ts)
* Version: 21.1.5
* Build date: Mon Aug 02 2021
*
* Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import { DxPromise } from './core/utils/deferred';
import dxDataGrid, { Column } from './ui/data_grid';
import { ExportLoadPanel } from './exporter/export_load_panel';

/**
 * A DataGrid cell to be exported to PDF.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface PdfDataGridCell {
    /**
     * The configuration of the cell&apos;s column.
     */
    column?: Column;
    /**
     * The data object of the cell&apos;s row.
     */
    data?: any;
    /**
     * The group index of the cell&apos;s row. Available when the rowType is &apos;group&apos;.
     */
    groupIndex?: number;
    /**
     * Information about group summary items the cell represents.
     */
    groupSummaryItems?: Array<{
      /**
       * The group summary item&apos;s identifier.
       */
      name?: string,
      /**
       * The group summary item&apos;s raw value.
       */
      value?: any
    }>;
    /**
     * The type of the cell&apos;s row.
     */
    rowType?: string;
    /**
     * The identifier of the total summary item that the cell represents.
     */
    totalSummaryItemName?: string;
    /**
     * The cell&apos;s raw value.
     */
    value?: any;
}

/**
 * Properties that can be passed as a parameter to the exportDataGrid(options) method from the pdfExporter module.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface PdfExportDataGridProps {
    /**
     * A jsPDF instance. This setting is required.
     */
    jsPDFDocument?: object;
    /**
     * Options of the generated PDF table. Refer to the jsPDF-autoTable plugin documentation to see the full list of available customizations.
     */
    autoTableOptions?: object;
    /**
     * A DataGrid instance. This setting is required.
     */
    component?: dxDataGrid;
    /**
     * Specifies whether or not to export only selected rows.
     */
    selectedRowsOnly?: boolean;
    /**
     * Specifies whether columns in the PDF file should have the same width as their source UI component&apos;s columns.
     */
    keepColumnWidths?: boolean;
    /**
     * Customizes a cell in PDF after creation.
     */
    customizeCell?: ((options: { gridCell?: PdfDataGridCell, pdfCell?: any}) => void);
    /**
     * Configures the load panel.
     */
    loadPanel?: ExportLoadPanel;
}

/**
 * [tags] ctp Exports grid data to a PDF file.
 */
export function exportDataGrid(options: PdfExportDataGridProps): DxPromise<void>;
