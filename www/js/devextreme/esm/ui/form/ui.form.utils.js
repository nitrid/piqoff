/**
 * DevExtreme (esm/ui/form/ui.form.utils.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import $ from "../../core/renderer";
import {
    isDefined
} from "../../core/utils/type";
import {
    WIDGET_CLASS,
    FIELD_ITEM_LABEL_TEXT_CLASS,
    HIDDEN_LABEL_CLASS,
    FIELD_ITEM_OPTIONAL_MARK_CLASS,
    FIELD_ITEM_REQUIRED_MARK_CLASS,
    FIELD_ITEM_LABEL_CONTENT_CLASS,
    FIELD_ITEM_LABEL_LOCATION_CLASS,
    FIELD_ITEM_LABEL_CLASS,
    FIELD_ITEM_HELP_TEXT_CLASS,
    FIELD_BUTTON_ITEM_CLASS,
    FIELD_ITEM_CLASS
} from "./constants";
export var createItemPathByIndex = (index, isTabs) => "".concat(isTabs ? "tabs" : "items", "[").concat(index, "]");
export var concatPaths = (path1, path2) => {
    if (isDefined(path1) && isDefined(path2)) {
        return "".concat(path1, ".").concat(path2)
    }
    return path1 || path2
};
export var getTextWithoutSpaces = text => text ? text.replace(/\s/g, "") : void 0;
export var isExpectedItem = (item, fieldName) => item && (item.dataField === fieldName || item.name === fieldName || getTextWithoutSpaces(item.title) === fieldName || "group" === item.itemType && getTextWithoutSpaces(item.caption) === fieldName);
export var getFullOptionName = (path, optionName) => "".concat(path, ".").concat(optionName);
export var getOptionNameFromFullName = fullName => {
    var parts = fullName.split(".");
    return parts[parts.length - 1].replace(/\[\d+]/, "")
};
export var tryGetTabPath = fullPath => {
    var pathParts = fullPath.split(".");
    var resultPathParts = [...pathParts];
    for (var i = pathParts.length - 1; i >= 0; i--) {
        if (isFullPathContainsTabs(pathParts[i])) {
            return resultPathParts.join(".")
        }
        resultPathParts.splice(i, 1)
    }
    return ""
};
export var isFullPathContainsTabs = fullPath => fullPath.indexOf("tabs") > -1;
export var getItemPath = (items, item, isTabs) => {
    var index = items.indexOf(item);
    if (index > -1) {
        return createItemPathByIndex(index, isTabs)
    }
    for (var i = 0; i < items.length; i++) {
        var targetItem = items[i];
        var tabOrGroupItems = targetItem.tabs || targetItem.items;
        if (tabOrGroupItems) {
            var itemPath = getItemPath(tabOrGroupItems, item, targetItem.tabs);
            if (itemPath) {
                return concatPaths(createItemPathByIndex(i, isTabs), itemPath)
            }
        }
    }
};
export function getLabelWidthByText(renderLabelOptions) {
    var $hiddenContainer = $("<div>").addClass(WIDGET_CLASS).addClass(HIDDEN_LABEL_CLASS).appendTo("body");
    var $label = renderLabel(renderLabelOptions).appendTo($hiddenContainer);
    var labelTextElement = $label.find("." + FIELD_ITEM_LABEL_TEXT_CLASS)[0];
    var result = labelTextElement.offsetWidth;
    $hiddenContainer.remove();
    return result
}
export function renderLabel(_ref) {
    var {
        text: text,
        id: id,
        location: location,
        alignment: alignment,
        labelID: labelID = null,
        markOptions: markOptions = {}
    } = _ref;
    if (!isDefined(text) || text.length <= 0) {
        return null
    }
    return $("<label>").addClass(FIELD_ITEM_LABEL_CLASS + " " + FIELD_ITEM_LABEL_LOCATION_CLASS + location).attr("for", id).attr("id", labelID).css("textAlign", alignment).append($("<span>").addClass(FIELD_ITEM_LABEL_CONTENT_CLASS).append($("<span>").addClass(FIELD_ITEM_LABEL_TEXT_CLASS).text(text), _renderLabelMark(markOptions)))
}
export function renderHelpText(helpText, helpID) {
    return $("<div>").addClass(FIELD_ITEM_HELP_TEXT_CLASS).attr("id", helpID).text(helpText)
}

function _renderLabelMark(_ref2) {
    var {
        isRequiredMark: isRequiredMark,
        requiredMark: requiredMark,
        isOptionalMark: isOptionalMark,
        optionalMark: optionalMark
    } = _ref2;
    if (!isRequiredMark && !isOptionalMark) {
        return null
    }
    return $("<span>").addClass(isRequiredMark ? FIELD_ITEM_REQUIRED_MARK_CLASS : FIELD_ITEM_OPTIONAL_MARK_CLASS).text(String.fromCharCode(160) + (isRequiredMark ? requiredMark : optionalMark))
}
export function renderButton(_ref3) {
    var {
        buttonOptions: buttonOptions,
        createComponentCallback: createComponentCallback
    } = _ref3;
    var $button = $("<div>");
    createComponentCallback($button, "dxButton", buttonOptions);
    return $button
}
export function convertAlignmentToJustifyContent(verticalAlignment) {
    switch (verticalAlignment) {
        case "center":
            return "center";
        case "bottom":
            return "flex-end";
        default:
            return "flex-start"
    }
}
export function convertAlignmentToTextAlign(horizontalAlignment) {
    return isDefined(horizontalAlignment) ? horizontalAlignment : "right"
}
export function adjustContainerAsButtonItem(_ref4) {
    var {
        $container: $container,
        justifyContent: justifyContent,
        textAlign: textAlign,
        cssItemClass: cssItemClass,
        targetColIndex: targetColIndex
    } = _ref4;
    $container.addClass(FIELD_BUTTON_ITEM_CLASS).css("textAlign", textAlign).addClass(FIELD_ITEM_CLASS).addClass(cssItemClass).addClass(isDefined(targetColIndex) ? "dx-col-" + targetColIndex : "");
    $container.parent().css("justifyContent", justifyContent)
}
