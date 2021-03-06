/**
* DevExtreme (data/abstract_store.d.ts)
* Version: 21.1.5
* Build date: Mon Aug 02 2021
*
* Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import {
    DxPromise
} from '../core/utils/deferred';

import {
    LoadOptions
} from './load_options';

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface StoreOptions<T = Store> {
    /**
     * Specifies the function that is executed when the store throws an error.
     */
    errorHandler?: Function;
    /**
     * Specifies the key property (or properties) that provide(s) key values to access data items. Each key value must be unique.
     */
    key?: string | Array<string>;
    /**
     * A function that is executed after a data item is added to the store.
     */
    onInserted?: ((values: any, key: any | string | number) => void);
    /**
     * A function that is executed before a data item is added to the store.
     */
    onInserting?: ((values: any) => void);
    /**
     * A function that is executed after data is loaded to the store.
     */
    onLoaded?: ((result: Array<any>) => void);
    /**
     * A function that is executed before data is loaded to the store.
     */
    onLoading?: ((loadOptions: LoadOptions) => void);
    /**
     * A function that is executed after a data item is added, updated, or removed from the store.
     */
    onModified?: Function;
    /**
     * A function that is executed before a data item is added, updated, or removed from the store.
     */
    onModifying?: Function;
    /**
     * The function executed before changes are pushed to the store.
     */
    onPush?: ((changes: Array<any>) => void);
    /**
     * A function that is executed after a data item is removed from the store.
     */
    onRemoved?: ((key: any | string | number) => void);
    /**
     * A function that is executed before a data item is removed from the store.
     */
    onRemoving?: ((key: any | string | number) => void);
    /**
     * A function that is executed after a data item is updated in the store.
     */
    onUpdated?: ((key: any | string | number, values: any) => void);
    /**
     * A function that is executed before a data item is updated in the store.
     */
    onUpdating?: ((key: any | string | number, values: any) => void);
}
/**
 * The base class for all Stores.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export default class Store {
    constructor(options?: StoreOptions)
    /**
     * Gets a data item with a specific key.
     */
    byKey(key: any | string | number): DxPromise<any>;
    /**
     * Adds a data item to the store.
     */
    insert(values: any): DxPromise<any>;
    /**
     * Gets the key property (or properties) as specified in the key property.
     */
    key(): any;
    /**
     * Gets a data item&apos;s key value.
     */
    keyOf(obj: any): any;
    /**
     * Starts loading data.
     */
    load(): DxPromise<any>;
    /**
     * Starts loading data.
     */
    load(options: LoadOptions): DxPromise<any>;
    /**
     * Detaches all event handlers from a single event.
     */
    off(eventName: string): this;
    /**
     * Detaches a particular event handler from a single event.
     */
    off(eventName: string, eventHandler: Function): this;
    /**
     * Subscribes to an event.
     */
    on(eventName: string, eventHandler: Function): this;
    /**
     * Subscribes to events.
     */
    on(events: any): this;
    /**
     * Pushes data changes to the store and notifies the DataSource.
     */
    push(changes: Array<any>): void;
    /**
     * Removes a data item with a specific key from the store.
     */
    remove(key: any | string | number): DxPromise<void>;
    /**
     * Gets the total count of items the load() function returns.
     */
    totalCount(obj: { filter?: any, group?: any }): DxPromise<number>;
    /**
     * Updates a data item with a specific key.
     */
    update(key: any | string | number, values: any): DxPromise<any>;
}
