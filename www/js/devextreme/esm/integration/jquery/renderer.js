/**
 * DevExtreme (esm/integration/jquery/renderer.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import jQuery from "jquery";
import rendererBase from "../../core/renderer_base";
import useJQueryFn from "./use_jquery";
var useJQuery = useJQueryFn();
if (useJQuery) {
    rendererBase.set(jQuery)
}
