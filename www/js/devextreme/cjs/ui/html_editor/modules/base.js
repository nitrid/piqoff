/**
 * DevExtreme (cjs/ui/html_editor/modules/base.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.default = void 0;
var _devextremeQuill = _interopRequireDefault(require("devextreme-quill"));
var _empty = _interopRequireDefault(require("./empty"));

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    }
}

function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    _setPrototypeOf(subClass, superClass)
}

function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function(o, p) {
        o.__proto__ = p;
        return o
    };
    return _setPrototypeOf(o, p)
}
var BaseModule = _empty.default;
if (_devextremeQuill.default) {
    var BaseQuillModule = _devextremeQuill.default.import("core/module");
    BaseModule = function(_BaseQuillModule) {
        _inheritsLoose(BaseHtmlEditorModule, _BaseQuillModule);

        function BaseHtmlEditorModule(quill, options) {
            var _this;
            _this = _BaseQuillModule.call(this, quill, options) || this;
            _this.editorInstance = options.editorInstance;
            return _this
        }
        var _proto = BaseHtmlEditorModule.prototype;
        _proto.saveValueChangeEvent = function(event) {
            this.editorInstance._saveValueChangeEvent(event)
        };
        _proto.addCleanCallback = function(callback) {
            this.editorInstance.addCleanCallback(callback)
        };
        return BaseHtmlEditorModule
    }(BaseQuillModule)
}
var _default = BaseModule;
exports.default = _default;
module.exports = exports.default;
module.exports.default = exports.default;
