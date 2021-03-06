/**
* DevExtreme (ui/tabs.d.ts)
* Version: 21.1.5
* Build date: Mon Aug 02 2021
*
* Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import {
    UserDefinedElement
} from '../core/element';

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

export type ContentReadyEvent = EventInfo<dxTabs>;

export type DisposingEvent = EventInfo<dxTabs>;

export type InitializedEvent = InitializedEventInfo<dxTabs>;

export type ItemClickEvent = NativeEventInfo<dxTabs> & ItemInfo;

export type ItemContextMenuEvent = NativeEventInfo<dxTabs> & ItemInfo;

export type ItemHoldEvent = NativeEventInfo<dxTabs> & ItemInfo;

export type ItemRenderedEvent = NativeEventInfo<dxTabs> & ItemInfo;

export type OptionChangedEvent = EventInfo<dxTabs> & ChangedOptionInfo;

export type SelectionChangedEvent = EventInfo<dxTabs> & SelectionChangedInfo;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxTabsOptions<T = dxTabs> extends CollectionWidgetOptions<T> {
    /**
     * Binds the UI component to data.
     */
    dataSource?: string | Array<string | Item | any> | Store | DataSource | DataSourceOptions;
    /**
     * Specifies whether the UI component can be focused using keyboard navigation.
     */
    focusStateEnabled?: boolean;
    /**
     * Specifies whether the UI component changes its state when a user pauses on it.
     */
    hoverStateEnabled?: boolean;
    /**
     * An array of items displayed by the UI component.
     */
    items?: Array<string | Item | any>;
    /**
     * Specifies whether to repaint only those elements whose data changed.
     */
    repaintChangesOnly?: boolean;
    /**
     * Specifies whether or not an end-user can scroll tabs by swiping.
     */
    scrollByContent?: boolean;
    /**
     * Specifies whether or not an end-user can scroll tabs.
     */
    scrollingEnabled?: boolean;
    /**
     * An array of currently selected item objects.
     */
    selectedItems?: Array<string | number | any>;
    /**
     * Specifies whether the UI component enables an end-user to select only a single item or multiple items.
     */
    selectionMode?: 'multiple' | 'single';
    /**
     * Specifies whether navigation buttons should be available when tabs exceed the UI component&apos;s width.
     */
    showNavButtons?: boolean;
}
/**
 * The Tabs is a tab strip used to switch between pages or views. This UI component is included in the TabPanel UI component, but you can use the Tabs separately as well.
 */
export default class dxTabs extends CollectionWidget {
    constructor(element: UserDefinedElement, options?: dxTabsOptions)
}

export type Item = dxTabsItem;

/**
 * @deprecated Use Item instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxTabsItem extends CollectionWidgetItem {
    /**
     * Specifies a badge text for the tab.
     */
    badge?: string;
    /**
     * Specifies the icon to be displayed on the tab.
     */
    icon?: string;
}

export type Properties = dxTabsOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type Options = dxTabsOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type IOptions = dxTabsOptions;
