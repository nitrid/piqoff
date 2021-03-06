/**
 * DevExtreme (esm/renovation/ui/scheduler/workspaces/timeline/header_panel/layout.j.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import registerComponent from "../../../../../../core/component_registrator";
import HeaderPanel from "../../../../../component_wrapper/scheduler_header_panel";
import {
    TimelineHeaderPanelLayout as TimelineHeaderPanelLayoutComponent
} from "./layout";
export default class TimelineHeaderPanelLayout extends HeaderPanel {
    get _propsInfo() {
        return {
            twoWay: [],
            allowNull: [],
            elements: [],
            templates: ["dateCellTemplate", "timeCellTemplate", "dateHeaderTemplate", "resourceCellTemplate"],
            props: ["dateHeaderData", "isRenderDateHeader", "groupPanelCellBaseColSpan", "dateCellTemplate", "timeCellTemplate", "dateHeaderTemplate", "groups", "groupOrientation", "groupByDate", "height", "baseColSpan", "columnCountPerGroup", "className", "resourceCellTemplate"]
        }
    }
    get _viewComponent() {
        return TimelineHeaderPanelLayoutComponent
    }
}
registerComponent("dxTimelineHeaderPanelLayout", TimelineHeaderPanelLayout);
