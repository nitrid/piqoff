/**
* DevExtreme (ui/tile_view.d.ts)
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
} from './collection/ui.collection_widget.base';

export type ContentReadyEvent = EventInfo<dxTileView>;

export type DisposingEvent = EventInfo<dxTileView>;

export type InitializedEvent = InitializedEventInfo<dxTileView>;

export type ItemClickEvent = NativeEventInfo<dxTileView> & ItemInfo;

export type ItemContextMenuEvent = NativeEventInfo<dxTileView> & ItemInfo;

export type ItemHoldEvent = NativeEventInfo<dxTileView> & ItemInfo;

export type ItemRenderedEvent = NativeEventInfo<dxTileView> & ItemInfo;

export type OptionChangedEvent = EventInfo<dxTileView> & ChangedOptionInfo;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxTileViewOptions extends CollectionWidgetOptions<dxTileView> {
    /**
     * A Boolean value specifying whether or not the UI component changes its state when interacting with a user.
     */
    activeStateEnabled?: boolean;
    /**
     * Specifies the height of the base tile view item.
     */
    baseItemHeight?: number;
    /**
     * Specifies the width of the base tile view item.
     */
    baseItemWidth?: number;
    /**
     * Binds the UI component to data.
     */
    dataSource?: string | Array<string | Item | any> | Store | DataSource | DataSourceOptions;
    /**
     * Specifies whether the UI component is oriented horizontally or vertically.
     */
    direction?: 'horizontal' | 'vertical';
    /**
     * Specifies whether the UI component can be focused using keyboard navigation.
     */
    focusStateEnabled?: boolean;
    /**
     * Specifies the UI component&apos;s height.
     */
    height?: number | string | (() => number | string);
    /**
     * Specifies whether the UI component changes its state when a user pauses on it.
     */
    hoverStateEnabled?: boolean;
    /**
     * Specifies the distance in pixels between adjacent tiles.
     */
    itemMargin?: number;
    /**
     * An array of items displayed by the UI component.
     */
    items?: Array<string | Item | any>;
    /**
     * A Boolean value specifying whether or not to display a scrollbar.
     */
    showScrollbar?: boolean;
}
/**
 * The TileView UI component contains a collection of tiles. Tiles can store much more information than ordinary buttons, that is why they are very popular in apps designed for touch devices.
 */
export default class dxTileView extends CollectionWidget {
    constructor(element: UserDefinedElement, options?: dxTileViewOptions)
    /**
     * Gets the current scroll position.
     */
    scrollPosition(): number;
}

export type Item = dxTileViewItem;

/**
 * @deprecated Use Item instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxTileViewItem extends CollectionWidgetItem {
    /**
     * Specifies a multiplier for the baseItemHeight property value (for the purpose of obtaining the actual item height).
     */
    heightRatio?: number;
    /**
     * Specifies a multiplier for the baseItemWidth property value (for the purpose of obtaining the actual item width).
     */
    widthRatio?: number;
}

export type Properties = dxTileViewOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type Options = dxTileViewOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type IOptions = dxTileViewOptions;
