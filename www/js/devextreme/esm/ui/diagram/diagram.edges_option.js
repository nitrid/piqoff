/**
 * DevExtreme (esm/ui/diagram/diagram.edges_option.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import ItemsOption from "./diagram.items_option";
class EdgesOption extends ItemsOption {
    _getKeyExpr() {
        return this._diagramWidget._createOptionGetter("edges.keyExpr")
    }
}
export default EdgesOption;
