/**
* DevExtreme (ui/editor/editor.d.ts)
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

import Widget, {
    WidgetOptions
} from '../widget/ui.widget';

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface ValueChangedInfo {
    readonly previousValue?: any;
    readonly value?: any;
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface EditorOptions<T = Editor> extends WidgetOptions<T> {
    /**
     * Specifies or indicates whether the editor&apos;s value is valid.
     */
    isValid?: boolean;
    /**
     * A function that is executed after the UI component&apos;s value is changed.
     */
    onValueChanged?: ((e: NativeEventInfo<T> & ValueChangedInfo) => void);
    /**
     * Specifies whether the editor is read-only.
     */
    readOnly?: boolean;
    /**
     * Information on the broken validation rule. Contains the first item from the validationErrors array.
     */
    validationError?: any;
    /**
     * An array of the validation rules that failed.
     */
    validationErrors?: Array<any>;
    /**
     * Specifies how the message about the validation rules that are not satisfied by this editor&apos;s value is displayed.
     */
    validationMessageMode?: 'always' | 'auto';
    /**
     * Indicates or specifies the current validation status.
     */
    validationStatus?: 'valid' | 'invalid' | 'pending';
    /**
     * Specifies the UI component&apos;s value.
     */
    value?: any;
    /**
     * 
     */
    stylingMode?: 'outlined' | 'underlined' | 'filled';
}
/**
 * A base class for editors.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export default class Editor extends Widget {
    constructor(element: UserDefinedElement, options?: EditorOptions)
    /**
     * Resets the value property to the default value.
     */
    reset(): void;
}
