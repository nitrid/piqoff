/**
* DevExtreme (ui/overlay.d.ts)
* Version: 21.1.5
* Build date: Mon Aug 02 2021
*
* Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import {
    animationConfig
} from '../animation/fx';

import {
    UserDefinedElement,
    DxElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import {
    DxPromise
} from '../core/utils/deferred';

import {
    DxEvent,
    Cancelable,
    EventInfo
} from '../events/index';

import Widget, {
    WidgetOptions
} from './widget/ui.widget';

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxOverlayOptions<T = dxOverlay> extends WidgetOptions<T> {
    /**
     * Configures UI component visibility animations. This object contains two fields: show and hide.
     */
    animation?: dxOverlayAnimation;
    /**
     * Specifies whether to close the UI component if a user clicks outside it.
     */
    closeOnOutsideClick?: boolean | ((event: DxEvent) => boolean);
    /**
     * Specifies a custom template for the UI component content.
     */
    contentTemplate?: template | ((contentElement: DxElement) => string | UserDefinedElement);
    /**
     * Specifies whether to render the UI component&apos;s content when it is displayed. If false, the content is rendered immediately.
     */
    deferRendering?: boolean;
    /**
     * Specifies whether or not an end-user can drag the UI component.
     */
    dragEnabled?: boolean;
    /**
     * Specifies the UI component&apos;s height in pixels.
     */
    height?: number | string | (() => number | string);
    /**
     * Specifies the maximum height the UI component can reach while resizing.
     */
    maxHeight?: number | string | (() => number | string);
    /**
     * Specifies the maximum width the UI component can reach while resizing.
     */
    maxWidth?: number | string | (() => number | string);
    /**
     * Specifies the minimum height the UI component can reach while resizing.
     */
    minHeight?: number | string | (() => number | string);
    /**
     * Specifies the minimum width the UI component can reach while resizing.
     */
    minWidth?: number | string | (() => number | string);
    /**
     * A function that is executed after the UI component is hidden.
     */
    onHidden?: ((e: EventInfo<T>) => void);
    /**
     * A function that is executed before the UI component is hidden.
     */
    onHiding?: ((e: Cancelable & EventInfo<T>) => void);
    /**
     * A function that is executed before the UI component is displayed.
     */
    onShowing?: ((e: EventInfo<T>) => void);
    /**
     * A function that is executed after the UI component is displayed.
     */
    onShown?: ((e: EventInfo<T>) => void);
    /**
     * Positions the UI component.
     */
    position?: any;
    /**
     * Specifies whether to shade the background when the UI component is active.
     */
    shading?: boolean;
    /**
     * Specifies the shading color. Applies only if shading is enabled.
     */
    shadingColor?: string;
    /**
     * A Boolean value specifying whether or not the UI component is visible.
     */
    visible?: boolean;
    /**
     * Specifies the UI component&apos;s width in pixels.
     */
    width?: number | string | (() => number | string);
}
/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxOverlayAnimation {
    /**
     * An object that defines the animation properties used when the UI component is being hidden.
     */
    hide?: animationConfig;
    /**
     * An object that defines the animation properties used when the UI component is being shown.
     */
    show?: animationConfig;
}
/**
 * The Overlay UI component represents a window overlaying the current view. It displays data located within the HTML element representing the UI component.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export default class dxOverlay extends Widget {
    constructor(element: UserDefinedElement, options?: dxOverlayOptions)
    /**
     * Gets the UI component&apos;s content.
     */
    content(): DxElement;
    /**
     * Hides the UI component.
     */
    hide(): DxPromise<boolean>;
    /**
     * Recalculates the UI component&apos;s size and position without rerendering.
     */
    repaint(): void;
    /**
     * Shows the UI component.
     */
    show(): DxPromise<boolean>;
    /**
     * Shows or hides the UI component depending on the argument.
     */
    toggle(showing: boolean): DxPromise<boolean>;
}

/**
 * Specifies the base z-index for all overlay UI components.
 */
export function baseZIndex(zIndex: number): void;

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type Options = dxOverlayOptions;
/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type IOptions = dxOverlayOptions;
