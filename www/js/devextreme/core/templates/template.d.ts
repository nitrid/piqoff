/**
* DevExtreme (core/templates/template.d.ts)
* Version: 21.1.5
* Build date: Mon Aug 02 2021
*
* Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import {
    UserDefinedElement
} from '../element';

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxTemplateOptions {
    /**
     * Specifies the name of the template.
     */
    name?: string;
}
/**
 * A custom template&apos;s markup.
 */
export type dxTemplate = Template;
/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export class Template {
    constructor(options?: dxTemplateOptions)
}

/**
 * A template notation used to specify templates for UI component elements.
 */
export type template = string | Function | UserDefinedElement;
