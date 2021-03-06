/**
* DevExtreme (ui/collection/ui.collection_widget.base.d.ts)
* Version: 21.1.5
* Build date: Mon Aug 02 2021
*
* Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import {
    UserDefinedElement,
    DxElement
} from '../../core/element';

import {
    template
} from '../../core/templates/template';

import DataSource, {
    DataSourceOptions
} from '../../data/data_source';

import Store from '../../data/abstract_store';

import {
    EventInfo,
    NativeEventInfo,
    ItemInfo
} from '../../events/index';

import Widget, {
    WidgetOptions
} from '../widget/ui.widget';

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface SelectionChangedInfo<T = any> {
    readonly addedItems: Array<T>;
    readonly removedItems: Array<T>;
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface CollectionWidgetOptions<T = CollectionWidget> extends WidgetOptions<T> {
    /**
     * Binds the UI component to data.
     */
    dataSource?: string | Array<string | CollectionWidgetItem> | Store | DataSource | DataSourceOptions;
    /**
     * The time period in milliseconds before the onItemHold event is raised.
     */
    itemHoldTimeout?: number;
    /**
     * Specifies a custom template for items.
     */
    itemTemplate?: template | ((itemData: any, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement);
    /**
     * An array of items displayed by the UI component.
     */
    items?: Array<string | CollectionWidgetItem | any>;
    /**
     * Specifies the key property that provides key values to access data items. Each key value must be unique.
     */
    keyExpr?: string | Function;
    /**
     * Specifies the text or HTML markup displayed by the UI component if the item collection is empty.
     */
    noDataText?: string;
    /**
     * A function that is executed when a collection item is clicked or tapped.
     */
    onItemClick?: ((e: NativeEventInfo<T> & ItemInfo) => void) | string;
    /**
     * A function that is executed when a collection item is right-clicked or pressed.
     */
    onItemContextMenu?: ((e: NativeEventInfo<T> & ItemInfo) => void);
    /**
     * A function that is executed when a collection item has been held for a specified period.
     */
    onItemHold?: ((e: NativeEventInfo<T> & ItemInfo) => void);
    /**
     * A function that is executed after a collection item is rendered.
     */
    onItemRendered?: ((e: NativeEventInfo<T> & ItemInfo) => void);
    /**
     * A function that is executed when a collection item is selected or selection is canceled.
     */
    onSelectionChanged?: ((e: EventInfo<T> & SelectionChangedInfo) => void);
    /**
     * The index of the currently selected UI component item.
     */
    selectedIndex?: number;
    /**
     * The selected item object.
     */
    selectedItem?: any;
    /**
     * Specifies an array of currently selected item keys.
     */
    selectedItemKeys?: Array<any>;
    /**
     * An array of currently selected item objects.
     */
    selectedItems?: Array<any>;
}
/**
 * The base class for UI components containing an item collection.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export default class CollectionWidget extends Widget {
    constructor(element: UserDefinedElement, options?: CollectionWidgetOptions)
    getDataSource(): DataSource;
}


/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface CollectionWidgetItem {
    /**
     * Specifies whether the UI component item responds to user interaction.
     */
    disabled?: boolean;
    /**
     * Specifies the HTML markup to be inserted into the item element.
     */
    html?: string;
    /**
     * Specifies a template that should be used to render this item only.
     */
    template?: template | ((itemData: any, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement);
    /**
     * Specifies text displayed for the UI component item.
     */
    text?: string;
    /**
     * Specifies whether or not a UI component item must be displayed.
     */
    visible?: boolean;
}
