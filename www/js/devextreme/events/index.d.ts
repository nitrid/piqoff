/**
* DevExtreme (events/index.d.ts)
* Version: 21.1.5
* Build date: Mon Aug 02 2021
*
* Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import {
    DxElement
} from '../core/element';

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface EventExtension { }
/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface EventType { }
/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type DxEvent = {} extends EventType ? EventObject : EventType;

export interface InitializedEventInfo<T> {
    readonly component?: T;
    readonly element?: DxElement;
}

export interface EventInfo<T> {
    readonly component: T;
    readonly element: DxElement;
    readonly model?: any;
}

export interface NativeEventInfo<T> {
    readonly component: T;
    readonly element: DxElement;
    readonly model?: any;
    readonly event?: DxEvent;
}

export interface ChangedOptionInfo {
    readonly name: string;
    readonly fullName: string;
    readonly value?: any;
    readonly previousValue?: any;
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface ItemInfo {
    readonly itemData?: any;
    readonly itemElement: DxElement;
    readonly itemIndex: number;
}

export interface Cancelable {
    cancel?: boolean;
}

/**
 * @deprecated EventObject
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type dxEvent = EventObject;

/**
 * Describes EventObject, a counterpart of the jQuery.Event to be used without jQuery.
 */
export class EventObject {
    /**
     * The DOM element within the current event propagation stage.
     */
    currentTarget: Element;
    /**
     * Data passed to the event handler.
     */
    data: any;
    /**
     * The DOM element to which the currently-called event handler was attached.
     */
    delegateTarget: Element;
    /**
     * The DOM element that initiated the event.
     */
    target: Element;
    /**
     * Checks if the preventDefault() method was called on this event object.
     */
    isDefaultPrevented(): boolean;
    /**
     * Checks if the stopImmediatePropagation() method was called on this event object.
     */
    isImmediatePropagationStopped(): boolean;
    /**
     * Checks if the stopPropagation() method was called on this event object.
     */
    isPropagationStopped(): boolean;
    /**
     * Prevents the event&apos;s default action from triggering.
     */
    preventDefault(): void;
    /**
     * Stops the event&apos;s propagation up the DOM tree, preventing the rest of the handlers from being executed.
     */
    stopImmediatePropagation(): void;
    /**
     * Stops the event&apos;s propagation up the DOM tree, keeping parent handlers unnotified of the event.
     */
    stopPropagation(): void;
}

/**
 * 
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type event = DxEvent;

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export function eventsHandler(event: DxEvent, extraParameters: any): boolean;

/**
 * Detaches all handlers from the specified elements.
 */
export function off(element: Element | Array<Element>): void;

/**
 * Detaches all handlers of the specified event from the specified elements.
 */
export function off(element: Element | Array<Element>, eventName: string): void;

/**
 * Detaches an event handler from the specified elements.
 */
export function off(element: Element | Array<Element>, eventName: string, handler: Function): void;

/**
 * Detaches all event handlers of the specified type attached using the on(element, eventName, selector, data, handler) or on(element, eventName, selector, handler) method.
 */
export function off(element: Element | Array<Element>, eventName: string, selector: string): void;

/**
 * Detaches the specified event handler attached using the on(element, eventName, selector, data, handler) or on(element, eventName, selector, handler) method.
 */
export function off(element: Element | Array<Element>, eventName: string, selector: string, handler: Function): void;

/**
 * Attaches an event handler to the specified elements. Allows you to pass custom data to the handler.
 */
export function on(element: Element | Array<Element>, eventName: string, data: any, handler: Function): void;

/**
 * Attaches an event handler to the specified elements.
 */
export function on(element: Element | Array<Element>, eventName: string, handler: Function): void;

/**
 * Attaches an event handler to the specified elements&apos; descendants. Allows you to pass custom data to the handler.
 */
export function on(element: Element | Array<Element>, eventName: string, selector: string, data: any, handler: Function): void;

/**
 * Attaches an event handler to the specified elements&apos; descendants.
 */
export function on(element: Element | Array<Element>, eventName: string, selector: string, handler: Function): void;

/**
 * Attaches an event handler that is executed only once to the specified elements. Allows you to pass custom data to the handler.
 */
export function one(element: Element | Array<Element>, eventName: string, data: any, handler: Function): void;

/**
 * Attaches an event handler that is executed only once to the specified elements.
 */
export function one(element: Element | Array<Element>, eventName: string, handler: Function): void;

/**
 * Attaches an event handler that is executed only once to the specified elements&apos; descendants. Allows you to pass custom data to the handler.
 */
export function one(element: Element | Array<Element>, eventName: string, selector: string, data: any, handler: Function): void;

/**
 * Attaches an event handler that is executed only once to the specified elements&apos; descendants.
 */
export function one(element: Element | Array<Element>, eventName: string, selector: string, handler: Function): void;

/**
 * Triggers an event for the specified elements.
 */
export function trigger(element: Element | Array<Element>, event: string | DxEvent): void;

/**
 * Triggers an event for the specified elements. Allows you to pass custom parameters to event handlers.
 */
export function trigger(element: Element | Array<Element>, event: string | DxEvent, extraParameters: any): void;

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export function triggerHandler(element: Element | Array<Element>, event: string | DxEvent): void;

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export function triggerHandler(element: Element | Array<Element>, event: string | DxEvent, extraParameters: any): void;
