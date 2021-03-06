/**
 * DevExtreme (esm/ui/file_manager/ui.file_manager.dialog.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import $ from "../../core/renderer";
import {
    extend
} from "../../core/utils/extend";
import {
    isDefined
} from "../../core/utils/type";
import messageLocalization from "../../localization/message";
import Widget from "../widget/ui.widget";
import Popup from "../popup";
var FILE_MANAGER_DIALOG_CONTENT = "dx-filemanager-dialog";
var FILE_MANAGER_DIALOG_POPUP = "dx-filemanager-dialog-popup";
class FileManagerDialogBase extends Widget {
    _initMarkup() {
        super._initMarkup();
        this._createOnClosedAction();
        var options = this._getDialogOptions();
        var $popup = $("<div>").addClass(FILE_MANAGER_DIALOG_POPUP).appendTo(this.$element());
        if (options.popupCssClass) {
            $popup.addClass(options.popupCssClass)
        }
        var popupOptions = {
            showTitle: true,
            title: options.title,
            visible: false,
            closeOnOutsideClick: true,
            contentTemplate: this._createContentTemplate.bind(this),
            toolbarItems: [{
                widget: "dxButton",
                toolbar: "bottom",
                location: "after",
                options: {
                    text: options.buttonText,
                    onClick: this._applyDialogChanges.bind(this)
                }
            }, {
                widget: "dxButton",
                toolbar: "bottom",
                location: "after",
                options: {
                    text: messageLocalization.format("dxFileManager-dialogButtonCancel"),
                    onClick: this._closeDialog.bind(this)
                }
            }],
            onInitialized: _ref => {
                var {
                    component: component
                } = _ref;
                component.registerKeyHandler("enter", this._applyDialogChanges.bind(this))
            },
            onHidden: this._onPopupHidden.bind(this),
            onShown: this._onPopupShown.bind(this)
        };
        if (isDefined(options.height)) {
            popupOptions.height = options.height
        }
        if (isDefined(options.maxHeight)) {
            popupOptions.maxHeight = options.maxHeight
        }
        this._popup = this._createComponent($popup, Popup, popupOptions)
    }
    show() {
        this._dialogResult = null;
        this._popup.show()
    }
    _getDialogOptions() {
        return {
            title: "Title",
            buttonText: "ButtonText",
            contentCssClass: "",
            popupCssClass: ""
        }
    }
    _createContentTemplate(element) {
        this._$contentElement = $("<div>").appendTo(element).addClass(FILE_MANAGER_DIALOG_CONTENT);
        var cssClass = this._getDialogOptions().contentCssClass;
        if (cssClass) {
            this._$contentElement.addClass(cssClass)
        }
    }
    _getDialogResult() {
        return null
    }
    _applyDialogChanges() {
        var result = this._getDialogResult();
        if (result) {
            this._dialogResult = result;
            this._closeDialog()
        }
    }
    _closeDialog() {
        this._popup.hide()
    }
    _onPopupHidden() {
        this._onClosedAction({
            dialogResult: this._dialogResult
        })
    }
    _onPopupShown() {}
    _createOnClosedAction() {
        this._onClosedAction = this._createActionByOption("onClosed")
    }
    _setTitle(newTitle) {
        this._popup.option("title", newTitle)
    }
    _setButtonText(newText) {
        this._popup.option("toolbarItems[0].options.text", newText)
    }
    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            onClosed: null
        })
    }
    _optionChanged(args) {
        var name = args.name;
        switch (name) {
            case "onClosed":
                this._createOnPathChangedAction();
                break;
            default:
                super._optionChanged(args)
        }
    }
}
export default FileManagerDialogBase;
