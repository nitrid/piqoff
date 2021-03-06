/**
* DevExtreme (ui/accordion.d.ts)
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

export type ContentReadyEvent = EventInfo<dxAccordion>;

export type DisposingEvent = EventInfo<dxAccordion>;

export type InitializedEvent = InitializedEventInfo<dxAccordion>;

export type ItemClickEvent = NativeEventInfo<dxAccordion> & ItemInfo;

export type ItemContextMenuEvent = NativeEventInfo<dxAccordion> & ItemInfo;

export type ItemHoldEvent = NativeEventInfo<dxAccordion> & ItemInfo;

export type ItemRenderedEvent = NativeEventInfo<dxAccordion> & ItemInfo;

export type ItemTitleClickEvent = NativeEventInfo<dxAccordion> & ItemInfo;

export type OptionChangedEvent = EventInfo<dxAccordion> & ChangedOptionInfo;

export type SelectionChangedEvent = EventInfo<dxAccordion> & SelectionChangedInfo;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxAccordionOptions extends CollectionWidgetOptions<dxAccordion> {
    /**
     * A number specifying the time in milliseconds spent on the animation of the expanding or collapsing of a panel.
     */
    animationDuration?: number;
    /**
     * Specifies whether all items can be collapsed or whether at least one item must always be expanded.
     */
    collapsible?: boolean;
    /**
     * Binds the UI component to data.
     */
    dataSource?: string | Array<string | Item | any> | Store | DataSource | DataSourceOptions;
    /**
     * Specifies whether to render the panel&apos;s content when it is displayed. If false, the content is rendered immediately.
     */
    deferRendering?: boolean;
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
     * Specifies a custom template for items.
     */
    itemTemplate?: template | ((itemData: any, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement);
    /**
     * Specifies a custom template for item titles.
     */
    itemTitleTemplate?: template | ((itemData: any, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement);
    /**
     * An array of items displayed by the UI component.
     */
    items?: Array<string | Item | any>;
    /**
     * Specifies whether the UI component can expand several items or only a single item at once.
     */
    multiple?: boolean;
    /**
     * A function that is executed when an accordion item&apos;s title is clicked or tapped.
     */
    onItemTitleClick?: ((e: ItemTitleClickEvent) => void) | string;
    /**
     * Specifies whether to repaint only those elements whose data changed.
     */
    repaintChangesOnly?: boolean;
    /**
     * [tags] expandedItem, expand The index number of the currently expanded item.
     */
    selectedIndex?: number;
}
/**
 * The Accordion UI component contains several panels displayed one under another. These panels can be collapsed or expanded by an end user, which makes this UI component very useful for presenting information in a limited amount of space.
 */
export default class dxAccordion extends CollectionWidget {
    constructor(element: UserDefinedElement, options?: dxAccordionOptions)
    /**
     * Collapses an item with a specific index.
     */
    collapseItem(index: number): DxPromise<void>;
    /**
     * Expands an item with a specific index.
     */
    expandItem(index: number): DxPromise<void>;
    /**
     * Updates the dimensions of the UI component contents.
     */
    updateDimensions(): DxPromise<void>;
}

export type Item = dxAccordionItem;

/**
 * @deprecated Use Item instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxAccordionItem extends CollectionWidgetItem {
    /**
     * Specifies the icon to be displayed in the panel&apos;s title.
     */
    icon?: string;
    /**
     * Specifies text displayed for the UI component item title.
     */
    title?: string;
}

export type Properties = dxAccordionOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type Options = dxAccordionOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type IOptions = dxAccordionOptions;
