/**
* DevExtreme (ui/range_slider.d.ts)
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
    ChangedOptionInfo
} from '../events/index';

import {
    ValueChangedInfo
} from './editor/editor';

import {
    dxSliderBaseOptions
} from './slider';

import dxTrackBar from './track_bar';

export type ContentReadyEvent = EventInfo<dxRangeSlider>;

export type DisposingEvent = EventInfo<dxRangeSlider>;

export type InitializedEvent = InitializedEventInfo<dxRangeSlider>;

export type OptionChangedEvent = EventInfo<dxRangeSlider> & ChangedOptionInfo;

export type ValueChangedEvent = NativeEventInfo<dxRangeSlider> & ValueChangedInfo & {
    readonly start?: number;
    readonly end?: number;
    readonly value?: Array<number>;
}

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxRangeSliderOptions extends dxSliderBaseOptions<dxRangeSlider> {
    /**
     * The right edge of the interval currently selected using the range slider.
     */
    end?: number;
    /**
     * The value to be assigned to the name attribute of the underlying `` element.
     */
    endName?: string;
    /**
     * A function that is executed after the UI component&apos;s value is changed.
     */
    onValueChanged?: ((e: ValueChangedEvent) => void);
    /**
     * The left edge of the interval currently selected using the range slider.
     */
    start?: number;
    /**
     * The value to be assigned to the name attribute of the underlying `` element.
     */
    startName?: string;
    /**
     * Specifies the UI component&apos;s value.
     */
    value?: Array<number>;
}
/**
 * The RangeSlider is a UI component that allows an end user to choose a range of numeric values.
 */
export default class dxRangeSlider extends dxTrackBar {
    constructor(element: UserDefinedElement, options?: dxRangeSliderOptions)
}

export type Properties = dxRangeSliderOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type Options = dxRangeSliderOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type IOptions = dxRangeSliderOptions;
