/**
 * DevExtreme (esm/renovation/common/config_provider.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
var _excluded = ["children", "rtlEnabled"];
import {
    BaseInfernoComponent
} from "@devextreme/vdom";
export var viewFunction = viewModel => viewModel.props.children;
export var ConfigProviderProps = {};
export class ConfigProvider extends BaseInfernoComponent {
    constructor(props) {
        super(props);
        this.state = {}
    }
    getChildContext() {
        return _extends({}, this.context, {
            ConfigContext: this.config
        })
    }
    get config() {
        return {
            rtlEnabled: this.props.rtlEnabled
        }
    }
    get restAttributes() {
        var _this$props = this.props,
            restProps = _objectWithoutPropertiesLoose(_this$props, _excluded);
        return restProps
    }
    render() {
        var props = this.props;
        return viewFunction({
            props: _extends({}, props),
            config: this.config,
            restAttributes: this.restAttributes
        })
    }
}
ConfigProvider.defaultProps = _extends({}, ConfigProviderProps);
