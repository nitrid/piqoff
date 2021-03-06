/**
* DevExtreme (data/custom_store.d.ts)
* Version: 21.1.5
* Build date: Mon Aug 02 2021
*
* Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import Store, {
    StoreOptions
} from './abstract_store';

import {
    LoadOptions
} from './load_options';

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface CustomStoreOptions extends StoreOptions<CustomStore> {
    /**
     * Specifies a custom implementation of the byKey(key) method.
     */
    byKey?: ((key: any | string | number) => PromiseLike<any>);
    /**
     * Specifies whether raw data should be saved in the cache. Applies only if loadMode is &apos;raw&apos;.
     */
    cacheRawData?: boolean;
    /**
     * Specifies a custom implementation of the insert(values) method.
     */
    insert?: ((values: any) => PromiseLike<any>);
    /**
     * Specifies a custom implementation of the load(options) method.
     */
    load?: ((options: LoadOptions) => PromiseLike<any> | Array<any>);
    /**
     * Specifies how data returned by the load function is treated.
     */
    loadMode?: 'processed' | 'raw';
    /**
     * Specifies a custom implementation of the remove(key) method.
     */
    remove?: ((key: any | string | number) => PromiseLike<void>);
    /**
     * Specifies a custom implementation of the totalCount(options) method.
     */
    totalCount?: ((loadOptions: { filter?: any, group?: any }) => PromiseLike<number>);
    /**
     * Specifies a custom implementation of the update(key, values) method.
     */
    update?: ((key: any | string | number, values: any) => PromiseLike<any>);
    /**
     * Specifies whether the store combines the search and filter expressions. Defaults to true if the loadMode is &apos;raw&apos; and false if it is &apos;processed&apos;.
     */
    useDefaultSearch?: boolean;
}
/**
 * The CustomStore enables you to implement custom data access logic for consuming data from any source.
 */
export default class CustomStore extends Store {
    constructor(options?: CustomStoreOptions)
    /**
     * Deletes data from the cache. Takes effect only if the cacheRawData property is true.
     */
    clearRawDataCache(): void;
}
