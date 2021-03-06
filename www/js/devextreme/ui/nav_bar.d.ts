/**
* DevExtreme (ui/nav_bar.d.ts)
* Version: 21.1.5
* Build date: Mon Aug 02 2021
*
* Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import {
    UserDefinedElement
} from '../core/element';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
    ItemInfo
} from '../events/index';

import {
    SelectionChangedInfo
} from './collection/ui.collection_widget.base';

import dxTabs, {
    dxTabsItem,
    dxTabsOptions
} from './tabs';

export type ContentReadyEvent = EventInfo<dxNavBar>;

export type DisposingEvent = EventInfo<dxNavBar>;

export type InitializedEvent = InitializedEventInfo<dxNavBar>;

export type ItemClickEvent = NativeEventInfo<dxNavBar> & ItemInfo;

export type ItemContextMenuEvent = NativeEventInfo<dxNavBar> & ItemInfo;

export type ItemHoldEvent = NativeEventInfo<dxNavBar> & ItemInfo;

export type ItemRenderedEvent = NativeEventInfo<dxNavBar> & ItemInfo;

export type OptionChangedEvent = EventInfo<dxNavBar> & ChangedOptionInfo;

export type SelectionChangedEvent = EventInfo<dxNavBar> & SelectionChangedInfo;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxNavBarOptions extends dxTabsOptions<dxNavBar> {
    /**
     * Specifies whether or not an end-user can scroll tabs by swiping.
     */
    scrollByContent?: boolean;
}
/**
 * The NavBar is a UI component that navigates the application views.
 * @deprecated 
 */
export default class dxNavBar extends dxTabs {
    constructor(element: UserDefinedElement, options?: dxNavBarOptions)
}

export type Item = dxNavBarItem;

/**
 * @deprecated Use Item instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxNavBarItem extends dxTabsItem {
    /**
     * Specifies a badge text for the navbar item.
     */
    badge?: string;
}

export type Properties = dxNavBarOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type Options = dxNavBarOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type IOptions = dxNavBarOptions;
