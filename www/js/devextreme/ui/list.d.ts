/**
* DevExtreme (ui/list.d.ts)
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
    template
} from '../core/templates/template';

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
    ChangedOptionInfo,
    ItemInfo
} from '../events/index';

import CollectionWidget, {
    CollectionWidgetItem,
    CollectionWidgetOptions,
    SelectionChangedInfo
} from './collection/ui.collection_widget.base';

import {
    dxSortableOptions
} from './sortable';

import {
    SearchBoxMixinOptions
} from './widget/ui.search_box_mixin';

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
interface ListItemInfo {
    readonly itemData?: any;
    readonly itemElement: DxElement;
    readonly itemIndex: number | { group: number; item: number; };
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface ScrollInfo {
    readonly scrollOffset?: any;
    readonly reachedLeft: boolean;
    readonly reachedRight: boolean;
    readonly reachedTop: boolean;
    readonly reachedBottom: boolean;
}

export type ContentReadyEvent = EventInfo<dxList>;

export type DisposingEvent = EventInfo<dxList>;

export type GroupRenderedEvent = EventInfo<dxList> & {
    readonly groupData?: any;
    readonly groupElement?: DxElement;
    readonly groupIndex?: number;
}

export type InitializedEvent = InitializedEventInfo<dxList>;

export type ItemClickEvent = NativeEventInfo<dxList> & ListItemInfo;

export type ItemContextMenuEvent = NativeEventInfo<dxList> & ListItemInfo;

export type ItemDeletedEvent = EventInfo<dxList> & ListItemInfo;

export type ItemDeletingEvent = EventInfo<dxList> & ListItemInfo & {
    cancel?: boolean | PromiseLike<void>;
}

export type ItemHoldEvent = NativeEventInfo<dxList> & ListItemInfo;

export type ItemRenderedEvent = NativeEventInfo<dxList> & ItemInfo;

export type ItemReorderedEvent = EventInfo<dxList> & ListItemInfo & {
    readonly fromIndex: number;
    readonly toIndex: number;
}

export type ItemSwipeEvent = NativeEventInfo<dxList> & ListItemInfo & {
    readonly direction: string;
}

export type OptionChangedEvent = EventInfo<dxList> & ChangedOptionInfo;

export type PageLoadingEvent = EventInfo<dxList>;

export type PullRefreshEvent = EventInfo<dxList>;

export type ScrollEvent = NativeEventInfo<dxList> & ScrollInfo;

export type SelectAllValueChangedEvent = EventInfo<dxList> & {
    readonly value: boolean;
}

export type SelectionChangedEvent = EventInfo<dxList> & SelectionChangedInfo;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxListOptions extends CollectionWidgetOptions<dxList>, SearchBoxMixinOptions<dxList> {
    /**
     * Specifies whether or not the UI component changes its state when interacting with a user.
     */
    activeStateEnabled?: boolean;
    /**
     * Specifies whether or not an end user can delete list items.
     */
    allowItemDeleting?: boolean;
    /**
     * A Boolean value specifying whether to enable or disable the bounce-back effect.
     */
    bounceEnabled?: boolean;
    /**
     * Specifies whether or not an end-user can collapse groups.
     */
    collapsibleGroups?: boolean;
    /**
     * Binds the UI component to data.
     */
    dataSource?: string | Array<string | Item | any> | Store | DataSource | DataSourceOptions;
    /**
     * Specifies the data field whose values should be displayed. Defaults to &apos;text&apos; when the data source contains objects.
     */
    displayExpr?: string | ((item: any) => string);
    /**
     * Specifies whether the UI component can be focused using keyboard navigation.
     */
    focusStateEnabled?: boolean;
    /**
     * Specifies a custom template for group captions.
     */
    groupTemplate?: template | ((groupData: any, groupIndex: number, groupElement: DxElement) => string | UserDefinedElement);
    /**
     * Specifies whether data items should be grouped.
     */
    grouped?: boolean;
    /**
     * Specifies whether the UI component changes its state when a user pauses on it.
     */
    hoverStateEnabled?: boolean;
    /**
     * Specifies whether or not to show the loading panel when the DataSource bound to the UI component is loading data.
     */
    indicateLoading?: boolean;
    /**
     * Specifies the way a user can delete items from the list.
     */
    itemDeleteMode?: 'context' | 'slideButton' | 'slideItem' | 'static' | 'swipe' | 'toggle';
    /**
     * Configures item reordering using drag and drop gestures.
     */
    itemDragging?: dxSortableOptions;
    /**
     * An array of items displayed by the UI component.
     */
    items?: Array<string | Item | any>;
    /**
     * Specifies the array of items for a context menu called for a list item.
     */
    menuItems?: Array<{
      /**
       * Holds on a function called when the item is clicked.
       */
      action?: ((itemElement: DxElement, itemData: any) => any),
      /**
       * Specifies the menu item text.
       */
      text?: string
    }>;
    /**
     * Specifies whether an item context menu is shown when a user holds or swipes an item.
     */
    menuMode?: 'context' | 'slide';
    /**
     * The text displayed on the button used to load the next page from the data source.
     */
    nextButtonText?: string;
    /**
     * A function that is executed when a group element is rendered.
     */
    onGroupRendered?: ((e: GroupRenderedEvent) => void);
    /**
     * A function that is executed when a collection item is clicked or tapped.
     */
    onItemClick?: ((e: ItemClickEvent) => void) | string;
    /**
     * A function that is executed when a collection item is right-clicked or pressed.
     */
    onItemContextMenu?: ((e: ItemContextMenuEvent) => void);
    /**
     * A function that is executed after a list item is deleted from the data source.
     */
    onItemDeleted?: ((e: ItemDeletedEvent) => void);
    /**
     * A function that is executed before a collection item is deleted from the data source.
     */
    onItemDeleting?: ((e: ItemDeletingEvent) => void);
    /**
     * A function that is executed when a collection item has been held for a specified period.
     */
    onItemHold?: ((e: ItemHoldEvent) => void);
    /**
     * A function that is executed after a list item is moved to another position.
     */
    onItemReordered?: ((e: ItemReorderedEvent) => void);
    /**
     * A function that is executed when a list item is swiped.
     */
    onItemSwipe?: ((e: ItemSwipeEvent) => void);
    /**
     * A function that is executed before the next page is loaded.
     */
    onPageLoading?: ((e: PageLoadingEvent) => void);
    /**
     * A function that is executed when the &apos;pull to refresh&apos; gesture is performed. Supported on mobile devices only.
     */
    onPullRefresh?: ((e: PullRefreshEvent) => void);
    /**
     * A function that is executed on each scroll gesture.
     */
    onScroll?: ((e: ScrollEvent) => void);
    /**
     * A function that is executed when the &apos;Select All&apos; check box value is changed. Applies only if the selectionMode is &apos;all&apos;.
     */
    onSelectAllValueChanged?: ((e: SelectAllValueChangedEvent) => void);
    /**
     * Specifies whether the next page is loaded when a user scrolls the UI component to the bottom or when the &apos;next&apos; button is clicked.
     */
    pageLoadMode?: 'nextButton' | 'scrollBottom';
    /**
     * Specifies the text shown in the pullDown panel, which is displayed when the list is scrolled to the bottom.
     */
    pageLoadingText?: string;
    /**
     * A Boolean value specifying whether or not the UI component supports the &apos;pull down to refresh&apos; gesture.
     */
    pullRefreshEnabled?: boolean;
    /**
     * Specifies the text displayed in the pullDown panel when the list is pulled below the refresh threshold.
     */
    pulledDownText?: string;
    /**
     * Specifies the text shown in the pullDown panel while the list is being pulled down to the refresh threshold.
     */
    pullingDownText?: string;
    /**
     * Specifies the text displayed in the pullDown panel while the list is being refreshed.
     */
    refreshingText?: string;
    /**
     * Specifies whether to repaint only those elements whose data changed.
     */
    repaintChangesOnly?: boolean;
    /**
     * A Boolean value specifying if the list is scrolled by content.
     */
    scrollByContent?: boolean;
    /**
     * Specifies whether a user can scroll the content with the scrollbar. Applies only if useNativeScrolling is false.
     */
    scrollByThumb?: boolean;
    /**
     * A Boolean value specifying whether to enable or disable list scrolling.
     */
    scrollingEnabled?: boolean;
    /**
     * Specifies the mode in which all items are selected.
     */
    selectAllMode?: 'allPages' | 'page';
    /**
     * Specifies item selection mode.
     */
    selectionMode?: 'all' | 'multiple' | 'none' | 'single';
    /**
     * Specifies when the UI component shows the scrollbar.
     */
    showScrollbar?: 'always' | 'never' | 'onHover' | 'onScroll';
    /**
     * Specifies whether or not to display controls used to select list items.
     */
    showSelectionControls?: boolean;
    /**
     * Specifies whether or not the UI component uses native scrolling.
     */
    useNativeScrolling?: boolean;
}
/**
 * The List is a UI component that represents a collection of items in a scrollable list.
 */
export default class dxList extends CollectionWidget {
    constructor(element: UserDefinedElement, options?: dxListOptions)
    /**
     * Gets the UI component&apos;s height in pixels.
     */
    clientHeight(): number;
    /**
     * Collapses a group with a specific index.
     */
    collapseGroup(groupIndex: number): DxPromise<void>;
    /**
     * Removes an item found using its DOM node.
     */
    deleteItem(itemElement: Element): DxPromise<void>;
    /**
     * Removes an item with a specific index.
     */
    deleteItem(itemIndex: number | any): DxPromise<void>;
    /**
     * Expands a group with a specific index.
     */
    expandGroup(groupIndex: number): DxPromise<void>;
    /**
     * Checks whether an item found using its DOM node is selected.
     */
    isItemSelected(itemElement: Element): boolean;
    /**
     * Checks whether an item with a specific index is selected.
     */
    isItemSelected(itemIndex: number | any): boolean;
    /**
     * Reloads list data.
     */
    reload(): void;
    /**
     * Reorders items found using their DOM nodes.
     */
    reorderItem(itemElement: Element, toItemElement: Element): DxPromise<void>;
    /**
     * Reorders items with specific indexes.
     */
    reorderItem(itemIndex: number | any, toItemIndex: number | any): DxPromise<void>;
    /**
     * Scrolls the content by a specified distance.
     */
    scrollBy(distance: number): void;
    /**
     * Gets the content&apos;s height in pixels.
     */
    scrollHeight(): number;
    /**
     * Scrolls the content to a specific position.
     */
    scrollTo(location: number): void;
    /**
     * Scrolls the content to an item found using its DOM node.
     */
    scrollToItem(itemElement: Element): void;
    /**
     * Scrolls the content to an item with a specific index.
     */
    scrollToItem(itemIndex: number | any): void;
    /**
     * Gets the top scroll offset.
     */
    scrollTop(): number;
    /**
     * Selects all items.
     */
    selectAll(): void;
    /**
     * Selects an item found using its DOM node.
     */
    selectItem(itemElement: Element): void;
    /**
     * Selects an item with a specific index.
     */
    selectItem(itemIndex: number | any): void;
    /**
     * Cancels the selection of all items.
     */
    unselectAll(): void;
    /**
     * Cancels the selection of an item found using its DOM node.
     */
    unselectItem(itemElement: Element): void;
    /**
     * Cancels the selection of an item with a specific index.
     */
    unselectItem(itemIndex: number | any): void;
    /**
     * Updates the UI component scrollbar according to UI component content size.
     */
    updateDimensions(): DxPromise<void>;
}

export type Item = dxListItem;

/**
 * @deprecated Use Item instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxListItem extends CollectionWidgetItem {
    /**
     * Specifies the text of a badge displayed for the list item.
     */
    badge?: string;
    /**
     * Specifies the list item&apos;s icon.
     */
    icon?: string;
    /**
     * Specifies the name of the list items group in a grouped list.
     */
    key?: string;
    /**
     * Specifies whether or not to display a chevron for the list item.
     */
    showChevron?: boolean;
}

export type Properties = dxListOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type Options = dxListOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type IOptions = dxListOptions;
