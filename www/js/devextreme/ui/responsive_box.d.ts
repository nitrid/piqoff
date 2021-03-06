/**
* DevExtreme (ui/responsive_box.d.ts)
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

export type ContentReadyEvent = EventInfo<dxResponsiveBox>;

export type DisposingEvent = EventInfo<dxResponsiveBox>;

export type InitializedEvent = InitializedEventInfo<dxResponsiveBox>;

export type ItemClickEvent = NativeEventInfo<dxResponsiveBox> & ItemInfo;

export type ItemContextMenuEvent = NativeEventInfo<dxResponsiveBox> & ItemInfo;

export type ItemHoldEvent = NativeEventInfo<dxResponsiveBox> & ItemInfo;

export type ItemRenderedEvent = NativeEventInfo<dxResponsiveBox> & ItemInfo;

export type OptionChangedEvent = EventInfo<dxResponsiveBox> & ChangedOptionInfo;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxResponsiveBoxOptions extends CollectionWidgetOptions<dxResponsiveBox> {
    /**
     * Specifies the collection of columns for the grid used to position layout elements.
     */
    cols?: Array<{
      /**
       * The column&apos;s base width. Calculated automatically when the singleColumnScreen property arranges all elements in a single column.
       */
      baseSize?: number | 'auto',
      /**
       * The column width ratio.
       */
      ratio?: number,
      /**
       * Decides on which screens the current column is rendered.
       */
      screen?: string,
      /**
       * A factor that defines how much a column width shrinks relative to the rest of the columns in the container.
       */
      shrink?: number
    }>;
    /**
     * Binds the UI component to data.
     */
    dataSource?: string | Array<string | Item | any> | Store | DataSource | DataSourceOptions;
    /**
     * Specifies the UI component&apos;s height.
     */
    height?: number | string | (() => number | string);
    /**
     * An array of items displayed by the UI component.
     */
    items?: Array<string | Item | any>;
    /**
     * Specifies the collection of rows for the grid used to position layout elements.
     */
    rows?: Array<{
      /**
       * The row&apos;s base height. Calculated automatically when the singleColumnScreen property arranges all elements in a single column.
       */
      baseSize?: number | 'auto',
      /**
       * The row height ratio.
       */
      ratio?: number,
      /**
       * Decides on which screens the current row is rendered.
       */
      screen?: string,
      /**
       * A factor that defines how much a row height shrinks relative to the rest of the rows in the container.
       */
      shrink?: number
    }>;
    /**
     * Specifies the function returning the size qualifier depending on the screen&apos;s width.
     */
    screenByWidth?: Function;
    /**
     * Specifies on which screens all layout elements should be arranged in a single column. Accepts a single or several size qualifiers separated by a space.
     */
    singleColumnScreen?: string;
    /**
     * Specifies the UI component&apos;s width.
     */
    width?: number | string | (() => number | string);
}
/**
 * The ResponsiveBox UI component allows you to create an application or a website with a layout adapted to different screen sizes.
 */
export default class dxResponsiveBox extends CollectionWidget {
    constructor(element: UserDefinedElement, options?: dxResponsiveBoxOptions)
}

export type Item = dxResponsiveBoxItem;

/**
 * @deprecated Use Item instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxResponsiveBoxItem extends CollectionWidgetItem {
    /**
     * Specifies the item location and size against the UI component grid.
     */
    location?: {
      /**
       * Specifies which column the element should occupy. Accepts an index from the cols array.
       */
      col?: number,
      /**
       * Specifies how many columns the element should span.
       */
      colspan?: number,
      /**
       * Specifies which row the element should occupy. Accepts an index from the rows array.
       */
      row?: number,
      /**
       * Specifies how many rows the element should span.
       */
      rowspan?: number,
      /**
       * Decides on which screens the current location settings should be applied to the element.
       */
      screen?: string
    } | Array<{ col?: number, colspan?: number, row?: number, rowspan?: number, screen?: string }>;
}

export type Properties = dxResponsiveBoxOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type Options = dxResponsiveBoxOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type IOptions = dxResponsiveBoxOptions;
