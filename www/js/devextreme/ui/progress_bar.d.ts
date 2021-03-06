/**
* DevExtreme (ui/progress_bar.d.ts)
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

export type CompleteEvent = NativeEventInfo<dxProgressBar>;

export type ContentReadyEvent = EventInfo<dxProgressBar>;

export type DisposingEvent = EventInfo<dxProgressBar>;

export type InitializedEvent = InitializedEventInfo<dxProgressBar>;

export type OptionChangedEvent = EventInfo<dxProgressBar> & ChangedOptionInfo;

export type ValueChangedEvent = NativeEventInfo<dxProgressBar> & ValueChangedInfo;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxProgressBarOptions extends dxTrackBarOptions<dxProgressBar> {
    /**
     * A function that is executed when the value reaches the maximum.
     */
    onComplete?: ((e: CompleteEvent) => void);
    /**
     * Specifies whether or not the UI component displays a progress status.
     */
    showStatus?: boolean;
    /**
     * Specifies a format for the progress status.
     */
    statusFormat?: string | ((ratio: number, value: number) => string);
    /**
     * The current UI component value.
     */
    value?: number;
}
/**
 * The ProgressBar is a UI component that shows current progress.
 */
export default class dxProgressBar extends dxTrackBar {
    constructor(element: UserDefinedElement, options?: dxProgressBarOptions)
}

export type Properties = dxProgressBarOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type Options = dxProgressBarOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type IOptions = dxProgressBarOptions;
