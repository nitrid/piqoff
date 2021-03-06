/**
* DevExtreme (ui/scroll_view/ui.scrollable.d.ts)
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
    UserDefinedElement,
    DxElement
} from '../../core/element';

import {
    DxPromise
} from '../../core/utils/deferred';

import {
    NativeEventInfo
} from '../../events/index';

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface ScrollEventInfo<T = dxScrollable> extends NativeEventInfo<T> {
    readonly scrollOffset?: any;
    readonly reachedLeft?: boolean;
    readonly reachedRight?: boolean;
    readonly reachedTop?: boolean;
    readonly reachedBottom?: boolean;
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxScrollableOptions<T = dxScrollable> extends DOMComponentOptions<T> {
    /**
     * A Boolean value specifying whether to enable or disable the bounce-back effect.
     */
    bounceEnabled?: boolean;
    /**
     * A string value specifying the available scrolling directions.
     */
    direction?: 'both' | 'horizontal' | 'vertical';
    /**
     * Specifies whether the UI component responds to user interaction.
     */
    disabled?: boolean;
    /**
     * A function that is executed on each scroll gesture.
     */
    onScroll?: ((e: ScrollEventInfo<T>) => void);
    /**
     * A function that is executed each time the UI component is updated.
     */
    onUpdated?: ((e: ScrollEventInfo<T>) => void);
    /**
     * A Boolean value specifying whether or not an end-user can scroll the UI component content swiping it up or down. Applies only if useNative is false
     */
    scrollByContent?: boolean;
    /**
     * Specifies whether a user can scroll the content with the scrollbar. Applies only if useNative is false.
     */
    scrollByThumb?: boolean;
    /**
     * Specifies when the UI component shows the scrollbar.
     */
    showScrollbar?: 'onScroll' | 'onHover' | 'always' | 'never';
    /**
     * Indicates whether to use native or simulated scrolling.
     */
    useNative?: boolean;
}
/**
 * A UI component used to display scrollable content.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export default class dxScrollable extends DOMComponent {
    constructor(element: UserDefinedElement, options?: dxScrollableOptions)
    /**
     * Gets the UI component&apos;s height.
     */
    clientHeight(): number;
    /**
     * Gets the UI component&apos;s width.
     */
    clientWidth(): number;
    /**
     * Gets the UI component&apos;s content.
     */
    content(): DxElement;
    /**
     * Scrolls the content by a specific distance.
     */
    scrollBy(distance: number | any): void;
    /**
     * Gets the scrollable content&apos;s height in pixels.
     */
    scrollHeight(): number;
    /**
     * Gets the left scroll offset.
     */
    scrollLeft(): number;
    /**
     * Gets the scroll offset.
     */
    scrollOffset(): any;
    /**
     * Scrolls the content to a specific position.
     */
    scrollTo(targetLocation: number | any): void;
    /**
     * Scrolls content to an element.
     */
    scrollToElement(element: UserDefinedElement): void;
    /**
     * Gets the top scroll offset.
     */
    scrollTop(): number;
    /**
     * Gets the scrollable content&apos;s width in pixels.
     */
    scrollWidth(): number;
    /**
     * Updates the scrollable contents&apos; dimensions.
     */
    update(): DxPromise<void>;
}
