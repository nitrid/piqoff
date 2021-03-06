/**
* DevExtreme (data/array_store.d.ts)
* Version: 21.1.5
* Build date: Mon Aug 02 2021
*
* Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import Store, {
    StoreOptions
} from './abstract_store';

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface ArrayStoreOptions<T = ArrayStore> extends StoreOptions<T> {
    /**
     * Specifies the store&apos;s associated array.
     */
    data?: Array<any>;
}
/**
 * The ArrayStore is a store that provides an interface for loading and editing an in-memory array and handling related events.
 */
export default class ArrayStore extends Store {
    constructor(options?: ArrayStoreOptions)
    /**
     * Clears all the ArrayStore&apos;s associated data.
     */
    clear(): void;
    /**
     * Creates a Query for the underlying array.
     */
    createQuery(): any;
}
