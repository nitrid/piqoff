/**
* DevExtreme (ui/data_grid.d.ts)
* Version: 21.1.5
* Build date: Mon Aug 02 2021
*
* Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import {
  UserDefinedElement,
  DxElement,
  UserDefinedElementsArray
} from '../core/element';

import {
    DxPromise
} from '../core/utils/deferred';

import {
    template
} from '../core/templates/template';

import Store from '../data/abstract_store';

import DataSource, {
    DataSourceOptions
} from '../data/data_source';

import {
    DxEvent,
    Cancelable,
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo
} from '../events/index';

import {
    DataGridCell as ExcelCell
} from '../excel_exporter';

import {
    ExcelFont
} from '../exporter/excel/excel.doc_comments';

import dxDraggable from './draggable';

import {
    dxFilterBuilderOptions
} from './filter_builder';

import {
    dxFormOptions,
    dxFormSimpleItem
} from './form';

import {
    dxPopupOptions
} from './popup';

import dxScrollable from './scroll_view/ui.scrollable';

import dxSortable from './sortable';

import {
    dxToolbarOptions
} from './toolbar';

import {
    AsyncRule,
    CompareRule,
    CustomRule,
    EmailRule,
    NumericRule,
    PatternRule,
    RangeRule,
    RequiredRule,
    StringLengthRule
} from './validation_rules';

import Widget, {
    format,
    WidgetOptions
} from './widget/ui.widget';

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface AdaptiveDetailRowPreparingInfo {
  readonly formOptions: any;
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface DataErrorOccurredInfo {
  readonly error?: Error;
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface DataChangeInfo {
  readonly changes: Array<DataChange>;
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface NewRowInfo {
  data: any;
  promise?: PromiseLike<void>;
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface KeyDownInfo {
  handled: boolean;
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface RowKeyInfo {
  readonly key: any;
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface RowInsertedInfo {
  readonly data: any;
  readonly key: any;
  readonly error: Error;
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface RowInsertingInfo {
  data: any;
  cancel: boolean | PromiseLike<void>;
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface RowRemovedInfo {
  readonly data: any;
  readonly key: any;
  readonly error: Error;
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface RowRemovingInfo {
  readonly data: any;
  readonly key: any;
  cancel: boolean | PromiseLike<void>;
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface RowUpdatedInfo {
  readonly data: any;
  readonly key: any;
  readonly error: Error;
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface RowUpdatingInfo {
  readonly oldData: any;
  newData: any;
  readonly key: any;
  cancel: boolean | PromiseLike<void>;
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface RowValidatingInfo {
  readonly brokenRules: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule>;
  isValid: boolean;
  readonly key: any;
  readonly newData: any;
  readonly oldData: any;
  errorText: string;
  promise?: PromiseLike<void>;
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface SavingInfo {
  changes: Array<DataChange>;
  promise?: PromiseLike<void>;
  cancel: boolean;
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface SelectionChangedInfo {
  readonly currentSelectedRowKeys: Array<any>;
  readonly currentDeselectedRowKeys: Array<any>;
  readonly selectedRowKeys: Array<any>;
  readonly selectedRowsData: Array<any>;
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface ToolbarPreparingInfo {
  toolbarOptions: dxToolbarOptions;
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface RowDraggingEventInfo<T extends GridBase> {
  readonly component: T;
  readonly event: DxEvent;
  readonly itemData?: any;
  readonly itemElement: DxElement;
  readonly fromIndex: number;
  readonly toIndex: number;
  readonly fromComponent: dxSortable | dxDraggable;
  readonly toComponent: dxSortable | dxDraggable;
  readonly fromData?: any;
  readonly toData?: any;
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface DragStartEventInfo<T extends GridBase> {
  readonly component: T;
  readonly event: DxEvent;
  itemData?: any;
  readonly itemElement: DxElement;
  readonly fromIndex: number;
  readonly fromData?: any;
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface DragDropInfo {
  readonly dropInsideItem: boolean;
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface DragReorderInfo {
  readonly dropInsideItem: boolean;
  promise?: PromiseLike<void>;
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface RowDraggingTemplateDataModel {
  readonly itemData: any;
  readonly itemElement: DxElement;
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface FilterPanelCustomizeTextArg<T> { 
  readonly component: T,
  readonly filterValue: any,
  readonly text: string
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface FilterPanel<T extends GridBase> {
  /**
   * Customizes the filter expression&apos;s text representation.
   */
  customizeText?: ((e: FilterPanelCustomizeTextArg<T>) => string),
  /**
   * Specifies whether the filter expression is applied.
   */
  filterEnabled?: boolean,
  /**
   * Specifies texts for the filter panel&apos;s elements.
   */
  texts?: FilterPanelTexts,
  /**
   * Specifies whether the filter panel is visible.
   */
  visible?: boolean
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface RowDragging<T extends GridBase> {
    /**
     * Allows users to drop a row inside another row.
     */
    allowDropInsideItem?: boolean,
    /**
     * Allows row reordering using drag and drop gestures.
     */
    allowReordering?: boolean,
    /**
     * Enables automatic scrolling while dragging a row beyond the viewport.
     */
    autoScroll?: boolean,
    /**
     * Specifies a DOM element that limits the dragging area.
     */
    boundary?: string | UserDefinedElement,
    /**
     * Specifies a custom container in which the draggable row should be rendered.
     */
    container?: string | UserDefinedElement,
    /**
     * Specifies the cursor offset from the dragged row.
     */
    cursorOffset?: string | {
      /**
       * Specifies the horizontal cursor offset from the dragged row in pixels.
       */
      x?: number,
      /**
       * Specifies the vertical cursor offset from the dragged row in pixels.
       */
      y?: number
    },
    /**
     * A container for custom data.
     */
    data?: any,
    /**
     * Specifies the directions in which a row can be dragged.
     */
    dragDirection?: 'both' | 'horizontal' | 'vertical',
    /**
     * Specifies custom markup to be shown instead of the item being dragged.
     */
    dragTemplate?: template | ((dragInfo: RowDraggingTemplateData, containerElement: DxElement) => string | UserDefinedElement),
    /**
     * Specifies how to highlight the row&apos;s drop position.
     */
    dropFeedbackMode?: 'push' | 'indicate',
    /**
     * Specifies a CSS selector for draggable rows.
     */
    filter?: string,
    /**
     * Allows you to group several UI components so that users can drag and drop rows between them.
     */
    group?: string,
    /**
     * Specifies a CSS selector (ID or class) for the element(s) that should act as the drag handle(s).
     */
    handle?: string,
    /**
     * A function that is called when a new row is added.
     */
    onAdd?: ((e: RowDraggingEventInfo<T> & DragDropInfo) => void),
    /**
     * A function that is called when the dragged row&apos;s position is changed.
     */
    onDragChange?: ((e: Cancelable & RowDraggingEventInfo<T> & DragDropInfo) => void),
    /**
     * A function that is called when the drag gesture is finished.
     */
    onDragEnd?: ((e: Cancelable & RowDraggingEventInfo<T> & DragDropInfo) => void),
    /**
     * A function that is called every time a draggable row is moved.
     */
    onDragMove?: ((e: Cancelable & RowDraggingEventInfo<T> & DragDropInfo) => void),
    /**
     * A function that is called when the drag gesture is initialized.
     */
    onDragStart?: ((e: Cancelable & DragStartEventInfo<T>) => void),
    /**
     * A function that is called when a draggable row is removed.
     */
    onRemove?: ((e: RowDraggingEventInfo<T>) => void),
    /**
     * A function that is called when the draggable rows are reordered.
     */
    onReorder?: ((e: RowDraggingEventInfo<dxDataGrid> & DragReorderInfo) => void),
    /**
     * Specifies the distance in pixels from the edge of viewport at which scrolling should start. Applies only if autoScroll is true.
     */
    scrollSensitivity?: number,
    /**
     * Specifies the scrolling speed when dragging a row beyond the viewport. Applies only if autoScroll is true.
     */
    scrollSpeed?: number,
    /**
     * Shows or hides row dragging icons.
     */
    showDragIcons?: boolean
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface GridBaseOptions<T extends GridBase> extends WidgetOptions<T> {
    /**
     * Specifies whether a user can reorder columns.
     */
    allowColumnReordering?: boolean;
    /**
     * Specifies whether a user can resize columns.
     */
    allowColumnResizing?: boolean;
    /**
     * Automatically scrolls to the focused row when the focusedRowKey is changed.
     */
    autoNavigateToFocusedRow?: boolean;
    /**
     * Specifies whether data should be cached.
     */
    cacheEnabled?: boolean;
    /**
     * Enables a hint that appears when a user hovers the mouse pointer over a cell with truncated content.
     */
    cellHintEnabled?: boolean;
    /**
     * Specifies whether columns should adjust their widths to the content.
     */
    columnAutoWidth?: boolean;
    /**
     * Configures the column chooser.
     */
    columnChooser?: ColumnChooser;
    /**
     * Configures column fixing.
     */
    columnFixing?: ColumnFixing;
    /**
     * Specifies whether the UI component should hide columns to adapt to the screen or container size. Ignored if allowColumnResizing is true and columnResizingMode is &apos;widget&apos;.
     */
    columnHidingEnabled?: boolean;
    /**
     * Specifies the minimum width of columns.
     */
    columnMinWidth?: number;
    /**
     * Specifies how the UI component resizes columns. Applies only if allowColumnResizing is true.
     */
    columnResizingMode?: 'nextColumn' | 'widget';
    /**
     * Specifies the width for all data columns. Has a lower priority than the column.width property.
     */
    columnWidth?: number | 'auto';
    /**
     * Overridden.
     */
    columns?: Array<ColumnBase | string>;
    /**
     * Binds the UI component to data.
     */
    dataSource?: string | Array<any> | Store | DataSource | DataSourceOptions;
    /**
     * Specifies the format in which date-time values should be sent to the server.
     */
    dateSerializationFormat?: string;
    /**
     * Overriden.
     */
    editing?: EditingBase;
    /**
     * Indicates whether to show the error row.
     */
    errorRowEnabled?: boolean;
    /**
     * Configures the integrated filter builder.
     */
    filterBuilder?: dxFilterBuilderOptions;
    /**
     * Configures the popup in which the integrated filter builder is shown.
     */
    filterBuilderPopup?: dxPopupOptions;
    /**
     * Configures the filter panel.
     */
    filterPanel?: FilterPanel<T>;
    /**
     * Configures the filter row.
     */
    filterRow?: FilterRow;
    /**
     * Specifies whether to synchronize the filter row, header filter, and filter builder. The synchronized filter expression is stored in the filterValue property.
     */
    filterSyncEnabled?: boolean | 'auto';
    /**
     * Specifies a filter expression.
     */
    filterValue?: string | Array<any> | Function;
    /**
     * The index of the column that contains the focused data cell. This index is taken from the columns array.
     */
    focusedColumnIndex?: number;
    /**
     * Specifies whether the focused row feature is enabled.
     */
    focusedRowEnabled?: boolean;
    /**
     * Specifies or indicates the focused data row&apos;s index. Use this property when focusedRowEnabled is true.
     */
    focusedRowIndex?: number;
    /**
     * Specifies initially or currently focused grid row&apos;s key. Use it when focusedRowEnabled is true.
     */
    focusedRowKey?: any;
    /**
     * Configures the header filter feature.
     */
    headerFilter?: HeaderFilter;
    /**
     * Specifies whether to highlight rows and cells with edited data. repaintChangesOnly should be true.
     */
    highlightChanges?: boolean;
    /**
     * Configures keyboard navigation.
     */
    keyboardNavigation?: KeyboardNavigation;
    /**
     * Configures the load panel.
     */
    loadPanel?: LoadPanel;
    /**
     * Specifies the text or HTML markup shown when the UI component does not display any data.
     */
    noDataText?: string;
    /**
     * A function that is executed before an adaptive detail row is rendered.
     */
    onAdaptiveDetailRowPreparing?: ((e: EventInfo<T> & AdaptiveDetailRowPreparingInfo) => void);
    /**
     * A function that is executed when an error occurs in the data source.
     */
    onDataErrorOccurred?: ((e: EventInfo<T> & DataErrorOccurredInfo) => void);
    /**
     * A function that is executed after row changes are discarded.
     */
    onEditCanceled?: ((e: EventInfo<T> & DataChangeInfo) => void);
    /**
     * A function that is executed when the edit operation is canceled, but row changes are not yet discarded.
     */
    onEditCanceling?: ((e: Cancelable & EventInfo<T> & DataChangeInfo) => void);
    /**
     * A function that is executed before a new row is added to the UI component.
     */
    onInitNewRow?: ((e: EventInfo<T> & NewRowInfo) => void);
    /**
     * A function that is executed when the UI component is in focus and a key has been pressed down.
     */
    onKeyDown?: ((e: NativeEventInfo<T> & KeyDownInfo) => void);
    /**
     * A function that is executed after a row is collapsed.
     */
    onRowCollapsed?: ((e: EventInfo<T> & RowKeyInfo) => void);
    /**
     * A function that is executed before a row is collapsed.
     */
    onRowCollapsing?: ((e: Cancelable & EventInfo<T> & RowKeyInfo) => void);
    /**
     * A function that is executed after a row is expanded.
     */
    onRowExpanded?: ((e: EventInfo<T> & RowKeyInfo) => void);
    /**
     * A function that is executed before a row is expanded.
     */
    onRowExpanding?: ((e: Cancelable & EventInfo<T> & RowKeyInfo) => void);
    /**
     * A function that is executed after a new row has been inserted into the data source.
     */
    onRowInserted?: ((e: EventInfo<T> & RowInsertedInfo) => void);
    /**
     * A function that is executed before a new row is inserted into the data source.
     */
    onRowInserting?: ((e: EventInfo<T> & RowInsertingInfo) => void);
    /**
     * A function that is executed after a row has been removed from the data source.
     */
    onRowRemoved?: ((e: EventInfo<T> & RowRemovedInfo) => void);
    /**
     * A function that is executed before a row is removed from the data source.
     */
    onRowRemoving?: ((e: EventInfo<T> & RowRemovingInfo) => void);
    /**
     * A function that is executed after a row has been updated in the data source.
     */
    onRowUpdated?: ((e: EventInfo<T> & RowUpdatedInfo) => void);
    /**
     * A function that is executed before a row is updated in the data source.
     */
    onRowUpdating?: ((e: EventInfo<T> & RowUpdatingInfo) => void);
    /**
     * A function that is executed after cells in a row are validated against validation rules.
     */
    onRowValidating?: ((e: EventInfo<T> & RowValidatingInfo) => void);
    /**
     * A function that is executed after row changes are saved.
     */
    onSaved?: ((e: EventInfo<T> & DataChangeInfo) => void);
    /**
     * A function that is executed before pending row changes are saved.
     */
    onSaving?: ((e: EventInfo<T> & SavingInfo) => void);
    /**
     * A function that is executed after selecting a row or clearing its selection.
     */
    onSelectionChanged?: ((e: EventInfo<T> & SelectionChangedInfo) => void);
    /**
     * A function that is executed before the toolbar is created.
     */
    onToolbarPreparing?: ((e: EventInfo<T> & ToolbarPreparingInfo) => void);
    /**
     * Configures the pager.
     */
    pager?: Pager;
    /**
     * Configures paging.
     */
    paging?: PagingBase;
    /**
     * Specifies whether to render the filter row, command columns, and columns with showEditorAlways set to true after other elements.
     */
    renderAsync?: boolean;
    /**
     * Specifies whether to repaint only those cells whose data changed.
     */
    repaintChangesOnly?: boolean;
    /**
     * Specifies whether rows should be shaded differently.
     */
    rowAlternationEnabled?: boolean;
    /**
     * Configures row reordering using drag and drop gestures.
     */
    rowDragging?: RowDragging<T>;
    /**
     * 
     */
    scrolling?: ScrollingBase;
    /**
     * Configures the search panel.
     */
    searchPanel?: SearchPanel;
    /**
     * Allows you to select rows or determine which rows are selected.
     */
    selectedRowKeys?: Array<any>;
    /**
     * 
     */
    selection?: SelectionBase;
    /**
     * Specifies whether the outer borders of the UI component are visible.
     */
    showBorders?: boolean;
    /**
     * Specifies whether column headers are visible.
     */
    showColumnHeaders?: boolean;
    /**
     * Specifies whether vertical lines that separate one column from another are visible.
     */
    showColumnLines?: boolean;
    /**
     * Specifies whether horizontal lines that separate one row from another are visible.
     */
    showRowLines?: boolean;
    /**
     * Configures runtime sorting.
     */
    sorting?: Sorting;
    /**
     * Configures state storing.
     */
    stateStoring?: StateStoring;
    /**
     * Specifies whether to enable two-way data binding.
     */
    twoWayBindingEnabled?: boolean;
    /**
     * Specifies whether text that does not fit into a column should be wrapped.
     */
    wordWrapEnabled?: boolean;
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface ColumnChooser {
    /**
     * Specifies whether searching is enabled in the column chooser.
     */
    allowSearch?: boolean,
    /**
     * Specifies text displayed by the column chooser when it is empty.
     */
    emptyPanelText?: string,
    /**
     * Specifies whether a user can open the column chooser.
     */
    enabled?: boolean,
    /**
     * Specifies the height of the column chooser.
     */
    height?: number,
    /**
     * Specifies how a user manages columns using the column chooser.
     */
    mode?: 'dragAndDrop' | 'select',
    /**
     * Specifies a delay in milliseconds between when a user finishes typing in the column chooser&apos;s search panel, and when the search is executed.
     */
    searchTimeout?: number,
    /**
     * Specifies the title of the column chooser.
     */
    title?: string,
    /**
     * Specifies the width of the column chooser.
     */
    width?: number
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface ColumnFixing {
    /**
     * Enables column fixing.
     */
    enabled?: boolean,
    /**
     * Contains properties that specify texts for column fixing commands in the context menu of a column header.
     */
    texts?: ColumnFixingTexts
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface ColumnFixingTexts {
    /**
     * Specifies text for the context menu item that fixes a column.
     */
    fix?: string,
    /**
     * Specifies text for the context menu subitem that fixes a column to the left edge of the UI component.
     */
    leftPosition?: string,
    /**
     * Specifies text for the context menu subitem that fixes a column to the right edge of the UI component.
     */
    rightPosition?: string,
    /**
     * Specifies text for the context menu item that unfixes a column.
     */
    unfix?: string
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface FilterPanelTexts {
    /**
     * The text of the &apos;Clear&apos; link.
     */
    clearFilter?: string,
    /**
     * The text of the &apos;Create Filter&apos; link.
     */
    createFilter?: string,
    /**
     * The hint of the checkbox that applies the filter.
     */
    filterEnabledHint?: string
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface FilterRow {
    /**
     * Specifies when to apply a filter.
     */
    applyFilter?: 'auto' | 'onClick',
    /**
     * Specifies text for a hint that appears when a user pauses on a button that applies the filter.
     */
    applyFilterText?: string,
    /**
     * Specifies a placeholder for the editor that specifies the end of a range when a user selects the &apos;between&apos; filter operation.
     */
    betweenEndText?: string,
    /**
     * Specifies a placeholder for the editor that specifies the start of a range when a user selects the &apos;between&apos; filter operation.
     */
    betweenStartText?: string,
    /**
     * Specifies descriptions for filter operations on the filter list.
     */
    operationDescriptions?: FilterRowOperationDescriptions,
    /**
     * Specifies text for the reset operation on the filter list.
     */
    resetOperationText?: string,
    /**
     * Specifies text for the item that clears the applied filter. Used only when a cell of the filter row contains a select box.
     */
    showAllText?: string,
    /**
     * Specifies whether icons that open the filter lists are visible.
     */
    showOperationChooser?: boolean,
    /**
     * Specifies whether the filter row is visible.
     */
    visible?: boolean
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface FilterRowOperationDescriptions {
    /**
     * A description for the &apos;between&apos; operation.
     */
    between?: string,
    /**
     * A description for the &apos;contains&apos; operation.
     */
    contains?: string,
    /**
     * A description for the &apos;endswith&apos; operation.
     */
    endsWith?: string,
    /**
     * A description for the &apos;=&apos; operation.
     */
    equal?: string,
    /**
     * A description for the &apos;&gt;&apos; operation.
     */
    greaterThan?: string,
    /**
     * A description for the &apos;&gt;=&apos; operation.
     */
    greaterThanOrEqual?: string,
    /**
     * A description for the &apos;&lt;&apos; operation.
     */
    lessThan?: string,
    /**
     * A description for the &apos;&lt;=&apos; operation.
     */
    lessThanOrEqual?: string,
    /**
     * A description for the &apos;notcontains&apos; operation.
     */
    notContains?: string,
    /**
     * A description for the &apos;&lt;&gt;&apos; operation.
     */
    notEqual?: string,
    /**
     * A description for the &apos;startswith&apos; operation.
     */
    startsWith?: string
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface HeaderFilter {
    /**
     * Specifies whether searching is enabled in the header filter.
     */
    allowSearch?: boolean,
    /**
     * Specifies the height of the popup menu that contains values for filtering.
     */
    height?: number,
    /**
     * Specifies a delay in milliseconds between when a user finishes typing in the header filter&apos;s search panel, and when the search is executed.
     */
    searchTimeout?: number,
    /**
     * Contains properties that specify text for various elements of the popup menu.
     */
    texts?: HeaderFilterTexts,
    /**
     * Specifies whether header filter icons are visible.
     */
    visible?: boolean,
    /**
     * Specifies the width of the popup menu that contains values for filtering.
     */
    width?: number
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface HeaderFilterTexts {
    /**
     * Specifies text for the button that closes the popup menu without applying a filter.
     */
    cancel?: string,
    /**
     * Specifies a name for the item that represents empty values in the popup menu.
     */
    emptyValue?: string,
    /**
     * Specifies text for the button that applies the specified filter.
     */
    ok?: string
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface KeyboardNavigation {
    /**
     * Specifies whether users can enter a new cell value on a key press. Applies if editing.mode is &apos;cell&apos; or &apos;batch&apos;.
     */
    editOnKeyPress?: boolean,
    /**
     * Enables keyboard navigation.
     */
    enabled?: boolean,
    /**
     * Specifies whether the Enter key switches the cell or row to the edit state or moves focus in the enterKeyDirection. Applies for all edit modes, except &apos;popup&apos;.
     */
    enterKeyAction?: 'startEdit' | 'moveFocus',
    /**
     * Specifies the direction in which to move focus when a user presses Enter. Applies if editing.mode is &apos;cell&apos; or &apos;batch&apos;.
     */
    enterKeyDirection?: 'none' | 'column' | 'row'
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface LoadPanel {
    /**
     * Enables displaying the load panel automatically.
     */
    enabled?: boolean | 'auto',
    /**
     * Specifies the height of the load panel in pixels.
     */
    height?: number,
    /**
     * Specifies a URL pointing to an image to be used as a loading indicator.
     */
    indicatorSrc?: string,
    /**
     * Specifies whether to shade the UI component when the load panel is shown.
     */
    shading?: boolean,
    /**
     * Specifies the shading color. Applies only if shading is true.
     */
    shadingColor?: string,
    /**
     * Specifies whether to show the loading indicator.
     */
    showIndicator?: boolean,
    /**
     * Specifies whether to show the pane of the load panel.
     */
    showPane?: boolean,
    /**
     * Specifies text displayed on the load panel.
     */
    text?: string,
    /**
     * Specifies the width of the load panel in pixels.
     */
    width?: number
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface Pager {
    /**
     * Specifies the available page sizes in the page size selector.
     */
    allowedPageSizes?: Array<(number | 'all')> | 'auto',
    /**
     * Specifies the pager&apos;s display mode.
     */
    displayMode?: 'adaptive' | 'compact' | 'full',
    /**
     * Specifies the page information text.
     */
    infoText?: string,
    /**
     * Specifies whether to show the page information.
     */
    showInfo?: boolean,
    /**
     * Specifies whether to show navigation buttons.
     */
    showNavigationButtons?: boolean,
    /**
     * Specifies whether to show the page size selector.
     */
    showPageSizeSelector?: boolean,
    /**
     * Specifies whether the pager is visible.
     */
    visible?: boolean | 'auto'
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface SearchPanel {
    /**
     * Notifies the UI component whether search is case-sensitive to ensure that search results are highlighted correctly. Applies only if highlightSearchText is true.
     */
    highlightCaseSensitive?: boolean,
    /**
     * Specifies whether found substrings should be highlighted.
     */
    highlightSearchText?: boolean,
    /**
     * Specifies a placeholder for the search panel.
     */
    placeholder?: string,
    /**
     * Specifies whether the UI component should search against all columns or only visible ones.
     */
    searchVisibleColumnsOnly?: boolean,
    /**
     * Sets a search string for the search panel.
     */
    text?: string,
    /**
     * Specifies whether the search panel is visible or not.
     */
    visible?: boolean,
    /**
     * Specifies the width of the search panel in pixels.
     */
    width?: number
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface Sorting {
    /**
     * Specifies text for the context menu item that sets an ascending sort order in a column.
     */
    ascendingText?: string,
    /**
     * Specifies text for the context menu item that clears sorting settings for a column.
     */
    clearText?: string,
    /**
     * Specifies text for the context menu item that sets a descending sort order in a column.
     */
    descendingText?: string,
    /**
     * Specifies the sorting mode.
     */
    mode?: 'multiple' | 'none' | 'single',
    /**
     * Specifies whether to display sort indexes in column headers. Applies only when sorting.mode is &apos;multiple&apos; and data is sorted by two or more columns.
     */
    showSortIndexes?: boolean
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface StateStoring {
    /**
     * Specifies a function that is executed on state loading. Applies only if the type is &apos;custom&apos;.
     */
    customLoad?: (() => PromiseLike<any>),
    /**
     * Specifies a function that is executed on state saving. Applies only if the type is &apos;custom&apos;.
     */
    customSave?: ((gridState: any) => any),
    /**
     * Enables state storing.
     */
    enabled?: boolean,
    /**
     * Specifies the delay in milliseconds between when a user makes a change and when this change is saved.
     */
    savingTimeout?: number,
    /**
     * Specifies the key for storing the UI component state.
     */
    storageKey?: string,
    /**
     * Specifies the type of storage where the state is saved.
     */
    type?: 'custom' | 'localStorage' | 'sessionStorage'
}

/**
 * @deprecated 
 */
export type GridBaseEditing = EditingBase;
/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface EditingBase {
    /**
     * Specifies if confirmation is required when a user deletes a row.
     */
    confirmDelete?: boolean;
    /**
     * An array of pending row changes.
     */
    changes?: Array<DataChange>;
    /**
     * The name of a column being edited. Applies only if editing.mode is &apos;cell&apos; or &apos;batch&apos;.
     */
    editColumnName?: string;
    /**
     * The key(s) of a row being edited.
     */
    editRowKey?: any;
    /**
     * Configures the form. Used only if editing.mode is &apos;form&apos; or &apos;popup&apos;.
     */
    form?: dxFormOptions;
    /**
     * Specifies how a user edits data.
     */
    mode?: 'batch' | 'cell' | 'row' | 'form' | 'popup';
    /**
     * Configures the popup. Used only if editing.mode is &apos;popup&apos;.
     */
    popup?: dxPopupOptions;
    /**
     * Specifies operations that are performed after saving changes.
     */
    refreshMode?: 'full' | 'reshape' | 'repaint';
    /**
     * Specifies whether to select text in a cell when a user starts editing.
     */
    selectTextOnEditStart?: boolean;
    /**
     * Specifies whether a single or double click should switch a cell to the editing state. Applies if editing.mode is &apos;cell&apos; or &apos;batch&apos;.
     */
    startEditAction?: 'click' | 'dblClick';
    /**
     * Contains properties that specify texts for editing-related UI elements.
     */
    texts?: EditingTextsBase;
    /**
     * Specifies whether the edit column uses icons instead of links.
     */
    useIcons?: boolean;
}

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface DataChange {
    /**
     * The key of the row being updated or removed.
     */
    key: any;
    /**
     * Data change type.
     */
    type: 'insert' | 'update' | 'remove';
    /**
     * An object with updated row fields.
     */
    data: object;
    /**
     * [tags] ctp Zero-based index of a new row. Applies only if the type is &apos;insert&apos;.
     */
    index?: number;
    /**
     * [tags] ctp Zero-based index of a page into which a new row should be inserted. Applies only if the type is &apos;insert&apos; and the pager is used.
     */
    pageIndex?: number;
}

/**
 * @deprecated 
 */
export type GridBaseEditingTexts = EditingTextsBase;
/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface EditingTextsBase {
    /**
     * Specifies text for a hint that appears when a user pauses on the global &apos;Add&apos; button. Applies only if editing.allowAdding is true.
     */
    addRow?: string;
    /**
     * Specifies text for a hint that appears when a user pauses on the &apos;Discard&apos; button. Applies only if editing.mode is &apos;batch&apos;.
     */
    cancelAllChanges?: string;
    /**
     * Specifies text for a button that cancels changes in a row. Applies only if editing.allowUpdating is true and editing.mode is &apos;row&apos;.
     */
    cancelRowChanges?: string;
    /**
     * Specifies a message that prompts a user to confirm deletion.
     */
    confirmDeleteMessage?: string;
    /**
     * Specifies a title for the window that asks a user to confirm deletion.
     */
    confirmDeleteTitle?: string;
    /**
     * Specifies text for buttons that delete rows. Applies only if allowDeleting is true.
     */
    deleteRow?: string;
    /**
     * Specifies text for buttons that switch rows into the editing state. Applies only if allowUpdating is true.
     */
    editRow?: string;
    /**
     * Specifies text for a hint that appears when a user pauses on the global &apos;Save&apos; button. Applies only if editing.mode is &apos;batch&apos;.
     */
    saveAllChanges?: string;
    /**
     * Specifies text for a button that saves changes made in a row. Applies only if allowUpdating is true.
     */
    saveRowChanges?: string;
    /**
     * Specifies text for buttons that recover deleted rows. Applies only if allowDeleting is true and editing.mode is &apos;batch&apos;.
     */
    undeleteRow?: string;
    /**
     * Specifies text for a hint appearing when a user pauses on the button that cancels changes in a cell. Applies only if editing.mode is &apos;cell&apos; and data validation is enabled.
     */
    validationCancelChanges?: string;
}

/**
 * @deprecated 
 */
export type GridBasePaging = PagingBase;
/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface PagingBase {
    /**
     * Enables paging.
     */
    enabled?: boolean;
    /**
     * Specifies the page to be displayed using a zero-based index.
     */
    pageIndex?: number;
    /**
     * Specifies the page size.
     */
    pageSize?: number;
}

/**
 * @deprecated 
 */
export type GridBaseScrolling = ScrollingBase;
/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface ScrollingBase {
    /**
     * Specifies the rendering mode for columns. Applies when columns are left outside the viewport. Requires the columnWidth, columnAutoWidth, or width (for all columns) property specified.
     */
    columnRenderingMode?: 'standard' | 'virtual';
    /**
     * Specifies whether the UI component should load adjacent pages. Applies only if scrolling.mode is &apos;virtual&apos; or &apos;infinite&apos;.
     */
    preloadEnabled?: boolean;
    /**
     * Specifies the rendering mode for loaded rows.
     */
    rowRenderingMode?: 'standard' | 'virtual';
    /**
     * Specifies whether a user can scroll the content with a swipe gesture. Applies only if useNative is false.
     */
    scrollByContent?: boolean;
    /**
     * Specifies whether a user can scroll the content with the scrollbar. Applies only if useNative is false.
     */
    scrollByThumb?: boolean;
    /**
     * Specifies when to show scrollbars. Applies only if useNative is false.
     */
    showScrollbar?: 'always' | 'never' | 'onHover' | 'onScroll';
    /**
     * Specifies whether the UI component should use native or simulated scrolling.
     */
    useNative?: boolean | 'auto';
}

/**
 * @deprecated 
 */
export type GridBaseSelection = SelectionBase;
/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface SelectionBase {
    /**
     * Allows users to simultaneously select all or current page rows (depending on the selectAllMode).
     */
    allowSelectAll?: boolean;
    /**
     * Specifies the selection mode.
     */
    mode?: 'multiple' | 'none' | 'single';
}

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface GridBase {
    /**
     * Shows the load panel.
     */
    beginCustomLoading(messageText: string): void;
    /**
     * Gets a data object with a specific key.
     */
    byKey(key: any | string | number): DxPromise<any>;
    /**
     * Discards changes that a user made to data.
     */
    cancelEditData(): void;
    /**
     * Gets the value of a cell with a specific row index and a data field, column caption or name.
     */
    cellValue(rowIndex: number, dataField: string): any;
    /**
     * Sets a new value to a cell with a specific row index and a data field, column caption or name.
     */
    cellValue(rowIndex: number, dataField: string, value: any): void;
    /**
     * Gets the value of a cell with specific row and column indexes.
     */
    cellValue(rowIndex: number, visibleColumnIndex: number): any;
    /**
     * Sets a new value to a cell with specific row and column indexes.
     */
    cellValue(rowIndex: number, visibleColumnIndex: number, value: any): void;
    /**
     * Clears all filters applied to UI component rows.
     */
    clearFilter(): void;
    /**
     * Clears all row filters of a specific type.
     */
    clearFilter(filterName: string): void;
    /**
     * Clears selection of all rows on all pages.
     */
    clearSelection(): void;
    /**
     * Clears sorting settings of all columns at once.
     */
    clearSorting(): void;
    /**
     * Switches the cell being edited back to the normal state. Takes effect only if editing.mode is batch or cell and showEditorAlways is false.
     */
    closeEditCell(): void;
    /**
     * Collapses the currently expanded adaptive detail row (if there is one).
     */
    collapseAdaptiveDetailRow(): void;
    /**
     * Gets the data column count. Includes visible and hidden columns, excludes command columns.
     */
    columnCount(): number;
    /**
     * Gets all properties of a column with a specific identifier.
     */
    columnOption(id: number | string): any;
    /**
     * Gets the value of a single column property.
     */
    columnOption(id: number | string, optionName: string): any;
    /**
     * Updates the value of a single column property.
     */
    columnOption(id: number | string, optionName: string, optionValue: any): void;
    /**
     * Updates the values of several column properties.
     */
    columnOption(id: number | string, options: any): void;
    /**
     * Removes a column.
     */
    deleteColumn(id: number | string): void;
    /**
     * Removes a row with a specific index.
     */
    deleteRow(rowIndex: number): void;
    /**
     * Clears the selection of all rows on all pages or the currently rendered page only.
     */
    deselectAll(): DxPromise<void>;
    /**
     * Cancels the selection of rows with specific keys.
     */
    deselectRows(keys: Array<any>): DxPromise<any>;
    /**
     * Switches a cell with a specific row index and a data field to the editing state. Takes effect only if the editing mode is &apos;batch&apos; or &apos;cell&apos;.
     */
    editCell(rowIndex: number, dataField: string): void;
    /**
     * Switches a cell with specific row and column indexes to the editing state. Takes effect only if the editing mode is &apos;batch&apos; or &apos;cell&apos;.
     */
    editCell(rowIndex: number, visibleColumnIndex: number): void;
    /**
     * Switches a row with a specific index to the editing state. Takes effect only if the editing mode is &apos;row&apos;, &apos;popup&apos; or &apos;form&apos;.
     */
    editRow(rowIndex: number): void;
    /**
     * Hides the load panel.
     */
    endCustomLoading(): void;
    /**
     * Expands an adaptive detail row.
     */
    expandAdaptiveDetailRow(key: any): void;
    /**
     * Gets a filter expression applied to the UI component&apos;s data source using the filter(filterExpr) method and the DataSource&apos;s filter property.
     */
    filter(): any;
    /**
     * Applies a filter to the dataSource.
     */
    filter(filterExpr: any): void;
    focus(): void;
    /**
     * Sets focus on a specific cell.
     */
    focus(element: UserDefinedElement): void;
    /**
     * Gets a cell with a specific row index and a data field, column caption or name.
     */
    getCellElement(rowIndex: number, dataField: string): DxElement | undefined;
    /**
     * Gets a cell with specific row and column indexes.
     */
    getCellElement(rowIndex: number, visibleColumnIndex: number): DxElement | undefined;
    /**
     * Gets the total filter that combines all the filters applied.
     */
    getCombinedFilter(): any;
    /**
     * Gets the total filter that combines all the filters applied.
     */
    getCombinedFilter(returnDataField: boolean): any;
    getDataSource(): DataSource;
    /**
     * Gets the key of a row with a specific index.
     */
    getKeyByRowIndex(rowIndex: number): any;
    /**
     * Gets the container of a row with a specific index.
     */
    getRowElement(rowIndex: number): UserDefinedElementsArray | undefined;
    /**
     * Gets the index of a row with a specific key.
     */
    getRowIndexByKey(key: any | string | number): number;
    /**
     * Gets the instance of the UI component&apos;s scrollable part.
     */
    getScrollable(): dxScrollable;
    /**
     * Gets the index of a visible column.
     */
    getVisibleColumnIndex(id: number | string): number;
    /**
     * Checks whether the UI component has unsaved changes.
     */
    hasEditData(): boolean;
    /**
     * Hides the column chooser.
     */
    hideColumnChooser(): void;
    /**
     * Checks whether an adaptive detail row is expanded or collapsed.
     */
    isAdaptiveDetailRowExpanded(key: any): boolean;
    /**
     * Checks whether a row with a specific key is focused.
     */
    isRowFocused(key: any): boolean;
    /**
     * Checks whether a row with a specific key is selected.
     */
    isRowSelected(key: any): boolean;
    /**
     * Gets a data object&apos;s key.
     */
    keyOf(obj: any): any;
    /**
     * Navigates to a row with the specified key.
     */
    navigateToRow(key: any): void;
    /**
     * Gets the total page count.
     */
    pageCount(): number;
    /**
     * Gets the current page index.
     */
    pageIndex(): number;
    /**
     * Switches the UI component to a specific page using a zero-based index.
     */
    pageIndex(newIndex: number): DxPromise<void>;
    /**
     * Gets the current page size.
     */
    pageSize(): number;
    /**
     * Sets the page size.
     */
    pageSize(value: number): void;
    /**
     * Reloads data and repaints data rows.
     */
    refresh(): DxPromise<void>;
    /**
     * Reloads data and repaints all or only updated data rows.
     */
    refresh(changesOnly: boolean): DxPromise<void>;
    /**
     * Repaints specific rows.
     */
    repaintRows(rowIndexes: Array<number>): void;
    /**
     * Saves changes that a user made to data.
     */
    saveEditData(): DxPromise<void>;
    /**
     * Seeks a search string in the columns whose allowSearch property is true.
     */
    searchByText(text: string): void;
    /**
     * Selects all rows.
     */
    selectAll(): DxPromise<void>;
    /**
     * Selects rows with specific keys.
     */
    selectRows(keys: Array<any>, preserve: boolean): DxPromise<any>;
    /**
     * Selects rows with specific indexes.
     */
    selectRowsByIndexes(indexes: Array<number>): DxPromise<any>;
    /**
     * Shows the column chooser.
     */
    showColumnChooser(): void;
    /**
     * Gets the current UI component state.
     */
    state(): any;
    /**
     * Sets the UI component state.
     */
    state(state: any): void;
    /**
     * Recovers a row deleted in batch editing mode.
     */
    undeleteRow(rowIndex: number): void;
    /**
     * Updates the UI component&apos;s content after resizing.
     */
    updateDimensions(): void;
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface ColumnCustomizeTextArg {
  value?: string | number | Date;
  valueText?: string;
  target?: string;
  groupInterval?: string | number;
}

/**
 * @deprecated 
 */
export type GridBaseColumn = ColumnBase;
/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface ColumnBase {
    /**
     * Aligns the content of the column.
     */
    alignment?: 'center' | 'left' | 'right';
    /**
     * Specifies whether a user can edit values in the column at runtime. By default, inherits the value of the editing.allowUpdating property.
     */
    allowEditing?: boolean;
    /**
     * Specifies whether data can be filtered by this column. Applies only if filterRow.visible is true.
     */
    allowFiltering?: boolean;
    /**
     * Specifies whether a user can fix the column at runtime. Applies only if columnFixing.enabled is true.
     */
    allowFixing?: boolean;
    /**
     * Specifies whether the header filter can be used to filter data by this column. Applies only if headerFilter.visible is true. By default, inherits the value of the allowFiltering property.
     */
    allowHeaderFiltering?: boolean;
    /**
     * Specifies whether a user can hide the column using the column chooser at runtime. Applies only if columnChooser.enabled is true.
     */
    allowHiding?: boolean;
    /**
     * Specifies whether this column can be used in column reordering at runtime. Applies only if allowColumnReordering is true.
     */
    allowReordering?: boolean;
    /**
     * Specifies whether a user can resize the column at runtime. Applies only if allowColumnResizing is true.
     */
    allowResizing?: boolean;
    /**
     * Specifies whether this column can be searched. Applies only if searchPanel.visible is true. Inherits the value of the allowFiltering property by default.
     */
    allowSearch?: boolean;
    /**
     * Specifies whether a user can sort rows by this column at runtime. Applies only if sorting.mode differs from &apos;none&apos;.
     */
    allowSorting?: boolean;
    /**
     * Calculates custom cell values. Use this function to create an unbound data column.
     */
    calculateCellValue?: ((rowData: any) => any);
    /**
     * Calculates custom display values for column cells. Requires specifying the dataField or calculateCellValue property. Used in lookup optimization.
     */
    calculateDisplayValue?: string | ((rowData: any) => any);
    /**
     * Specifies the column&apos;s custom rules to filter data.
     */
    calculateFilterExpression?: ((filterValue: any, selectedFilterOperation: string, target: string) => string | Array<any> | Function);
    /**
     * Calculates custom values used to sort this column.
     */
    calculateSortValue?: string | ((rowData: any) => any);
    /**
     * Specifies a caption for the column.
     */
    caption?: string;
    /**
     * Specifies a CSS class to be applied to the column.
     */
    cssClass?: string;
    /**
     * Customizes the text displayed in column cells.
     */
    customizeText?: ((cellInfo: ColumnCustomizeTextArg) => string);
    /**
     * Binds the column to a field of the dataSource.
     */
    dataField?: string;
    /**
     * Casts column values to a specific data type.
     */
    dataType?: 'string' | 'number' | 'date' | 'boolean' | 'object' | 'datetime';
    /**
     * Configures the default UI component used for editing and filtering in the filter row.
     */
    editorOptions?: any;
    /**
     * Specifies whether HTML tags are displayed as plain text or applied to the values of the column.
     */
    encodeHtml?: boolean;
    /**
     * In a boolean column, replaces all false items with a specified text. Applies only if showEditorAlways property is false.
     */
    falseText?: string;
    /**
     * Specifies available filter operations. Applies if allowFiltering is true and the filterRow and/or filterPanel are visible.
     */
    filterOperations?: Array<'=' | '<>' | '<' | '<=' | '>' | '>=' | 'contains' | 'endswith' | 'isblank' | 'isnotblank' | 'notcontains' | 'startswith' | 'between' | 'anyof' | 'noneof'>;
    /**
     * Specifies whether a user changes the current filter by including (selecting) or excluding (clearing the selection of) values. Applies only if headerFilter.visible and allowHeaderFiltering are true.
     */
    filterType?: 'exclude' | 'include';
    /**
     * Specifies the column&apos;s filter value displayed in the filter row.
     */
    filterValue?: any;
    /**
     * Specifies values selected in the column&apos;s header filter.
     */
    filterValues?: Array<any>;
    /**
     * Fixes the column.
     */
    fixed?: boolean;
    /**
     * Specifies the UI component&apos;s edge to which the column is fixed. Applies only if columns[].fixed is true.
     */
    fixedPosition?: 'left' | 'right';
    /**
     * Configures the form item that the column produces in the editing state. Applies only if editing.mode is &apos;form&apos; or &apos;popup&apos;.
     */
    formItem?: dxFormSimpleItem;
    /**
     * Formats a value before it is displayed in a column cell.
     */
    format?: format;
    /**
     * Specifies data settings for the header filter.
     */
    headerFilter?: ColumnHeaderFilter;
    /**
     * Specifies the order in which columns are hidden when the UI component adapts to the screen or container size. Ignored if allowColumnResizing is true and columnResizingMode is &apos;widget&apos;.
     */
    hidingPriority?: number;
    /**
     * Specifies whether the column organizes other columns into bands.
     */
    isBand?: boolean;
    /**
     * Specifies properties of a lookup column.
     */
    lookup?: ColumnLookup;
    /**
     * Specifies the minimum width of the column.
     */
    minWidth?: number;
    /**
     * Specifies the column&apos;s unique identifier. If not set in code, this value is inherited from the dataField.
     */
    name?: string;
    /**
     * Specifies the band column that owns the current column. Accepts the index of the band column in the columns array.
     */
    ownerBand?: number;
    /**
     * Specifies whether to render the column after other columns and elements. Use if column cells have a complex template. Requires the width property specified.
     */
    renderAsync?: boolean;
    /**
     * Specifies a filter operation that applies when users use the filter row to filter the column.
     */
    selectedFilterOperation?: '<' | '<=' | '<>' | '=' | '>' | '>=' | 'between' | 'contains' | 'endswith' | 'notcontains' | 'startswith';
    /**
     * Specifies a function to be invoked after the user has edited a cell value, but before it will be saved in the data source.
     */
    setCellValue?: ((newData: any, value: any, currentRowData: any) => void | PromiseLike<void>);
    /**
     * Specifies whether the column displays its values using editors.
     */
    showEditorAlways?: boolean;
    /**
     * Specifies whether the column chooser can contain the column header.
     */
    showInColumnChooser?: boolean;
    /**
     * Specifies the index according to which columns participate in sorting.
     */
    sortIndex?: number;
    /**
     * Specifies the sort order of column values.
     */
    sortOrder?: 'asc' | 'desc';
    /**
     * Specifies a custom comparison function for sorting. Applies only when sorting is performed on the client.
     */
    sortingMethod?: ((value1: any, value2: any) => number);
    /**
     * In a boolean column, replaces all true items with a specified text. Applies only if showEditorAlways property is false.
     */
    trueText?: string;
    /**
     * Specifies validation rules to be checked when cell values are updated.
     */
    validationRules?: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule>;
    /**
     * Specifies whether the column is visible, that is, occupies space in the table.
     */
    visible?: boolean;
    /**
     * Specifies the position of the column regarding other columns in the resulting UI component.
     */
    visibleIndex?: number;
    /**
     * Specifies the column&apos;s width in pixels or as a percentage. Ignored if it is less than minWidth.
     */
    width?: number | string;
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface ColumnHeaderFilter {
  /**
   * Specifies whether searching is enabled in the header filter.
   */
  allowSearch?: boolean,
  /**
   * Specifies the header filter&apos;s data source.
   */
  dataSource?: Array<any> | Store | ((options: { component?: any, dataSource?: DataSourceOptions }) => any) | DataSourceOptions,
  /**
   * Specifies how the header filter combines values into groups. Does not apply if you specify a custom header filter data source.
   */
  groupInterval?: 'day' | 'hour' | 'minute' | 'month' | 'quarter' | 'second' | 'year' | number,
  /**
   * Specifies the height of the popup menu containing filtering values.
   */
  height?: number,
  /**
   * Specifies a comparison operation used to search header filter values.
   */
  searchMode?: 'contains' | 'startswith' | 'equals',
  /**
   * Specifies the width of the popup menu containing filtering values.
   */
  width?: number
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface ColumnLookup {
  /**
   * Specifies whether to display the Clear button in lookup column cells while they are being edited.
   */
  allowClearing?: boolean,
  /**
   * Specifies the data source for the lookup column.
   */
  dataSource?: Array<any> | DataSourceOptions | Store | ((options: { data?: any, key?: any }) => Array<any> | DataSourceOptions | Store),
  /**
   * Specifies the data source field whose values must be displayed.
   */
  displayExpr?: string | ((data: any) => string),
  /**
   * Specifies the data field whose values should be replaced with values from the displayExpr field.
   */
  valueExpr?: string
  /**
   * 
   */
  calculateCellValue?: ((rowData: any) => any);
}

/**
 * @deprecated 
 */
export type GridBaseColumnButton = ColumnButtonBase;
/**
 * Allows you to customize buttons in the edit column or create a custom command column. Applies only if the column&apos;s type is &apos;buttons&apos;.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface ColumnButtonBase {
    /**
     * Specifies a CSS class to be applied to the button.
     */
    cssClass?: string;
    /**
     * Specifies the text for the hint that appears when the button is hovered over or long-pressed.
     */
    hint?: string;
    /**
     * Specifies the button&apos;s icon.
     */
    icon?: string;
    /**
     * Specifies the button&apos;s text. Applies only if the button&apos;s icon is not specified.
     */
    text?: string;
}

export type AdaptiveDetailRowPreparingEvent = EventInfo<dxDataGrid> & AdaptiveDetailRowPreparingInfo;

export type CellClickEvent = NativeEventInfo<dxDataGrid> & {
  readonly data: any;
  readonly key: any;
  readonly value?: any;
  readonly displayValue?: any;
  readonly text: string;
  readonly columnIndex: number;
  readonly column: any;
  readonly rowIndex: number;
  readonly rowType: string;
  readonly cellElement: DxElement;
  readonly row: RowObject;
}

export type CellDblClickEvent = NativeEventInfo<dxDataGrid> & {
  readonly data: any;
  readonly key: any;
  readonly value?: any;
  readonly displayValue?: any;
  readonly text: string;
  readonly columnIndex: number;
  readonly column: Column;
  readonly rowIndex: number;
  readonly rowType: string;
  readonly cellElement: DxElement;
  readonly row: RowObject;
}

export type CellHoverChangedEvent = EventInfo<dxDataGrid> & {
  readonly eventType: string;
  readonly data: any;
  readonly key: any;
  readonly value?: any;
  readonly text: string;
  readonly displayValue?: any;
  readonly columnIndex: number;
  readonly rowIndex: number;
  readonly column: Column;
  readonly rowType: string;
  readonly cellElement: DxElement;
  readonly row: RowObject;
}

export type CellPreparedEvent = EventInfo<dxDataGrid> & {
  readonly data: any;
  readonly key: any;
  readonly value?: any;
  readonly displayValue?: any;
  readonly text: string;
  readonly columnIndex: number;
  readonly column: Column;
  readonly rowIndex: number;
  readonly rowType: string;
  readonly row: RowObject;
  readonly isSelected?: boolean;
  readonly isExpanded?: boolean;
  readonly isNewRow?: boolean;
  readonly cellElement: DxElement;
  readonly watch?: Function;
  readonly oldValue?: any;
}

export type ContentReadyEvent = EventInfo<dxDataGrid>;

export type ContextMenuPreparingEvent = EventInfo<dxDataGrid> & {
  items?: Array<any>;
  readonly target: string;
  readonly targetElement: DxElement;
  readonly columnIndex: number;
  readonly column?: Column;
  readonly rowIndex: number;
  readonly row?: RowObject;
}

export type DataErrorOccurredEvent = EventInfo<dxDataGrid> & DataErrorOccurredInfo;

export type DisposingEvent = EventInfo<dxDataGrid>;

export type EditCanceledEvent = EventInfo<dxDataGrid> & DataChangeInfo;

export type EditCancelingEvent = Cancelable & EventInfo<dxDataGrid> & DataChangeInfo;

export type EditingStartEvent = Cancelable & EventInfo<dxDataGrid> & {
  readonly data: any;
  readonly key: any;
  readonly column?: any;
}

export type EditorPreparedEvent = EventInfo<dxDataGrid> & {
  readonly parentType: string;
  readonly value?: any;
  readonly setValue?: any;
  readonly updateValueTimeout?: number;
  readonly width?: number;
  readonly disabled: boolean;
  readonly rtlEnabled: boolean;
  readonly editorElement: DxElement;
  readonly readOnly: boolean;
  readonly dataField?: string;
  readonly row?: RowObject;
}

export type EditorPreparingEvent = EventInfo<dxDataGrid> & {
  readonly parentType: string;
  readonly value?: any;
  readonly setValue?: any;
  readonly updateValueTimeout?: number;
  readonly width?: number;
  readonly disabled: boolean;
  readonly rtlEnabled: boolean;
  cancel: boolean;
  readonly editorElement: DxElement;
  readonly readOnly: boolean;
  editorName: string;
  editorOptions: any;
  readonly dataField?: string;
  readonly row?: RowObject;
}

export type ExportedEvent  = EventInfo<dxDataGrid>;

export type ExportingEvent = Cancelable & EventInfo<dxDataGrid> & {
  fileName?: string;
}

export type FileSavingEvent = Cancelable & {
  readonly component: dxDataGrid;
  readonly element: DxElement;
  fileName?: string;
  format?: string;
  readonly data: Blob;
}

export type FocusedCellChangedEvent = EventInfo<dxDataGrid> & {
  readonly cellElement: DxElement;
  readonly columnIndex: number;
  readonly rowIndex: number;
  readonly row?: RowObject;
  readonly column?: Column;
}

export type FocusedCellChangingEvent = Cancelable & NativeEventInfo<dxDataGrid> & {
  readonly cellElement: DxElement;
  readonly prevColumnIndex: number;
  readonly prevRowIndex: number;
  newColumnIndex: number;
  newRowIndex: number;
  readonly rows: Array<RowObject>;
  readonly columns: Array<Column>;
  isHighlighted: boolean;
}

export type FocusedRowChangedEvent = EventInfo<dxDataGrid> & {
  readonly rowElement: DxElement;
  readonly rowIndex: number;
  readonly row?: RowObject;
}

export type FocusedRowChangingEvent = Cancelable & NativeEventInfo<dxDataGrid> & {
  readonly rowElement: DxElement;
  readonly prevRowIndex: number;
  newRowIndex: number;
  readonly rows: Array<RowObject>;
}

export type InitializedEvent = InitializedEventInfo<dxDataGrid>;

export type InitNewRowEvent = EventInfo<dxDataGrid> & NewRowInfo;

export type KeyDownEvent = NativeEventInfo<dxDataGrid> & KeyDownInfo;

export type OptionChangedEvent = EventInfo<dxDataGrid> & ChangedOptionInfo;

export type RowClickEvent = NativeEventInfo<dxDataGrid> & {
  readonly data: any;
  readonly key: any;
  readonly values: Array<any>;
  readonly columns: Array<any>;
  readonly rowIndex: number;
  readonly rowType: string;
  readonly isSelected?: boolean;
  readonly isExpanded?: boolean;
  readonly isNewRow?: boolean;
  readonly groupIndex?: number;
  readonly rowElement: DxElement;
  readonly handled: boolean;
}

export type RowCollapsedEvent = EventInfo<dxDataGrid> & RowKeyInfo;

export type RowCollapsingEvent = Cancelable & EventInfo<dxDataGrid> & RowKeyInfo;

export type RowDblClickEvent = NativeEventInfo<dxDataGrid> & {
  readonly data: any;
  readonly key: any;
  readonly values: Array<any>;
  readonly columns: Array<Column>;
  readonly rowIndex: number;
  readonly rowType: string;
  readonly isSelected?: boolean;
  readonly isExpanded?: boolean;
  readonly isNewRow?: boolean;
  readonly groupIndex?: number;
  readonly rowElement: DxElement;
}

export type RowExpandedEvent = EventInfo<dxDataGrid> & RowKeyInfo;

export type RowExpandingEvent = Cancelable & EventInfo<dxDataGrid> & RowKeyInfo;

export type RowInsertedEvent = EventInfo<dxDataGrid> & RowInsertedInfo;

export type RowInsertingEvent = EventInfo<dxDataGrid> & RowInsertingInfo;

export type RowPreparedEvent = EventInfo<dxDataGrid> & {
  readonly data: any;
  readonly key: any;
  readonly values: Array<any>;
  readonly columns: Array<Column>;
  readonly rowIndex: number;
  readonly rowType: string;
  readonly groupIndex?: number;
  readonly isSelected?: boolean;
  readonly isExpanded?: boolean;
  readonly isNewRow?: boolean;
  readonly rowElement: DxElement;
}

export type RowRemovedEvent = EventInfo<dxDataGrid> & RowRemovedInfo;

export type RowRemovingEvent = EventInfo<dxDataGrid> & RowRemovingInfo;

export type RowUpdatedEvent = EventInfo<dxDataGrid> & RowUpdatedInfo;

export type RowUpdatingEvent = EventInfo<dxDataGrid> & RowUpdatingInfo;

export type RowValidatingEvent = EventInfo<dxDataGrid> & RowValidatingInfo;

export type SavedEvent = EventInfo<dxDataGrid> & DataChangeInfo;

export type SavingEvent = EventInfo<dxDataGrid> & SavingInfo;

export type SelectionChangedEvent = EventInfo<dxDataGrid> & SelectionChangedInfo;

export type ToolbarPreparingEvent = EventInfo<dxDataGrid> & ToolbarPreparingInfo;


export type RowDraggingAddEvent = RowDraggingEventInfo<dxDataGrid> & DragDropInfo;

export type RowDraggingChangeEvent = Cancelable & RowDraggingEventInfo<dxDataGrid> & DragDropInfo;

export type RowDraggingEndEvent = Cancelable & RowDraggingEventInfo<dxDataGrid> & DragDropInfo;

export type RowDraggingMoveEvent = Cancelable & RowDraggingEventInfo<dxDataGrid> & DragDropInfo;

export type RowDraggingStartEvent = Cancelable & DragStartEventInfo<dxDataGrid>;

export type RowDraggingRemoveEvent = RowDraggingEventInfo<dxDataGrid>;

export type RowDraggingReorderEvent = RowDraggingEventInfo<dxDataGrid> & DragReorderInfo;

export type ColumnButtonClickEvent = NativeEventInfo<dxDataGrid> & {
  row?: RowObject;
  column?: Column;
}

export type ColumnButtonTemplateData = {
  readonly component: dxDataGrid;
  readonly data?: any;
  readonly key?: any;
  readonly columnIndex: number;
  readonly column: Column;
  readonly rowIndex: number;
  readonly rowType: string;
  readonly row: RowObject;
}

export type ColumnCellTemplateData = {
  readonly data?: any;
  readonly component: dxDataGrid;
  readonly value?: any;
  readonly oldValue?: any;
  readonly displayValue?: any;
  readonly text: string;
  readonly columnIndex: number;
  readonly rowIndex: number;
  readonly column: Column;
  readonly row: RowObject;
  readonly rowType: string;
  readonly watch?: Function;
}

export type ColumnEditCellTemplateData = {
  readonly setValue?: any;
  readonly data?: any;
  readonly component: dxDataGrid;
  readonly value?: any;
  readonly displayValue?: any;
  readonly text: string;
  readonly columnIndex: number;
  readonly rowIndex: number;
  readonly column: Column;
  readonly row: RowObject;
  readonly rowType: string;
  readonly watch?: Function;
}

export type ColumnGroupCellTemplateData = {
  readonly data?: any;
  readonly component: dxDataGrid;
  readonly value?: any;
  readonly text: string;
  readonly displayValue?: any;
  readonly columnIndex: number;
  readonly rowIndex: number;
  readonly column: Column;
  readonly row: RowObject;
  readonly summaryItems: Array<any>;
  readonly groupContinuesMessage?: string;
  readonly groupContinuedMessage?: string;
}

export type ColumnHeaderCellTemplateData = {
  readonly component: dxDataGrid;
  readonly columnIndex: number;
  readonly column: Column;
}

export type MasterDetailTemplateData = {
  readonly key: any;
  readonly data: any;
  readonly watch?: Function;
}

export type RowDraggingTemplateData = RowDraggingTemplateDataModel;

export type RowTemplateData = {
  readonly key: any;
  readonly data: any;
  readonly component: dxDataGrid;
  readonly values: Array<any>;
  readonly rowIndex: number;
  readonly columns: Array<Column>;
  readonly isSelected?: boolean;
  readonly rowType: string;
  readonly groupIndex?: number;
  readonly isExpanded?: boolean;
}

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxDataGridOptions extends GridBaseOptions<dxDataGrid> {
    /**
     * An array of grid columns.
     */
    columns?: Array<Column | string>;
    /**
     * Customizes columns after they are created.
     */
    customizeColumns?: ((columns: Array<Column>) => void);
    /**
     * Customizes data before export.
     * @deprecated Since v20.1, we recommend ExcelJS-based export which does not use this property.
     */
    customizeExportData?: ((columns: Array<Column>, rows: Array<RowObject>) => void);
    /**
     * Configures editing.
     */
    editing?: Editing;
    /**
     * [tags] xlsx, csv Configures client-side exporting.
     */
    export?: Export;
    /**
     * Configures the group panel.
     */
    groupPanel?: GroupPanel;
    /**
     * Configures grouping.
     */
    grouping?: Grouping;
    /**
     * Specifies the key property (or properties) that provide(s) key values to access data items. Each key value must be unique. This property applies only if data is a simple array.
     */
    keyExpr?: string | Array<string>;
    /**
     * Allows you to build a master-detail interface in the grid.
     */
    masterDetail?: MasterDetail;
    /**
     * A function that is executed when a cell is clicked or tapped. Executed before onRowClick.
     */
    onCellClick?: ((e: CellClickEvent) => void);
    /**
     * A function that is executed when a cell is double-clicked or double-tapped. Executed before onRowDblClick.
     */
    onCellDblClick?: ((e: CellDblClickEvent) => void);
    /**
     * A function that is executed after the pointer enters or leaves a cell.
     */
    onCellHoverChanged?: ((e: CellHoverChangedEvent) => void);
    /**
     * A function that is executed after a grid cell is created.
     */
    onCellPrepared?: ((e: CellPreparedEvent) => void);
    /**
     * A function that is executed before the context menu is rendered.
     */
    onContextMenuPreparing?: ((e: ContextMenuPreparingEvent) => void);
    /**
     * A function that is executed before a cell or row switches to the editing state.
     */
    onEditingStart?: ((e: EditingStartEvent) => void);
    /**
     * A function that is executed after an editor is created. Not executed for cells with an editCellTemplate.
     */
    onEditorPrepared?: ((options: EditorPreparedEvent) => void);
    /**
     * A function used to customize a cell&apos;s editor. Not executed for cells with an editCellTemplate.
     */
    onEditorPreparing?: ((e: EditorPreparingEvent) => void);
    /**
     * A function that is executed after data is exported.
     * @deprecated Since v20.1, we recommend ExcelJS-based export which does not use this property.
     */
    onExported?: ((e: ExportedEvent) => void);
    /**
     * A function that is executed before data is exported.
     */
    onExporting?: ((e: ExportingEvent) => void);
    /**
     * A function that is executed before a file with exported data is saved to the user&apos;s local storage.
     * @deprecated Since v20.1, we recommend ExcelJS-based export which does not use this property.
     */
    onFileSaving?: ((e: FileSavingEvent) => void);
    /**
     * A function that is executed after the focused cell changes. Applies only to cells in data or group rows.
     */
    onFocusedCellChanged?: ((e: FocusedCellChangedEvent) => void);
    /**
     * A function that is executed before the focused cell changes. Applies only to cells in data or group rows.
     */
    onFocusedCellChanging?: ((e: FocusedCellChangingEvent) => void);
    /**
     * A function that is executed after the focused row changes. Applies only to data or group rows. focusedRowEnabled should be true.
     */
    onFocusedRowChanged?: ((e: FocusedRowChangedEvent) => void);
    /**
     * A function that is executed before the focused row changes. Applies only to data or group rows. focusedRowEnabled should be true.
     */
    onFocusedRowChanging?: ((e: FocusedRowChangingEvent) => void);
    /**
     * A function that is executed when a row is clicked or tapped.
     */
    onRowClick?: ((e: RowClickEvent) => void);
    /**
     * A function that is executed when a row is double-clicked or double-tapped. Executed after onCellDblClick.
     */
    onRowDblClick?: ((e: RowDblClickEvent) => void);
    /**
     * A function that is executed after a row is created.
     */
    onRowPrepared?: ((e: RowPreparedEvent) => void);
    /**
     * Notifies the DataGrid of the server&apos;s data processing operations.
     */
    remoteOperations?: boolean | {
      /**
       * Specifies whether or not filtering must be performed on the server side.
       */
      filtering?: boolean,
      /**
       * Specifies whether paging by groups should be performed on the server side.
       */
      groupPaging?: boolean,
      /**
       * Specifies whether or not grouping must be performed on the server side.
       */
      grouping?: boolean,
      /**
       * Specifies whether or not paging must be performed on the server side.
       */
      paging?: boolean,
      /**
       * Specifies whether or not sorting must be performed on the server side.
       */
      sorting?: boolean,
      /**
       * Specifies whether or not summaries summaries are calculated on the server-side.
       */
      summary?: boolean
    } | 'auto';
    /**
     * Specifies a custom template for rows.
     */
    rowTemplate?: template | ((rowElement: DxElement, rowInfo: RowTemplateData) => any);
    /**
     * Configures scrolling.
     */
    scrolling?: Scrolling;
    /**
     * Configures runtime selection.
     */
    selection?: Selection;
    /**
     * Specifies filters for the rows that must be selected initially. Applies only if selection.deferred is true.
     */
    selectionFilter?: string | Array<any> | Function;
    /**
     * Allows you to sort groups according to the values of group summary items.
     */
    sortByGroupSummaryInfo?: Array<dxDataGridSortByGroupSummaryInfoItem>;
    /**
     * Specifies the properties of the grid summary.
     */
    summary?: Summary;
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface ExcelCellInfo {
  readonly component: dxDataGrid;
  horizontalAlignment?: 'center' | 'centerContinuous' | 'distributed' | 'fill' | 'general' | 'justify' | 'left' | 'right';
  verticalAlignment?: 'bottom' | 'center' | 'distributed' | 'justify' | 'top';
  wrapTextEnabled?: boolean;
  backgroundColor?: string;
  fillPatternType?: 'darkDown' | 'darkGray' | 'darkGrid' | 'darkHorizontal' | 'darkTrellis' | 'darkUp' | 'darkVertical' | 'gray0625' | 'gray125' | 'lightDown' | 'lightGray' | 'lightGrid' | 'lightHorizontal' | 'lightTrellis' | 'lightUp' | 'lightVertical' | 'mediumGray' | 'none' | 'solid';
  fillPatternColor?: string;
  font?: ExcelFont;
  readonly value?: string | number | Date;
  numberFormat?: string;
  gridCell?: ExcelCell;
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface Export {
  /**
   * Allows users to export selected rows only.
   */
  allowExportSelectedData?: boolean,
  /**
   * Customizes an Excel cell after it is created.
   * @deprecated Since v20.1, we recommend ExcelJS-based export which does not use this property.
   */
  customizeExcelCell?: ((options: ExcelCellInfo) => void),
  /**
   * Adds the Export button to the DataGrid&apos;s toolbar.
   */
  enabled?: boolean,
  /**
   * Specifies whether to enable Excel filtering for the exported data in the resulting XLSX file.
   * @deprecated Since v20.1, we recommend ExcelJS-based export which does not use this property.
   */
  excelFilterEnabled?: boolean,
  /**
   * Specifies whether to enable word wrapping for exported data in the resulting XLSX file.
   * @deprecated Since v20.1, we recommend ExcelJS-based export which does not use this property.
   */
  excelWrapTextEnabled?: boolean,
  /**
   * Specifies a default name for the file to which grid data is exported.
   * @deprecated Since v20.1, we recommend ExcelJS-based export which does not use this property.
   */
  fileName?: string,
  /**
   * Specifies whether Excel should hide warnings if there are errors in the exported document.
   * @deprecated Since v20.1, we recommend ExcelJS-based export which does not use this property.
   */
  ignoreExcelErrors?: boolean,
  /**
   * Specifies the URL of the server-side proxy that streams the resulting file to the end user to enable exporting in the Safari browser.
   * @deprecated Since v10, Safari browser supports API for saving files, and this property is no longer required.
   */
  proxyUrl?: string,
  /**
   * Configures the texts of export commands, buttons, and hints.
   */
  texts?: ExportTexts
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface ExportTexts {
  /**
   * The text or hint of the command that exports all data.
   */
  exportAll?: string,
  /**
   * The text of the command that exports selected rows. Applies when allowExportSelectedData property is true.
   */
  exportSelectedRows?: string,
  /**
   * The hint of the Export button when the allowExportSelectedData property is true.
   */
  exportTo?: string
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface GroupPanel {
  /**
   * Specifies whether columns can be dragged onto or from the group panel.
   */
  allowColumnDragging?: boolean,
  /**
   * Specifies text displayed by the group panel when it does not contain any columns.
   */
  emptyPanelText?: string,
  /**
   * Specifies whether the group panel is visible or not.
   */
  visible?: boolean | 'auto'
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface Grouping {
  /**
   * Specifies whether the user can collapse grouped records in a grid or not.
   */
  allowCollapsing?: boolean,
  /**
   * Specifies whether groups appear expanded or not.
   */
  autoExpandAll?: boolean,
  /**
   * Enables the user to group data using the context menu.
   */
  contextMenuEnabled?: boolean,
  /**
   * Specifies the event on which a group will be expanded/collapsed.
   */
  expandMode?: 'buttonClick' | 'rowClick',
  /**
   * Defines the texts of grouping-related visual elements.
   */
  texts?: GroupingTexts
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface GroupingTexts {
  /**
   * Specifies the text of the context menu item that groups data by a specific column.
   */
  groupByThisColumn?: string,
  /**
   * Specifies the message displayed in a group row when the corresponding group is continued from the previous page.
   */
  groupContinuedMessage?: string,
  /**
   * Specifies the message displayed in a group row when the corresponding group continues on the next page.
   */
  groupContinuesMessage?: string,
  /**
   * Specifies the text of the context menu item that clears grouping settings of a specific column.
   */
  ungroup?: string,
  /**
   * Specifies the text of the context menu item that clears grouping settings of all columns.
   */
  ungroupAll?: string
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface MasterDetail {
  /**
   * Specifies whether detail sections appear expanded or collapsed.
   */
  autoExpandAll?: boolean,
  /**
   * Enables an end-user to expand/collapse detail sections.
   */
  enabled?: boolean,
  /**
   * Specifies a custom template for detail sections.
   */
  template?: template | ((detailElement: DxElement, detailInfo: MasterDetailTemplateData) => any)
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxDataGridSortByGroupSummaryInfoItem {
    /**
     * Specifies the identifier of the column that must be used in grouping so that sorting by group summary item values be applied.
     */
    groupColumn?: string,
    /**
     * Specifies the sort order of group summary item values.
     */
    sortOrder?: 'asc' | 'desc',
    /**
     * Specifies the group summary item whose values must be used to sort groups.
     */
    summaryItem?: string | number
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface CustomSummaryInfo {
  readonly component: dxDataGrid;
  readonly name?: string;
  readonly summaryProcess: string;
  readonly value?: any;
  totalValue?: any;
  readonly groupIndex?: number;
}

export interface Summary {
  /**
   * Specifies a custom aggregate function. This function is called for summary items whose summaryType is &apos;custom&apos;.
   */
  calculateCustomSummary?: ((options: CustomSummaryInfo) => void),
  /**
   * Specifies items of the group summary.
   */
  groupItems?: Array<SummaryGroupItem>,
  /**
   * Specifies whether to recalculate summaries while a user edits data.
   */
  recalculateWhileEditing?: boolean,
  /**
   * Specifies whether to skip empty strings, null and undefined values when calculating a summary. Does not apply when you use a remote data source.
   */
  skipEmptyValues?: boolean,
  /**
   * Contains properties that specify text patterns for summary items.
   */
  texts?: SummaryTexts,
  /**
   * Specifies items of the total summary.
   */
  totalItems?: Array<SummaryTotalItem>
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface SummaryItemTextInfo {
  readonly value?: string | number | Date;
  readonly valueText: string;
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface SummaryGroupItem {
    /**
     * Indicates whether to display group summary items in parentheses after the group row header or to align them by the corresponding columns within the group row.
     */
    alignByColumn?: boolean,
    /**
     * Specifies the column that provides data for a group summary item.
     */
    column?: string,
    /**
     * Customizes the text to be displayed in the summary item.
     */
    customizeText?: ((itemInfo: SummaryItemTextInfo) => string),
    /**
     * Specifies the summary item&apos;s text.
     */
    displayFormat?: string,
    /**
     * Specifies the group summary item&apos;s identifier.
     */
    name?: string,
    /**
     * Specifies the column that must hold the summary item when this item is displayed in the group footer or aligned by a column in the group row.
     */
    showInColumn?: string,
    /**
     * Specifies whether or not a summary item must be displayed in the group footer.
     */
    showInGroupFooter?: boolean,
    /**
     * Specifies whether to skip empty strings, null, and undefined values when calculating a summary. Does not apply when you use a remote data source.
     */
    skipEmptyValues?: boolean,
    /**
     * Specifies how to aggregate data for the group summary item.
     */
    summaryType?: 'avg' | 'count' | 'custom' | 'max' | 'min' | 'sum' | string,
    /**
     * Specifies a summary item value&apos;s display format.
     */
    valueFormat?: format
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface SummaryTotalItem {
  /**
   * Specifies the alignment of a summary item.
   */
  alignment?: 'center' | 'left' | 'right',
  /**
   * Specifies the column that provides data for a summary item.
   */
  column?: string,
  /**
   * Specifies a CSS class to be applied to a summary item.
   */
  cssClass?: string,
  /**
   * Customizes the text to be displayed in the summary item.
   */
  customizeText?: ((itemInfo: SummaryItemTextInfo) => string),
  /**
   * Specifies the summary item&apos;s text.
   */
  displayFormat?: string,
  /**
   * Specifies the total summary item&apos;s identifier.
   */
  name?: string,
  /**
   * Specifies the column that must hold the summary item.
   */
  showInColumn?: string,
  /**
   * Specifies whether to skip empty strings, null, and undefined values when calculating a summary. Does not apply when you use a remote data source.
   */
  skipEmptyValues?: boolean,
  /**
   * Specifies how to aggregate data for the total summary item.
   */
  summaryType?: 'avg' | 'count' | 'custom' | 'max' | 'min' | 'sum' | string,
  /**
   * Specifies a summary item value&apos;s display format.
   */
  valueFormat?: format
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface SummaryTexts {
    /**
     * Specifies a pattern for the &apos;avg&apos; summary items when they are displayed in the parent column.
     */
    avg?: string,
    /**
     * Specifies a pattern for the &apos;avg&apos; summary items displayed in a group row or in any other column rather than the parent one.
     */
    avgOtherColumn?: string,
    /**
     * Specifies a pattern for the &apos;count&apos; summary items.
     */
    count?: string,
    /**
     * Specifies a pattern for the &apos;max&apos; summary items when they are displayed in the parent column.
     */
    max?: string,
    /**
     * Specifies a pattern for the &apos;max&apos; summary items displayed in a group row or in any other column rather than the parent one.
     */
    maxOtherColumn?: string,
    /**
     * Specifies a pattern for the &apos;min&apos; summary items when they are displayed in the parent column.
     */
    min?: string,
    /**
     * Specifies a pattern for the &apos;min&apos; summary items displayed in a group row or in any other column rather than the parent one.
     */
    minOtherColumn?: string,
    /**
     * Specifies a pattern for the &apos;sum&apos; summary items when they are displayed in the parent column.
     */
    sum?: string,
    /**
     * Specifies a pattern for the &apos;sum&apos; summary items displayed in a group row or in any other column rather than the parent one.
     */
    sumOtherColumn?: string
}

/**
 * @deprecated 
 */
export type dxDataGridEditing = Editing;

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface Editing extends EditingBase {
    /**
     * Specifies whether a user can add new rows.
     */
    allowAdding?: boolean;
    /**
     * Specifies whether a user can delete rows. It is called for each data row when defined as a function.
     */
    allowDeleting?: boolean | ((options: { component?: dxDataGrid, row?: RowObject }) => boolean);
    /**
     * Specifies whether a user can update rows. It is called for each data row when defined as a function.
     */
    allowUpdating?: boolean | ((options: { component?: dxDataGrid, row?: RowObject }) => boolean);
    /**
     * Contains properties that specify texts for editing-related UI elements.
     */
    texts?: any;
}

/**
 * @deprecated 
 */
export type dxDataGridScrolling = Scrolling;

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface Scrolling extends ScrollingBase {
    /**
     * Specifies the scrolling mode.
     */
    mode?: 'infinite' | 'standard' | 'virtual';
}

/**
 * @deprecated 
 */
export type dxDataGridSelection = Selection;

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface Selection extends SelectionBase {
    /**
     * Makes selection deferred.
     */
    deferred?: boolean;
    /**
     * Specifies the mode in which all the records are selected. Applies only if selection.allowSelectAll is true.
     */
    selectAllMode?: 'allPages' | 'page';
    /**
     * Specifies when to display the selection column and row selection checkboxes. Applies only if selection.mode is &apos;multiple&apos;.
     */
    showCheckBoxesMode?: 'always' | 'none' | 'onClick' | 'onLongTap';
}
/**
 * The DataGrid is a UI component that represents data from a local or remote source in the form of a grid. This UI component offers such basic features as sorting, grouping, filtering, as well as more advanced capabilities, like state storing, client-side exporting, master-detail interface, and many others.
 */
declare class dxDataGrid extends Widget implements GridBase {
    constructor(element: UserDefinedElement, options?: dxDataGridOptions)
    /**
     * Adds a new column.
     */
    addColumn(columnOptions: any | string): void;
    /**
     * Adds an empty data row and switches it to the editing state.
     */
    addRow(): DxPromise<void>;
    /**
     * Ungroups grid records.
     */
    clearGrouping(): void;
    /**
     * Collapses master rows or groups of a specific level.
     */
    collapseAll(groupIndex?: number): void;
    /**
     * Collapses a group or a master row with a specific key.
     */
    collapseRow(key: any): DxPromise<void>;
    /**
     * Expands master rows or groups of a specific level. Does not apply if data is remote.
     */
    expandAll(groupIndex?: number): void;
    /**
     * Expands a group or a master row with a specific key.
     */
    expandRow(key: any): DxPromise<void>;
    /**
     * Exports grid data to Excel.
     * @deprecated Use exportDataGrid instead.
     */
    exportToExcel(selectionOnly: boolean): void;
    /**
     * Gets the currently selected rows&apos; keys.
     */
    getSelectedRowKeys(): Array<any> & DxPromise<any>;
    /**
     * Gets the selected rows&apos; data objects.
     */
    getSelectedRowsData(): Array<any> & DxPromise<any>;
    /**
     * Gets the value of a total summary item.
     */
    getTotalSummaryValue(summaryItemName: string): any;
    /**
     * Gets all visible columns.
     */
    getVisibleColumns(): Array<Column>;
    /**
     * Gets all visible columns at a specific hierarchical level of column headers. Use it to access banded columns.
     */
    getVisibleColumns(headerLevel: number): Array<Column>;
    /**
     * Gets currently rendered rows.
     */
    getVisibleRows(): Array<RowObject>;
    /**
     * Checks whether a specific group or master row is expanded or collapsed.
     */
    isRowExpanded(key: any): boolean;
    /**
     * Checks whether a row found using its data object is selected. Takes effect only if selection.deferred is true.
     */
    isRowSelected(data: any): boolean;
    isRowSelected(key: any): boolean;
    /**
     * Gets the total row count.
     */
    totalCount(): number;

    beginCustomLoading(messageText: string): void;
    byKey(key: any | string | number): DxPromise<any>;
    cancelEditData(): void;
    cellValue(rowIndex: number, dataField: string): any;
    cellValue(rowIndex: number, dataField: string, value: any): void;
    cellValue(rowIndex: number, visibleColumnIndex: number): any;
    cellValue(rowIndex: number, visibleColumnIndex: number, value: any): void;
    clearFilter(): void;
    clearFilter(filterName: string): void;
    clearSelection(): void;
    clearSorting(): void;
    closeEditCell(): void;
    collapseAdaptiveDetailRow(): void;
    columnCount(): number;
    columnOption(id: number | string): any;
    columnOption(id: number | string, optionName: string): any;
    columnOption(id: number | string, optionName: string, optionValue: any): void;
    columnOption(id: number | string, options: any): void;
    deleteColumn(id: number | string): void;
    deleteRow(rowIndex: number): void;
    deselectAll(): DxPromise<void>;
    deselectRows(keys: Array<any>): DxPromise<any>;
    editCell(rowIndex: number, dataField: string): void;
    editCell(rowIndex: number, visibleColumnIndex: number): void;
    editRow(rowIndex: number): void;
    endCustomLoading(): void;
    expandAdaptiveDetailRow(key: any): void;
    filter(): any;
    filter(filterExpr: any): void;
    focus(): void;
    focus(element: UserDefinedElement): void;
    getCellElement(rowIndex: number, dataField: string): DxElement | undefined;
    getCellElement(rowIndex: number, visibleColumnIndex: number): DxElement | undefined;
    getCombinedFilter(): any;
    getCombinedFilter(returnDataField: boolean): any;
    getDataSource(): DataSource;
    getKeyByRowIndex(rowIndex: number): any;
    getRowElement(rowIndex: number): UserDefinedElementsArray | undefined;
    getRowIndexByKey(key: any | string | number): number;
    getScrollable(): dxScrollable;
    getVisibleColumnIndex(id: number | string): number;
    hasEditData(): boolean;
    hideColumnChooser(): void;
    isAdaptiveDetailRowExpanded(key: any): boolean;
    isRowFocused(key: any): boolean;
    isRowSelected(key: any): boolean;
    keyOf(obj: any): any;
    navigateToRow(key: any): void;
    pageCount(): number;
    pageIndex(): number;
    pageIndex(newIndex: number): DxPromise<void>;
    pageSize(): number;
    pageSize(value: number): void;
    refresh(): DxPromise<void>;
    refresh(changesOnly: boolean): DxPromise<void>;
    repaintRows(rowIndexes: Array<number>): void;
    saveEditData(): DxPromise<void>;
    searchByText(text: string): void;
    selectAll(): DxPromise<void>;
    selectRows(keys: Array<any>, preserve: boolean): DxPromise<any>;
    selectRowsByIndexes(indexes: Array<number>): DxPromise<any>;
    showColumnChooser(): void;
    state(): any;
    state(state: any): void;
    undeleteRow(rowIndex: number): void;
    updateDimensions(): void;
}

export type Column = dxDataGridColumn;

/**
 * @deprecated Use the Column type instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxDataGridColumn extends ColumnBase {
    /**
     * Specifies whether data from this column should be exported. Applies only if the column is visible.
     */
    allowExporting?: boolean;
    /**
     * Specifies whether the user can group data by values of this column. Applies only when grouping is enabled.
     */
    allowGrouping?: boolean;
    /**
     * Specifies whether groups appear expanded or not when records are grouped by a specific column. Setting this property makes sense only when grouping is allowed for this column.
     */
    autoExpandGroup?: boolean;
    /**
     * Allows you to customize buttons in the edit column or create a custom command column. Applies only if the column&apos;s type is &apos;buttons&apos;.
     */
    buttons?: Array<'cancel' | 'delete' | 'edit' | 'save' | 'undelete' | ColumnButton>;
    /**
     * Sets custom column values used to group grid records.
     */
    calculateGroupValue?: string | ((rowData: any) => any);
    /**
     * Specifies a custom template for data cells.
     */
    cellTemplate?: template | ((cellElement: DxElement, cellInfo: ColumnCellTemplateData) => any);
    /**
     * An array of grid columns.
     */
    columns?: Array<Column | string>;
    /**
     * Specifies a custom template for data cells in editing state.
     */
    editCellTemplate?: template | ((cellElement: DxElement, cellInfo: ColumnEditCellTemplateData) => any);
    /**
     * Specifies a custom template for group cells (group rows).
     */
    groupCellTemplate?: template | ((cellElement: DxElement, cellInfo: ColumnGroupCellTemplateData) => any);
    /**
     * Specifies the index of a column when grid records are grouped by the values of this column.
     */
    groupIndex?: number;
    /**
     * Specifies a custom template for column headers.
     */
    headerCellTemplate?: template | ((columnHeader: DxElement, headerInfo: ColumnHeaderCellTemplateData) => any);
    /**
     * Specifies whether or not to display the column when grid records are grouped by it.
     */
    showWhenGrouped?: boolean;
    /**
     * Specifies the command column that this object customizes.
     */
    type?: 'adaptive' | 'buttons' | 'detailExpand' | 'groupExpand' | 'selection';
}

export type ColumnButton = dxDataGridColumnButton;
/**
 * @deprecated Use the DataGrid's ColumnButton type instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxDataGridColumnButton extends ColumnButtonBase {
    /**
     * The name used to identify a built-in button.
     */
    name?: 'cancel' | 'delete' | 'edit' | 'save' | 'undelete' | string;
    /**
     * A function that is executed when the button is clicked or tapped. Not executed if a template is used.
     */
    onClick?: ((e: ColumnButtonClickEvent) => void);
    /**
     * Specifies a custom button template.
     */
    template?: template | ((cellElement: DxElement, cellInfo: ColumnButtonTemplateData) => string | UserDefinedElement);
    /**
     * Specifies the button&apos;s visibility.
     */
    visible?: boolean | ((options: { component?: dxDataGrid, row?: RowObject, column?: Column }) => boolean);
}

/**
 * @deprecated 
 */
export type dxDataGridRowObject = RowObject;

/**
 * A grid row.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface RowObject {
    /**
     * The data object represented by the row.
     */
    readonly data: any;
    /**
     * The group index of the row. Available when the rowType is &apos;group&apos;.
     */
    readonly groupIndex?: number;
    /**
     * Indicates whether the row is in the editing state.
     */
    readonly isEditing?: boolean;
    /**
     * Indicates whether the row is expanded or collapsed. Available if rowType is &apos;data&apos;, &apos;detail&apos; or &apos;group&apos;.
     */
    readonly isExpanded?: boolean;
    /**
     * Indicates that the row is added, but not yet saved. Available if rowType is &apos;data&apos;.
     */
    readonly isNewRow?: boolean;
    /**
     * Indicates whether the row is selected. Available if rowType is &apos;data&apos;.
     */
    readonly isSelected?: boolean;
    /**
     * The key of the data object represented by the row.
     */
    readonly key: any;
    /**
     * The visible index of the row.
     */
    readonly rowIndex: number;
    /**
     * The row&apos;s type.
     */
    readonly rowType: string;
    /**
     * Values of the row as they exist in the data source.
     */
    readonly values: Array<any>;
}

export type Properties = dxDataGridOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type Options = dxDataGridOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type IOptions = dxDataGridOptions;

export default dxDataGrid;
