/**
* DevExtreme (ui/multi_view.d.ts)
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

export type ContentReadyEvent = EventInfo<dxMultiView>;

export type DisposingEvent = EventInfo<dxMultiView>;

export type InitializedEvent = InitializedEventInfo<dxMultiView>;

export type ItemClickEvent = NativeEventInfo<dxMultiView> & ItemInfo;

export type ItemContextMenuEvent = NativeEventInfo<dxMultiView> & ItemInfo;

export type ItemHoldEvent = NativeEventInfo<dxMultiView> & ItemInfo;

export type ItemRenderedEvent = NativeEventInfo<dxMultiView> & ItemInfo;

export type OptionChangedEvent = EventInfo<dxMultiView> & ChangedOptionInfo;

export type SelectionChangedEvent = EventInfo<dxMultiView> & SelectionChangedInfo;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxMultiViewOptions<T = dxMultiView> extends CollectionWidgetOptions<T> {
    /**
     * Specifies whether or not to animate the displayed item change.
     */
    animationEnabled?: boolean;
    /**
     * Binds the UI component to data.
     */
    dataSource?: string | Array<string | Item | any> | Store | DataSource | DataSourceOptions;
    /**
     * Specifies whether to render the view&apos;s content when it is displayed. If false, the content is rendered immediately.
     */
    deferRendering?: boolean;
    /**
     * Specifies whether the UI component can be focused using keyboard navigation.
     */
    focusStateEnabled?: boolean;
    /**
     * An array of items displayed by the UI component.
     */
    items?: Array<string | Item | any>;
    /**
     * A Boolean value specifying whether or not to scroll back to the first item after the last item is swiped.
     */
    loop?: boolean;
    /**
     * The index of the currently displayed item.
     */
    selectedIndex?: number;
    /**
     * A Boolean value specifying whether or not to allow users to change the selected index by swiping.
     */
    swipeEnabled?: boolean;
}
/**
 * The MultiView is a UI component that contains several views. An end user navigates through the views by swiping them in the horizontal direction.
 */
export default class dxMultiView extends CollectionWidget {
    constructor(element: UserDefinedElement, options?: dxMultiViewOptions)
}

export type Item = dxMultiViewItem;

/**
 * @deprecated Use Item instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxMultiViewItem extends CollectionWidgetItem {
}

export type Properties = dxMultiViewOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type Options = dxMultiViewOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type IOptions = dxMultiViewOptions;
