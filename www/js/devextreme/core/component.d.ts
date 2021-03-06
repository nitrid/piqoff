/**
* DevExtreme (core/component.d.ts)
* Version: 21.1.5
* Build date: Mon Aug 02 2021
*
* Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import {
  DxElement
} from './element';

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface ComponentOptions<T = Component> {
  /**
   * A function that is executed before the UI component is disposed of.
   */
  onDisposing?: ((e: { component: T }) => void);
  /**
   * A function used in JavaScript frameworks to save the UI component instance.
   */
  onInitialized?: ((e: { component?: T, element?: DxElement }) => void);
  /**
   * A function that is executed after a UI component property is changed.
   */
  onOptionChanged?: ((e: { component?: T, name?: string, fullName?: string, value?: any }) => void);
}
/**
 * A base class for all components and UI components.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export class Component {
  constructor(options?: ComponentOptions);
  /**
   * Prevents the UI component from refreshing until the endUpdate() method is called.
   */
  beginUpdate(): void;
  /**
   * Refreshes the UI component after a call of the beginUpdate() method.
   */
  endUpdate(): void;
  /**
   * Gets the UI component&apos;s instance. Use it to access other methods of the UI component.
   */
  instance(): this;
  /**
   * Detaches all event handlers from a single event.
   */
  off(eventName: string): this;
  /**
   * Detaches a particular event handler from a single event.
   */
  off(eventName: string, eventHandler: Function): this;
  /**
   * Subscribes to an event.
   */
  on(eventName: string, eventHandler: Function): this;
  /**
   * Subscribes to events.
   */
  on(events: any): this;
  /**
   * Gets all UI component properties.
   */
  option(): any;
  /**
   * Gets the value of a single property.
   */
  option(optionName: string): any;
  /**
   * Updates the value of a single property.
   */
  option(optionName: string, optionValue: any): void;
  /**
   * Updates the values of several properties.
   */
  option(options: any): void;
  /**
   * Resets an property to its default value.
   */
  resetOption(optionName: string): void;
}
