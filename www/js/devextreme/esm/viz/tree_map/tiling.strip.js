/**
 * DevExtreme (esm/viz/tree_map/tiling.strip.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import _squarify from "./tiling.squarified.base";
import {
    addAlgorithm
} from "./tiling";

function accumulate(total, current, count) {
    return ((count - 1) * total + current) / count
}

function strip(data) {
    return _squarify(data, accumulate, true)
}
addAlgorithm("strip", strip);
export default strip;
