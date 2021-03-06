/**
* DevExtreme (ui/toolbar.d.ts)
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
    CollectionWidgetOptions
} from './collection/ui.collection_widget.base';

export type ContentReadyEvent = EventInfo<dxToolbar>;

export type DisposingEvent = EventInfo<dxToolbar>;

export type InitializedEvent = InitializedEventInfo<dxToolbar>;

export type ItemClickEvent = NativeEventInfo<dxToolbar> & ItemInfo;

export type ItemContextMenuEvent = NativeEventInfo<dxToolbar> & ItemInfo;

export type ItemHoldEvent = NativeEventInfo<dxToolbar> & ItemInfo;

export type ItemRenderedEvent = NativeEventInfo<dxToolbar> & ItemInfo;

export type OptionChangedEvent = EventInfo<dxToolbar> & ChangedOptionInfo;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxToolbarOptions extends CollectionWidgetOptions<dxToolbar> {
    /**
     * Binds the UI component to data.
     */
    dataSource?: string | Array<string | Item | any> | Store | DataSource | DataSourceOptions;
    /**
     * An array of items displayed by the UI component.
     */
    items?: Array<string | Item | any>;
    /**
     * Specifies a custom template for menu items.
     */
    menuItemTemplate?: template | ((itemData: any, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement);
    /**
     * Specifies the UI component&apos;s height in pixels.
     * @deprecated 
     */
    height?: number | string | (() => number | string);
}
/**
 * The Toolbar is a UI component containing items that usually manage screen content. Those items can be plain text or UI components.
 */
export default class dxToolbar extends CollectionWidget {
    constructor(element: UserDefinedElement, options?: dxToolbarOptions)
}

export type Item = dxToolbarItem;

/**
 * @deprecated Use Item instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxToolbarItem extends CollectionWidgetItem {
    /**
     * Specifies a CSS class to be applied to the item.
     */
    cssClass?: string;
    /**
     * Specifies when to display an item in the toolbar&apos;s overflow menu.
     */
    locateInMenu?: 'always' | 'auto' | 'never';
    /**
     * Specifies a location for the item on the toolbar.
     */
    location?: 'after' | 'before' | 'center';
    /**
     * Specifies a template that should be used to render a menu item.
     */
    menuItemTemplate?: template | (() => string | UserDefinedElement);
    /**
     * Configures the DevExtreme UI component used as a toolbar item.
     */
    options?: any;
    /**
     * Specifies when to display the text for the UI component item.
     */
    showText?: 'always' | 'inMenu';
    /**
     * A UI component that presents a toolbar item. To configure it, use the options object.
     */
    widget?: 'dxAutocomplete' | 'dxButton' | 'dxCheckBox' | 'dxDateBox' | 'dxMenu' | 'dxSelectBox' | 'dxTabs' | 'dxTextBox' | 'dxButtonGroup' | 'dxDropDownButton';
}

export type Properties = dxToolbarOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type Options = dxToolbarOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type IOptions = dxToolbarOptions;
