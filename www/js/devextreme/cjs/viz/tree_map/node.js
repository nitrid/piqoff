/**
 * DevExtreme (cjs/viz/tree_map/node.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.default = void 0;
var _extend2 = require("../../core/utils/extend");

function Node() {}
var updateTile = [updateLeaf, updateGroup];
(0, _extend2.extend)(Node.prototype, {
    value: 0,
    isNode: function() {
        return !!(this.nodes && this.level < this.ctx.maxLevel)
    },
    isActive: function() {
        var ctx = this.ctx;
        return this.level >= ctx.minLevel && this.level <= ctx.maxLevel
    },
    updateStyles: function() {
        var isNode = Number(this.isNode());
        this.state = this._buildState(this.ctx.settings[isNode].state, !isNode && this.color && {
            fill: this.color
        })
    },
    _buildState: function(state, extra) {
        var base = (0, _extend2.extend)({}, state);
        return extra ? (0, _extend2.extend)(base, extra) : base
    },
    updateLabelStyle: function() {
        var settings = this.ctx.settings[Number(this.isNode())];
        this.labelState = settings.labelState;
        this.labelParams = settings.labelParams
    },
    _getState: function() {
        return this.state
    },
    applyState: function() {
        updateTile[Number(this.isNode())](this.tile, this._getState())
    }
});

function updateLeaf(content, attrs) {
    content.smartAttr(attrs)
}

function updateGroup(content, attrs) {
    content.outer.attr({
        stroke: attrs.stroke,
        "stroke-width": attrs["stroke-width"],
        "stroke-opacity": attrs["stroke-opacity"]
    });
    content.inner.smartAttr({
        fill: attrs.fill,
        opacity: attrs.opacity,
        hatching: attrs.hatching
    })
}
var _default = Node;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;
