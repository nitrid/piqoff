/**
* DevExtreme (ui/context_menu/ui.menu_base.d.ts)
* Version: 21.1.5
* Build date: Mon Aug 02 2021
*
* Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import {
    animationConfig
} from '../../animation/fx';

import {
    UserDefinedElement
} from '../../core/element';

import DataSource, {
    DataSourceOptions
} from '../../data/data_source';

import Store from '../../data/abstract_store';

import HierarchicalCollectionWidget, {
    HierarchicalCollectionWidgetOptions
} from '../hierarchical_collection/ui.hierarchical_collection_widget';

import {
    dxMenuBaseItem
} from '../menu';

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxMenuBaseOptions<T = dxMenuBase> extends HierarchicalCollectionWidgetOptions<T> {
    /**
     * A Boolean value specifying whether or not the UI component changes its state when interacting with a user.
     */
    activeStateEnabled?: boolean;
    /**
     * Configures UI component visibility animations. This object contains two fields: show and hide.
     */
    animation?: {
      /**
       * An object that defines the animation properties used when the UI component is being hidden.
       */
      hide?: animationConfig,
      /**
       * An object that defines the animation properties used when the UI component is being shown.
       */
      show?: animationConfig
    };
    /**
     * Specifies the name of the CSS class to be applied to the root menu level and all submenus.
     */
    cssClass?: string;
    /**
     * Binds the UI component to data.
     */
    dataSource?: string | Array<dxMenuBaseItem> | Store | DataSource | DataSourceOptions;
    /**
     * Holds an array of menu items.
     */
    items?: Array<dxMenuBaseItem>;
    /**
     * Specifies whether or not an item becomes selected if a user clicks it.
     */
    selectByClick?: boolean;
    /**
     * Specifies the selection mode supported by the menu.
     */
    selectionMode?: 'none' | 'single';
    /**
     * Specifies properties of submenu showing and hiding.
     */
    showSubmenuMode?: {
      /**
       * Specifies the delay of submenu show and hiding.
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
}
/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export default class dxMenuBase extends HierarchicalCollectionWidget {
    constructor(element: UserDefinedElement, options?: dxMenuBaseOptions)
    /**
     * Selects an item found using its DOM node.
     */
    selectItem(itemElement: Element): void;
    /**
     * Cancels the selection of an item found using its DOM node.
     */
    unselectItem(itemElement: Element): void;
}
