/**
 * DevExtreme (esm/renovation/ui/scroll_view/scrollable_simulated_props.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import _extends from "@babel/runtime/helpers/esm/extends";
import {
    ScrollableProps
} from "./scrollable_props";
import {
    BaseWidgetProps
} from "../common/base_props";
import {
    WidgetProps
} from "../common/widget";
export var ScrollableSimulatedProps = _extends({}, ScrollableProps, {
    inertiaEnabled: true,
    useKeyboard: true
});
export var ScrollableSimulatedPropsType = {
    inertiaEnabled: ScrollableSimulatedProps.inertiaEnabled,
    useKeyboard: ScrollableSimulatedProps.useKeyboard,
    useNative: ScrollableSimulatedProps.useNative,
    direction: ScrollableSimulatedProps.direction,
    showScrollbar: ScrollableSimulatedProps.showScrollbar,
    bounceEnabled: ScrollableSimulatedProps.bounceEnabled,
    scrollByContent: ScrollableSimulatedProps.scrollByContent,
    scrollByThumb: ScrollableSimulatedProps.scrollByThumb,
    updateManually: ScrollableSimulatedProps.updateManually,
    pullDownEnabled: ScrollableSimulatedProps.pullDownEnabled,
    reachBottomEnabled: ScrollableSimulatedProps.reachBottomEnabled,
    forceGeneratePockets: ScrollableSimulatedProps.forceGeneratePockets,
    needScrollViewContentWrapper: ScrollableSimulatedProps.needScrollViewContentWrapper,
    needScrollViewLoadPanel: ScrollableSimulatedProps.needScrollViewLoadPanel,
    aria: WidgetProps.aria,
    disabled: BaseWidgetProps.disabled,
    visible: BaseWidgetProps.visible
};
