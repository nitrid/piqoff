/**
* DevExtreme (animation/fx.d.ts)
* Version: 21.1.5
* Build date: Mon Aug 02 2021
*
* Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import {
    DxElement
} from '../core/element';

import {
    DxPromise
} from '../core/utils/deferred';

/**
 * Defines animation properties.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface animationConfig {
    /**
     * A function called after animation is completed.
     */
    complete?: (($element: DxElement, config: any) => void);
    /**
     * A number specifying wait time before animation execution.
     */
    delay?: number;
    /**
     * Specifies the animation direction for the &apos;slideIn&apos; and &apos;slideOut&apos; animation types.
     */
    direction?: 'bottom' | 'left' | 'right' | 'top';
    /**
     * A number specifying the time in milliseconds spent on animation.
     */
    duration?: number;
    /**
     * A string specifying the easing function for animation.
     */
    easing?: string;
    /**
     * Specifies the initial animation state.
     */
    from?: number | string | any;
    /**
     * A number specifying the time period to wait before the animation of the next stagger item starts.
     */
    staggerDelay?: number;
    /**
     * A function called before animation is started.
     */
    start?: (($element: DxElement, config: any) => void);
    /**
     * Specifies a final animation state.
     */
    to?: number | string | any;
    /**
     * A string value specifying the animation type.
     */
    type?: 'css' | 'fade' | 'fadeIn' | 'fadeOut' | 'pop' | 'slide' | 'slideIn' | 'slideOut';
}

/**
 * An object that serves as a namespace for the methods that are used to animate UI elements.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
declare const fx: {
    /**
     * Animates an element.
     */
    animate(element: Element, config: animationConfig): DxPromise<void>;

    /**
     * Checks whether an element is being animated.
     */
    isAnimating(element: Element): boolean;

    /**
     * Stops an element&apos;s animation.
     */
    stop(element: Element, jumpToEnd: boolean): void;
}
export default fx;
