/**
* DevExtreme (ui/slide_out.d.ts)
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

export type ContentReadyEvent = EventInfo<dxSlideOut>;

export type DisposingEvent = EventInfo<dxSlideOut>;

export type InitializedEvent = InitializedEventInfo<dxSlideOut>;

export type ItemClickEvent = NativeEventInfo<dxSlideOut> & ItemInfo;

export type ItemContextMenuEvent = NativeEventInfo<dxSlideOut> & ItemInfo;

export type ItemHoldEvent = NativeEventInfo<dxSlideOut> & ItemInfo;

export type ItemRenderedEvent = NativeEventInfo<dxSlideOut> & ItemInfo;

export type MenuGroupRenderedEvent = EventInfo<dxSlideOut>;

export type MenuItemRenderedEvent = EventInfo<dxSlideOut>;

export type OptionChangedEvent = EventInfo<dxSlideOut> & ChangedOptionInfo;

export type SelectionChangedEvent = EventInfo<dxSlideOut> & SelectionChangedInfo;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxSlideOutOptions extends CollectionWidgetOptions<dxSlideOut> {
    /**
     * A Boolean value specifying whether or not the UI component changes its state when interacting with a user.
     */
    activeStateEnabled?: boolean;
    /**
     * Specifies a custom template for the UI component content. Rendered only once - when the UI component is created.
     */
    contentTemplate?: template | ((container: DxElement) => string | UserDefinedElement);
    /**
     * Binds the UI component to data.
     */
    dataSource?: string | Array<string | Item | any> | Store | DataSource | DataSourceOptions;
    /**
     * An array of items displayed by the UI component.
     */
    items?: Array<string | Item | any>;
    /**
     * Specifies a custom template for group captions.
     */
    menuGroupTemplate?: template | ((groupData: any, groupIndex: number, groupElement: any) => string | UserDefinedElement);
    /**
     * A Boolean value specifying whether or not to display a grouped menu.
     */
    menuGrouped?: boolean;
    /**
     * Specifies a custom template for menu items.
     */
    menuItemTemplate?: template | ((itemData: any, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement);
    /**
     * Specifies the current menu position.
     */
    menuPosition?: 'inverted' | 'normal';
    /**
     * Specifies whether or not the slide-out menu is displayed.
     */
    menuVisible?: boolean;
    /**
     * A function that is executed when a group menu item is rendered.
     */
    onMenuGroupRendered?: ((e: MenuGroupRenderedEvent) => void);
    /**
     * A function that is executed when a regular menu item is rendered.
     */
    onMenuItemRendered?: ((e: MenuItemRenderedEvent) => void);
    /**
     * The index number of the currently selected item.
     */
    selectedIndex?: number;
    /**
     * Indicates whether the menu can be shown/hidden by swiping the UI component&apos;s main panel.
     */
    swipeEnabled?: boolean;
}
/**
 * The SlideOut UI component is a classic slide-out menu paired with a view. An end user opens the menu by swiping away the view.
 * @deprecated 
 */
export default class dxSlideOut extends CollectionWidget {
    constructor(element: UserDefinedElement, options?: dxSlideOutOptions)
    /**
     * Hides the UI component&apos;s slide-out menu.
     */
    hideMenu(): DxPromise<void>;
    /**
     * Displays the UI component&apos;s slide-out menu.
     */
    showMenu(): DxPromise<void>;
    /**
     * Shows or hides the slide-out menu depending on the argument.
     */
    toggleMenuVisibility(showing?: boolean): DxPromise<void>;
}

export type Item = dxSlideOutItem;

/**
 * @deprecated Use Item instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxSlideOutItem extends CollectionWidgetItem {
    /**
     * Specifies a template that should be used to render a menu item.
     */
    menuTemplate?: template | (() => string | UserDefinedElement);
}

export type Properties = dxSlideOutOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type Options = dxSlideOutOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type IOptions = dxSlideOutOptions;
