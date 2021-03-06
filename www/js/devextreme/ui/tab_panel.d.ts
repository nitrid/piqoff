/**
* DevExtreme (ui/tab_panel.d.ts)
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

import {
    SelectionChangedInfo
} from './collection/ui.collection_widget.base';

import dxMultiView, {
    dxMultiViewItem,
    dxMultiViewOptions
} from './multi_view';

export type ContentReadyEvent = EventInfo<dxTabPanel>;

export type DisposingEvent = EventInfo<dxTabPanel>;

export type InitializedEvent = InitializedEventInfo<dxTabPanel>;

export type ItemClickEvent = NativeEventInfo<dxTabPanel> & ItemInfo;

export type ItemContextMenuEvent = NativeEventInfo<dxTabPanel> & ItemInfo;

export type ItemHoldEvent = NativeEventInfo<dxTabPanel> & ItemInfo;

export type ItemRenderedEvent = NativeEventInfo<dxTabPanel> & ItemInfo;

export type OptionChangedEvent = EventInfo<dxTabPanel> & ChangedOptionInfo;

export type SelectionChangedEvent = EventInfo<dxTabPanel> & SelectionChangedInfo;

export type TitleClickEvent = NativeEventInfo<dxTabPanel> & {
    readonly itemData?: any;
    readonly itemElement?: DxElement;
}

export type TitleHoldEvent = NativeEventInfo<dxTabPanel> & {
    readonly itemData?: any;
    readonly itemElement?: DxElement;
}

export type TitleRenderedEvent = EventInfo<dxTabPanel> & {
    readonly itemData?: any;
    readonly itemElement?: DxElement;
}

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxTabPanelOptions extends dxMultiViewOptions<dxTabPanel> {
    /**
     * Specifies whether or not to animate the displayed item change.
     */
    animationEnabled?: boolean;
    /**
     * Binds the UI component to data.
     */
    dataSource?: string | Array<string | Item | any> | Store | DataSource | DataSourceOptions;
    /**
     * Specifies whether the UI component changes its state when a user pauses on it.
     */
    hoverStateEnabled?: boolean;
    /**
     * Specifies a custom template for item titles.
     */
    itemTitleTemplate?: template | ((itemData: any, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement);
    /**
     * An array of items displayed by the UI component.
     */
    items?: Array<string | Item | any>;
    /**
     * A function that is executed when a tab is clicked or tapped.
     */
    onTitleClick?: ((e: TitleClickEvent) => void) | string;
    /**
     * A function that is executed when a tab has been held for a specified period.
     */
    onTitleHold?: ((e: TitleHoldEvent) => void);
    /**
     * A function that is executed after a tab is rendered.
     */
    onTitleRendered?: ((e: TitleRenderedEvent) => void);
    /**
     * Specifies whether to repaint only those elements whose data changed.
     */
    repaintChangesOnly?: boolean;
    /**
     * A Boolean value specifying if tabs in the title are scrolled by content.
     */
    scrollByContent?: boolean;
    /**
     * A Boolean indicating whether or not to add scrolling support for tabs in the title.
     */
    scrollingEnabled?: boolean;
    /**
     * Specifies whether navigation buttons should be available when tabs exceed the UI component&apos;s width.
     */
    showNavButtons?: boolean;
    /**
     * A Boolean value specifying whether or not to allow users to change the selected index by swiping.
     */
    swipeEnabled?: boolean;
}
/**
 * The TabPanel is a UI component consisting of the Tabs and MultiView UI components. It automatically synchronizes the selected tab with the currently displayed view and vice versa.
 */
export default class dxTabPanel extends dxMultiView {
    constructor(element: UserDefinedElement, options?: dxTabPanelOptions)
}

export type Item = dxTabPanelItem;

/**
 * @deprecated Use Item instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxTabPanelItem extends dxMultiViewItem {
    /**
     * Specifies a badge text for the tab.
     */
    badge?: string;
    /**
     * Specifies the icon to be displayed in the tab&apos;s title.
     */
    icon?: string;
    /**
     * Specifies a template that should be used to render the tab for this item only.
     */
    tabTemplate?: template | (() => string | UserDefinedElement);
    /**
     * Specifies the item title text displayed on a corresponding tab.
     */
    title?: string;
}

export type Properties = dxTabPanelOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type Options = dxTabPanelOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type IOptions = dxTabPanelOptions;
