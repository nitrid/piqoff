/**
 * DevExtreme (esm/viz/tree_map/tiling.rotated_slice_and_dice.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import {
    getAlgorithm,
    addAlgorithm
} from "./tiling";
var sliceAndDiceAlgorithm = getAlgorithm("sliceanddice");

function rotatedSliceAndDice(data) {
    data.isRotated = !data.isRotated;
    return sliceAndDiceAlgorithm.call(this, data)
}
addAlgorithm("rotatedsliceanddice", rotatedSliceAndDice);
