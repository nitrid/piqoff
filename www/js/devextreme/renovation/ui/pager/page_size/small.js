/**
 * DevExtreme (renovation/ui/pager/page_size/small.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.PageSizeSmall = exports.PageSizeSmallProps = exports.viewFunction = void 0;
var _inferno = require("inferno");
var _vdom = require("@devextreme/vdom");
var _select_box = require("../../select_box");
var _calculate_values_fitted_width = require("../utils/calculate_values_fitted_width");
var _get_element_width = require("../utils/get_element_width");
var _pager_props = require("../common/pager_props");
var _excluded = ["defaultPageSize", "pageSize", "pageSizeChange", "pageSizes", "parentRef"];

function _objectWithoutProperties(source, excluded) {
    if (null == source) {
        return {}
    }
    var target = _objectWithoutPropertiesLoose(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for (i = 0; i < sourceSymbolKeys.length; i++) {
            key = sourceSymbolKeys[i];
            if (excluded.indexOf(key) >= 0) {
                continue
            }
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) {
                continue
            }
            target[key] = source[key]
        }
    }
    return target
}

function _objectWithoutPropertiesLoose(source, excluded) {
    if (null == source) {
        return {}
    }
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for (i = 0; i < sourceKeys.length; i++) {
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) {
            continue
        }
        target[key] = source[key]
    }
    return target
}

function _extends() {
    _extends = Object.assign || function(target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key]
                }
            }
        }
        return target
    };
    return _extends.apply(this, arguments)
}

function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) {
            descriptor.writable = true
        }
        Object.defineProperty(target, descriptor.key, descriptor)
    }
}

function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) {
        _defineProperties(Constructor.prototype, protoProps)
    }
    if (staticProps) {
        _defineProperties(Constructor, staticProps)
    }
    return Constructor
}

function _assertThisInitialized(self) {
    if (void 0 === self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
    }
    return self
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
var viewFunction = function(_ref) {
    var _ref$props = _ref.props,
        pageSize = _ref$props.pageSize,
        pageSizeChange = _ref$props.pageSizeChange,
        pageSizes = _ref$props.pageSizes,
        width = _ref.width;
    return (0, _inferno.createComponentVNode)(2, _select_box.SelectBox, {
        displayExpr: "text",
        valueExpr: "value",
        dataSource: pageSizes,
        value: pageSize,
        valueChange: pageSizeChange,
        width: width
    })
};
exports.viewFunction = viewFunction;
var PageSizeSmallProps = {};
exports.PageSizeSmallProps = PageSizeSmallProps;
var PageSizeSmallPropsType = {
    defaultPageSize: _pager_props.PagerProps.pageSize
};
var PageSizeSmall = function(_InfernoComponent) {
    _inheritsLoose(PageSizeSmall, _InfernoComponent);

    function PageSizeSmall(props) {
        var _this;
        _this = _InfernoComponent.call(this, props) || this;
        _this._currentState = null;
        _this.state = {
            minWidth: 10,
            pageSize: void 0 !== _this.props.pageSize ? _this.props.pageSize : _this.props.defaultPageSize
        };
        _this.updateWidth = _this.updateWidth.bind(_assertThisInitialized(_this));
        return _this
    }
    var _proto = PageSizeSmall.prototype;
    _proto.createEffects = function() {
        return [new _vdom.InfernoEffect(this.updateWidth, [this.minWidth, this.__state_pageSize, this.props.pageSizeChange, this.props.pageSizes, this.props.defaultPageSize])]
    };
    _proto.updateEffects = function() {
        var _this$_effects$;
        null === (_this$_effects$ = this._effects[0]) || void 0 === _this$_effects$ ? void 0 : _this$_effects$.update([this.minWidth, this.__state_pageSize, this.props.pageSizeChange, this.props.pageSizes, this.props.defaultPageSize])
    };
    _proto.set_minWidth = function(value) {
        var _this2 = this;
        this.setState((function(state) {
            _this2._currentState = state;
            var newValue = value();
            _this2._currentState = null;
            return {
                minWidth: newValue
            }
        }))
    };
    _proto.set_pageSize = function(value) {
        var _this3 = this;
        this.setState((function(state) {
            var _this3$props$pageSize, _this3$props;
            _this3._currentState = state;
            var newValue = value();
            null === (_this3$props$pageSize = (_this3$props = _this3.props).pageSizeChange) || void 0 === _this3$props$pageSize ? void 0 : _this3$props$pageSize.call(_this3$props, newValue);
            _this3._currentState = null;
            return {
                pageSize: newValue
            }
        }))
    };
    _proto.updateWidth = function() {
        var _this4 = this;
        this.set_minWidth((function() {
            return (0, _get_element_width.getElementMinWidth)(_this4.props.parentRef.current) || _this4.minWidth
        }))
    };
    _proto.render = function() {
        var props = this.props;
        return viewFunction({
            props: _extends({}, props, {
                pageSize: this.__state_pageSize
            }),
            width: this.width,
            restAttributes: this.restAttributes
        })
    };
    _createClass(PageSizeSmall, [{
        key: "minWidth",
        get: function() {
            var state = this._currentState || this.state;
            return state.minWidth
        }
    }, {
        key: "__state_pageSize",
        get: function() {
            var state = this._currentState || this.state;
            return void 0 !== this.props.pageSize ? this.props.pageSize : state.pageSize
        }
    }, {
        key: "width",
        get: function() {
            return (0, _calculate_values_fitted_width.calculateValuesFittedWidth)(this.minWidth, this.props.pageSizes.map((function(p) {
                return p.value
            })))
        }
    }, {
        key: "restAttributes",
        get: function() {
            var _this$props$pageSize = _extends({}, this.props, {
                    pageSize: this.__state_pageSize
                }),
                restProps = (_this$props$pageSize.defaultPageSize, _this$props$pageSize.pageSize, _this$props$pageSize.pageSizeChange, _this$props$pageSize.pageSizes, _this$props$pageSize.parentRef, _objectWithoutProperties(_this$props$pageSize, _excluded));
            return restProps
        }
    }]);
    return PageSizeSmall
}(_vdom.InfernoComponent);
exports.PageSizeSmall = PageSizeSmall;
PageSizeSmall.defaultProps = _extends({}, PageSizeSmallPropsType);
