/**
* DevExtreme (ui/slider.d.ts)
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

import dxTrackBar, {
    dxTrackBarOptions
} from './track_bar';

import {
    format
} from './widget/ui.widget';

export type ContentReadyEvent = EventInfo<dxSlider>;

export type DisposingEvent = EventInfo<dxSlider>;

export type InitializedEvent = InitializedEventInfo<dxSlider>;

export type OptionChangedEvent = EventInfo<dxSlider> & ChangedOptionInfo;

export type ValueChangedEvent = NativeEventInfo<dxSlider> & ValueChangedInfo;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxSliderOptions extends dxSliderBaseOptions<dxSlider> {
    /**
     * The current slider value.
     */
    value?: number;
}
/**
 * The Slider is a UI component that allows an end user to set a numeric value on a continuous range of possible values.
 */
export default class dxSlider extends dxTrackBar {
    constructor(element: UserDefinedElement, options?: dxSliderOptions)
}

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxSliderBaseOptions<T> extends dxTrackBarOptions<T> {
    /**
     * Specifies whether or not the UI component changes its state when interacting with a user.
     */
    activeStateEnabled?: boolean;
    /**
     * Specifies whether the UI component can be focused using keyboard navigation.
     */
    focusStateEnabled?: boolean;
    /**
     * Specifies whether the UI component changes its state when a user pauses on it.
     */
    hoverStateEnabled?: boolean;
    /**
     * Specifies the step by which a handle moves when a user presses Page Up or Page Down.
     */
    keyStep?: number;
    /**
     * Configures the labels displayed at the min and max values.
     */
    label?: {
      /**
       * Formats a value before it is displayed in a label.
       */
      format?: format,
      /**
       * Specifies whether labels are over or under the scale.
       */
      position?: 'bottom' | 'top',
      /**
       * Specifies whether slider labels are visible.
       */
      visible?: boolean
    };
    /**
     * The value to be assigned to the `name` attribute of the underlying HTML element.
     */
    name?: string;
    /**
     * Specifies whether to highlight the selected range.
     */
    showRange?: boolean;
    /**
     * Specifies the step by which the UI component&apos;s value changes when a user drags a handler.
     */
    step?: number;
    /**
     * Configures a tooltip.
     */
    tooltip?: {
      /**
       * Specifies whether a tooltip is enabled.
       */
      enabled?: boolean,
      /**
       * Specifies a tooltip&apos;s display format.
       */
      format?: format,
      /**
       * Specifies whether a tooltip is over or under the slider.
       */
      position?: 'bottom' | 'top',
      /**
       * Specifies when the UI component shows a tooltip.
       */
      showMode?: 'always' | 'onHover'
    };
}

export type Properties = dxSliderOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type Options = dxSliderOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type IOptions = dxSliderOptions;
