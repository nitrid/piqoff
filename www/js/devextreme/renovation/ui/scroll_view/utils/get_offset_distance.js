/**
 * DevExtreme (renovation/ui/scroll_view/utils/get_offset_distance.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.getOffsetDistance = getOffsetDistance;
var _common = require("../../../../core/utils/common");
var _restore_location = require("./restore_location");

function getOffsetDistance(targetLocation, direction, scrollOffset) {
    var location = (0, _restore_location.restoreLocation)(targetLocation, direction);
    var top = -scrollOffset.top - (0, _common.ensureDefined)(location.top, -scrollOffset.top);
    var left = -scrollOffset.left - (0, _common.ensureDefined)(location.left, -scrollOffset.left);
    return {
        top: top,
        left: left
    }
}
