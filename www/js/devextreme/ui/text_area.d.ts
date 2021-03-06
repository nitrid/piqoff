/**
* DevExtreme (ui/text_area.d.ts)
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

import dxTextBox, {
    dxTextBoxOptions
} from './text_box';

export type ChangeEvent = NativeEventInfo<dxTextArea>;

export type ContentReadyEvent = EventInfo<dxTextArea>;

export type CopyEvent = NativeEventInfo<dxTextArea>;

export type CutEvent = NativeEventInfo<dxTextArea>;

export type DisposingEvent = EventInfo<dxTextArea>;

export type EnterKeyEvent = NativeEventInfo<dxTextArea>;

export type FocusInEvent = NativeEventInfo<dxTextArea>;

export type FocusOutEvent = NativeEventInfo<dxTextArea>;

export type InitializedEvent = InitializedEventInfo<dxTextArea>;

export type InputEvent = NativeEventInfo<dxTextArea>;

export type KeyDownEvent = NativeEventInfo<dxTextArea>;

export type KeyPressEvent = NativeEventInfo<dxTextArea>;

export type KeyUpEvent = NativeEventInfo<dxTextArea>;

export type OptionChangedEvent = EventInfo<dxTextArea> & ChangedOptionInfo;

export type PasteEvent = NativeEventInfo<dxTextArea>;

export type ValueChangedEvent = NativeEventInfo<dxTextArea> & ValueChangedInfo;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxTextAreaOptions extends dxTextBoxOptions<dxTextArea> {
    /**
     * A Boolean value specifying whether or not the auto resizing mode is enabled.
     */
    autoResizeEnabled?: boolean;
    /**
     * Specifies the maximum height of the UI component.
     */
    maxHeight?: number | string;
    /**
     * Specifies the minimum height of the UI component.
     */
    minHeight?: number | string;
    /**
     * Specifies whether or not the UI component checks the inner text for spelling mistakes.
     */
    spellcheck?: boolean;
}
/**
 * The TextArea is a UI component that enables a user to enter and edit a multi-line text.
 */
export default class dxTextArea extends dxTextBox {
    constructor(element: UserDefinedElement, options?: dxTextAreaOptions)
}

export type Properties = dxTextAreaOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type Options = dxTextAreaOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type IOptions = dxTextAreaOptions;
