/**
 * DevExtreme (esm/renovation/ui/scheduler/workspaces/base/time_panel/layout.j.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import registerComponent from "../../../../../../core/component_registrator";
import BaseComponent from "../../../../../component_wrapper/component";
import {
    TimePanelTableLayout as TimePanelTableLayoutComponent
} from "./layout";
export default class TimePanelTableLayout extends BaseComponent {
    get _propsInfo() {
        return {
            twoWay: [],
            allowNull: [],
            elements: [],
            templates: ["timeCellTemplate"],
            props: ["className", "groupOrientation", "allDayPanelVisible", "timePanelData", "timeCellTemplate"]
        }
    }
    get _viewComponent() {
        return TimePanelTableLayoutComponent
    }
}
registerComponent("dxTimePanelTableLayout", TimePanelTableLayout);
