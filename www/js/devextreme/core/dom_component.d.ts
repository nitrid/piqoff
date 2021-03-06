/**
* DevExtreme (core/dom_component.d.ts)
* Version: 21.1.5
* Build date: Mon Aug 02 2021
*
* Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import {
    Component,
    ComponentOptions
} from './component';

import {
    Device
} from './devices';

import {
    UserDefinedElement,
    DxElement
} from './element';

import { TemplateManager } from './template_manager';
import { FunctionTemplate } from './templates/function_template';

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface DOMComponentOptions<T = DOMComponent> extends ComponentOptions<T> {
    /**
     * 
     */
    bindingOptions?: any;
    /**
     * Specifies the global attributes to be attached to the UI component&apos;s container element.
     */
    elementAttr?: any;
    /**
     * Specifies the UI component&apos;s height.
     */
    height?: number | string | (() => number | string);
    /**
     * A function that is executed before the UI component is disposed of.
     */
    onDisposing?: ((e: { component?: T, element?: DxElement, model?: any }) => void);
    /**
     * A function that is executed after a UI component property is changed.
     */
    onOptionChanged?: ((e: { component?: T, element?: DxElement, model?: any, name?: string, fullName?: string, value?: any }) => void);
    /**
     * Switches the UI component to a right-to-left representation.
     */
    rtlEnabled?: boolean;
    /**
     * Specifies the UI component&apos;s width.
     */
    width?: number | string | (() => number | string);
}
/**
 * A base class for all components.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export default class DOMComponent extends Component {
    constructor(element: UserDefinedElement, options?: DOMComponentOptions);
    /**
     * Specifies the device-dependent default configuration properties for this component.
     */
    static defaultOptions(rule: { device?: Device | Array<Device> | Function, options?: any }): void;
    /**
     * Disposes of all the resources allocated to the widget instance.
     */
    dispose(): void;
    /**
     * Gets the root UI component element.
     */
    element(): DxElement;
    /**
     * Gets the instance of a UI component found using its DOM node.
     */
    static getInstance(element: UserDefinedElement): DOMComponent;

    $element(): UserDefinedElement;
    _getTemplate(template: unknown): FunctionTemplate;
    _invalidate(): void;
    _refresh(): void;
    _templateManager: TemplateManager;
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type Options = DOMComponentOptions;
/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type IOptions = DOMComponentOptions;
