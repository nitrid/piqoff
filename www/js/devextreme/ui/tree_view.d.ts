/**
* DevExtreme (ui/tree_view.d.ts)
* Version: 21.1.5
* Build date: Mon Aug 02 2021
*
* Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import {
    UserDefinedElement,
    DxElement
} from '../core/element';

import {
    DxPromise
} from '../core/utils/deferred';

import DataSource, {
    DataSourceOptions
} from '../data/data_source';

import Store from '../data/abstract_store';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo
} from '../events/index';

import {
    CollectionWidgetItem
} from './collection/ui.collection_widget.base';

import HierarchicalCollectionWidget, {
    HierarchicalCollectionWidgetOptions
} from './hierarchical_collection/ui.hierarchical_collection_widget';

import {
    SearchBoxMixinOptions
} from './widget/ui.search_box_mixin';

export type ContentReadyEvent = EventInfo<dxTreeView>;

export type DisposingEvent = EventInfo<dxTreeView>;

export type InitializedEvent = InitializedEventInfo<dxTreeView>;

export type ItemClickEvent = NativeEventInfo<dxTreeView> & {
    readonly itemData?: any;
    readonly itemElement?: DxElement;
    readonly itemIndex?: number | any;
    readonly node?: dxTreeViewNode;
}

export type ItemCollapsedEvent = NativeEventInfo<dxTreeView> & {
    readonly itemData?: any;
    readonly itemElement?: DxElement;
    readonly itemIndex?: number;
    readonly node?: dxTreeViewNode;
}

export type ItemContextMenuEvent = NativeEventInfo<dxTreeView> & {
    readonly itemData?: any;
    readonly itemElement?: DxElement;
    readonly itemIndex?: number | any;
    readonly node?: dxTreeViewNode;
}

export type ItemExpandedEvent = NativeEventInfo<dxTreeView> & {
    readonly itemData?: any;
    readonly itemElement?: DxElement;
    readonly itemIndex?: number;
    readonly node?: dxTreeViewNode;
}

export type ItemHoldEvent = NativeEventInfo<dxTreeView> & {
    readonly itemData?: any;
    readonly itemElement?: DxElement;
    readonly itemIndex?: number;
    readonly node?: dxTreeViewNode;
}

export type ItemRenderedEvent = NativeEventInfo<dxTreeView> & {
    readonly itemData?: any;
    readonly itemElement?: DxElement;
    readonly itemIndex?: number;
    readonly node?: dxTreeViewNode;
}

export type ItemSelectionChangedEvent = EventInfo<dxTreeView> & {
    readonly node?: dxTreeViewNode;
    readonly itemElement?: DxElement;
    readonly itemData?: any;
    readonly itemIndex?: number;
}

export type OptionChangedEvent = EventInfo<dxTreeView> & ChangedOptionInfo;

export type SelectAllValueChangedEvent = EventInfo<dxTreeView> & {
    readonly value?: boolean | undefined;
}

export type SelectionChangedEvent = EventInfo<dxTreeView>;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxTreeViewOptions extends HierarchicalCollectionWidgetOptions<dxTreeView>, SearchBoxMixinOptions<dxTreeView> {
    /**
     * Specifies whether or not to animate item collapsing and expanding.
     */
    animationEnabled?: boolean;
    /**
     * Allows you to load nodes on demand.
     */
    createChildren?: ((parentNode: dxTreeViewNode) => PromiseLike<any> | Array<any>);
    /**
     * Binds the UI component to data.
     */
    dataSource?: string | Array<Item> | Store | DataSource | DataSourceOptions;
    /**
     * Notifies the UI component of the used data structure.
     */
    dataStructure?: 'plain' | 'tree';
    /**
     * Specifies whether or not a user can expand all tree view items by the &apos;*&apos; hot key.
     */
    expandAllEnabled?: boolean;
    /**
     * Specifies the event on which to expand/collapse a node.
     */
    expandEvent?: 'dblclick' | 'click';
    /**
     * Specifies whether or not all parent nodes of an initially expanded node are displayed expanded.
     */
    expandNodesRecursive?: boolean;
    /**
     * Specifies which data source field specifies whether an item is expanded.
     */
    expandedExpr?: string | Function;
    /**
     * Specifies the name of the data source item field whose value defines whether or not the corresponding node includes child nodes.
     */
    hasItemsExpr?: string | Function;
    /**
     * An array of items displayed by the UI component.
     */
    items?: Array<Item>;
    /**
     * A function that is executed when a collection item is clicked or tapped.
     */
    onItemClick?: ((e: ItemClickEvent) => void);
    /**
     * A function that is executed when a tree view item is collapsed.
     */
    onItemCollapsed?: ((e: ItemCollapsedEvent) => void);
    /**
     * A function that is executed when a collection item is right-clicked or pressed.
     */
    onItemContextMenu?: ((e: ItemContextMenuEvent) => void);
    /**
     * A function that is executed when a tree view item is expanded.
     */
    onItemExpanded?: ((e: ItemExpandedEvent) => void);
    /**
     * A function that is executed when a collection item has been held for a specified period.
     */
    onItemHold?: ((e: ItemHoldEvent) => void);
    /**
     * A function that is executed after a collection item is rendered.
     */
    onItemRendered?: ((e: ItemRenderedEvent) => void);
    /**
     * A function that is executed when a single TreeView item is selected or selection is canceled.
     */
    onItemSelectionChanged?: ((e: ItemSelectionChangedEvent) => void);
    /**
     * A function that is executed when the &apos;Select All&apos; check box value is changed. Applies only if showCheckBoxesMode is &apos;selectAll&apos; and selectionMode is &apos;multiple&apos;.
     */
    onSelectAllValueChanged?: ((e: SelectAllValueChangedEvent) => void);
    /**
     * A function that is executed when a TreeView item is selected or selection is canceled.
     */
    onSelectionChanged?: ((e: SelectionChangedEvent) => void);
    /**
     * Specifies the name of the data source item field for holding the parent key of the corresponding node.
     */
    parentIdExpr?: string | Function;
    /**
     * Specifies the parent ID value of the root item.
     */
    rootValue?: any;
    /**
     * A string value specifying available scrolling directions.
     */
    scrollDirection?: 'both' | 'horizontal' | 'vertical';
    /**
     * Specifies the text displayed at the &apos;Select All&apos; check box.
     */
    selectAllText?: string;
    /**
     * Specifies whether an item becomes selected if a user clicks it.
     */
    selectByClick?: boolean;
    /**
     * Specifies whether all child nodes should be selected when their parent node is selected. Applies only if the selectionMode is &apos;multiple&apos;.
     */
    selectNodesRecursive?: boolean;
    /**
     * Specifies item selection mode. Applies only if selection is enabled.
     */
    selectionMode?: 'multiple' | 'single';
    /**
     * Specifies the checkbox display mode.
     */
    showCheckBoxesMode?: 'none' | 'normal' | 'selectAll';
    /**
     * Enables the virtual mode in which nodes are loaded on demand. Use it to enhance the performance on large datasets.
     */
    virtualModeEnabled?: boolean;
}
/**
 * The TreeView UI component is a tree-like representation of textual data.
 */
export default class dxTreeView extends HierarchicalCollectionWidget {
    constructor(element: UserDefinedElement, options?: dxTreeViewOptions)
    /**
     * Collapses all items.
     */
    collapseAll(): void;
    /**
     * Collapses an item with a specific key.
     */
    collapseItem(itemData: any): DxPromise<void>;
    /**
     * Collapses an item found using its DOM node.
     */
    collapseItem(itemElement: Element): DxPromise<void>;
    /**
     * Collapses an item with a specific key.
     */
    collapseItem(key: any): DxPromise<void>;
    /**
     * Expands all items. If you load items on demand, this method expands only the loaded items.
     */
    expandAll(): void;
    /**
     * Expands an item found using its data object.
     */
    expandItem(itemData: any): DxPromise<void>;
    /**
     * Expands an item found using its DOM node.
     */
    expandItem(itemElement: Element): DxPromise<void>;
    /**
     * Expands an item with a specific key.
     */
    expandItem(key: any): DxPromise<void>;
    /**
     * Gets all nodes.
     */
    getNodes(): Array<dxTreeViewNode>;
    /**
     * Gets selected nodes.
     */
    getSelectedNodes(): Array<dxTreeViewNode>;
    /**
     * Gets the keys of selected nodes.
     */
    getSelectedNodeKeys(): Array<any>;
    /**
     * Selects all nodes.
     */
    selectAll(): void;
    /**
     * Selects a node found using its data object.
     */
    selectItem(itemData: any): boolean;
    /**
     * Selects a TreeView node found using its DOM node.
     */
    selectItem(itemElement: Element): boolean;
    /**
     * Selects a node with a specific key.
     */
    selectItem(key: any): boolean;
    /**
     * Cancels the selection of all nodes.
     */
    unselectAll(): void;
    /**
     * Cancels the selection of a node found using its data object.
     */
    unselectItem(itemData: any): boolean;
    /**
     * Cancels the selection of a TreeView node found using its DOM node.
     */
    unselectItem(itemElement: Element): boolean;
    /**
     * Cancels the selection of a node with a specific key.
     */
    unselectItem(key: any): boolean;
    /**
     * Updates the tree view scrollbars according to the current size of the UI component content.
     */
    updateDimensions(): DxPromise<void>;
    /**
     * Scrolls the content to an item found using its data.
     */
    scrollToItem(itemData: any): DxPromise<void>;
    /**
     * Scrolls the content to an item found using its DOM node.
     */
    scrollToItem(itemElement: Element): DxPromise<void>;
    /**
     * Scrolls the content to an item found using its key.
     */
    scrollToItem(key: any): DxPromise<void>;
}

export type Item = dxTreeViewItem;

/**
 * @deprecated Use Item instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxTreeViewItem extends CollectionWidgetItem {
    /**
     * Specifies whether or not the tree view item is displayed expanded.
     */
    expanded?: boolean;
    /**
     * Specifies whether or not the tree view item has children.
     */
    hasItems?: boolean;
    /**
     * Specifies the tree view item&apos;s icon.
     */
    icon?: string;
    /**
     * Specifies nested tree view items.
     */
    items?: Array<dxTreeViewItem>;
    /**
     * Holds the unique key of an item.
     */
    id?: number | string;
    /**
     * Holds the key of the parent item.
     */
    parentId?: number | string;
    /**
     * Specifies whether the TreeView item should be displayed as selected.
     */
    selected?: boolean;
}

/**
 * A TreeView node.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxTreeViewNode {
    /**
     * Contains all the child nodes of the current node.
     */
    children?: Array<dxTreeViewNode>;
    /**
     * Equals to true if the node is disabled; otherwise false.
     */
    disabled?: boolean;
    /**
     * Equals true if the node is expanded; false if collapsed.
     */
    expanded?: boolean;
    /**
     * Contains the data source object corresponding to the node.
     */
    itemData?: any;
    /**
     * Contains the key value of the node.
     */
    key?: any;
    /**
     * Refers to the parent node of the current node.
     */
    parent?: dxTreeViewNode;
    /**
     * Equals to true if the node is selected; false if not.
     */
    selected?: boolean;
    /**
     * Contains the text displayed by the node.
     */
    text?: string;
}

export type Properties = dxTreeViewOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type Options = dxTreeViewOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type IOptions = dxTreeViewOptions;
