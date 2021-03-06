/**
 * DevExtreme (esm/renovation/ui/scheduler/workspaces/base/header_panel/date_header/layout.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
var _excluded = ["dateCellTemplate", "dateHeaderData", "groupByDate", "groupOrientation", "groups", "timeCellTemplate"];
import {
    createFragment,
    createComponentVNode,
    normalizeProps
} from "inferno";
import {
    Fragment
} from "inferno";
import {
    BaseInfernoComponent
} from "@devextreme/vdom";
import {
    Row
} from "../../row";
import {
    isHorizontalGroupOrientation
} from "../../../utils";
import {
    DateHeaderCell
} from "./cell";
export var viewFunction = _ref => {
    var {
        isHorizontalGrouping: isHorizontalGrouping,
        props: {
            dateCellTemplate: dateCellTemplate,
            dateHeaderData: dateHeaderData
        }
    } = _ref;
    var {
        dataMap: dataMap,
        leftVirtualCellCount: leftVirtualCellCount,
        leftVirtualCellWidth: leftVirtualCellWidth,
        rightVirtualCellCount: rightVirtualCellCount,
        rightVirtualCellWidth: rightVirtualCellWidth
    } = dateHeaderData;
    return createFragment(dataMap.map((dateHeaderRow, rowIndex) => createComponentVNode(2, Row, {
        className: "dx-scheduler-header-row",
        leftVirtualCellWidth: leftVirtualCellWidth,
        leftVirtualCellCount: leftVirtualCellCount,
        rightVirtualCellWidth: rightVirtualCellWidth,
        rightVirtualCellCount: rightVirtualCellCount,
        isHeaderRow: true,
        children: dateHeaderRow.map(_ref2 => {
            var {
                colSpan: colSpan,
                endDate: endDate,
                groupIndex: groupIndex,
                groups: cellGroups,
                index: index,
                isFirstGroupCell: isFirstGroupCell,
                isLastGroupCell: isLastGroupCell,
                key: key,
                startDate: startDate,
                text: text,
                today: today
            } = _ref2;
            return createComponentVNode(2, DateHeaderCell, {
                startDate: startDate,
                endDate: endDate,
                groups: isHorizontalGrouping ? cellGroups : void 0,
                groupIndex: isHorizontalGrouping ? groupIndex : void 0,
                today: today,
                index: index,
                text: text,
                isFirstGroupCell: isFirstGroupCell,
                isLastGroupCell: isLastGroupCell,
                dateCellTemplate: dateCellTemplate,
                colSpan: colSpan
            }, key)
        })
    }, rowIndex.toString())), 0)
};
export var DateHeaderLayoutProps = {
    groupOrientation: "horizontal",
    groupByDate: false,
    groups: []
};
var getTemplate = TemplateProp => TemplateProp && (TemplateProp.defaultProps ? props => normalizeProps(createComponentVNode(2, TemplateProp, _extends({}, props))) : TemplateProp);
export class DateHeaderLayout extends BaseInfernoComponent {
    constructor(props) {
        super(props);
        this.state = {}
    }
    get isHorizontalGrouping() {
        var {
            groupByDate: groupByDate,
            groupOrientation: groupOrientation,
            groups: groups
        } = this.props;
        return isHorizontalGroupOrientation(groups, groupOrientation) && !groupByDate
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
                dateCellTemplate: getTemplate(props.dateCellTemplate),
                timeCellTemplate: getTemplate(props.timeCellTemplate)
            }),
            isHorizontalGrouping: this.isHorizontalGrouping,
            restAttributes: this.restAttributes
        })
    }
}
DateHeaderLayout.defaultProps = _extends({}, DateHeaderLayoutProps);
