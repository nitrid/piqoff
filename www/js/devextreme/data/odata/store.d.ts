/**
* DevExtreme (data/odata/store.d.ts)
* Version: 21.1.5
* Build date: Mon Aug 02 2021
*
* Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import {
    DxPromise
} from '../../core/utils/deferred';

import Store, {
    StoreOptions
} from '../abstract_store';

import {
    LoadOptions
} from '../load_options';

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
interface PromiseExtension<T> {
    then<TResult1 = T, TResult2 = never>(
        onfulfilled?: ((value: T, extraParameters?: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
        onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
    ): Promise<TResult1 | TResult2>;
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface ODataStoreOptions extends StoreOptions<ODataStore> {
    /**
     * Specifies a function that customizes the request before it is sent to the server.
     */
    beforeSend?: ((options: { url?: string, async?: boolean, method?: string, timeout?: number, params?: any, payload?: any, headers?: any }) => void);
    /**
     * Specifies whether the store serializes/parses date-time values.
     */
    deserializeDates?: boolean;
    /**
     * Specifies a function that is executed when the ODataStore throws an error.
     */
    errorHandler?: ((e: { httpStatus?: number, errorDetails?: any, requestOptions?: any }) => void);
    /**
     * Specifies the data field types. Accepts the following types: &apos;String&apos;, &apos;Int32&apos;, &apos;Int64&apos;, &apos;Boolean&apos;, &apos;Single&apos;, &apos;Decimal&apos; and &apos;Guid&apos;.
     */
    fieldTypes?: any;
    /**
     * Specifies whether to convert string values to lowercase in filter and search requests. Applies to the following operations: &apos;startswith&apos;, &apos;endswith&apos;, &apos;contains&apos;, and &apos;notcontains&apos;.
     */
    filterToLower?: boolean;
    /**
     * Specifies whether data should be sent using JSONP.
     */
    jsonp?: boolean;
    /**
     * Specifies the type of the key property or properties.
     */
    keyType?: 'String' | 'Int32' | 'Int64' | 'Guid' | 'Boolean' | 'Single' | 'Decimal' | any;
    /**
     * A function that is executed before data is loaded to the store.
     */
    onLoading?: ((loadOptions: LoadOptions) => void);
    /**
     * Specifies the URL of an OData entity collection.
     */
    url?: string;
    /**
     * Specifies the OData version.
     */
    version?: number;
    /**
     * Specifies whether to send cookies, authorization headers, and client certificates in a cross-origin request.
     */
    withCredentials?: boolean;
}
/**
 * The ODataStore is a store that provides an interface for loading and editing data from an individual OData entity collection and handling related events.
 */
export default class ODataStore extends Store {
    constructor(options?: ODataStoreOptions)
    byKey(key: any | string | number): DxPromise<any>;
    /**
     * Gets an entity with a specific key.
     */
    byKey(key: any | string | number, extraOptions: { expand?: string | Array<string>, select?: string | Array<string> }): DxPromise<any>;
    /**
     * Creates a Query for the OData endpoint.
     */
    createQuery(loadOptions: any): any;

    /**
     * 
     */
    insert(values: any): DxPromise<any> & PromiseExtension<any>;
}
