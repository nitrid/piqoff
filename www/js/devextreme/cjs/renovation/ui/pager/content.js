/**
 * DevExtreme (cjs/renovation/ui/pager/content.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
exports.PagerContent = exports.PagerContentProps = exports.viewFunction = void 0;
var _inferno = require("inferno");
var _vdom = require("@devextreme/vdom");
var _info = require("./info");
var _page_index_selector = require("./pages/page_index_selector");
var _selector = require("./page_size/selector");
var _consts = require("./common/consts");
var _pager_props = require("./common/pager_props");
var _combine_classes = require("../../utils/combine_classes");
var _widget = require("../common/widget");
var _accessibility = require("../../../ui/shared/accessibility");
var _excluded = ["className", "defaultPageIndex", "defaultPageSize", "displayMode", "gridCompatibility", "hasKnownLastPage", "infoText", "infoTextRef", "infoTextVisible", "isLargeDisplayMode", "lightModeEnabled", "maxPagesCount", "onKeyDown", "pageCount", "pageIndex", "pageIndexChange", "pageSize", "pageSizeChange", "pageSizes", "pageSizesRef", "pagesCountText", "pagesNavigatorVisible", "pagesRef", "rootElementRef", "rtlEnabled", "showInfo", "showNavigationButtons", "showPageSizes", "totalCount", "visible"];

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
    var classes = _ref.classes,
        infoVisible = _ref.infoVisible,
        isLargeDisplayMode = _ref.isLargeDisplayMode,
        pageIndexSelectorVisible = _ref.pageIndexSelectorVisible,
        pagesContainerVisibility = _ref.pagesContainerVisibility,
        pagesContainerVisible = _ref.pagesContainerVisible,
        _ref$props = _ref.props,
        hasKnownLastPage = _ref$props.hasKnownLastPage,
        infoText = _ref$props.infoText,
        infoTextRef = _ref$props.infoTextRef,
        maxPagesCount = _ref$props.maxPagesCount,
        pageCount = _ref$props.pageCount,
        pageIndex = _ref$props.pageIndex,
        pageIndexChange = _ref$props.pageIndexChange,
        pageSize = _ref$props.pageSize,
        pageSizeChange = _ref$props.pageSizeChange,
        pageSizes = _ref$props.pageSizes,
        pageSizesRef = _ref$props.pageSizesRef,
        pagesCountText = _ref$props.pagesCountText,
        pagesRef = _ref$props.pagesRef,
        rtlEnabled = _ref$props.rtlEnabled,
        showNavigationButtons = _ref$props.showNavigationButtons,
        showPageSizes = _ref$props.showPageSizes,
        totalCount = _ref$props.totalCount,
        visible = _ref$props.visible,
        restAttributes = _ref.restAttributes,
        widgetRootElementRef = _ref.widgetRootElementRef;
    return (0, _inferno.normalizeProps)((0, _inferno.createComponentVNode)(2, _widget.Widget, _extends({
        rootElementRef: widgetRootElementRef,
        rtlEnabled: rtlEnabled,
        classes: classes,
        visible: visible
    }, restAttributes, {
        children: [showPageSizes && (0, _inferno.createComponentVNode)(2, _selector.PageSizeSelector, {
            rootElementRef: pageSizesRef,
            isLargeDisplayMode: isLargeDisplayMode,
            pageSize: pageSize,
            pageSizeChange: pageSizeChange,
            pageSizes: pageSizes
        }), pagesContainerVisible && (0, _inferno.createVNode)(1, "div", _consts.PAGER_PAGES_CLASS, [infoVisible && (0, _inferno.createComponentVNode)(2, _info.InfoText, {
            rootElementRef: infoTextRef,
            infoText: infoText,
            pageCount: pageCount,
            pageIndex: pageIndex,
            totalCount: totalCount
        }), pageIndexSelectorVisible && (0, _inferno.createVNode)(1, "div", _consts.PAGER_PAGE_INDEXES_CLASS, (0, _inferno.createComponentVNode)(2, _page_index_selector.PageIndexSelector, {
            hasKnownLastPage: hasKnownLastPage,
            isLargeDisplayMode: isLargeDisplayMode,
            maxPagesCount: maxPagesCount,
            pageCount: pageCount,
            pageIndex: pageIndex,
            pageIndexChange: pageIndexChange,
            pagesCountText: pagesCountText,
            showNavigationButtons: showNavigationButtons,
            totalCount: totalCount
        }), 2, null, null, pagesRef)], 0, {
            style: (0, _vdom.normalizeStyles)({
                visibility: pagesContainerVisibility
            })
        })]
    })))
};
exports.viewFunction = viewFunction;
var PagerContentProps = _extends({}, _pager_props.PagerProps, {
    infoTextVisible: true,
    isLargeDisplayMode: true
});
exports.PagerContentProps = PagerContentProps;
var PagerContent = function(_InfernoComponent) {
    _inheritsLoose(PagerContent, _InfernoComponent);

    function PagerContent(props) {
        var _this;
        _this = _InfernoComponent.call(this, props) || this;
        _this._currentState = null;
        _this.widgetRootElementRef = (0, _inferno.createRef)();
        _this.state = {
            pageIndex: void 0 !== _this.props.pageIndex ? _this.props.pageIndex : _this.props.defaultPageIndex,
            pageSize: void 0 !== _this.props.pageSize ? _this.props.pageSize : _this.props.defaultPageSize
        };
        _this.createFakeInstance = _this.createFakeInstance.bind(_assertThisInitialized(_this));
        _this.setRootElementRef = _this.setRootElementRef.bind(_assertThisInitialized(_this));
        return _this
    }
    var _proto = PagerContent.prototype;
    _proto.createEffects = function() {
        return [new _vdom.InfernoEffect(this.setRootElementRef, [])]
    };
    _proto.updateEffects = function() {};
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
    _proto.getChildContext = function() {
        return _extends({}, this.context, {
            KeyboardActionContext: this.keyboardAction
        })
    };
    _proto.setRootElementRef = function() {
        var rootElementRef = this.props.rootElementRef;
        if (rootElementRef) {
            rootElementRef.current = this.widgetRootElementRef.current
        }
    };
    _proto.createFakeInstance = function() {
        var _this4 = this;
        return {
            option: function() {
                return false
            },
            element: function() {
                return _this4.widgetRootElementRef.current
            },
            _createActionByOption: function() {
                return function(e) {
                    var _this4$props$onKeyDow, _this4$props;
                    null === (_this4$props$onKeyDow = (_this4$props = _this4.props).onKeyDown) || void 0 === _this4$props$onKeyDow ? void 0 : _this4$props$onKeyDow.call(_this4$props, e)
                }
            }
        }
    };
    _proto.render = function() {
        var props = this.props;
        return viewFunction({
            props: _extends({}, props, {
                pageIndex: this.__state_pageIndex,
                pageSize: this.__state_pageSize
            }),
            widgetRootElementRef: this.widgetRootElementRef,
            keyboardAction: this.keyboardAction,
            infoVisible: this.infoVisible,
            pageIndexSelectorVisible: this.pageIndexSelectorVisible,
            pagesContainerVisible: this.pagesContainerVisible,
            pagesContainerVisibility: this.pagesContainerVisibility,
            isLargeDisplayMode: this.isLargeDisplayMode,
            classes: this.classes,
            restAttributes: this.restAttributes
        })
    };
    _createClass(PagerContent, [{
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
        key: "keyboardAction",
        get: function() {
            var _this5 = this;
            return {
                registerKeyboardAction: function(element, action) {
                    var fakePagerInstance = _this5.createFakeInstance();
                    return (0, _accessibility.registerKeyboardAction)("pager", fakePagerInstance, element, void 0, action)
                }
            }
        }
    }, {
        key: "infoVisible",
        get: function() {
            var _this$props = this.props,
                infoTextVisible = _this$props.infoTextVisible,
                showInfo = _this$props.showInfo;
            return showInfo && infoTextVisible && this.isLargeDisplayMode
        }
    }, {
        key: "pageIndexSelectorVisible",
        get: function() {
            return 0 !== this.__state_pageSize
        }
    }, {
        key: "normalizedDisplayMode",
        get: function() {
            var _this$props2 = this.props,
                displayMode = _this$props2.displayMode,
                lightModeEnabled = _this$props2.lightModeEnabled;
            if ("adaptive" === displayMode && void 0 !== lightModeEnabled) {
                return lightModeEnabled ? "compact" : "full"
            }
            return displayMode
        }
    }, {
        key: "pagesContainerVisible",
        get: function() {
            return !!this.props.pagesNavigatorVisible && this.props.pageCount > 0
        }
    }, {
        key: "pagesContainerVisibility",
        get: function() {
            if ("auto" === this.props.pagesNavigatorVisible && 1 === this.props.pageCount && this.props.hasKnownLastPage) {
                return "hidden"
            }
            return
        }
    }, {
        key: "isLargeDisplayMode",
        get: function() {
            var displayMode = this.normalizedDisplayMode;
            var result = false;
            if ("adaptive" === displayMode) {
                result = this.props.isLargeDisplayMode
            } else {
                result = "full" === displayMode
            }
            return result
        }
    }, {
        key: "classes",
        get: function() {
            var _classesMap;
            var classesMap = (_classesMap = {}, _defineProperty(_classesMap, "".concat(this.props.className), !!this.props.className), _defineProperty(_classesMap, _consts.PAGER_CLASS, true), _defineProperty(_classesMap, _consts.LIGHT_MODE_CLASS, !this.isLargeDisplayMode), _classesMap);
            return (0, _combine_classes.combineClasses)(classesMap)
        }
    }, {
        key: "restAttributes",
        get: function() {
            var _this$props$pageIndex = _extends({}, this.props, {
                    pageIndex: this.__state_pageIndex,
                    pageSize: this.__state_pageSize
                }),
                restProps = (_this$props$pageIndex.className, _this$props$pageIndex.defaultPageIndex, _this$props$pageIndex.defaultPageSize, _this$props$pageIndex.displayMode, _this$props$pageIndex.gridCompatibility, _this$props$pageIndex.hasKnownLastPage, _this$props$pageIndex.infoText, _this$props$pageIndex.infoTextRef, _this$props$pageIndex.infoTextVisible, _this$props$pageIndex.isLargeDisplayMode, _this$props$pageIndex.lightModeEnabled, _this$props$pageIndex.maxPagesCount, _this$props$pageIndex.onKeyDown, _this$props$pageIndex.pageCount, _this$props$pageIndex.pageIndex, _this$props$pageIndex.pageIndexChange, _this$props$pageIndex.pageSize, _this$props$pageIndex.pageSizeChange, _this$props$pageIndex.pageSizes, _this$props$pageIndex.pageSizesRef, _this$props$pageIndex.pagesCountText, _this$props$pageIndex.pagesNavigatorVisible, _this$props$pageIndex.pagesRef, _this$props$pageIndex.rootElementRef, _this$props$pageIndex.rtlEnabled, _this$props$pageIndex.showInfo, _this$props$pageIndex.showNavigationButtons, _this$props$pageIndex.showPageSizes, _this$props$pageIndex.totalCount, _this$props$pageIndex.visible, _objectWithoutProperties(_this$props$pageIndex, _excluded));
            return restProps
        }
    }]);
    return PagerContent
}(_vdom.InfernoComponent);
exports.PagerContent = PagerContent;
PagerContent.defaultProps = _extends({}, PagerContentProps);
