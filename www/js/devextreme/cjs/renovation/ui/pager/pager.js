/**
 * DevExtreme (cjs/renovation/ui/pager/pager.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.Pager = exports.viewFunction = void 0;
var _inferno = require("inferno");
var _vdom = require("@devextreme/vdom");
var _resizable_container = require("./resizable_container");
var _pager_props = require("./common/pager_props");
var _content = require("./content");
var _combine_classes = require("../../utils/combine_classes");
var _excluded = ["className", "defaultPageIndex", "defaultPageSize", "displayMode", "gridCompatibility", "hasKnownLastPage", "infoText", "lightModeEnabled", "maxPagesCount", "onKeyDown", "pageCount", "pageIndex", "pageIndexChange", "pageSize", "pageSizeChange", "pageSizes", "pagesCountText", "pagesNavigatorVisible", "rtlEnabled", "showInfo", "showNavigationButtons", "showPageSizes", "totalCount", "visible"];

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

function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        })
    } else {
        obj[key] = value
    }
    return obj
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
var viewFunction = function(_ref) {
    var pagerProps = _ref.pagerProps,
        restAttributes = _ref.restAttributes;
    return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, _resizable_container.ResizableContainer, _extends({
        contentTemplate: _content.PagerContent,
        pagerProps: pagerProps
    }, restAttributes)))
};
exports.viewFunction = viewFunction;
var Pager = function(_InfernoWrapperCompon) {
    _inheritsLoose(Pager, _InfernoWrapperCompon);

    function Pager(props) {
        var _this;
        _this = _InfernoWrapperCompon.call(this, props) || this;
        _this._currentState = null;
        _this.state = {
            pageIndex: void 0 !== _this.props.pageIndex ? _this.props.pageIndex : _this.props.defaultPageIndex,
            pageSize: void 0 !== _this.props.pageSize ? _this.props.pageSize : _this.props.defaultPageSize
        };
        _this.pageIndexChange = _this.pageIndexChange.bind(_assertThisInitialized(_this));
        _this.pageSizeChange = _this.pageSizeChange.bind(_assertThisInitialized(_this));
        return _this
    }
    var _proto = Pager.prototype;
    _proto.set_pageIndex = function(value) {
        var _this2 = this;
        this.setState((function(state) {
            var _this2$props$pageInde, _this2$props;
            _this2._currentState = state;
            var newValue = value();
            null === (_this2$props$pageInde = (_this2$props = _this2.props).pageIndexChange) || void 0 === _this2$props$pageInde ? void 0 : _this2$props$pageInde.call(_this2$props, newValue);
            _this2._currentState = null;
            return {
                pageIndex: newValue
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
    _proto.pageIndexChange = function(newPageIndex) {
        if (this.props.gridCompatibility) {
            this.set_pageIndex((function() {
                return newPageIndex + 1
            }))
        } else {
            this.set_pageIndex((function() {
                return newPageIndex
            }))
        }
    };
    _proto.pageSizeChange = function(newPageSize) {
        this.set_pageSize((function() {
            return newPageSize
        }))
    };
    _proto.render = function() {
        var props = this.props;
        return viewFunction({
            props: _extends({}, props, {
                pageIndex: this.__state_pageIndex,
                pageSize: this.__state_pageSize
            }),
            pageIndexChange: this.pageIndexChange,
            pageIndex: this.pageIndex,
            pageSizeChange: this.pageSizeChange,
            className: this.className,
            pagerProps: this.pagerProps,
            restAttributes: this.restAttributes
        })
    };
    _createClass(Pager, [{
        key: "__state_pageIndex",
        get: function() {
            var state = this._currentState || this.state;
            return void 0 !== this.props.pageIndex ? this.props.pageIndex : state.pageIndex
        }
    }, {
        key: "__state_pageSize",
        get: function() {
            var state = this._currentState || this.state;
            return void 0 !== this.props.pageSize ? this.props.pageSize : state.pageSize
        }
    }, {
        key: "pageIndex",
        get: function() {
            if (this.props.gridCompatibility) {
                return this.__state_pageIndex - 1
            }
            return this.__state_pageIndex
        }
    }, {
        key: "className",
        get: function() {
            if (this.props.gridCompatibility) {
                return (0, _combine_classes.combineClasses)(_defineProperty({
                    "dx-datagrid-pager": true
                }, "".concat(this.props.className), !!this.props.className))
            }
            return this.props.className
        }
    }, {
        key: "pagerProps",
        get: function() {
            var _this4 = this;
            return _extends({}, _extends({}, this.props, {
                pageIndex: this.__state_pageIndex,
                pageSize: this.__state_pageSize
            }), {
                className: this.className,
                pageIndex: this.pageIndex,
                pageIndexChange: function(pageIndex) {
                    return _this4.pageIndexChange(pageIndex)
                },
                pageSizeChange: function(pageSize) {
                    return _this4.pageSizeChange(pageSize)
                }
            })
        }
    }, {
        key: "restAttributes",
        get: function() {
            var _this$props$pageIndex = _extends({}, this.props, {
                    pageIndex: this.__state_pageIndex,
                    pageSize: this.__state_pageSize
                }),
                restProps = (_this$props$pageIndex.className, _this$props$pageIndex.defaultPageIndex, _this$props$pageIndex.defaultPageSize, _this$props$pageIndex.displayMode, _this$props$pageIndex.gridCompatibility, _this$props$pageIndex.hasKnownLastPage, _this$props$pageIndex.infoText, _this$props$pageIndex.lightModeEnabled, _this$props$pageIndex.maxPagesCount, _this$props$pageIndex.onKeyDown, _this$props$pageIndex.pageCount, _this$props$pageIndex.pageIndex, _this$props$pageIndex.pageIndexChange, _this$props$pageIndex.pageSize, _this$props$pageIndex.pageSizeChange, _this$props$pageIndex.pageSizes, _this$props$pageIndex.pagesCountText, _this$props$pageIndex.pagesNavigatorVisible, _this$props$pageIndex.rtlEnabled, _this$props$pageIndex.showInfo, _this$props$pageIndex.showNavigationButtons, _this$props$pageIndex.showPageSizes, _this$props$pageIndex.totalCount, _this$props$pageIndex.visible, _objectWithoutProperties(_this$props$pageIndex, _excluded));
            return restProps
        }
    }]);
    return Pager
}(_vdom.InfernoWrapperComponent);
exports.Pager = Pager;
Pager.defaultProps = _extends({}, _pager_props.PagerProps);
