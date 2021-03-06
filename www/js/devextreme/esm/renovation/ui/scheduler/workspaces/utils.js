/**
 * DevExtreme (esm/renovation/ui/scheduler/workspaces/utils.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import _extends from "@babel/runtime/helpers/esm/extends";
import {
    combineClasses
} from "../../../utils/combine_classes";
import {
    HORIZONTAL_GROUP_ORIENTATION,
    VERTICAL_GROUP_ORIENTATION
} from "../consts";
export var getKeyByDateAndGroup = (date, groupIndex) => {
    var key = date.getTime();
    if (!groupIndex) {
        return key.toString()
    }
    return (key + groupIndex).toString()
};
export var getKeyByGroup = (groupIndex, groupOrientation) => {
    if (groupOrientation === VERTICAL_GROUP_ORIENTATION) {
        return groupIndex.toString()
    }
    return "0"
};
var addToStyle = (attr, value, style) => {
    var nextStyle = style || {};
    var result = _extends({}, nextStyle);
    result[attr] = value || nextStyle[attr];
    return result
};
export var addHeightToStyle = (value, style) => {
    var height = value ? "".concat(value, "px") : "";
    return addToStyle("height", height, style)
};
export var addWidthToStyle = (value, style) => {
    var width = value ? "".concat(value, "px") : "";
    return addToStyle("width", width, style)
};
export var getGroupCellClasses = function() {
    var isFirstGroupCell = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : false;
    var isLastGroupCell = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : false;
    var className = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "";
    return combineClasses({
        "dx-scheduler-first-group-cell": isFirstGroupCell,
        "dx-scheduler-last-group-cell": isLastGroupCell,
        [className]: true
    })
};
export var getIsGroupedAllDayPanel = (viewData, index) => {
    var {
        groupedData: groupedData
    } = viewData;
    var groupData = groupedData[index];
    var isAllDayPanel = !!(null !== groupData && void 0 !== groupData && groupData.allDayPanel);
    var isGroupedAllDayPanel = !!(null !== groupData && void 0 !== groupData && groupData.isGroupedAllDayPanel);
    return isAllDayPanel && isGroupedAllDayPanel
};
export var isVerticalGroupOrientation = groupOrientation => groupOrientation === VERTICAL_GROUP_ORIENTATION;
export var isHorizontalGroupOrientation = (groups, groupOrientation) => groupOrientation === HORIZONTAL_GROUP_ORIENTATION && !!groups.length;
