/**
* DevExtreme (data/apply_changes.d.ts)
* Version: 21.1.5
* Build date: Mon Aug 02 2021
*
* Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
/**
 * Applies an array of changes to a source data array.
 */
declare function applyChanges(data: Array<any>, changes: Array<any>, options?: { keyExpr?: string | Array<string>, immutable?: boolean }): Array<any>;

export default applyChanges;
