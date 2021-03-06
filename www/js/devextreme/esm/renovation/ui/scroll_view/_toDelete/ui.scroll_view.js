/**
 * DevExtreme (esm/renovation/ui/scroll_view/_toDelete/ui.scroll_view.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import $ from "../../core/renderer";
import {
    hasWindow
} from "../../core/utils/window";
import registerComponent from "../../core/component_registrator";
import {
    noop
} from "../../core/utils/common";
import PullDownStrategy from "./ui.scroll_view.native.pull_down";
import SwipeDownStrategy from "./ui.scroll_view.native.swipe_down";
import SimulatedStrategy from "./ui.scroll_view.simulated";
import Scrollable from "./ui.scrollable";
var refreshStrategies = {
    pullDown: PullDownStrategy,
    swipeDown: SwipeDownStrategy,
    simulated: SimulatedStrategy
};
var isServerSide = !hasWindow();
var scrollViewServerConfig = {
    finishLoading: noop,
    release: noop,
    refresh: noop,
    _optionChanged: function(args) {
        if ("onUpdated" !== args.name) {
            return this.callBase.apply(this, arguments)
        }
    }
};
var ScrollView = Scrollable.inherit(isServerSide ? scrollViewServerConfig : {
    _createStrategy: function() {
        var strategyName = this.option("useNative") ? this.option("refreshStrategy") : "simulated";
        var strategyClass = refreshStrategies[strategyName];
        if (!strategyClass) {
            throw Error("E1030", this.option("refreshStrategy"))
        }
    },
    _optionChanged: function(args) {
        switch (args.name) {
            case "onPullDown":
            case "onReachBottom":
                this._createActions();
                break;
            case "pullingDownText":
            case "pulledDownText":
            case "refreshingText":
            case "refreshStrategy":
                this._invalidate();
                break;
            case "reachBottomText":
                this._updateReachBottomText();
                break;
            default:
                this.callBase(args)
        }
    },
    release: function(preventReachBottom) {
        if (void 0 !== preventReachBottom) {
            this.toggleLoading(!preventReachBottom)
        }
        return this._strategy.release()
    },
    toggleLoading: function(showOrHide) {
        this._reachBottomEnable(showOrHide)
    },
    isFull: function() {
        return $(this.content()).height() > this._$container.height()
    }
});
registerComponent("dxScrollView", ScrollView);
export default ScrollView;
