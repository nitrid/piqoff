/**
 * DevExtreme (esm/ui/html_editor/formats/align.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import Quill from "devextreme-quill";
var AlignStyle = {};
if (Quill) {
    AlignStyle = Quill.import("attributors/style/align");
    AlignStyle.whitelist.push("left")
}
export default AlignStyle;
