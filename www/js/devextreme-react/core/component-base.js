/*!
 * devextreme-react
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file in the root of the project for details.
 *
 * https://github.com/DevExpress/devextreme-react
 */

"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DX_REMOVE_EVENT = exports.ComponentBase = void 0;
var events = require("devextreme/events");
var React = require("react");
var react_dom_1 = require("react-dom");
var options_manager_1 = require("./options-manager");
var templates_manager_1 = require("./templates-manager");
var templates_renderer_1 = require("./templates-renderer");
var templates_store_1 = require("./templates-store");
var widget_config_1 = require("./widget-config");
var tree_1 = require("./configuration/react/tree");
var utils_1 = require("./configuration/utils");
var DX_REMOVE_EVENT = 'dxremove';
exports.DX_REMOVE_EVENT = DX_REMOVE_EVENT;
var ComponentBase = /** @class */ (function (_super) {
    __extends(ComponentBase, _super);
    function ComponentBase(props) {
        var _this = _super.call(this, props) || this;
        _this.isPortalComponent = false;
        _this._templateProps = [];
        _this.useDeferUpdateFlag = false;
        _this.useDeferUpdateForTemplates = false;
        _this._setTemplatesRendererRef = _this._setTemplatesRendererRef.bind(_this);
        _this._createWidget = _this._createWidget.bind(_this);
        _this._templatesStore = new templates_store_1.TemplatesStore(function () {
            if (_this._templatesRendererRef) {
                _this._templatesRendererRef.scheduleUpdate(_this.useDeferUpdateForTemplates);
            }
        });
        _this._templatesManager = new templates_manager_1.default(_this._templatesStore);
        _this._optionsManager = new options_manager_1.OptionsManager(_this._templatesManager);
        return _this;
    }
    ComponentBase.displayContentsStyle = function () {
        return utils_1.isIE()
            ? {
                width: '100%',
                height: '100%',
                padding: 0,
                margin: 0,
            }
            : { display: 'contents' };
    };
    ComponentBase.prototype.componentDidMount = function () {
        this._updateCssClasses(null, this.props);
    };
    ComponentBase.prototype.componentDidUpdate = function (prevProps) {
        this._updateCssClasses(prevProps, this.props);
        var config = this._getConfig();
        this._optionsManager.update(config);
        if (this._templatesRendererRef) {
            this._templatesRendererRef.scheduleUpdate(this.useDeferUpdateForTemplates);
        }
    };
    ComponentBase.prototype.componentWillUnmount = function () {
        if (this._instance) {
            events.triggerHandler(this._element, DX_REMOVE_EVENT);
            this._instance.dispose();
        }
        this._optionsManager.dispose();
    };
    ComponentBase.prototype._createWidget = function (element) {
        element = element || this._element;
        var config = this._getConfig();
        this._instance = new this._WidgetClass(element, __assign({ templatesRenderAsynchronously: true }, this._optionsManager.getInitialOptions(config)));
        if (this.useDeferUpdateFlag) {
            this.useDeferUpdateForTemplates = this._instance.option('integrationOptions.useDeferUpdateForTemplates');
        }
        this._optionsManager.setInstance(this._instance, config, this.subscribableOptions, this.independentEvents);
        this._instance.on('optionChanged', this._optionsManager.onOptionChanged);
    };
    ComponentBase.prototype._getConfig = function () {
        return tree_1.buildConfigTree({
            templates: this._templateProps,
            initialValuesProps: this._defaults,
            predefinedValuesProps: {},
            expectedChildren: this._expectedChildren,
        }, this.props);
    };
    ComponentBase.prototype._setTemplatesRendererRef = function (instance) {
        this._templatesRendererRef = instance;
    };
    ComponentBase.prototype._getElementProps = function () {
        var _this = this;
        var elementProps = {
            ref: function (element) { _this._element = element; },
        };
        widget_config_1.elementPropNames.forEach(function (name) {
            var props = _this.props;
            if (name in props) {
                elementProps[name] = props[name];
            }
        });
        return elementProps;
    };
    ComponentBase.prototype._updateCssClasses = function (prevProps, newProps) {
        var _a, _b;
        var prevClassName = prevProps ? widget_config_1.getClassName(prevProps) : undefined;
        var newClassName = widget_config_1.getClassName(newProps);
        if (prevClassName === newClassName) {
            return;
        }
        if (prevClassName) {
            var classNames = prevClassName.split(' ').filter(function (c) { return c; });
            if (classNames.length) {
                (_a = this._element.classList).remove.apply(_a, classNames);
            }
        }
        if (newClassName) {
            var classNames = newClassName.split(' ').filter(function (c) { return c; });
            if (classNames.length) {
                (_b = this._element.classList).add.apply(_b, classNames);
            }
        }
    };
    ComponentBase.prototype.renderChildren = function () {
        var children = this.props.children;
        return children;
    };
    ComponentBase.prototype.renderContent = function () {
        var _this = this;
        var children = this.props.children;
        return this.isPortalComponent && children
            ? React.createElement('div', {
                ref: function (node) {
                    if (node && _this.portalContainer !== node) {
                        _this.portalContainer = node;
                        _this.forceUpdate();
                    }
                },
                style: ComponentBase.displayContentsStyle(),
            })
            : this.renderChildren();
    };
    ComponentBase.prototype.renderPortal = function () {
        return this.portalContainer && react_dom_1.createPortal(this.renderChildren(), this.portalContainer);
    };
    ComponentBase.prototype.render = function () {
        return React.createElement(React.Fragment, {}, React.createElement('div', this._getElementProps(), this.renderContent(), React.createElement(templates_renderer_1.TemplatesRenderer, {
            templatesStore: this._templatesStore,
            ref: this._setTemplatesRendererRef,
        })), this.isPortalComponent && this.renderPortal());
    };
    return ComponentBase;
}(React.PureComponent));
exports.ComponentBase = ComponentBase;
