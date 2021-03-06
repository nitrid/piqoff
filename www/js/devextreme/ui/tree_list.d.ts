/**
* DevExtreme (ui/tree_list.d.ts)
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
    template
} from '../core/templates/template';

import {
    DxPromise
} from '../core/utils/deferred';

import DataSource from '../data/data_source';

import {
    Cancelable,
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo
} from '../events/index';

import {
    GridBase,
    ColumnBase,
    ColumnButtonBase,
    EditingBase,
    EditingTextsBase,
    GridBaseOptions,
    PagingBase,
    ScrollingBase,
    SelectionBase,
    AdaptiveDetailRowPreparingInfo,
    DataErrorOccurredInfo,
    DataChangeInfo,
    DragStartEventInfo,
    RowDraggingEventInfo,
    DragDropInfo,
    DragReorderInfo,
    KeyDownInfo,
    NewRowInfo,
    RowInsertedInfo,
    RowInsertingInfo,
    RowKeyInfo,
    RowRemovedInfo,
    RowRemovingInfo,
    RowUpdatedInfo,
    RowUpdatingInfo,
    RowValidatingInfo,
    SavingInfo,
    SelectionChangedInfo,
    ToolbarPreparingInfo,
    RowDraggingTemplateDataModel
} from './data_grid';

import dxScrollable from './scroll_view/ui.scrollable';

import Widget from './widget/ui.widget';

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
interface CellInfo {
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

export type AdaptiveDetailRowPreparingEvent = EventInfo<dxTreeList> & AdaptiveDetailRowPreparingInfo;

export type CellClickEvent = NativeEventInfo<dxTreeList> & CellInfo;

export type CellDblClickEvent = NativeEventInfo<dxTreeList> & CellInfo;

export type CellHoverChangedEvent = EventInfo<dxTreeList> & CellInfo & {
    readonly eventType: string;
}

export type CellPreparedEvent = EventInfo<dxTreeList> & CellInfo & {
    readonly isSelected?: boolean;
    readonly isExpanded?: boolean;
    readonly isNewRow?: boolean;
    readonly watch?: Function;
    readonly oldValue?: any;
}

export type ContentReadyEvent = EventInfo<dxTreeList>;

export type ContextMenuPreparingEvent = EventInfo<dxTreeList> & {
    items?: Array<any>;
    readonly target: string;
    readonly targetElement: DxElement;
    readonly columnIndex: number;
    readonly column?: Column;
    readonly rowIndex: number;
    readonly row?: RowObject;
}

export type DataErrorOccurredEvent = EventInfo<dxTreeList> & DataErrorOccurredInfo;

export type DisposingEvent = EventInfo<dxTreeList>;

export type EditCanceledEvent = EventInfo<dxTreeList> & DataChangeInfo;

export type EditCancelingEvent = Cancelable & EventInfo<dxTreeList> & DataChangeInfo;

export type EditingStartEvent = Cancelable & EventInfo<dxTreeList> & {
    readonly data: any;
    readonly key: any;
    readonly column: any;
}

export type EditorPreparedEvent = EventInfo<dxTreeList> & {
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

export type EditorPreparingEvent = Cancelable & EventInfo<dxTreeList> & {
    readonly parentType: string;
    readonly value?: any;
    readonly setValue?: any;
    updateValueTimeout?: number;
    readonly width?: number;
    readonly disabled: boolean;
    readonly rtlEnabled: boolean;
    readonly editorElement: DxElement;
    readonly readOnly: boolean;
    editorName: string;
    editorOptions: any;
    readonly dataField?: string;
    readonly row?: RowObject;
}

export type FocusedCellChangedEvent = EventInfo<dxTreeList> & {
    readonly cellElement: DxElement;
    readonly columnIndex: number;
    readonly rowIndex: number;
    readonly row: RowObject;
    readonly column: Column;
}

export type FocusedCellChangingEvent = Cancelable & NativeEventInfo<dxTreeList> & {
    readonly cellElement: DxElement;
    readonly prevColumnIndex: number;
    readonly prevRowIndex: number;
    newColumnIndex: number;
    newRowIndex: number;
    readonly rows: Array<RowObject>;
    readonly columns: Array<Column>;
    isHighlighted: boolean;
}

export type FocusedRowChangedEvent = EventInfo<dxTreeList> & {
    readonly rowElement: DxElement;
    readonly rowIndex: number;
    readonly row: RowObject;
}

export type FocusedRowChangingEvent = NativeEventInfo<dxTreeList> & {
    readonly rowElement: DxElement;
    readonly prevRowIndex: number;
    newRowIndex: number;
    readonly rows: Array<RowObject>;
}

export type InitializedEvent = InitializedEventInfo<dxTreeList>;

export type InitNewRowEvent = EventInfo<dxTreeList> & NewRowInfo;

export type KeyDownEvent = NativeEventInfo<dxTreeList> & KeyDownInfo;

export type NodesInitializedEvent = EventInfo<dxTreeList> & {
    readonly root: Node;
}

export type OptionChangedEvent = EventInfo<dxTreeList> & ChangedOptionInfo;

export type RowClickEvent = NativeEventInfo<dxTreeList> & {
    readonly data: any;
    readonly key: any;
    readonly values: Array<any>;
    readonly columns: Array<any>;
    readonly rowIndex: number;
    readonly rowType: string;
    readonly isSelected?: boolean;
    readonly isExpanded?: boolean;
    readonly isNewRow?: boolean;
    readonly rowElement: DxElement;
    readonly handled: boolean;
    readonly node: Node;
    readonly level: number;
}

export type RowCollapsedEvent = EventInfo<dxTreeList> & RowKeyInfo;

export type RowCollapsingEvent = Cancelable & EventInfo<dxTreeList> & RowKeyInfo;

export type RowDblClickEvent = NativeEventInfo<dxTreeList> & {
    readonly data: any;
    readonly key: any;
    readonly values: Array<any>;
    readonly columns: Array<Column>;
    readonly rowIndex: number;
    readonly rowType: string;
    readonly isSelected?: boolean;
    readonly isExpanded?: boolean;
    readonly isNewRow?: boolean;
    readonly rowElement: DxElement;
}

export type RowExpandedEvent = EventInfo<dxTreeList> & RowKeyInfo;

export type RowExpandingEvent = Cancelable & EventInfo<dxTreeList> & RowKeyInfo;

export type RowInsertedEvent = EventInfo<dxTreeList> & RowInsertedInfo;

export type RowInsertingEvent = EventInfo<dxTreeList> & RowInsertingInfo;

export type RowPreparedEvent = EventInfo<dxTreeList> & {
    readonly data: any;
    readonly key: any;
    readonly values: Array<any>;
    readonly columns: Array<Column>;
    readonly rowIndex: number;
    readonly rowType: string;
    readonly isSelected?: boolean;
    readonly isExpanded?: boolean;
    readonly isNewRow?: boolean;
    readonly rowElement: DxElement;
    readonly node: Node;
    readonly level: number;
}

export type RowRemovedEvent = EventInfo<dxTreeList> & RowRemovedInfo;

export type RowRemovingEvent = EventInfo<dxTreeList> & RowRemovingInfo;

export type RowUpdatedEvent = EventInfo<dxTreeList> & RowUpdatedInfo;

export type RowUpdatingEvent = EventInfo<dxTreeList> & RowUpdatingInfo;

export type RowValidatingEvent = EventInfo<dxTreeList> & RowValidatingInfo;

export type SavedEvent = EventInfo<dxTreeList> & DataChangeInfo;

export type SavingEvent = EventInfo<dxTreeList> & SavingInfo;

export type SelectionChangedEvent = EventInfo<dxTreeList> & SelectionChangedInfo;

export type ToolbarPreparingEvent = EventInfo<dxTreeList> & ToolbarPreparingInfo;


export type RowDraggingAddEvent = RowDraggingEventInfo<dxTreeList> & DragDropInfo;

export type RowDraggingChangeEvent = Cancelable & RowDraggingEventInfo<dxTreeList> & DragDropInfo;

export type RowDraggingEndEvent = Cancelable & RowDraggingEventInfo<dxTreeList> & DragDropInfo;

export type RowDraggingMoveEvent = Cancelable & RowDraggingEventInfo<dxTreeList> & DragDropInfo;

export type RowDraggingStartEvent = Cancelable & DragStartEventInfo<dxTreeList>;

export type RowDraggingRemoveEvent = RowDraggingEventInfo<dxTreeList>;

export type RowDraggingReorderEvent = RowDraggingEventInfo<dxTreeList> & DragReorderInfo;


export type ColumnButtonClickEvent = NativeEventInfo<dxTreeList> & {
    row?: RowObject;
    column?: Column;
}


export type ColumnButtonTemplateData = {
    readonly component: dxTreeList;
    readonly data: any;
    readonly key: any;
    readonly columnIndex: number;
    readonly column: Column;
    readonly rowIndex: number;
    readonly rowType: string;
    readonly row: RowObject;
}

export type ColumnCellTemplateData = {
    readonly data: any;
    readonly component: dxTreeList;
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
    readonly data: any;
    readonly component: dxTreeList;
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

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type ColumnHeaderCellTemplateData = {
    readonly component: dxTreeList;
    readonly columnIndex: number;
    readonly column: Column;
}

export type RowDraggingTemplateData = RowDraggingTemplateDataModel;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxTreeListOptions extends GridBaseOptions<dxTreeList> {
    /**
     * Specifies whether all rows are expanded initially.
     */
    autoExpandAll?: boolean;
    /**
     * Configures columns.
     */
    columns?: Array<Column | string>;
    /**
     * Customizes columns after they are created.
     */
    customizeColumns?: ((columns: Array<Column>) => void);
    /**
     * Notifies the UI component of the used data structure.
     */
    dataStructure?: 'plain' | 'tree';
    /**
     * Configures editing.
     */
    editing?: Editing;
    /**
     * Specifies whether nodes appear expanded or collapsed after filtering is applied.
     */
    expandNodesOnFiltering?: boolean;
    /**
     * Specifies keys of the initially expanded rows.
     */
    expandedRowKeys?: Array<any>;
    /**
     * Specifies whether filter and search results should include matching rows only, matching rows with ancestors, or matching rows with ancestors and descendants (full branch).
     */
    filterMode?: 'fullBranch' | 'withAncestors' | 'matchOnly';
    /**
     * Specifies which data field defines whether the node has children.
     */
    hasItemsExpr?: string | Function;
    /**
     * Specifies which data field contains nested items. Set this property when your data has a hierarchical structure.
     */
    itemsExpr?: string | Function;
    /**
     * Specifies the key property (or properties) that provide(s) key values to access data items. Each key value must be unique.
     */
    keyExpr?: string | Function;
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
     * A function that is executed after the focused cell changes. Applies only to cells in data rows.
     */
    onFocusedCellChanged?: ((e: FocusedCellChangedEvent) => void);
    /**
     * A function that is executed before the focused cell changes. Applies only to cells in data rows.
     */
    onFocusedCellChanging?: ((e: FocusedCellChangingEvent) => void);
    /**
     * A function that executed when the focused row changes. Applies only to data rows. focusedRowEnabled should be true.
     */
    onFocusedRowChanged?: ((e: FocusedRowChangedEvent) => void);
    /**
     * A function that is executed before the focused row changes. Applies only to data rows. focusedRowEnabled should be true.
     */
    onFocusedRowChanging?: ((e: FocusedRowChangingEvent) => void);
    /**
     * A function that is executed after the loaded nodes are initialized.
     */
    onNodesInitialized?: ((e: NodesInitializedEvent) => void);
    /**
     * A function that is executed when a grid row is clicked or tapped.
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
     * Configures paging.
     */
    paging?: Paging;
    /**
     * Specifies which data field provides parent keys.
     */
    parentIdExpr?: string | Function;
    /**
     * Notifies the TreeList of the server&apos;s data processing operations. Applies only if data has a plain structure.
     */
    remoteOperations?: {
      /**
       * Specifies whether filtering should be performed on the server.
       */
      filtering?: boolean,
      /**
       * Specifies whether grouping should be performed on the server.
       */
      grouping?: boolean,
      /**
       * Specifies whether sorting should be performed on the server.
       */
      sorting?: boolean
    } | 'auto';
    /**
     * Specifies the root node&apos;s identifier. Applies if dataStructure is &apos;plain&apos;.
     */
    rootValue?: any;
    /**
     * Configures scrolling.
     */
    scrolling?: Scrolling;
    /**
     * Configures runtime selection.
     */
    selection?: Selection;
}

/**
 * @deprecated 
 */
export type dxTreeListEditing = Editing;

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface Editing extends EditingBase {
    /**
     * Specifies whether a user can add new rows. It is called for each data row when defined as a function.
     */
    allowAdding?: boolean | ((options: { readonly component: dxTreeList, readonly row?: RowObject }) => boolean);
    /**
     * Specifies whether a user can delete rows. It is called for each data row when defined as a function.
     */
    allowDeleting?: boolean | ((options: { readonly component: dxTreeList, readonly row?: RowObject }) => boolean);
    /**
     * Specifies whether a user can update rows. It is called for each data row when defined as a function
     */
    allowUpdating?: boolean | ((options: { readonly component: dxTreeList, readonly row?: RowObject }) => boolean);
    /**
     * Contains properties that specify texts for editing-related UI elements.
     */
    texts?: EditingTexts;
}

/**
 * @deprecated 
 */
export type dxTreeListEditingTexts = EditingTexts;

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface EditingTexts extends EditingTextsBase {
    /**
     * Specifies text for the button that adds a new nested row. Applies if the editing.mode is &apos;batch&apos; or &apos;cell&apos;.
     */
    addRowToNode?: string;
}

/**
 * @deprecated 
 */
export type dxTreeListPaging = Paging;

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface Paging extends PagingBase {
    /**
     * Enables paging.
     */
    enabled?: boolean;
}

/**
 * @deprecated 
 */
export type dxTreeListScrolling = Scrolling;

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface Scrolling extends ScrollingBase {
    /**
     * Specifies the scrolling mode.
     */
    mode?: 'standard' | 'virtual';
}

/**
 * @deprecated 
 */
export type dxTreeListSelection = Selection;

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface Selection extends SelectionBase {
    /**
     * Specifies whether selection is recursive.
     */
    recursive?: boolean;
}
/**
 * The TreeList is a UI component that represents data from a local or remote source in the form of a multi-column tree view. This UI component offers such features as sorting, filtering, editing, selection, etc.
 */
export default class dxTreeList extends Widget implements GridBase {
    constructor(element: UserDefinedElement, options?: dxTreeListOptions)
    /**
     * Adds a new column.
     */
    addColumn(columnOptions: any | string): void;
    /**
     * Adds an empty data row to the highest hierarchical level and switches it to the editing state.
     */
    addRow(): DxPromise<void>;
    /**
     * Adds an empty data row to a specified parent row.
     */
    addRow(parentId: any): DxPromise<void>;
    /**
     * Collapses a row with a specific key.
     */
    collapseRow(key: any): DxPromise<void>;
    /**
     * Expands a row with a specific key.
     */
    expandRow(key: any): DxPromise<void>;
    /**
     * Performs a pre-order tree traversal, executing a function on each visited node. Starts traversing from the top level nodes.
     */
    forEachNode(callback: Function): void;
    /**
     * Performs a pre-order tree traversal, executing a function on each visited node. Starts traversing from the specified nodes.
     */
    forEachNode(nodes: Array<Node>, callback: Function): void;
    /**
     * Gets a node with a specific key.
     */
    getNodeByKey(key: any | string | number): Node;
    /**
     * Gets the root node.
     */
    getRootNode(): Node;
    /**
     * Gets the keys of the rows selected explicitly via the API or via a click or tap.
     */
    getSelectedRowKeys(): Array<any>;
    /**
     * Gets the selected rows&apos; keys.
     */
    getSelectedRowKeys(mode: string): Array<any>;
    /**
     * Gets the data objects of the rows selected explicitly via the API or via a click or tap.
     */
    getSelectedRowsData(): Array<any>;
    /**
     * Gets the selected rows&apos; data objects.
     */
    getSelectedRowsData(mode: string): Array<any>;
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
     * Checks whether a row is expanded or collapsed.
     */
    isRowExpanded(key: any): boolean;
    /**
     * Loads all root node descendants (all data items). Takes effect only if data has the plain structure and remoteOperations.filtering is true.
     */
    loadDescendants(): DxPromise<void>;
    /**
     * Loads a specific node&apos;s descendants. Takes effect only if data has the plain structure and remoteOperations.filtering is true.
     */
    loadDescendants(keys: Array<any>): DxPromise<void>;
    /**
     * Loads all or only direct descendants of specific nodes. Takes effect only if data has the plain structure and remoteOperations.filtering is true.
     */
    loadDescendants(keys: Array<any>, childrenOnly: boolean): DxPromise<void>;

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

export type Column = dxTreeListColumn;

/**
 * @deprecated Use the Column type instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxTreeListColumn extends ColumnBase {
    /**
     * Allows you to customize buttons in the edit column or create a custom command column. Applies only if the column&apos;s type is &apos;buttons&apos;.
     */
    buttons?: Array<'add' | 'cancel' | 'delete' | 'edit' | 'save' | 'undelete' | ColumnButton>;
    /**
     * Specifies a custom template for data cells.
     */
    cellTemplate?: template | ((cellElement: DxElement, cellInfo: ColumnCellTemplateData) => any);
    /**
     * Configures columns.
     */
    columns?: Array<Column | string>;
    /**
     * Specifies a custom template for data cells in editing state.
     */
    editCellTemplate?: template | ((cellElement: DxElement, cellInfo: ColumnEditCellTemplateData) => any);
    /**
     * Specifies a custom template for column headers.
     */
    headerCellTemplate?: template | ((columnHeader: DxElement, headerInfo: ColumnHeaderCellTemplateData) => any);
    /**
     * Specifies the command column that this object customizes.
     */
    type?: 'adaptive' | 'buttons';
}

export type ColumnButton = dxTreeListColumnButton;


/**
 * @deprecated Use the TreeList's ColumnButton type instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxTreeListColumnButton extends ColumnButtonBase {
    /**
     * The name used to identify a built-in button.
     */
    name?: 'add' | 'cancel' | 'delete' | 'edit' | 'save' | 'undelete' | string;
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
    visible?: boolean | ((options: { readonly component: dxTreeList, row?: RowObject, readonly column: Column }) => boolean);
}

/**
 * @deprecated 
 */
export type dxTreeListNode = Node;

/**
 * A TreeList node&apos;s structure.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface Node {
    /**
     * Contains all child nodes.
     */
    children?: Array<Node>;
    /**
     * The node&apos;s data object.
     */
    data?: any;
    /**
     * Indicates whether the node has child nodes.
     */
    hasChildren?: boolean;
    /**
     * The node&apos;s key.
     */
    key: any;
    /**
     * The node&apos;s hierarchical level.
     */
    level: number;
    /**
     * The parent node.
     */
    parent?: Node;
    /**
     * Indicates whether the node is visualized as a row.
     */
    visible?: boolean;
}

/**
 * @deprecated Use RowObject instead
 */
export type dxTreeListRowObject = RowObject;

/**
 * A grid row.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface RowObject {
    /**
     * Indicates whether the row is in the editing state.
     */
    readonly isEditing?: boolean;
    /**
     * Indicates whether the row is expanded or collapsed. Available if rowType is &apos;data&apos; or &apos;detail&apos;.
     */
    readonly isExpanded?: boolean;
    /**
     * Indicates that the row is added, but not yet saved. Available if rowType is &apos;data&apos;.
     */
    readonly isNewRow?: boolean;
    /**
     * Indicates whether the row is selected. Available if rowType is &apos;data&apos; or &apos;detail&apos;.
     */
    readonly isSelected?: boolean;
    /**
     * The row&apos;s key. Available if rowType is &apos;data&apos;, &apos;detail&apos; or &apos;detailAdaptive&apos;.
     */
    readonly key: any;
    /**
     * The row&apos;s hierarchical level. Available if rowType is &apos;data&apos; or &apos;detail&apos;.
     */
    readonly level: number;
    /**
     * The row&apos;s node. Available if rowType is &apos;data&apos; or &apos;detail&apos;.
     */
    readonly node: Node;
    /**
     * The row&apos;s visible index. This index is zero-based and available if rowType is &apos;data&apos;, &apos;detail&apos; or &apos;detailAdaptive&apos;.
     */
    readonly rowIndex: number;
    /**
     * The row&apos;s type.
     */
    readonly rowType: string;
    /**
     * Values displayed in the row&apos;s cells.
     */
    readonly values: Array<any>;
}

export type Properties = dxTreeListOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type Options = dxTreeListOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type IOptions = dxTreeListOptions;
