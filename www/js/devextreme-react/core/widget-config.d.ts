/*!
 * devextreme-react
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file in the root of the project for details.
 *
 * https://github.com/DevExpress/devextreme-react
 */

import { ITemplateMeta } from './template';
declare const elementPropNames: string[];
declare function separateProps(props: Record<string, any>, defaultsProps: Record<string, string>, templateProps: ITemplateMeta[]): {
    options: Record<string, any>;
    defaults: Record<string, any>;
    templates: Record<string, any>;
};
declare function getClassName(props: Record<string, any>): string | undefined;
export { elementPropNames, getClassName, separateProps, };
