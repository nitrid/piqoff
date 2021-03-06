/**
* DevExtreme (ui/context_menu.d.ts)
* Version: 21.1.5
* Build date: Mon Aug 02 2021
*
* Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import {
    positionConfig
} from '../animation/position';

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
    DxEvent,
    Cancelable,
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
    ItemInfo
} from '../events/index';

import dxMenuBase, {
    dxMenuBaseOptions
} from './context_menu/ui.menu_base';

import {
    dxMenuBaseItem
} from './menu';

import {
    SelectionChangedInfo
} from './collection/ui.collection_widget.base';

export type ContentReadyEvent = EventInfo<dxContextMenu>;

export type DisposingEvent = EventInfo<dxContextMenu>;

export type HiddenEvent = EventInfo<dxContextMenu>;

export type HidingEvent = Cancelable & EventInfo<dxContextMenu>;

export type InitializedEvent = InitializedEventInfo<dxContextMenu>;

export type ItemClickEvent = NativeEventInfo<dxContextMenu> & ItemInfo;

export type ItemContextMenuEvent = NativeEventInfo<dxContextMenu> & ItemInfo;

export type ItemRenderedEvent = NativeEventInfo<dxContextMenu> & ItemInfo;

export type OptionChangedEvent = EventInfo<dxContextMenu> & ChangedOptionInfo;

export type PositioningEvent = NativeEventInfo<dxContextMenu> & {
    readonly position: positionConfig;
}

export type SelectionChangedEvent = EventInfo<dxContextMenu> & SelectionChangedInfo;

export type ShowingEvent = Cancelable & EventInfo<dxContextMenu>;

export type ShownEvent = EventInfo<dxContextMenu>;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxContextMenuOptions extends dxMenuBaseOptions<dxContextMenu> {
    /**
     * Specifies whether to close the UI component if a user clicks outside it.
     */
    closeOnOutsideClick?: boolean | ((event: DxEvent) => boolean);
    /**
     * Binds the UI component to data.
     */
    dataSource?: string | Array<Item> | Store | DataSource | DataSourceOptions;
    /**
     * Holds an array of menu items.
     */
    items?: Array<Item>;
    /**
     * A function that is executed after the ContextMenu is hidden.
     */
    onHidden?: ((e: HiddenEvent) => void);
    /**
     * A function that is executed before the ContextMenu is hidden.
     */
    onHiding?: ((e: HidingEvent) => void);
    /**
     * A function that is executed before the ContextMenu is positioned.
     */
    onPositioning?: ((e: PositioningEvent) => void);
    /**
     * A function that is executed before the ContextMenu is shown.
     */
    onShowing?: ((e: ShowingEvent) => void);
    /**
     * A function that is executed after the ContextMenu is shown.
     */
    onShown?: ((e: ShownEvent) => void);
    /**
     * An object defining UI component positioning properties.
     */
    position?: positionConfig;
    /**
     * Specifies properties for displaying the UI component.
     */
    showEvent?: {
      /**
       * The delay in milliseconds after which the UI component is displayed.
       */
      delay?: number,
      /**
       * Specifies the event names on which the UI component is shown.
       */
      name?: string
    } | string;
    /**
     * Specifies the direction at which submenus are displayed.
     */
    submenuDirection?: 'auto' | 'left' | 'right';
    /**
     * The target element associated with the context menu.
     */
    target?: string | UserDefinedElement;
    /**
     * A Boolean value specifying whether or not the UI component is visible.
     */
    visible?: boolean;
}
/**
 * The ContextMenu UI component displays a single- or multi-level context menu. An end user invokes this menu by a right click or a long press.
 */
export default class dxContextMenu extends dxMenuBase {
    constructor(element: UserDefinedElement, options?: dxContextMenuOptions)
    /**
     * Hides the UI component.
     */
    hide(): DxPromise<void>;
    /**
     * Shows the UI component.
     */
    show(): DxPromise<void>;
    /**
     * Shows or hides the UI component depending on the argument.
     */
    toggle(showing: boolean): DxPromise<void>;
}

export type Item = dxContextMenuItem;

/**
 * @deprecated Use Item instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxContextMenuItem extends dxMenuBaseItem {
    /**
     * Specifies nested menu items.
     */
    items?: Array<dxContextMenuItem>;
}

export type Properties = dxContextMenuOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type Options = dxContextMenuOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type IOptions = dxContextMenuOptions;
