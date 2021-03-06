/**
 * DevExtreme (esm/renovation/ui/scroll_view/utils/get_boundary_props.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import {
    getScrollLeftMax
} from "./get_scroll_left_max";
import {
    getScrollTopMax
} from "./get_scroll_top_max";
import {
    ScrollDirection
} from "./scroll_direction";
export function isReachedRight(element, scrollOffsetLeft) {
    return getScrollLeftMax(element) - scrollOffsetLeft < .5
}
export function isReachedBottom(element, scrollOffsetTop, pocketHeight) {
    return getScrollTopMax(element) - scrollOffsetTop - pocketHeight <= .5
}
export function getBoundaryProps(direction, scrollOffset, element, pocketHeight) {
    var {
        left: left,
        top: top
    } = scrollOffset;
    var boundaryProps = {};
    var {
        isHorizontal: isHorizontal,
        isVertical: isVertical
    } = new ScrollDirection(direction);
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
