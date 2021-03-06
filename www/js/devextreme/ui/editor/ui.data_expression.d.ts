/**
* DevExtreme (ui/editor/ui.data_expression.d.ts)
* Version: 21.1.5
* Build date: Mon Aug 02 2021
*
* Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import {
    UserDefinedElement,
    DxElement
} from '../../core/element';

import {
    template
} from '../../core/templates/template';

import DataSource, {
    DataSourceOptions
} from '../../data/data_source';

import Store from '../../data/abstract_store';

import {
    CollectionWidgetItem
} from '../collection/ui.collection_widget.base';

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface DataExpressionMixinOptions<T = DataExpressionMixin> {
    /**
     * Binds the UI component to data.
     */
    dataSource?: string | Array<CollectionWidgetItem | any> | Store | DataSource | DataSourceOptions;
    /**
     * Specifies the data field whose values should be displayed.
     */
    displayExpr?: string | ((item: any) => string);
    /**
     * Specifies a custom template for items.
     */
    itemTemplate?: template | ((itemData: any, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement);
    /**
     * An array of items displayed by the UI component.
     */
    items?: Array<CollectionWidgetItem | any>;
    /**
     * Specifies the currently selected value. May be an object if dataSource contains objects and valueExpr is not set.
     */
    value?: any;
    /**
     * Specifies which data field provides unique values to the UI component&apos;s value.
     */
    valueExpr?: string | ((item: any) => string | number | boolean);
}
/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export default class DataExpressionMixin {
    constructor(options?: DataExpressionMixinOptions)
    getDataSource(): DataSource;
}
