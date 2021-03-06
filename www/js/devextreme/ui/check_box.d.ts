/**
* DevExtreme (ui/check_box.d.ts)
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
    EditorOptions,
    ValueChangedInfo
} from './editor/editor';

export type ContentReadyEvent = EventInfo<dxCheckBox>;

export type DisposingEvent = EventInfo<dxCheckBox>;

export type InitializedEvent = InitializedEventInfo<dxCheckBox>;

export type OptionChangedEvent = EventInfo<dxCheckBox> & ChangedOptionInfo;

export type ValueChangedEvent = NativeEventInfo<dxCheckBox> & ValueChangedInfo;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxCheckBoxOptions extends EditorOptions<dxCheckBox> {
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
     * Specifies the text displayed by the check box.
     */
    text?: string;
    /**
     * Specifies the UI component state.
     */
    value?: boolean | undefined;
}
/**
 * The CheckBox is a small box, which when selected by the end user, shows that a particular feature has been enabled or a specific property has been chosen.
 */
export default class dxCheckBox extends Editor {
    constructor(element: UserDefinedElement, options?: dxCheckBoxOptions)
}

export type Properties = dxCheckBoxOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type Options = dxCheckBoxOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type IOptions = dxCheckBoxOptions;
