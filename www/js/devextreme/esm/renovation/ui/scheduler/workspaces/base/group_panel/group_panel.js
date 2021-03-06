/**
 * DevExtreme (esm/renovation/ui/scheduler/workspaces/base/group_panel/group_panel.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
var _excluded = ["baseColSpan", "className", "columnCountPerGroup", "groupByDate", "groupOrientation", "groups", "height", "resourceCellTemplate"];
import {
    createComponentVNode,
    normalizeProps
} from "inferno";
import {
    InfernoWrapperComponent
} from "@devextreme/vdom";
import {
    isVerticalGroupOrientation
} from "../../utils";
import {
    GroupPanelProps
} from "./group_panel_props";
import {
    GroupPanelVerticalLayout
} from "./vertical/layout";
import {
    GroupPanelHorizontalLayout
} from "./horizontal/layout";
import {
    getGroupsRenderData
} from "./utils";
export var viewFunction = _ref => {
    var {
        groupsRenderData: groupsRenderData,
        layout: Layout,
        props: {
            baseColSpan: baseColSpan,
            className: className,
            groupByDate: groupByDate,
            groups: groups,
            height: height,
            resourceCellTemplate: resourceCellTemplate
        },
        restAttributes: restAttributes
    } = _ref;
    return createComponentVNode(2, Layout, {
        groups: groups,
        height: height,
        resourceCellTemplate: resourceCellTemplate,
        groupByDate: groupByDate,
        className: className,
        groupsRenderData: groupsRenderData,
        baseColSpan: baseColSpan,
        styles: restAttributes.style
    })
};
var getTemplate = TemplateProp => TemplateProp && (TemplateProp.defaultProps ? props => normalizeProps(createComponentVNode(2, TemplateProp, _extends({}, props))) : TemplateProp);
export class GroupPanel extends InfernoWrapperComponent {
    constructor(props) {
        super(props);
        this.state = {}
    }
    get layout() {
        var {
            groupOrientation: groupOrientation
        } = this.props;
        return isVerticalGroupOrientation(groupOrientation) ? GroupPanelVerticalLayout : GroupPanelHorizontalLayout
    }
    get groupsRenderData() {
        var {
            columnCountPerGroup: columnCountPerGroup,
            groupByDate: groupByDate,
            groups: groups
        } = this.props;
        return getGroupsRenderData(groups, columnCountPerGroup, groupByDate)
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
                resourceCellTemplate: getTemplate(props.resourceCellTemplate)
            }),
            layout: this.layout,
            groupsRenderData: this.groupsRenderData,
            restAttributes: this.restAttributes
        })
    }
}
GroupPanel.defaultProps = _extends({}, GroupPanelProps);
