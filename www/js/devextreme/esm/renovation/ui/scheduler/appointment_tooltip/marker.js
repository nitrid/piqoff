/**
 * DevExtreme (esm/renovation/ui/scheduler/appointment_tooltip/marker.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
var _excluded = ["className"];
import {
    createVNode
} from "inferno";
import {
    BaseInfernoComponent,
    normalizeStyles
} from "@devextreme/vdom";
export var viewFunction = viewModel => createVNode(1, "div", "dx-tooltip-appointment-item-marker ".concat(viewModel.props.className), createVNode(1, "div", "dx-tooltip-appointment-item-marker-body", null, 1, {
    style: normalizeStyles(viewModel.style)
}), 2);
export var MarkerProps = {
    className: ""
};
export class Marker extends BaseInfernoComponent {
    constructor(props) {
        super(props);
        this._currentState = null;
        this.state = {
            appointmentColor: void 0
        }
    }
    get appointmentColor() {
        var state = this._currentState || this.state;
        return state.appointmentColor
    }
    set_appointmentColor(value) {
        this.setState(state => {
            this._currentState = state;
            var newValue = value();
            this._currentState = null;
            return {
                appointmentColor: newValue
            }
        })
    }
    get style() {
        return {
            background: this.appointmentColor
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
            appointmentColor: this.appointmentColor,
            style: this.style,
            restAttributes: this.restAttributes
        })
    }
}
Marker.defaultProps = _extends({}, MarkerProps);
