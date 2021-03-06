/**
* DevExtreme (ui/validation_summary.d.ts)
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

import CollectionWidget, {
    CollectionWidgetOptions
} from './collection/ui.collection_widget.base';

export type ContentReadyEvent = EventInfo<dxValidationSummary>;

export type DisposingEvent = EventInfo<dxValidationSummary>;

export type InitializedEvent = InitializedEventInfo<dxValidationSummary>;

export type ItemClickEvent = NativeEventInfo<dxValidationSummary> & ItemInfo;

export type OptionChangedEvent = EventInfo<dxValidationSummary> & ChangedOptionInfo;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxValidationSummaryOptions extends CollectionWidgetOptions<dxValidationSummary> {
    /**
     * Specifies the validation group for which summary should be generated.
     */
    validationGroup?: string;
}
/**
 * A UI component for displaying the result of checking validation rules for editors.
 */
export default class dxValidationSummary extends CollectionWidget {
    constructor(element: UserDefinedElement, options?: dxValidationSummaryOptions)
}

export type Properties = dxValidationSummaryOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type Options = dxValidationSummaryOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type IOptions = dxValidationSummaryOptions;
