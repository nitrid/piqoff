/**
* DevExtreme (ui/text_box/ui.text_editor.base.d.ts)
* Version: 21.1.5
* Build date: Mon Aug 02 2021
*
* Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import {
    UserDefinedElement
} from '../../core/element';

import {
    NativeEventInfo
} from '../../events/index';

import dxButton, {
    dxButtonOptions
} from '../button';

import Editor, {
    EditorOptions
} from '../editor/editor';

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxTextEditorOptions<T = dxTextEditor> extends EditorOptions<T> {
    /**
     * Allows you to add custom buttons to the input text field.
     */
    buttons?: Array<string | 'clear' | dxTextEditorButton>;
    /**
     * Specifies whether the UI component can be focused using keyboard navigation.
     */
    focusStateEnabled?: boolean;
    /**
     * Specifies whether the UI component changes its state when a user pauses on it.
     */
    hoverStateEnabled?: boolean;
    /**
     * Specifies the attributes to be passed on to the underlying HTML element.
     */
    inputAttr?: any;
    /**
     * The editor mask that specifies the custom format of the entered string.
     */
    mask?: string;
    /**
     * Specifies a mask placeholder. A single character is recommended.
     */
    maskChar?: string;
    /**
     * A message displayed when the entered text does not match the specified pattern.
     */
    maskInvalidMessage?: string;
    /**
     * Specifies custom mask rules.
     */
    maskRules?: any;
    /**
     * The value to be assigned to the `name` attribute of the underlying HTML element.
     */
    name?: string;
    /**
     * A function that is executed when the UI component loses focus after the text field&apos;s content was changed using the keyboard.
     */
    onChange?: ((e: NativeEventInfo<T>) => void);
    /**
     * A function that is executed when the UI component&apos;s input has been copied.
     */
    onCopy?: ((e: NativeEventInfo<T>) => void);
    /**
     * A function that is executed when the UI component&apos;s input has been cut.
     */
    onCut?: ((e: NativeEventInfo<T>) => void);
    /**
     * A function that is executed when the Enter key has been pressed while the UI component is focused.
     */
    onEnterKey?: ((e: NativeEventInfo<T>) => void);
    /**
     * A function that is executed when the UI component gets focus.
     */
    onFocusIn?: ((e: NativeEventInfo<T>) => void);
    /**
     * A function that is executed when the UI component loses focus.
     */
    onFocusOut?: ((e: NativeEventInfo<T>) => void);
    /**
     * A function that is executed each time the UI component&apos;s input is changed while the UI component is focused.
     */
    onInput?: ((e: NativeEventInfo<T>) => void);
    /**
     * A function that is executed when a user is pressing a key on the keyboard.
     */
    onKeyDown?: ((e: NativeEventInfo<T>) => void);
    /**
     * A function that is executed when a user presses a key on the keyboard.
     * @deprecated The `keyPress` event is removed from the web standards and will be deprecated in modern browsers soon. Refer to the MDN topic for details.
     */
    onKeyPress?: ((e: NativeEventInfo<T>) => void);
    /**
     * A function that is executed when a user releases a key on the keyboard.
     */
    onKeyUp?: ((e: NativeEventInfo<T>) => void);
    /**
     * A function that is executed when the UI component&apos;s input has been pasted.
     */
    onPaste?: ((e: NativeEventInfo<T>) => void);
    /**
     * The text displayed by the UI component when the UI component value is empty.
     */
    placeholder?: string;
    /**
     * Specifies whether to display the Clear button in the UI component.
     */
    showClearButton?: boolean;
    /**
     * Specifies when the UI component shows the mask. Applies only if useMaskedValue is true.
     */
    showMaskMode?: 'always' | 'onFocus';
    /**
     * Specifies whether or not the UI component checks the inner text for spelling mistakes.
     */
    spellcheck?: boolean;
    /**
     * Specifies how the UI component&apos;s text field is styled.
     */
    stylingMode?: 'outlined' | 'underlined' | 'filled';
    /**
     * The read-only property that holds the text displayed by the UI component input element.
     */
    text?: string;
    /**
     * Specifies whether the value should contain mask characters or not.
     */
    useMaskedValue?: boolean;
    /**
     * Specifies the current value displayed by the UI component.
     */
    value?: any;
    /**
     * Specifies the DOM events after which the UI component&apos;s value should be updated.
     */
    valueChangeEvent?: string;
}
/**
 * A base class for text editing UI components.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export default class dxTextEditor extends Editor {
    constructor(element: UserDefinedElement, options?: dxTextEditorOptions)
    /**
     * Removes focus from the input element.
     */
    blur(): void;
    /**
     * Sets focus to the input element representing the UI component.
     */
    focus(): void;
    /**
     * Gets an instance of a custom action button.
     */
    getButton(name: string): dxButton | undefined;
}

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxTextEditorButton {
    /**
     * Specifies whether to place the button before or after the input text field.
     */
    location?: 'after' | 'before';
    /**
     * Specifies the button&apos;s name.
     */
    name?: string;
    /**
     * Configures the Button UI component used as the action button.
     */
    options?: dxButtonOptions;
}
