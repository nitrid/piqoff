/**
 * DevExtreme (renovation/ui/scroll_view/utils/restore_location.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.restoreLocation = restoreLocation;
var _type = require("../../../../core/utils/type");
var _common = require("../../../../core/utils/common");
var _scroll_direction = require("./scroll_direction");

function restoreLocation(location, direction) {
    if ((0, _type.isPlainObject)(location)) {
        var left = (0, _common.ensureDefined)(location.left, location.x);
        var top = (0, _common.ensureDefined)(location.top, location.y);
        return {
            left: (0, _type.isDefined)(left) ? -left : void 0,
            top: (0, _type.isDefined)(top) ? -top : void 0
        }
    }
    var _ScrollDirection = new _scroll_direction.ScrollDirection(direction),
        isHorizontal = _ScrollDirection.isHorizontal,
        isVertical = _ScrollDirection.isVertical;
    return {
        left: isHorizontal ? -location : void 0,
        top: isVertical ? -location : void 0
    }
}
