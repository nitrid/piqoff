/**
 * DevExtreme (esm/viz/tree_map/tiling.slice_and_dice.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import {
    buildSidesData,
    calculateRectangles,
    addAlgorithm
} from "./tiling";

function sliceAndDice(data) {
    var items = data.items;
    var sidesData = buildSidesData(data.rect, data.directions, data.isRotated ? 1 : 0);
    calculateRectangles(items, 0, data.rect, sidesData, {
        sum: data.sum,
        count: items.length,
        side: sidesData.variedSide
    })
}
addAlgorithm("sliceanddice", sliceAndDice);
export default sliceAndDice;
