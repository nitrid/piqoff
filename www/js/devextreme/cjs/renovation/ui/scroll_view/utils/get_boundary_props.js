/**
 * DevExtreme (cjs/renovation/ui/scroll_view/utils/get_boundary_props.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.isReachedRight = isReachedRight;
exports.isReachedBottom = isReachedBottom;
exports.getBoundaryProps = getBoundaryProps;
var _get_scroll_left_max = require("./get_scroll_left_max");
var _get_scroll_top_max = require("./get_scroll_top_max");
var _scroll_direction = require("./scroll_direction");

function isReachedRight(element, scrollOffsetLeft) {
    return (0, _get_scroll_left_max.getScrollLeftMax)(element) - scrollOffsetLeft < .5
}

function isReachedBottom(element, scrollOffsetTop, pocketHeight) {
    return (0, _get_scroll_top_max.getScrollTopMax)(element) - scrollOffsetTop - pocketHeight <= .5
}

function getBoundaryProps(direction, scrollOffset, element, pocketHeight) {
    var left = scrollOffset.left,
        top = scrollOffset.top;
    var boundaryProps = {};
    var _ScrollDirection = new _scroll_direction.ScrollDirection(direction),
        isHorizontal = _ScrollDirection.isHorizontal,
        isVertical = _ScrollDirection.isVertical;
    if (isHorizontal) {
        boundaryProps.reachedLeft = left <= 0;
        boundaryProps.reachedRight = isReachedRight(element, left)
    }
    if (isVertical) {
        boundaryProps.reachedTop = top <= 0;
        boundaryProps.reachedBottom = isReachedBottom(element, top, pocketHeight)
    }
    return boundaryProps
}
