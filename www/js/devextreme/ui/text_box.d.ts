/**
* DevExtreme (ui/text_box.d.ts)
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

import dxTextEditor, {
    dxTextEditorOptions
} from './text_box/ui.text_editor.base';

export type ChangeEvent = NativeEventInfo<dxTextBox>;

export type ContentReadyEvent = EventInfo<dxTextBox>;

export type CopyEvent = NativeEventInfo<dxTextBox>;

export type CutEvent = NativeEventInfo<dxTextBox>;

export type DisposingEvent = EventInfo<dxTextBox>;

export type EnterKeyEvent = NativeEventInfo<dxTextBox>;

export type FocusInEvent = NativeEventInfo<dxTextBox>;

export type FocusOutEvent = NativeEventInfo<dxTextBox>;

export type InitializedEvent = InitializedEventInfo<dxTextBox>;

export type InputEvent = NativeEventInfo<dxTextBox>;

export type KeyDownEvent = NativeEventInfo<dxTextBox>;

export type KeyPressEvent = NativeEventInfo<dxTextBox>;

export type KeyUpEvent = NativeEventInfo<dxTextBox>;

export type OptionChangedEvent = EventInfo<dxTextBox> & ChangedOptionInfo;

export type PasteEvent = NativeEventInfo<dxTextBox>;

export type ValueChangedEvent = NativeEventInfo<dxTextBox> & ValueChangedInfo;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxTextBoxOptions<T = dxTextBox> extends dxTextEditorOptions<T> {
    /**
     * Specifies the maximum number of characters you can enter into the textbox.
     */
    maxLength?: string | number;
    /**
     * The &apos;mode&apos; attribute value of the actual HTML input element representing the text box.
     */
    mode?: 'email' | 'password' | 'search' | 'tel' | 'text' | 'url';
    /**
     * Specifies a value the UI component displays.
     */
    value?: string;
}
/**
 * The TextBox is a UI component that enables a user to enter and edit a single line of text.
 */
export default class dxTextBox extends dxTextEditor {
    constructor(element: UserDefinedElement, options?: dxTextBoxOptions)
}

export type Properties = dxTextBoxOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type Options = dxTextBoxOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type IOptions = dxTextBoxOptions;
