/**
* DevExtreme (ui/track_bar.d.ts)
* Version: 21.1.5
* Build date: Mon Aug 02 2021
*
* Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import {
    UserDefinedElement
} from '../core/element';

import Editor, {
    EditorOptions
} from './editor/editor';

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxTrackBarOptions<T = dxTrackBar> extends EditorOptions<T> {
    /**
     * The maximum value the UI component can accept.
     */
    max?: number;
    /**
     * The minimum value the UI component can accept.
     */
    min?: number;
}
/**
 * A base class for track bar UI components.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export default class dxTrackBar extends Editor {
    constructor(element: UserDefinedElement, options?: dxTrackBarOptions)
}
