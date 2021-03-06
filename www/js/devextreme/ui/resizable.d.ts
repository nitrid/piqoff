/**
* DevExtreme (ui/resizable.d.ts)
* Version: 21.1.5
* Build date: Mon Aug 02 2021
*
* Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import DOMComponent, {
    DOMComponentOptions
} from '../core/dom_component';

import {
    UserDefinedElement
} from '../core/element';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo
} from '../events/index';

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface ResizeInfo {
    readonly width: number;
    readonly height: number;
    handles: {
        readonly left: boolean;
        readonly top: boolean;
        readonly right: boolean;
        readonly bottom: boolean;
    }
}

export type DisposingEvent = EventInfo<dxResizable>;

export type InitializedEvent = InitializedEventInfo<dxResizable>;

export type OptionChangedEvent = EventInfo<dxResizable> & ChangedOptionInfo;

export type ResizeEvent = NativeEventInfo<dxResizable> & ResizeInfo;

export type ResizeStartEvent = NativeEventInfo<dxResizable> & ResizeInfo;

export type ResizeEndEvent = NativeEventInfo<dxResizable> & ResizeInfo;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxResizableOptions extends DOMComponentOptions<dxResizable> {
    /**
     * Specifies which borders of the UI component element are used as a handle.
     */
    handles?: 'bottom' | 'left' | 'right' | 'top' | 'all' | string;
    /**
     * Specifies the UI component&apos;s height.
     */
    height?: number | string | (() => number | string);
    /**
     * Specifies the upper height boundary for resizing.
     */
    maxHeight?: number;
    /**
     * Specifies the upper width boundary for resizing.
     */
    maxWidth?: number;
    /**
     * Specifies the lower height boundary for resizing.
     */
    minHeight?: number;
    /**
     * Specifies the lower width boundary for resizing.
     */
    minWidth?: number;
    /**
     * A function that is executed each time the UI component is resized by one pixel.
     */
    onResize?: ((e: ResizeEvent) => void);
    /**
     * A function that is executed when resizing ends.
     */
    onResizeEnd?: ((e: ResizeEndEvent) => void);
    /**
     * A function that is executed when resizing starts.
     */
    onResizeStart?: ((e: ResizeStartEvent) => void);
    /**
     * Specifies the UI component&apos;s width.
     */
    width?: number | string | (() => number | string);
}
/**
 * The Resizable UI component enables its content to be resizable in the UI.
 */
export default class dxResizable extends DOMComponent {
    constructor(element: UserDefinedElement, options?: dxResizableOptions)
}

export type Properties = dxResizableOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type Options = dxResizableOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type IOptions = dxResizableOptions;
