/**
* DevExtreme (ui/gallery.d.ts)
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

export type ContentReadyEvent = EventInfo<dxGallery>;

export type DisposingEvent = EventInfo<dxGallery>;

export type InitializedEvent = InitializedEventInfo<dxGallery>;

export type ItemClickEvent = NativeEventInfo<dxGallery> & ItemInfo;

export type ItemContextMenuEvent = NativeEventInfo<dxGallery> & ItemInfo;

export type ItemHoldEvent = NativeEventInfo<dxGallery> & ItemInfo;

export type ItemRenderedEvent = NativeEventInfo<dxGallery> & ItemInfo;

export type OptionChangedEvent = EventInfo<dxGallery> & ChangedOptionInfo;

export type SelectionChangedEvent = EventInfo<dxGallery> & SelectionChangedInfo;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxGalleryOptions extends CollectionWidgetOptions<dxGallery> {
    /**
     * The time, in milliseconds, spent on slide animation.
     */
    animationDuration?: number;
    /**
     * Specifies whether or not to animate the displayed item change.
     */
    animationEnabled?: boolean;
    /**
     * Binds the UI component to data.
     */
    dataSource?: string | Array<string | Item | any> | Store | DataSource | DataSourceOptions;
    /**
     * Specifies whether the UI component can be focused using keyboard navigation.
     */
    focusStateEnabled?: boolean;
    /**
     * A Boolean value specifying whether or not to allow users to switch between items by clicking an indicator.
     */
    indicatorEnabled?: boolean;
    /**
     * Specifies the width of an area used to display a single image.
     */
    initialItemWidth?: number;
    /**
     * An array of items displayed by the UI component.
     */
    items?: Array<string | Item | any>;
    /**
     * A Boolean value specifying whether or not to scroll back to the first item after the last item is swiped.
     */
    loop?: boolean;
    /**
     * Specifies the text or HTML markup displayed by the UI component if the item collection is empty.
     */
    noDataText?: string;
    /**
     * The index of the currently active gallery item.
     */
    selectedIndex?: number;
    /**
     * A Boolean value specifying whether or not to display an indicator that points to the selected gallery item.
     */
    showIndicator?: boolean;
    /**
     * A Boolean value that specifies the availability of the &apos;Forward&apos; and &apos;Back&apos; navigation buttons.
     */
    showNavButtons?: boolean;
    /**
     * The time interval in milliseconds, after which the gallery switches to the next item.
     */
    slideshowDelay?: number;
    /**
     * Specifies if the UI component stretches images to fit the total gallery width.
     */
    stretchImages?: boolean;
    /**
     * A Boolean value specifying whether or not to allow users to switch between items by swiping.
     */
    swipeEnabled?: boolean;
    /**
     * Specifies whether or not to display parts of previous and next images along the sides of the current image.
     */
    wrapAround?: boolean;
}
/**
 * The Gallery is a UI component that displays a collection of images in a carousel. The UI component is supplied with various navigation controls that allow a user to switch between images.
 */
export default class dxGallery extends CollectionWidget {
    constructor(element: UserDefinedElement, options?: dxGalleryOptions)
    /**
     * Shows a specific image.
     */
    goToItem(itemIndex: number, animation: boolean): DxPromise<void>;
    /**
     * Shows the next image.
     */
    nextItem(animation: boolean): DxPromise<void>;
    /**
     * Shows the previous image.
     */
    prevItem(animation: boolean): DxPromise<void>;
}

export type Item = dxGalleryItem;

/**
 * @deprecated Use Item instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxGalleryItem extends CollectionWidgetItem {
    /**
     * Specifies the text passed to the alt attribute of the image markup element.
     */
    imageAlt?: string;
    /**
     * Specifies the URL of the image displayed by the item.
     */
    imageSrc?: string;
}

export type Properties = dxGalleryOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type Options = dxGalleryOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type IOptions = dxGalleryOptions;
