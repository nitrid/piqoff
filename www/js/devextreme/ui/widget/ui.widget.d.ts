/**
* DevExtreme (ui/widget/ui.widget.d.ts)
* Version: 21.1.5
* Build date: Mon Aug 02 2021
*
* Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import DOMComponent, {
    DOMComponentOptions
} from '../../core/dom_component';

import {
    UserDefinedElement
} from '../../core/element';

import {
    EventInfo
} from '../../events/index';

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface WidgetOptions<T = Widget> extends DOMComponentOptions<T> {
    /**
     * Specifies the shortcut key that sets focus on the UI component.
     */
    accessKey?: string;
    /**
     * Specifies whether or not the UI component changes its state when interacting with a user.
     */
    activeStateEnabled?: boolean;
    /**
     * Specifies whether the UI component responds to user interaction.
     */
    disabled?: boolean;
    /**
     * Specifies whether the UI component can be focused using keyboard navigation.
     */
    focusStateEnabled?: boolean;
    /**
     * Specifies text for a hint that appears when a user pauses on the UI component.
     */
    hint?: string;
    /**
     * Specifies whether the UI component changes its state when a user pauses on it.
     */
    hoverStateEnabled?: boolean;
    /**
     * A function that is executed when the UI component&apos;s content is ready and each time the content is changed.
     */
    onContentReady?: ((e: EventInfo<T>) => void);
    /**
     * Specifies the number of the element when the Tab key is used for navigating.
     */
    tabIndex?: number;
    /**
     * Specifies whether the UI component is visible.
     */
    visible?: boolean;
}
/**
 * The base class for UI components.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export default class Widget extends DOMComponent {
    constructor(element: UserDefinedElement, options?: WidgetOptions)
    /**
     * Sets focus on the UI component.
     */
    focus(): void;
    /**
     * Registers a handler to be executed when a user presses a specific key.
     */
    registerKeyHandler(key: string, handler: Function): void;
    /**
     * Repaints the UI component without reloading data. Call it to update the UI component&apos;s markup.
     */
    repaint(): void;
}

/**
 * Specifies markup for a UI component item.
 */
export var dxItem: any;

/**
 * Formats values.
 */
export type format = 'billions' | 'currency' | 'day' | 'decimal' | 'exponential' | 'fixedPoint' | 'largeNumber' | 'longDate' | 'longTime' | 'millions' | 'millisecond' | 'month' | 'monthAndDay' | 'monthAndYear' | 'percent' | 'quarter' | 'quarterAndYear' | 'shortDate' | 'shortTime' | 'thousands' | 'trillions' | 'year' | 'dayOfWeek' | 'hour' | 'longDateLongTime' | 'minute' | 'second' | 'shortDateShortTime' | string | ((value: number | Date) => string) | {
  /**
   * Specifies a 3-letter ISO 4217 code for currency. Applies only if the type is &apos;currency&apos;.
   */
  currency?: string,
  /**
   * A function that converts numeric or date-time values to a string.
   */
  formatter?: ((value: number | Date) => string),
  /**
   * Parses string values into numeric or date-time values. Can be used with formatter or one of the predefined formats.
   */
  parser?: ((value: string) => number | Date),
  /**
   * Specifies a precision for values of a numeric format.
   */
  precision?: number,
  /**
   * Specifies a predefined format. Does not apply if you have specified the formatter function.
   */
  type?: 'billions' | 'currency' | 'day' | 'decimal' | 'exponential' | 'fixedPoint' | 'largeNumber' | 'longDate' | 'longTime' | 'millions' | 'millisecond' | 'month' | 'monthAndDay' | 'monthAndYear' | 'percent' | 'quarter' | 'quarterAndYear' | 'shortDate' | 'shortTime' | 'thousands' | 'trillions' | 'year' | 'dayOfWeek' | 'hour' | 'longDateLongTime' | 'minute' | 'second' | 'shortDateShortTime' | string
};
