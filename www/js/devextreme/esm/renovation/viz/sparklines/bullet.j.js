/**
 * DevExtreme (esm/renovation/viz/sparklines/bullet.j.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import registerComponent from "../../../core/component_registrator";
import BaseComponent from "../../component_wrapper/component";
import {
    Bullet as BulletComponent
} from "./bullet";
export default class Bullet extends BaseComponent {
    _getActionConfigs() {
        return {
            onTooltipHidden: {},
            onTooltipShown: {},
            onContentReady: {
                excludeValidators: ["disabled"]
            }
        }
    }
    get _propsInfo() {
        return {
            twoWay: [
                ["canvas", {
                    width: 0,
                    height: 0,
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0
                }, "canvasChange"]
            ],
            allowNull: [],
            elements: [],
            templates: [],
            props: ["value", "color", "target", "targetColor", "targetWidth", "showTarget", "showZeroLevel", "startScaleValue", "endScaleValue", "tooltip", "onTooltipHidden", "onTooltipShown", "size", "margin", "disabled", "rtlEnabled", "classes", "className", "defaultCanvas", "onContentReady", "pointerEvents", "canvasChange", "canvas"]
        }
    }
    get _viewComponent() {
        return BulletComponent
    }
}
registerComponent("dxBullet", Bullet);
