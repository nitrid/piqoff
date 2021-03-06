/**
 * DevExtreme (esm/renovation/component_wrapper/check_box.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import Editor from "./editor";
import {
    addAttributes,
    getAriaName
} from "./utils";
export default class CheckBox extends Editor {
    _useTemplates() {
        return false
    }
    _optionChanged(option) {
        var _this$_valueChangeAct;
        var {
            name: name,
            previousValue: previousValue,
            value: value
        } = option || {};
        switch (name) {
            case "value":
                null === (_this$_valueChangeAct = this._valueChangeAction) || void 0 === _this$_valueChangeAct ? void 0 : _this$_valueChangeAct.call(this, {
                    element: this.$element(),
                    previousValue: previousValue,
                    value: value,
                    event: this._valueChangeEventInstance
                });
                this._valueChangeEventInstance = void 0;
                super._optionChanged(option);
                break;
            case "onValueChanged":
                this._valueChangeAction = this._createActionByOption("onValueChanged", {
                    excludeValidators: ["disabled", "readOnly"]
                });
                break;
            default:
                super._optionChanged(option)
        }
        this._invalidate()
    }
    setAria(name, value) {
        var attrName = getAriaName(name);
        addAttributes(this.$element(), [{
            name: attrName,
            value: value
        }])
    }
}
