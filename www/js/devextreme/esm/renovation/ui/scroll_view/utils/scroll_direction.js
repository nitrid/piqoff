/**
 * DevExtreme (esm/renovation/ui/scroll_view/utils/scroll_direction.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import {
    DIRECTION_VERTICAL,
    DIRECTION_HORIZONTAL,
    DIRECTION_BOTH
} from "../common/consts";
export class ScrollDirection {
    constructor(direction) {
        this.DIRECTION_HORIZONTAL = "horizontal";
        this.DIRECTION_VERTICAL = "vertical";
        this.DIRECTION_BOTH = "both";
        this.direction = null !== direction && void 0 !== direction ? direction : DIRECTION_VERTICAL
    }
    get isHorizontal() {
        return this.direction === DIRECTION_HORIZONTAL || this.direction === DIRECTION_BOTH
    }
    get isVertical() {
        return this.direction === DIRECTION_VERTICAL || this.direction === DIRECTION_BOTH
    }
    get isBoth() {
        return this.direction === DIRECTION_BOTH
    }
}
