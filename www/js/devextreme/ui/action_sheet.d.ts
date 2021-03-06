/**
* DevExtreme (ui/action_sheet.d.ts)
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

import CollectionWidget, {
    CollectionWidgetItem,
    CollectionWidgetOptions
} from './collection/ui.collection_widget.base';

export type CancelClickEvent = Cancelable & EventInfo<dxActionSheet>;

export type ContentReadyEvent = EventInfo<dxActionSheet>;

export type DisposingEvent = EventInfo<dxActionSheet>;

export type InitializedEvent = InitializedEventInfo<dxActionSheet>;

export type ItemClickEvent = NativeEventInfo<dxActionSheet> & ItemInfo;

export type ItemContextMenuEvent = NativeEventInfo<dxActionSheet> & ItemInfo;

export type ItemHoldEvent = NativeEventInfo<dxActionSheet> & ItemInfo;

export type ItemRenderedEvent = NativeEventInfo<dxActionSheet> & ItemInfo;

export type OptionChangedEvent = EventInfo<dxActionSheet> & ChangedOptionInfo;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxActionSheetOptions extends CollectionWidgetOptions<dxActionSheet> {
    /**
     * The text displayed in the button that closes the action sheet.
     */
    cancelText?: string;
    /**
     * Binds the UI component to data.
     */
    dataSource?: string | Array<string | Item | any> | Store | DataSource | DataSourceOptions;
    /**
     * An array of items displayed by the UI component.
     */
    items?: Array<string | Item | any>;
    /**
     * A function that is executed when the Cancel button is clicked or tapped.
     */
    onCancelClick?: ((e: CancelClickEvent) => void) | string;
    /**
     * Specifies whether or not to display the Cancel button in action sheet.
     */
    showCancelButton?: boolean;
    /**
     * A Boolean value specifying whether or not the title of the action sheet is visible.
     */
    showTitle?: boolean;
    /**
     * Specifies the element the action sheet popover points at. Applies only if usePopover is true.
     */
    target?: string | UserDefinedElement;
    /**
     * The title of the action sheet.
     */
    title?: string;
    /**
     * Specifies whether or not to show the action sheet within a Popover UI component.
     */
    usePopover?: boolean;
    /**
     * A Boolean value specifying whether or not the ActionSheet UI component is visible.
     */
    visible?: boolean;
}
/**
 * The ActionSheet UI component is a sheet containing a set of buttons located one under the other. These buttons usually represent several choices relating to a single task.
 */
export default class dxActionSheet extends CollectionWidget {
    constructor(element: UserDefinedElement, options?: dxActionSheetOptions)
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

export type Item = dxActionSheetItem;

/**
 * @deprecated Use Item instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxActionSheetItem extends CollectionWidgetItem {
    /**
     * Specifies the icon to be displayed on the action sheet button.
     */
    icon?: string;
    /**
     * A handler for the click event raised for the button representing the given action sheet button.
     */
    onClick?: ((e: { component?: dxActionSheet, element?: DxElement, model?: any, event?: DxEvent }) => void) | string;
    /**
     * Specifies the type of the button that represents an action sheet item.
     */
    type?: 'back' | 'danger' | 'default' | 'normal' | 'success';
}

export type Properties = dxActionSheetOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type Options = dxActionSheetOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type IOptions = dxActionSheetOptions;
