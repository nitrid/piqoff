/**
* DevExtreme (ui/date_box.d.ts)
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
    ComponentDisabledDate,
    dxCalendarOptions
} from './calendar';

import dxDropDownEditor, {
    dxDropDownEditorOptions,
    DropDownButtonTemplateDataModel
} from './drop_down_editor/ui.drop_down_editor';

import {
    ValueChangedInfo
} from './editor/editor';

import {
    format
} from './widget/ui.widget';

export type ChangeEvent = NativeEventInfo<dxDateBox>;

export type ClosedEvent = EventInfo<dxDateBox>;

export type ContentReadyEvent = EventInfo<dxDateBox>;

export type CopyEvent = NativeEventInfo<dxDateBox>;

export type CutEvent = NativeEventInfo<dxDateBox>;

export type DisposingEvent = EventInfo<dxDateBox>;

export type EnterKeyEvent = NativeEventInfo<dxDateBox>;

export type FocusInEvent = NativeEventInfo<dxDateBox>;

export type FocusOutEvent = NativeEventInfo<dxDateBox>;

export type InitializedEvent = InitializedEventInfo<dxDateBox>;

export type InputEvent = NativeEventInfo<dxDateBox>;

export type KeyDownEvent = NativeEventInfo<dxDateBox>;

export type KeyPressEvent = NativeEventInfo<dxDateBox>;

export type KeyUpEvent = NativeEventInfo<dxDateBox>;

export type OpenedEvent = EventInfo<dxDateBox>;

export type OptionChangedEvent = EventInfo<dxDateBox> & ChangedOptionInfo;

export type PasteEvent = NativeEventInfo<dxDateBox>;

export type ValueChangedEvent = NativeEventInfo<dxDateBox> & ValueChangedInfo;

export type DisabledDate = ComponentDisabledDate<dxDateBox>;

export type DropDownButtonTemplateData = DropDownButtonTemplateDataModel;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxDateBoxOptions extends dxDropDownEditorOptions<dxDateBox> {
    /**
     * Specifies whether or not adaptive UI component rendering is enabled on a small screen.
     */
    adaptivityEnabled?: boolean;
    /**
     * The text displayed on the Apply button.
     */
    applyButtonText?: string;
    /**
     * Configures the calendar&apos;s value picker. Applies only if the pickerType is &apos;calendar&apos;.
     */
    calendarOptions?: dxCalendarOptions;
    /**
     * The text displayed on the Cancel button.
     */
    cancelButtonText?: string;
    /**
     * Specifies the message displayed if the specified date is later than the max value or earlier than the min value.
     */
    dateOutOfRangeMessage?: string;
    /**
     * Specifies the date-time value serialization format. Use it only if you do not specify the value at design time.
     */
    dateSerializationFormat?: string;
    /**
     * Specifies dates that users cannot select. Applies only if pickerType is &apos;calendar&apos;.
     */
    disabledDates?: Array<Date> | ((data: DisabledDate) => boolean);
    /**
     * Specifies the date display format. Ignored if the pickerType property is &apos;native&apos;
     */
    displayFormat?: format;
    /**
     * Specifies the interval between neighboring values in the popup list in minutes.
     */
    interval?: number;
    /**
     * Specifies the message displayed if the typed value is not a valid date or time.
     */
    invalidDateMessage?: string;
    /**
     * The last date that can be selected within the UI component.
     */
    max?: Date | number | string;
    /**
     * The minimum date that can be selected within the UI component.
     */
    min?: Date | number | string;
    /**
     * Specifies the type of the date/time picker.
     */
    pickerType?: 'calendar' | 'list' | 'native' | 'rollers';
    /**
     * Specifies a placeholder for the input field.
     */
    placeholder?: string;
    /**
     * Specifies whether to show the analog clock in the value picker. Applies only if type is &apos;datetime&apos; and pickerType is &apos;calendar&apos;.
     */
    showAnalogClock?: boolean;
    /**
     * A format used to display date/time information.
     */
    type?: 'date' | 'datetime' | 'time';
    /**
     * Specifies whether to control user input using a mask created based on the displayFormat.
     */
    useMaskBehavior?: boolean;
    /**
     * An object or a value specifying the date and time currently selected using the date box.
     */
    value?: Date | number | string;
}
/**
 * The DateBox is a UI component that displays date and time in a specified format, and enables a user to pick or type in the required date/time value.
 */
export default class dxDateBox extends dxDropDownEditor {
    constructor(element: UserDefinedElement, options?: dxDateBoxOptions)
    /**
     * Closes the drop-down editor.
     */
    close(): void;
    /**
     * Opens the drop-down editor.
     */
    open(): void;
}

export type Properties = dxDateBoxOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type Options = dxDateBoxOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type IOptions = dxDateBoxOptions;
