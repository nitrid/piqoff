/**
* DevExtreme (events/core/events_engine.d.ts)
* Version: 21.1.5
* Build date: Mon Aug 02 2021
*
* Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
type EventsEngineType = {
    on: (element: any, eventName: any, handler: any) => void;
    off: (element: any, eventName: any, handler: any) => void;
    set: (eventEngine: any) => void;
};
/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
declare const eventsEngine: EventsEngineType;
/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export declare function set(eventEngine: any): void;
export default eventsEngine;
