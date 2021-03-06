/**
* DevExtreme (ui/menu.d.ts)
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

import DataSource, {
    DataSourceOptions
} from '../data/data_source';

import Store from '../data/abstract_store';

import {
    Cancelable,
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
    ItemInfo
} from '../events/index';

import {
    CollectionWidgetItem,
    SelectionChangedInfo
} from './collection/ui.collection_widget.base';

import dxMenuBase, {
    dxMenuBaseOptions
} from './context_menu/ui.menu_base';

export type ContentReadyEvent = EventInfo<dxMenu>;

export type DisposingEvent = EventInfo<dxMenu>;

export type InitializedEvent = InitializedEventInfo<dxMenu>;

export type ItemClickEvent = NativeEventInfo<dxMenu> & ItemInfo;

export type ItemContextMenuEvent = NativeEventInfo<dxMenu> & ItemInfo;

export type ItemRenderedEvent = NativeEventInfo<dxMenu> & ItemInfo;

export type OptionChangedEvent = EventInfo<dxMenu> & ChangedOptionInfo;

export type SelectionChangedEvent = EventInfo<dxMenu> & SelectionChangedInfo;

export type SubmenuHiddenEvent = EventInfo<dxMenu> & {
    readonly rootItem?: DxElement;
}

export type SubmenuHidingEvent = Cancelable & EventInfo<dxMenu> & {
    readonly rootItem?: DxElement;
}

export type SubmenuShowingEvent = EventInfo<dxMenu> & {
    readonly rootItem?: DxElement;
}

export type SubmenuShownEvent = EventInfo<dxMenu> & {
    readonly rootItem?: DxElement;
}

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxMenuOptions extends dxMenuBaseOptions<dxMenu> {
    /**
     * Specifies whether adaptive UI component rendering is enabled on small screens. Applies only if the orientation is &apos;horizontal&apos;.
     */
    adaptivityEnabled?: boolean;
    /**
     * Binds the UI component to data.
     */
    dataSource?: string | Array<Item> | Store | DataSource | DataSourceOptions;
    /**
     * Specifies whether or not the submenu is hidden when the mouse pointer leaves it.
     */
    hideSubmenuOnMouseLeave?: boolean;
    /**
     * Holds an array of menu items.
     */
    items?: Array<Item>;
    /**
     * A function that is executed after a submenu is hidden.
     */
    onSubmenuHidden?: ((e: SubmenuHiddenEvent) => void);
    /**
     * A function that is executed before a submenu is hidden.
     */
    onSubmenuHiding?: ((e: SubmenuHidingEvent) => void);
    /**
     * A function that is executed before a submenu is displayed.
     */
    onSubmenuShowing?: ((e: SubmenuShowingEvent) => void);
    /**
     * A function that is executed after a submenu is displayed.
     */
    onSubmenuShown?: ((e: SubmenuShownEvent) => void);
    /**
     * Specifies whether the menu has horizontal or vertical orientation.
     */
    orientation?: 'horizontal' | 'vertical';
    /**
     * Specifies properties for showing and hiding the first level submenu.
     */
    showFirstSubmenuMode?: {
      /**
       * Specifies the delay in submenu showing and hiding.
       */
      delay?: {
        /**
         * The time span after which the submenu is hidden.
         */
        hide?: number,
        /**
         * The time span after which the submenu is shown.
         */
        show?: number
      } | number,
      /**
       * Specifies the mode name.
       */
      name?: 'onClick' | 'onHover'
    } | 'onClick' | 'onHover';
    /**
     * Specifies the direction at which the submenus are displayed.
     */
    submenuDirection?: 'auto' | 'leftOrTop' | 'rightOrBottom';
}
/**
 * The Menu UI component is a panel with clickable items. A click on an item opens a drop-down menu, which can contain several submenus.
 */
export default class dxMenu extends dxMenuBase {
    constructor(element: UserDefinedElement, options?: dxMenuOptions)
}

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxMenuBaseItem extends CollectionWidgetItem {
    /**
     * Specifies whether a group separator is displayed over the item.
     */
    beginGroup?: boolean;
    /**
     * Specifies if a menu is closed when a user clicks the item.
     */
    closeMenuOnClick?: boolean;
    /**
     * Specifies whether the menu item responds to user interaction.
     */
    disabled?: boolean;
    /**
     * Specifies the menu item&apos;s icon.
     */
    icon?: string;
    /**
     * Specifies nested menu items.
     */
    items?: Array<dxMenuBaseItem>;
    /**
     * Specifies whether or not a user can select a menu item.
     */
    selectable?: boolean;
    /**
     * Specifies whether or not the item is selected.
     */
    selected?: boolean;
    /**
     * Specifies the text inserted into the item element.
     */
    text?: string;
    /**
     * Specifies whether or not the menu item is visible.
     */
    visible?: boolean;
}

export type Item = dxMenuItem;

/**
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxMenuItem extends dxMenuBaseItem {
    /**
     * Specifies nested menu items.
     */
    items?: Array<dxMenuItem>;
}

export type Properties = dxMenuOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type Options = dxMenuOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type IOptions = dxMenuOptions;
