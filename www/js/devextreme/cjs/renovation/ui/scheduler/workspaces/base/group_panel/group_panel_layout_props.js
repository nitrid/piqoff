/**
 * DevExtreme (cjs/renovation/ui/scheduler/workspaces/base/group_panel/group_panel_layout_props.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.GroupPanelLayoutProps = void 0;
var _group_panel_props = require("./group_panel_props");

function _extends() {
    _extends = Object.assign || function(target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key]
                }
            }
        }
        return target
    };
    return _extends.apply(this, arguments)
}
var GroupPanelLayoutProps = _extends({}, _group_panel_props.GroupPanelProps, {
    groupsRenderData: []
});
exports.GroupPanelLayoutProps = GroupPanelLayoutProps;
