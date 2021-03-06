/**
 * DevExtreme (esm/renovation/ui/scheduler/workspaces/base/date_table/cell.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
var _excluded = ["allDay", "children", "className", "contentTemplate", "contentTemplateProps", "dataCellTemplate", "endDate", "firstDayOfMonth", "groupIndex", "groups", "index", "isFirstGroupCell", "isLastGroupCell", "otherMonth", "startDate", "text", "today"];
import {
    createComponentVNode,
    normalizeProps
} from "inferno";
import {
    BaseInfernoComponent
} from "@devextreme/vdom";
import {
    CellBase as Cell,
    CellBaseProps
} from "../cell";
import {
    combineClasses
} from "../../../../../utils/combine_classes";
export var viewFunction = viewModel => createComponentVNode(2, Cell, {
    isFirstGroupCell: viewModel.props.isFirstGroupCell,
    isLastGroupCell: viewModel.props.isLastGroupCell,
    contentTemplate: viewModel.props.dataCellTemplate,
    contentTemplateProps: viewModel.dataCellTemplateProps,
    className: viewModel.classes,
    children: viewModel.props.children
});
export var DateTableCellBaseProps = _extends({}, CellBaseProps, {
    otherMonth: false,
    today: false,
    firstDayOfMonth: false
});
var getTemplate = TemplateProp => TemplateProp && (TemplateProp.defaultProps ? props => normalizeProps(createComponentVNode(2, TemplateProp, _extends({}, props))) : TemplateProp);
export class DateTableCellBase extends BaseInfernoComponent {
    constructor(props) {
        super(props);
        this.state = {}
    }
    get classes() {
        var {
            allDay: allDay,
            className: className
        } = this.props;
        return combineClasses({
            "dx-scheduler-cell-sizes-horizontal": true,
            "dx-scheduler-cell-sizes-vertical": !allDay,
            "dx-scheduler-date-table-cell": !allDay,
            [className]: true
        })
    }
    get dataCellTemplateProps() {
        var {
            allDay: allDay,
            contentTemplateProps: contentTemplateProps,
            endDate: endDate,
            groupIndex: groupIndex,
            groups: groups,
            index: index,
            startDate: startDate
        } = this.props;
        return {
            data: _extends({
                startDate: startDate,
                endDate: endDate,
                groups: groups,
                groupIndex: groups ? groupIndex : void 0,
                text: "",
                allDay: allDay || void 0
            }, contentTemplateProps.data),
            index: index
        }
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
                dataCellTemplate: getTemplate(props.dataCellTemplate),
                contentTemplate: getTemplate(props.contentTemplate)
            }),
            classes: this.classes,
            dataCellTemplateProps: this.dataCellTemplateProps,
            restAttributes: this.restAttributes
        })
    }
}
DateTableCellBase.defaultProps = _extends({}, DateTableCellBaseProps);
