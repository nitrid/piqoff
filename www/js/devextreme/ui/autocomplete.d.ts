/**
* DevExtreme (ui/autocomplete.d.ts)
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
    ChangedOptionInfo,
    ItemInfo
} from '../events/index';

import dxDropDownList, {
    dxDropDownListOptions,
    SelectionChangedInfo
} from './drop_down_editor/ui.drop_down_list';

import {
    DropDownButtonTemplateDataModel
} from './drop_down_editor/ui.drop_down_editor';

import {
    ValueChangedInfo
} from './editor/editor';

export type ChangeEvent = NativeEventInfo<dxAutocomplete>;

export type ClosedEvent = EventInfo<dxAutocomplete>;

export type ContentReadyEvent = EventInfo<dxAutocomplete>;

export type CopyEvent = NativeEventInfo<dxAutocomplete>;

export type CutEvent = NativeEventInfo<dxAutocomplete>;

export type DisposingEvent = EventInfo<dxAutocomplete>;

export type EnterKeyEvent = NativeEventInfo<dxAutocomplete>;

export type FocusInEvent = NativeEventInfo<dxAutocomplete>;

export type FocusOutEvent = NativeEventInfo<dxAutocomplete>;

export type InitializedEvent = InitializedEventInfo<dxAutocomplete>;

export type InputEvent = NativeEventInfo<dxAutocomplete>;

export type ItemClickEvent = NativeEventInfo<dxAutocomplete> & ItemInfo;

export type KeyDownEvent = NativeEventInfo<dxAutocomplete>;

export type KeyPressEvent = NativeEventInfo<dxAutocomplete>;

export type KeyUpEvent = NativeEventInfo<dxAutocomplete>;

export type OpenedEvent = EventInfo<dxAutocomplete>;

export type OptionChangedEvent = EventInfo<dxAutocomplete> & ChangedOptionInfo;

export type PasteEvent = NativeEventInfo<dxAutocomplete>;

export type SelectionChangedEvent = EventInfo<dxAutocomplete> & SelectionChangedInfo;

export type ValueChangedEvent = NativeEventInfo<dxAutocomplete> & ValueChangedInfo;

export type DropDownButtonTemplateData = DropDownButtonTemplateDataModel;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxAutocompleteOptions extends dxDropDownListOptions<dxAutocomplete> {
    /**
     * Specifies the maximum count of items displayed by the UI component.
     */
    maxItemCount?: number;
    /**
     * The minimum number of characters that must be entered into the text box to begin a search.
     */
    minSearchLength?: number;
    /**
     * Specifies whether the drop-down button is visible.
     */
    showDropDownButton?: boolean;
    /**
     * Specifies the current value displayed by the UI component.
     */
    value?: string;
}
/**
 * The Autocomplete UI component is a textbox that provides suggestions while a user types into it.
 */
export default class dxAutocomplete extends dxDropDownList {
    constructor(element: UserDefinedElement, options?: dxAutocompleteOptions)
}

export type Properties = dxAutocompleteOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type Options = dxAutocompleteOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type IOptions = dxAutocompleteOptions;
