/**
 * DevExtreme (esm/renovation/ui/form/form.j.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import registerComponent from "../../../core/component_registrator";
import BaseComponent from "../../component_wrapper/component";
import {
    Form as FormComponent
} from "./form";
export default class Form extends BaseComponent {
    get _propsInfo() {
        return {
            twoWay: [],
            allowNull: [],
            elements: [],
            templates: [],
            props: ["scrollingEnabled", "useNativeScrolling"]
        }
    }
    get _viewComponent() {
        return FormComponent
    }
}
registerComponent("dxForm", Form);
