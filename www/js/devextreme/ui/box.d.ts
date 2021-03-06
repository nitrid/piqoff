/**
* DevExtreme (ui/box.d.ts)
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
    CollectionWidgetOptions
} from './collection/ui.collection_widget.base';

export type ContentReadyEvent = EventInfo<dxBox>;

export type DisposingEvent = EventInfo<dxBox>;

export type InitializedEvent = InitializedEventInfo<dxBox>;

export type ItemClickEvent = NativeEventInfo<dxBox> & ItemInfo;

export type ItemContextMenuEvent = NativeEventInfo<dxBox> & ItemInfo;

export type ItemHoldEvent = NativeEventInfo<dxBox> & ItemInfo;

export type ItemRenderedEvent = NativeEventInfo<dxBox> & ItemInfo;

export type OptionChangedEvent = EventInfo<dxBox> & ChangedOptionInfo;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxBoxOptions extends CollectionWidgetOptions<dxBox> {
    /**
     * Specifies how UI component items are aligned along the main direction.
     */
    align?: 'center' | 'end' | 'space-around' | 'space-between' | 'start';
    /**
     * Specifies how UI component items are aligned cross-wise.
     */
    crossAlign?: 'center' | 'end' | 'start' | 'stretch';
    /**
     * Binds the UI component to data.
     */
    dataSource?: string | Array<string | Item | any> | Store | DataSource | DataSourceOptions;
    /**
     * Specifies the direction of item positioning in the UI component.
     */
    direction?: 'col' | 'row';
    /**
     * An array of items displayed by the UI component.
     */
    items?: Array<string | Item | any>;
}
/**
 * The Box UI component allows you to arrange various elements within it. Separate and adaptive, the Box UI component acts as a building block for the layout.
 */
export default class dxBox extends CollectionWidget {
    constructor(element: UserDefinedElement, options?: dxBoxOptions)
}

export type Item = dxBoxItem;

/**
 * @deprecated Use Item instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxBoxItem extends CollectionWidgetItem {
    /**
     * Specifies the base size of an item element along the main direction.
     */
    baseSize?: number | 'auto';
    /**
     * Holds a Box configuration object for the item.
     */
    box?: dxBoxOptions;
    /**
     * Specifies the ratio value used to count the item element size along the main direction.
     */
    ratio?: number;
    /**
     * A factor that defines how much an item shrinks relative to the rest of the items in the container.
     */
    shrink?: number;
}

export type Properties = dxBoxOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type Options = dxBoxOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type IOptions = dxBoxOptions;
