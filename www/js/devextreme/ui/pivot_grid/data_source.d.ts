/**
* DevExtreme (ui/pivot_grid/data_source.d.ts)
* Version: 21.1.5
* Build date: Mon Aug 02 2021
*
* Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import {
    DxPromise
} from '../../core/utils/deferred';

import Store, {
    StoreOptions
} from '../../data/abstract_store';

import DataSource from '../../data/data_source';

import {
    format
} from '../widget/ui.widget';

import XmlaStore, {
    XmlaStoreOptions
} from './xmla_store';

/**
 * An object exposing methods that manipulate a summary cell and provide access to its neighboring cells.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
interface dxPivotGridSummaryCell {
    /**
     * Gets the child cell in a specified direction.
     */
    child(direction: string, fieldValue: number | string): dxPivotGridSummaryCell;
    /**
     * Gets all child cells in a specified direction.
     */
    children(direction: string): Array<dxPivotGridSummaryCell>;
    /**
     * Gets a pivot grid field that corresponds to the summary cell.
     */
    field(area: string): Field;
    /**
     * Gets the Grand Total of the entire pivot grid.
     */
    grandTotal(): dxPivotGridSummaryCell;
    /**
     * Gets a partial Grand Total cell of a row or column.
     */
    grandTotal(direction: string): dxPivotGridSummaryCell;
    /**
     * Indicates whether the summaryDisplayMode or calculateSummaryValue post-processed the summary value.
     */
    isPostProcessed(field: Field | string): boolean;
    /**
     * Gets the cell next to the current one in a specified direction.
     */
    next(direction: string): dxPivotGridSummaryCell;
    /**
     * Gets the cell next to current in a specified direction.
     */
    next(direction: string, allowCrossGroup: boolean): dxPivotGridSummaryCell;
    /**
     * Gets the parent cell in a specified direction.
     */
    parent(direction: string): dxPivotGridSummaryCell;
    /**
     * Gets the cell prior to the current one in a specified direction.
     */
    prev(direction: string): dxPivotGridSummaryCell;
    /**
     * Gets the cell previous to current in a specified direction.
     */
    prev(direction: string, allowCrossGroup: boolean): dxPivotGridSummaryCell;
    /**
     * Gets the cell located by the path of the source cell with one field value changed.
     */
    slice(field: Field, value: number | string): dxPivotGridSummaryCell;
    /**
     * Gets the summary cell value.
     */
    value(): any;
    /**
     * Gets the value of any field associated with the summary cell.
     */
    value(field: Field | string): any;
    /**
     * Gets the value of any field associated with the summary cell.
     */
    value(field: Field | string, postProcessed: boolean): any;
    /**
     * Gets the summary cell value.
     */
    value(postProcessed: boolean): any;
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface PivotGridDataSourceOptions {
    /**
     * Configures pivot grid fields.
     */
    fields?: Array<Field>;
    /**
     * Specifies data filtering conditions. Cannot be used with an XmlaStore.
     */
    filter?: string | Array<any> | Function;
    /**
     * A function that is executed after data is successfully loaded.
     */
    onChanged?: Function;
    /**
     * A function that is executed when all fields are loaded from the store and they are ready to be displayed in the PivotGrid.
     */
    onFieldsPrepared?: ((fields: Array<Field>) => void);
    /**
     * A function that is executed when data loading fails.
     */
    onLoadError?: ((error: any) => void);
    /**
     * A function that is executed when the data loading status changes.
     */
    onLoadingChanged?: ((isLoading: boolean) => void);
    /**
     * Specifies whether the PivotGridDataSource should load data in portions. Can be used only with an XmlaStore.
     */
    paginate?: boolean;
    /**
     * Specifies whether the data processing operations (filtering, grouping, summary calculation) should be performed on the server.
     */
    remoteOperations?: boolean;
    /**
     * Specifies whether to auto-generate pivot grid fields from the store&apos;s data.
     */
    retrieveFields?: boolean;
    /**
     * Configures the DataSource&apos;s underlying store.
     */
    store?: Store | StoreOptions | XmlaStore | XmlaStoreOptions | Array<{
      /**
       * Specifies the PivotGridDataSource&apos;s storage type.
       */
      type?: 'array' | 'local' | 'odata' | 'xmla'
    }> | {
      /**
       * Specifies the PivotGridDataSource&apos;s storage type.
       */
      type?: 'array' | 'local' | 'odata' | 'xmla'
    };
}

export type Field = PivotGridDataSourceField;

/**
 * @deprecated Use Field instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface PivotGridDataSourceField {
    /**
     * Specifies whether to take neighboring groups&apos; summary values into account when calculating a running total and absolute or percent variation.
     */
    allowCrossGroupCalculation?: boolean;
    /**
     * Specifies whether a user can expand/collapse all items within the same column or row header level using the context menu.
     */
    allowExpandAll?: boolean;
    /**
     * Specifies whether a user can filter the field&apos;s values.
     */
    allowFiltering?: boolean;
    /**
     * Specifies whether a user can change the field&apos;s sorting.
     */
    allowSorting?: boolean;
    /**
     * Specifies whether a user can sort the pivot grid by summary values instead of field values.
     */
    allowSortingBySummary?: boolean;
    /**
     * Specifies the field&apos;s area.
     */
    area?: 'column' | 'data' | 'filter' | 'row' | undefined;
    /**
     * Specifies the field&apos;s order among the other fields in the same area. Corresponds to the field&apos;s order in the fields array by default.
     */
    areaIndex?: number;
    /**
     * Specifies a custom aggregate function. Applies only if the summaryType is &apos;custom&apos; and the remoteOperations is false. Cannot be used with an XmlaStore.
     */
    calculateCustomSummary?: ((options: { summaryProcess?: string, value?: any, totalValue?: any }) => void);
    /**
     * Specifies a custom post-processing function for summary values.
     */
    calculateSummaryValue?: ((e: dxPivotGridSummaryCell) => number);
    /**
     * Specifies the field&apos;s caption to be displayed in the field chooser and on the field panel.
     */
    caption?: string;
    /**
     * Customizes the text displayed in summary cells.
     */
    customizeText?: ((cellInfo: { value?: string | number | Date, valueText?: string }) => string);
    /**
     * Specifies which data source field provides data for the pivot grid field.
     */
    dataField?: string;
    /**
     * Casts field values to a specific data type.
     */
    dataType?: 'date' | 'number' | 'string';
    /**
     * Specifies the name of the folder in which the field is located when displayed in the field chooser.
     */
    displayFolder?: string;
    /**
     * Specifies whether to expand all items within the field&apos;s header level.
     */
    expanded?: boolean;
    /**
     * Specifies whether a user changes the current filter by including (selecting) or excluding (clearing the selection of) values.
     */
    filterType?: 'exclude' | 'include';
    /**
     * Specifies the values by which the field is filtered.
     */
    filterValues?: Array<any>;
    /**
     * Formats field values before they are displayed.
     */
    format?: format;
    /**
     * Specifies the field&apos;s index within its group.
     */
    groupIndex?: number;
    /**
     * Specifies how the field&apos;s values are combined into groups for the headers. Cannot be used with an XmlaStore.
     */
    groupInterval?: 'day' | 'dayOfWeek' | 'month' | 'quarter' | 'year' | number;
    /**
     * Specifies the name of the field&apos;s group.
     */
    groupName?: string;
    /**
     * Configures the field&apos;s header filter.
     */
    headerFilter?: { allowSearch?: boolean, height?: number, width?: number };
    /**
     * Specifies whether the field should be treated as a measure (a field providing data for calculation).
     */
    isMeasure?: boolean;
    /**
     * Specifies the field&apos;s identifier.
     */
    name?: string;
    /**
     * Specifies whether to calculate the running total by rows or by columns.
     */
    runningTotal?: 'column' | 'row';
    /**
     * Specifies a function that combines the field&apos;s values into groups for the headers. Cannot be used with an XmlaStore or remote operations.
     */
    selector?: Function;
    /**
     * Specifies whether to display the field&apos;s grand totals. Applies only if the field is in the data area.
     */
    showGrandTotals?: boolean;
    /**
     * Specifies whether to display the field&apos;s totals.
     */
    showTotals?: boolean;
    /**
     * Specifies whether to display the field&apos;s summary values. Applies only if the field is in the data area. Inherits the showTotals&apos; value by default.
     */
    showValues?: boolean;
    /**
     * Specifies how the field&apos;s values in the headers should be sorted.
     */
    sortBy?: 'displayText' | 'value' | 'none';
    /**
     * Sorts the field&apos;s values in the headers by the specified measure&apos;s summary values. Accepts the measure&apos;s name, caption, dataField, or index in the fields array.
     */
    sortBySummaryField?: string;
    /**
     * Specifies a path to the column or row whose summary values should be used to sort the field&apos;s values in the headers.
     */
    sortBySummaryPath?: Array<number | string>;
    /**
     * Specifies the field values&apos; sorting order.
     */
    sortOrder?: 'asc' | 'desc';
    /**
     * Specifies a custom comparison function that sorts the field&apos;s values in the headers.
     */
    sortingMethod?: ((a: { value?: string | number, children?: Array<any> }, b: { value?: string | number, children?: Array<any> }) => number);
    /**
     * Specifies a predefined post-processing function. Does not apply when the calculateSummaryValue property is set.
     */
    summaryDisplayMode?: 'absoluteVariation' | 'percentOfColumnGrandTotal' | 'percentOfColumnTotal' | 'percentOfGrandTotal' | 'percentOfRowGrandTotal' | 'percentOfRowTotal' | 'percentVariation';
    /**
     * Specifies how to aggregate the field&apos;s data. Cannot be used with an XmlaStore.
     */
    summaryType?: 'avg' | 'count' | 'custom' | 'max' | 'min' | 'sum' | string;
    /**
     * Specifies whether the field is visible in the pivot grid and field chooser.
     */
    visible?: boolean;
    /**
     * Specifies the field&apos;s width in pixels when the field is displayed in the pivot grid.
     */
    width?: number;
    /**
     * Specifies whether text that does not fit into a header item should be wrapped.
     */
    wordWrapEnabled?: boolean;
}
/**
 * The PivotGridDataSource is an object that provides an API for processing data from an underlying store. This object is used in the PivotGrid UI component.
 */
export default class PivotGridDataSource {
    constructor(options?: PivotGridDataSourceOptions)
    /**
     * Collapses all header items of a field with the specified identifier.
     */
    collapseAll(id: number | string): void;
    /**
     * Collapses a specific header item.
     */
    collapseHeaderItem(area: string, path: Array<string | number | Date>): void;
    /**
     * Provides access to the facts that were used to calculate a specific summary value.
     */
    createDrillDownDataSource(options: { columnPath?: Array<string | number | Date>, rowPath?: Array<string | number | Date>, dataIndex?: number, maxRowCount?: number, customColumns?: Array<string> }): DataSource;
    /**
     * Disposes of all the resources allocated to the PivotGridDataSource instance.
     */
    dispose(): void;
    /**
     * Expands all the header items of a field with the specified identifier.
     */
    expandAll(id: number | string): void;
    /**
     * Expands a specific header item.
     */
    expandHeaderItem(area: string, path: Array<any>): void;
    /**
     * Gets all the properties of a field with the specified identifier.
     */
    field(id: number | string): any;
    /**
     * Updates field options&apos; values.
     */
    field(id: number | string, options: any): void;
    /**
     * Gets all the fields including those generated automatically.
     */
    fields(): Array<Field>;
    /**
     * Specifies a new fields collection.
     */
    fields(fields: Array<Field>): void;
    /**
     * Gets the filter property&apos;s value. Does not affect an XmlaStore.
     */
    filter(): any;
    /**
     * Sets the filter property&apos;s value. Does not affect an XmlaStore.
     */
    filter(filterExpr: any): void;
    /**
     * Gets all the fields within an area.
     */
    getAreaFields(area: string, collectGroups: boolean): Array<Field>;
    /**
     * Gets the loaded data. Another data portion is loaded every time a header item is expanded.
     */
    getData(): any;
    /**
     * Checks whether the PivotGridDataSource is loading data.
     */
    isLoading(): boolean;
    /**
     * Starts loading data.
     */
    load(): DxPromise<any>;
    /**
     * Detaches all event handlers from a single event.
     */
    off(eventName: string): this;
    /**
     * Detaches a particular event handler from a single event.
     */
    off(eventName: string, eventHandler: Function): this;
    /**
     * Subscribes to an event.
     */
    on(eventName: string, eventHandler: Function): this;
    /**
     * Subscribes to events.
     */
    on(events: any): this;
    /**
     * Clears the loaded PivotGridDataSource data and calls the load() method.
     */
    reload(): DxPromise<any>;
    /**
     * Gets the current PivotGridDataSource state. Part of the PivotGrid UI component&apos;s state storing feature.
     */
    state(): any;
    /**
     * Sets the PivotGridDataSource state. Part of the PivotGrid UI component&apos;s state storing feature.
     */
    state(state: any): void;
}
