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

interface IOptions {
    useLegacyTemplateEngine: boolean;
}
declare function setOptions(options: Partial<IOptions>): void;
declare function getOption<TName extends keyof IOptions>(optionName: TName): IOptions[TName];
export default setOptions;
export { getOption };
