/**
 * DevExtreme (esm/ui/html_editor/modules/toolbar.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import Quill from "devextreme-quill";
import $ from "../../../core/renderer";
import BaseModule from "./base";
import Toolbar from "../../toolbar";
import "../../select_box";
import "../../color_box/color_view";
import "../../number_box";
import errors from "../../widget/ui.errors";
import WidgetCollector from "./widget_collector";
import {
    each
} from "../../../core/utils/iterator";
import {
    isString,
    isObject,
    isDefined,
    isEmptyObject,
    isBoolean
} from "../../../core/utils/type";
import {
    extend
} from "../../../core/utils/extend";
import localizationMessage from "../../../localization/message";
import {
    titleize,
    camelize
} from "../../../core/utils/inflector";
import eventsEngine from "../../../events/core/events_engine";
import {
    addNamespace
} from "../../../events/utils/index";
var ToolbarModule = BaseModule;
if (Quill) {
    var TOOLBAR_WRAPPER_CLASS = "dx-htmleditor-toolbar-wrapper";
    var TOOLBAR_CLASS = "dx-htmleditor-toolbar";
    var TOOLBAR_FORMAT_WIDGET_CLASS = "dx-htmleditor-toolbar-format";
    var TOOLBAR_SEPARATOR_CLASS = "dx-htmleditor-toolbar-separator";
    var TOOLBAR_MENU_SEPARATOR_CLASS = "dx-htmleditor-toolbar-menu-separator";
    var ACTIVE_FORMAT_CLASS = "dx-format-active";
    var BOX_ITEM_CONTENT_CLASS = "dx-box-item-content";
    var ICON_CLASS = "dx-icon";
    var SELECTION_CHANGE_EVENT = "selection-change";
    var DIALOG_COLOR_CAPTION = "dxHtmlEditor-dialogColorCaption";
    var DIALOG_BACKGROUND_CAPTION = "dxHtmlEditor-dialogBackgroundCaption";
    var DIALOG_LINK_CAPTION = "dxHtmlEditor-dialogLinkCaption";
    var DIALOG_LINK_FIELD_URL = "dxHtmlEditor-dialogLinkUrlField";
    var DIALOG_LINK_FIELD_TEXT = "dxHtmlEditor-dialogLinkTextField";
    var DIALOG_LINK_FIELD_TARGET = "dxHtmlEditor-dialogLinkTargetField";
    var DIALOG_LINK_FIELD_TARGET_CLASS = "dx-formdialog-field-target";
    var DIALOG_IMAGE_CAPTION = "dxHtmlEditor-dialogImageCaption";
    var DIALOG_IMAGE_FIELD_URL = "dxHtmlEditor-dialogImageUrlField";
    var DIALOG_IMAGE_FIELD_ALT = "dxHtmlEditor-dialogImageAltField";
    var DIALOG_IMAGE_FIELD_WIDTH = "dxHtmlEditor-dialogImageWidthField";
    var DIALOG_IMAGE_FIELD_HEIGHT = "dxHtmlEditor-dialogImageHeightField";
    var DIALOG_TABLE_FIELD_COLUMNS = "dxHtmlEditor-dialogInsertTableRowsField";
    var DIALOG_TABLE_FIELD_ROWS = "dxHtmlEditor-dialogInsertTableColumnsField";
    var DIALOG_TABLE_CAPTION = "dxHtmlEditor-dialogInsertTableCaption";
    var TABLE_OPERATIONS = ["insertTable", "insertRowAbove", "insertRowBelow", "insertColumnLeft", "insertColumnRight", "deleteColumn", "deleteRow", "deleteTable"];
    var USER_ACTION = "user";
    var SILENT_ACTION = "silent";
    var localize = name => localizationMessage.format("dxHtmlEditor-".concat(camelize(name)));
    var localizeValue = (value, name) => {
        if ("header" === name) {
            var isHeaderValue = isDefined(value) && false !== value;
            return isHeaderValue ? "".concat(localize("heading"), " ").concat(value) : localize("normalText")
        }
        return localize(value) || value
    };
    ToolbarModule = class extends BaseModule {
        constructor(quill, options) {
            super(quill, options);
            this._toolbarWidgets = new WidgetCollector;
            this._formatHandlers = this._getFormatHandlers();
            if (isDefined(options.items)) {
                this._addCallbacks();
                this._renderToolbar();
                this.quill.on("editor-change", eventName => {
                    var isSelectionChanged = eventName === SELECTION_CHANGE_EVENT;
                    this._updateToolbar(isSelectionChanged)
                })
            }
        }
        _applyFormat(formatArgs, event) {
            this.saveValueChangeEvent(event);
            this.quill.format(...formatArgs)
        }
        _addCallbacks() {
            this.addCleanCallback(this.clean.bind(this));
            this.editorInstance.addContentInitializedCallback(this.updateHistoryWidgets.bind(this))
        }
        _updateToolbar(isSelectionChanged) {
            this.updateFormatWidgets(isSelectionChanged);
            this.updateHistoryWidgets();
            this.updateTableWidgets()
        }
        _getDefaultClickHandler(name) {
            return _ref => {
                var {
                    event: event
                } = _ref;
                var formats = this.quill.getFormat();
                var value = formats[name];
                var newValue = !(isBoolean(value) ? value : isDefined(value));
                this._applyFormat([name, newValue, USER_ACTION], event);
                this._updateFormatWidget(name, newValue, formats)
            }
        }
        _updateFormatWidget(name, isApplied, formats) {
            var widget = this._toolbarWidgets.getByName(name);
            if (!widget) {
                return
            }
            if (isApplied) {
                this._markActiveFormatWidget(name, widget, formats)
            } else {
                this._resetFormatWidget(name, widget);
                if (Object.prototype.hasOwnProperty.call(name)) {
                    delete formats[name]
                }
            }
            this._toggleClearFormatting(isApplied || !isEmptyObject(formats))
        }
        _getFormatHandlers() {
            return {
                clear: _ref2 => {
                    var {
                        event: event
                    } = _ref2;
                    var range = this.quill.getSelection();
                    if (range) {
                        this.saveValueChangeEvent(event);
                        this.quill.removeFormat(range);
                        this.updateFormatWidgets()
                    }
                },
                link: this._prepareLinkHandler(),
                image: this._prepareImageHandler(),
                color: this._prepareColorClickHandler("color"),
                background: this._prepareColorClickHandler("background"),
                orderedList: this._prepareShortcutHandler("list", "ordered"),
                bulletList: this._prepareShortcutHandler("list", "bullet"),
                alignLeft: this._prepareShortcutHandler("align", "left"),
                alignCenter: this._prepareShortcutHandler("align", "center"),
                alignRight: this._prepareShortcutHandler("align", "right"),
                alignJustify: this._prepareShortcutHandler("align", "justify"),
                codeBlock: this._getDefaultClickHandler("code-block"),
                undo: _ref3 => {
                    var {
                        event: event
                    } = _ref3;
                    this.saveValueChangeEvent(event);
                    this.quill.history.undo()
                },
                redo: _ref4 => {
                    var {
                        event: event
                    } = _ref4;
                    this.saveValueChangeEvent(event);
                    this.quill.history.redo()
                },
                increaseIndent: _ref5 => {
                    var {
                        event: event
                    } = _ref5;
                    this._applyFormat(["indent", "+1", USER_ACTION], event)
                },
                decreaseIndent: _ref6 => {
                    var {
                        event: event
                    } = _ref6;
                    this._applyFormat(["indent", "-1", USER_ACTION], event)
                },
                superscript: this._prepareShortcutHandler("script", "super"),
                subscript: this._prepareShortcutHandler("script", "sub"),
                insertTable: this._prepareInsertTableHandler(),
                insertRowAbove: this._getTableOperationHandler("insertRowAbove"),
                insertRowBelow: this._getTableOperationHandler("insertRowBelow"),
                insertColumnLeft: this._getTableOperationHandler("insertColumnLeft"),
                insertColumnRight: this._getTableOperationHandler("insertColumnRight"),
                deleteColumn: this._getTableOperationHandler("deleteColumn"),
                deleteRow: this._getTableOperationHandler("deleteRow"),
                deleteTable: this._getTableOperationHandler("deleteTable")
            }
        }
        _prepareShortcutHandler(name, shortcutValue) {
            return _ref7 => {
                var {
                    event: event
                } = _ref7;
                var formats = this.quill.getFormat();
                var value = formats[name] === shortcutValue ? false : shortcutValue;
                this._applyFormat([name, value, USER_ACTION], event);
                this.updateFormatWidgets(true)
            }
        }
        _prepareLinkHandler() {
            return () => {
                this.quill.focus();
                var selection = this.quill.getSelection();
                var hasEmbedContent = this._hasEmbedContent(selection);
                var formats = selection ? this.quill.getFormat() : {};
                var formData = {
                    href: formats.link || "",
                    text: selection && !hasEmbedContent ? this.quill.getText(selection) : "",
                    target: Object.prototype.hasOwnProperty.call(formats, "target") ? !!formats.target : true
                };
                this.editorInstance.formDialogOption("title", localizationMessage.format(DIALOG_LINK_CAPTION));
                var promise = this.editorInstance.showFormDialog({
                    formData: formData,
                    items: this._getLinkFormItems(selection)
                });
                promise.done((formData, event) => {
                    if (selection && !hasEmbedContent) {
                        var text = formData.text || formData.href;
                        var {
                            index: index,
                            length: length
                        } = selection;
                        formData.text = void 0;
                        this.saveValueChangeEvent(event);
                        length && this.quill.deleteText(index, length, SILENT_ACTION);
                        this.quill.insertText(index, text, "link", formData, USER_ACTION);
                        this.quill.setSelection(index + text.length, 0, USER_ACTION)
                    } else {
                        formData.text = !selection && !formData.text ? formData.href : formData.text;
                        this._applyFormat(["link", formData, USER_ACTION], event)
                    }
                });
                promise.fail(() => {
                    this.quill.focus()
                })
            }
        }
        _hasEmbedContent(selection) {
            return !!selection && this.quill.getText(selection).trim().length < selection.length
        }
        _getLinkFormItems(selection) {
            return [{
                dataField: "href",
                label: {
                    text: localizationMessage.format(DIALOG_LINK_FIELD_URL)
                }
            }, {
                dataField: "text",
                label: {
                    text: localizationMessage.format(DIALOG_LINK_FIELD_TEXT)
                },
                visible: !this._hasEmbedContent(selection)
            }, {
                dataField: "target",
                editorType: "dxCheckBox",
                editorOptions: {
                    text: localizationMessage.format(DIALOG_LINK_FIELD_TARGET)
                },
                cssClass: DIALOG_LINK_FIELD_TARGET_CLASS,
                label: {
                    visible: false
                }
            }]
        }
        _prepareImageHandler() {
            return () => {
                var formData = this.quill.getFormat();
                var isUpdateDialog = Object.prototype.hasOwnProperty.call(formData, "imageSrc");
                var defaultIndex = this._defaultPasteIndex;
                if (isUpdateDialog) {
                    var {
                        imageSrc: imageSrc
                    } = this.quill.getFormat(defaultIndex - 1, 1);
                    formData.src = formData.imageSrc;
                    delete formData.imageSrc;
                    if (!imageSrc || 0 === defaultIndex) {
                        this.quill.setSelection(defaultIndex + 1, 0, SILENT_ACTION)
                    }
                }
                var formatIndex = this._embedFormatIndex;
                this.editorInstance.formDialogOption("title", localizationMessage.format(DIALOG_IMAGE_CAPTION));
                var promise = this.editorInstance.showFormDialog({
                    formData: formData,
                    items: this._imageFormItems
                });
                promise.done((formData, event) => {
                    var index = defaultIndex;
                    this.saveValueChangeEvent(event);
                    if (isUpdateDialog) {
                        index = formatIndex;
                        this.quill.deleteText(index, 1, SILENT_ACTION)
                    }
                    this.quill.insertEmbed(index, "extendedImage", formData, USER_ACTION);
                    this.quill.setSelection(index + 1, 0, USER_ACTION)
                }).always(() => {
                    this.quill.focus()
                })
            }
        }
        get _insertTableFormItems() {
            return [{
                dataField: "columns",
                editorType: "dxNumberBox",
                editorOptions: {
                    min: 1
                },
                label: {
                    text: localizationMessage.format(DIALOG_TABLE_FIELD_COLUMNS)
                }
            }, {
                dataField: "rows",
                editorType: "dxNumberBox",
                editorOptions: {
                    min: 1
                },
                label: {
                    text: localizationMessage.format(DIALOG_TABLE_FIELD_ROWS)
                }
            }]
        }
        _prepareInsertTableHandler() {
            return () => {
                var formats = this.quill.getFormat();
                var isTableFocused = Object.prototype.hasOwnProperty.call(formats, "table") || Object.prototype.hasOwnProperty.call(formats, "tableHeaderCell");
                if (isTableFocused) {
                    this.quill.focus();
                    return
                }
                this.editorInstance.formDialogOption("title", localizationMessage.format(DIALOG_TABLE_CAPTION));
                var promise = this.editorInstance.showFormDialog({
                    formData: {
                        rows: 1,
                        columns: 1
                    },
                    items: this._insertTableFormItems
                });
                promise.done((formData, event) => {
                    this.quill.focus();
                    var table = this.quill.getModule("table");
                    if (table) {
                        this.saveValueChangeEvent(event);
                        var {
                            columns: columns,
                            rows: rows
                        } = formData;
                        table.insertTable(columns, rows)
                    }
                }).always(() => {
                    this.quill.focus()
                })
            }
        }
        _getTableOperationHandler(operationName) {
            for (var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                rest[_key - 1] = arguments[_key]
            }
            return () => {
                var table = this.quill.getModule("table");
                if (!table) {
                    return
                }
                this.quill.focus();
                return table[operationName](...rest)
            }
        }
        get _embedFormatIndex() {
            var selection = this.quill.getSelection();
            if (selection) {
                if (selection.length) {
                    return selection.index
                } else {
                    return selection.index - 1
                }
            } else {
                return this.quill.getLength()
            }
        }
        get _defaultPasteIndex() {
            var _selection$index;
            var selection = this.quill.getSelection();
            return null !== (_selection$index = null === selection || void 0 === selection ? void 0 : selection.index) && void 0 !== _selection$index ? _selection$index : this.quill.getLength()
        }
        get _imageFormItems() {
            return [{
                dataField: "src",
                label: {
                    text: localizationMessage.format(DIALOG_IMAGE_FIELD_URL)
                }
            }, {
                dataField: "width",
                label: {
                    text: localizationMessage.format(DIALOG_IMAGE_FIELD_WIDTH)
                }
            }, {
                dataField: "height",
                label: {
                    text: localizationMessage.format(DIALOG_IMAGE_FIELD_HEIGHT)
                }
            }, {
                dataField: "alt",
                label: {
                    text: localizationMessage.format(DIALOG_IMAGE_FIELD_ALT)
                }
            }]
        }
        _renderToolbar() {
            var container = this.options.container || this._getContainer();
            this._$toolbar = $("<div>").addClass(TOOLBAR_CLASS).appendTo(container);
            this._$toolbarContainer = $(container).addClass(TOOLBAR_WRAPPER_CLASS);
            eventsEngine.on(this._$toolbarContainer, addNamespace("mousedown", this.editorInstance.NAME), e => {
                e.preventDefault()
            });
            this.toolbarInstance = this.editorInstance._createComponent(this._$toolbar, Toolbar, this.toolbarConfig);
            this.editorInstance.on("optionChanged", _ref8 => {
                var {
                    name: name
                } = _ref8;
                if ("readOnly" === name || "disabled" === name) {
                    this.toolbarInstance.option("disabled", this.isInteractionDisabled)
                }
            })
        }
        get toolbarConfig() {
            return {
                dataSource: this._prepareToolbarItems(),
                disabled: this.isInteractionDisabled,
                menuContainer: this._$toolbarContainer,
                multiline: this.isMultilineMode()
            }
        }
        get isInteractionDisabled() {
            return this.editorInstance.option("readOnly") || this.editorInstance.option("disabled")
        }
        isMultilineMode() {
            var _this$options$multili;
            return null !== (_this$options$multili = this.options.multiline) && void 0 !== _this$options$multili ? _this$options$multili : true
        }
        clean() {
            this._toolbarWidgets.clear();
            if (this._$toolbarContainer) {
                this._$toolbarContainer.empty().removeClass(TOOLBAR_WRAPPER_CLASS)
            }
        }
        repaint() {
            this.toolbarInstance && this.toolbarInstance.repaint()
        }
        _getContainer() {
            var $container = $("<div>");
            this.editorInstance.$element().prepend($container);
            return $container
        }
        _detectRenamedOptions(item) {
            if (isObject(item)) {
                each([{
                    newName: "name",
                    oldName: "formatName"
                }, {
                    newName: "acceptedValues",
                    oldName: "formatValues"
                }], (index, optionName) => {
                    if (Object.prototype.hasOwnProperty.call(item, optionName.oldName)) {
                        errors.log("W1016", optionName.oldName, optionName.newName)
                    }
                })
            }
        }
        _prepareToolbarItems() {
            var resultItems = [];
            each(this.options.items, (index, item) => {
                var newItem;
                this._detectRenamedOptions(item);
                if (isObject(item)) {
                    newItem = this._handleObjectItem(item)
                } else if (isString(item)) {
                    var buttonItemConfig = this._prepareButtonItemConfig(item);
                    newItem = this._getToolbarItem(buttonItemConfig)
                }
                if (newItem) {
                    resultItems.push(newItem)
                }
            });
            return resultItems
        }
        _handleObjectItem(item) {
            if (item.name && item.acceptedValues && this._isAcceptableItem(item.widget, "dxSelectBox")) {
                var selectItemConfig = this._prepareSelectItemConfig(item);
                return this._getToolbarItem(selectItemConfig)
            } else if (item.name && this._isAcceptableItem(item.widget, "dxButton")) {
                var defaultButtonItemConfig = this._prepareButtonItemConfig(item.name);
                var buttonItemConfig = extend(true, defaultButtonItemConfig, item);
                return this._getToolbarItem(buttonItemConfig)
            } else {
                return this._getToolbarItem(item)
            }
        }
        _isAcceptableItem(widget, acceptableWidgetName) {
            return !widget || widget === acceptableWidgetName
        }
        _prepareButtonItemConfig(name) {
            var iconName = "clear" === name ? "clearformat" : name;
            var buttonText = titleize(name);
            return {
                widget: "dxButton",
                name: name,
                options: {
                    hint: localize(buttonText),
                    text: localize(buttonText),
                    icon: iconName.toLowerCase(),
                    onClick: this._formatHandlers[name] || this._getDefaultClickHandler(name),
                    stylingMode: "text"
                },
                showText: "inMenu"
            }
        }
        _prepareSelectItemConfig(item) {
            var {
                name: name,
                acceptedValues: acceptedValues
            } = item;
            return extend(true, {
                widget: "dxSelectBox",
                name: name,
                options: {
                    stylingMode: "filled",
                    dataSource: acceptedValues,
                    displayExpr: value => localizeValue(value, name),
                    placeholder: localize(name),
                    onValueChanged: e => {
                        if (!this._isReset) {
                            this._hideAdaptiveMenu();
                            this._applyFormat([name, e.value, USER_ACTION], e.event);
                            this._setValueSilent(e.component, e.value)
                        }
                    }
                }
            }, item)
        }
        _hideAdaptiveMenu() {
            if (this.toolbarInstance.option("overflowMenuVisible")) {
                this.toolbarInstance.option("overflowMenuVisible", false)
            }
        }
        _prepareColorClickHandler(name) {
            return () => {
                var formData = this.quill.getFormat();
                var caption = "color" === name ? DIALOG_COLOR_CAPTION : DIALOG_BACKGROUND_CAPTION;
                this.editorInstance.formDialogOption("title", localizationMessage.format(caption));
                var promise = this.editorInstance.showFormDialog({
                    formData: formData,
                    items: [{
                        dataField: name,
                        editorType: "dxColorView",
                        editorOptions: {
                            onContentReady: e => {
                                $(e.element).closest(".".concat(BOX_ITEM_CONTENT_CLASS)).css("flexBasis", "auto")
                            },
                            focusStateEnabled: false
                        },
                        label: {
                            visible: false
                        }
                    }]
                });
                promise.done((formData, event) => {
                    this._applyFormat([name, formData[name], USER_ACTION], event)
                });
                promise.fail(() => {
                    this.quill.focus()
                })
            }
        }
        _getToolbarItem(item) {
            var baseItem = {
                options: {
                    onInitialized: e => {
                        if (item.name) {
                            e.component.$element().addClass(TOOLBAR_FORMAT_WIDGET_CLASS);
                            e.component.$element().toggleClass("dx-".concat(item.name.toLowerCase(), "-format"), !!item.name);
                            this._toolbarWidgets.add(item.name, e.component)
                        }
                    }
                }
            };
            var multilineItem = this.isMultilineMode() ? {
                location: "before",
                locateInMenu: "never"
            } : {};
            return extend(true, {
                location: "before",
                locateInMenu: "auto"
            }, this._getDefaultConfig(item.name), item, baseItem, multilineItem)
        }
        _getDefaultItemsConfig() {
            return {
                clear: {
                    options: {
                        disabled: true
                    }
                },
                undo: {
                    options: {
                        disabled: true
                    }
                },
                redo: {
                    options: {
                        disabled: true
                    }
                },
                insertRowAbove: {
                    options: {
                        disabled: true
                    }
                },
                insertRowBelow: {
                    options: {
                        disabled: true
                    }
                },
                insertColumnLeft: {
                    options: {
                        disabled: true
                    }
                },
                insertColumnRight: {
                    options: {
                        disabled: true
                    }
                },
                deleteRow: {
                    options: {
                        disabled: true
                    }
                },
                deleteColumn: {
                    options: {
                        disabled: true
                    }
                },
                deleteTable: {
                    options: {
                        disabled: true
                    }
                },
                separator: {
                    template: (data, index, element) => {
                        $(element).addClass(TOOLBAR_SEPARATOR_CLASS)
                    },
                    menuItemTemplate: (data, index, element) => {
                        $(element).addClass(TOOLBAR_MENU_SEPARATOR_CLASS)
                    }
                }
            }
        }
        _getDefaultConfig(name) {
            return this._getDefaultItemsConfig()[name]
        }
        updateHistoryWidgets() {
            var historyModule = this.quill.history;
            if (!historyModule) {
                return
            }
            var {
                undo: undoOps,
                redo: redoOps
            } = historyModule.stack;
            this._updateManipulationWidget(this._toolbarWidgets.getByName("undo"), Boolean(undoOps.length));
            this._updateManipulationWidget(this._toolbarWidgets.getByName("redo"), Boolean(redoOps.length))
        }
        updateTableWidgets() {
            var table = this.quill.getModule("table");
            if (!table) {
                return
            }
            var selection = this.quill.getSelection();
            var {
                table: tableCell,
                tableHeaderCell: tableHeaderCell
            } = selection && this.quill.getFormat(selection) || {};
            var isTableOperationsEnabled = Boolean(tableCell) || Boolean(tableHeaderCell);
            TABLE_OPERATIONS.forEach(operationName => {
                var isInsertTable = "insertTable" === operationName;
                var widget = this._toolbarWidgets.getByName(operationName);
                this._updateManipulationWidget(widget, isInsertTable ? !isTableOperationsEnabled : isTableOperationsEnabled)
            })
        }
        _updateManipulationWidget(widget, isOperationEnabled) {
            if (!widget) {
                return
            }
            widget.option("disabled", !isOperationEnabled)
        }
        updateFormatWidgets(isResetRequired) {
            var selection = this.quill.getSelection();
            if (!selection) {
                return
            }
            var formats = this.quill.getFormat(selection);
            var hasFormats = !isEmptyObject(formats);
            if (!hasFormats || isResetRequired) {
                this._resetFormatWidgets()
            }
            for (var formatName in formats) {
                var widgetName = this._getFormatWidgetName(formatName, formats);
                var formatWidget = this._toolbarWidgets.getByName(widgetName) || this._toolbarWidgets.getByName(formatName);
                if (!formatWidget) {
                    continue
                }
                this._markActiveFormatWidget(formatName, formatWidget, formats)
            }
            this._toggleClearFormatting(hasFormats || selection.length > 1)
        }
        _markActiveFormatWidget(name, widget, formats) {
            if (this._isColorFormat(name)) {
                this._updateColorWidget(name, formats[name])
            }
            if ("value" in widget.option()) {
                this._setValueSilent(widget, formats[name])
            } else {
                widget.$element().addClass(ACTIVE_FORMAT_CLASS)
            }
        }
        _toggleClearFormatting(hasFormats) {
            var clearWidget = this._toolbarWidgets.getByName("clear");
            if (clearWidget) {
                clearWidget.option("disabled", !hasFormats)
            }
        }
        _isColorFormat(name) {
            return "color" === name || "background" === name
        }
        _updateColorWidget(name, color) {
            var formatWidget = this._toolbarWidgets.getByName(name);
            if (!formatWidget) {
                return
            }
            formatWidget.$element().find(".".concat(ICON_CLASS)).css("borderBottomColor", color || "transparent")
        }
        _getFormatWidgetName(name, formats) {
            var widgetName;
            switch (name) {
                case "align":
                    widgetName = name + titleize(formats[name]);
                    break;
                case "list":
                    widgetName = formats[name] + titleize(name);
                    break;
                case "code-block":
                    widgetName = "codeBlock";
                    break;
                case "script":
                    widgetName = formats[name] + name;
                    break;
                case "imageSrc":
                    widgetName = "image";
                    break;
                default:
                    widgetName = name
            }
            return widgetName
        }
        _setValueSilent(widget, value) {
            this._isReset = true;
            widget.option("value", value);
            this._isReset = false
        }
        _resetFormatWidgets() {
            this._toolbarWidgets.each((name, widget) => {
                this._resetFormatWidget(name, widget)
            })
        }
        _resetFormatWidget(name, widget) {
            widget.$element().removeClass(ACTIVE_FORMAT_CLASS);
            if (this._isColorFormat(name)) {
                this._updateColorWidget(name)
            }
            if ("clear" === name) {
                widget.option("disabled", true)
            }
            if ("dxSelectBox" === widget.NAME) {
                this._setValueSilent(widget, null)
            }
        }
        addClickHandler(name, handler) {
            this._formatHandlers[name] = handler;
            var formatWidget = this._toolbarWidgets.getByName(name);
            if (formatWidget && "dxButton" === formatWidget.NAME) {
                formatWidget.option("onClick", handler)
            }
        }
    }
}
export default ToolbarModule;
