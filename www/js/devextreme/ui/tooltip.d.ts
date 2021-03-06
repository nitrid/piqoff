/**
* DevExtreme (ui/tooltip.d.ts)
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
    Cancelable,
    EventInfo,
    InitializedEventInfo,
    ChangedOptionInfo
} from '../events/index';

import dxPopover, {
    dxPopoverOptions
} from './popover';

export type ContentReadyEvent = EventInfo<dxTooltip>;

export type DisposingEvent = EventInfo<dxTooltip>;

export type HidingEvent = Cancelable & EventInfo<dxTooltip>;

export type HiddenEvent = EventInfo<dxTooltip>;

export type InitializedEvent = InitializedEventInfo<dxTooltip>;

export type OptionChangedEvent = EventInfo<dxTooltip> & ChangedOptionInfo;

export type ShowingEvent = EventInfo<dxTooltip>;

export type ShownEvent = EventInfo<dxTooltip>;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxTooltipOptions extends dxPopoverOptions<dxTooltip> {
}
/**
 * The Tooltip UI component displays a tooltip for a specified element on the page.
 */
export default class dxTooltip extends dxPopover {
    constructor(element: UserDefinedElement, options?: dxTooltipOptions)
}

export type Properties = dxTooltipOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type Options = dxTooltipOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type IOptions = dxTooltipOptions;
