/**
* DevExtreme (ui/switch.d.ts)
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

import Editor, {
    ValueChangedInfo,
    EditorOptions
} from './editor/editor';

export type ContentReadyEvent = EventInfo<dxSwitch>;

export type DisposingEvent = EventInfo<dxSwitch>;

export type InitializedEvent = InitializedEventInfo<dxSwitch>;

export type OptionChangedEvent = EventInfo<dxSwitch> & ChangedOptionInfo;

export type ValueChangedEvent = NativeEventInfo<dxSwitch> & ValueChangedInfo;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxSwitchOptions extends EditorOptions<dxSwitch> {
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
     * The value to be assigned to the `name` attribute of the underlying HTML element.
     */
    name?: string;
    /**
     * Specifies the text displayed when the UI component is switched off.
     */
    switchedOffText?: string;
    /**
     * Specifies the text displayed when the UI component is switched on.
     */
    switchedOnText?: string;
    /**
     * A Boolean value specifying whether the current switch state is &apos;On&apos; or &apos;Off&apos;.
     */
    value?: boolean;
}
/**
 * The Switch is a UI component that can be in two states: &apos;On&apos; and &apos;Off&apos;.
 */
export default class dxSwitch extends Editor {
    constructor(element: UserDefinedElement, options?: dxSwitchOptions)
}

export type Properties = dxSwitchOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type Options = dxSwitchOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type IOptions = dxSwitchOptions;
