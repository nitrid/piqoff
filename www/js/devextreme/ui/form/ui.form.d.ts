/**
* DevExtreme (ui/form/ui.form.d.ts)
* Version: 21.1.5
* Build date: Mon Aug 02 2021
*
* Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/

/**
 * Specifies dependency between the screen factor and the count of columns.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface ColCountResponsible {
    /**
     * The count of columns for a large screen size.
     */
    lg?: number;
    /**
     * The count of columns for a middle-sized screen.
     */
    md?: number;
    /**
     * The count of columns for a small-sized screen.
     */
    sm?: number;
    /**
     * The count of columns for an extra small-sized screen.
     */
    xs?: number;
}
