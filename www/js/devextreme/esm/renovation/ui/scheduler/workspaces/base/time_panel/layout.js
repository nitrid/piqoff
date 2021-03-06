/**
 * DevExtreme (esm/renovation/ui/scheduler/workspaces/base/time_panel/layout.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
var _excluded = ["allDayPanelVisible", "className", "groupOrientation", "timeCellTemplate", "timePanelData"];
import {
    createFragment,
    createComponentVNode,
    normalizeProps
} from "inferno";
import {
    Fragment
} from "inferno";
import {
    InfernoWrapperComponent
} from "@devextreme/vdom";
import {
    Row
} from "../row";
import {
    TimePanelCell as Cell
} from "./cell";
import {
    CellBase
} from "../cell";
import {
    getKeyByGroup,
    getIsGroupedAllDayPanel,
    isVerticalGroupOrientation
} from "../../utils";
import {
    Table
} from "../table";
import {
    AllDayPanelTitle
} from "../date_table/all_day_panel/title";
export var viewFunction = _ref => {
    var {
        bottomVirtualRowHeight: bottomVirtualRowHeight,
        isVerticalGroupOrientation: isVerticalGrouping,
        props: {
            groupOrientation: groupOrientation,
            timeCellTemplate: timeCellTemplate,
            timePanelData: timePanelData
        },
        restAttributes: restAttributes,
        topVirtualRowHeight: topVirtualRowHeight
    } = _ref;
    return normalizeProps(createComponentVNode(2, Table, _extends({}, restAttributes, {
        topVirtualRowHeight: topVirtualRowHeight,
        bottomVirtualRowHeight: bottomVirtualRowHeight,
        virtualCellsCount: 1,
        className: "dx-scheduler-time-panel",
        children: timePanelData.groupedData.map((_ref2, index) => {
            var {
                dateTable: dateTable,
                groupIndex: groupIndex
            } = _ref2;
            return createFragment([getIsGroupedAllDayPanel(timePanelData, index) && createComponentVNode(2, Row, {
                children: createComponentVNode(2, CellBase, {
                    className: "dx-scheduler-time-panel-title-cell",
                    children: createComponentVNode(2, AllDayPanelTitle)
                })
            }), dateTable.map(cell => {
                var {
                    cellCountInGroupRow: cellCountInGroupRow
                } = timePanelData;
                var {
                    groups: groups,
                    index: cellIndex,
                    isFirstGroupCell: isFirstGroupCell,
                    isLastGroupCell: isLastGroupCell,
                    key: key,
                    startDate: startDate,
                    text: text
                } = cell;
                return createComponentVNode(2, Row, {
                    className: "dx-scheduler-time-panel-row",
                    children: createComponentVNode(2, Cell, {
                        startDate: startDate,
                        text: text,
                        groups: isVerticalGrouping ? groups : void 0,
                        groupIndex: isVerticalGrouping ? groupIndex : void 0,
                        isFirstGroupCell: isVerticalGrouping && isFirstGroupCell,
                        isLastGroupCell: isVerticalGrouping && isLastGroupCell,
                        index: Math.floor(cellIndex / cellCountInGroupRow),
                        timeCellTemplate: timeCellTemplate
                    })
                }, key)
            })], 0, getKeyByGroup(groupIndex, groupOrientation))
        })
    })))
};
export var TimePanelTableLayoutProps = {
    className: "",
    allDayPanelVisible: false,
    timePanelData: {
        groupedData: [],
        cellCountInGroupRow: 0,
        leftVirtualCellCount: 0,
        rightVirtualCellCount: 0,
        topVirtualRowCount: 0,
        bottomVirtualRowCount: 0
    }
};
var getTemplate = TemplateProp => TemplateProp && (TemplateProp.defaultProps ? props => normalizeProps(createComponentVNode(2, TemplateProp, _extends({}, props))) : TemplateProp);
export class TimePanelTableLayout extends InfernoWrapperComponent {
    constructor(props) {
        super(props);
        this.state = {}
    }
    get topVirtualRowHeight() {
        return this.props.timePanelData.topVirtualRowHeight || 0
    }
    get bottomVirtualRowHeight() {
        return this.props.timePanelData.bottomVirtualRowHeight || 0
    }
    get isVerticalGroupOrientation() {
        var {
            groupOrientation: groupOrientation
        } = this.props;
        return isVerticalGroupOrientation(groupOrientation)
    }
    get restAttributes() {
        var _this$props = this.props,
            restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
        return restProps
    }
    render() {
        var props = this.props;
        return viewFunction({
            props: _extends({}, props, {
                timeCellTemplate: getTemplate(props.timeCellTemplate)
            }),
            topVirtualRowHeight: this.topVirtualRowHeight,
            bottomVirtualRowHeight: this.bottomVirtualRowHeight,
            isVerticalGroupOrientation: this.isVerticalGroupOrientation,
            restAttributes: this.restAttributes
        })
    }
}
TimePanelTableLayout.defaultProps = _extends({}, TimePanelTableLayoutProps);
