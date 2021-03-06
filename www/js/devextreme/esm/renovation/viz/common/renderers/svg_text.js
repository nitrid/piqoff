/**
 * DevExtreme (esm/renovation/viz/common/renderers/svg_text.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
var _excluded = ["align", "className", "dashStyle", "encodeHtml", "fill", "opacity", "rotate", "rotateX", "rotateY", "scaleX", "scaleY", "sharp", "sharpDirection", "stroke", "strokeOpacity", "strokeWidth", "styles", "text", "textsAlignment", "translateX", "translateY", "x", "y"];
import {
    createVNode,
    normalizeProps
} from "inferno";
import {
    InfernoEffect,
    InfernoComponent,
    normalizeStyles
} from "@devextreme/vdom";
import SvgGraphicsProps from "./base_graphics_props";
import {
    removeExtraAttrs,
    parseHTML,
    parseMultiline,
    getTextWidth,
    setTextNodeAttribute,
    getItemLineHeight,
    getLineHeight,
    convertAlignmentToAnchor,
    getGraphicExtraProps
} from "./utils";
import {
    isDefined
} from "../../../../core/utils/type";
import {
    ConfigContext
} from "../../../common/config_context";
var KEY_STROKE = "stroke";
export var viewFunction = _ref => {
    var {
        computedProps: computedProps,
        isStroked: isStroked,
        styles: styles,
        textAnchor: textAnchor,
        textItems: textItems,
        textRef: textRef
    } = _ref;
    var texts = textItems || [];
    var {
        fill: fill,
        opacity: opacity,
        stroke: stroke,
        strokeOpacity: strokeOpacity,
        strokeWidth: strokeWidth,
        text: text,
        x: x,
        y: y
    } = computedProps;
    return normalizeProps(createVNode(32, "text", null, [texts.length ? isStroked && texts.map((_ref2, index) => {
        var {
            className: className,
            style: style,
            value: value
        } = _ref2;
        return createVNode(32, "tspan", className, value, 0, {
            style: normalizeStyles(style)
        }, index)
    }) : null, texts.length ? texts.map((_ref3, index) => {
        var {
            className: className,
            style: style,
            value: value
        } = _ref3;
        return createVNode(32, "tspan", className, value, 0, {
            style: normalizeStyles(style)
        }, index)
    }) : null, !texts.length && text], 0, _extends({
        x: x,
        y: y,
        style: normalizeStyles(styles),
        "text-anchor": textAnchor,
        fill: fill,
        stroke: stroke,
        "stroke-width": strokeWidth,
        "stroke-opacity": strokeOpacity,
        opacity: opacity
    }, getGraphicExtraProps(computedProps, x, y)), null, textRef))
};
export var TextSvgElementProps = _extends({}, SvgGraphicsProps, {
    text: "",
    x: 0,
    y: 0,
    align: "center",
    encodeHtml: true
});
import {
    createRef as infernoCreateRef
} from "inferno";
export class TextSvgElement extends InfernoComponent {
    constructor(props) {
        super(props);
        this.state = {};
        this.textRef = infernoCreateRef();
        this.effectUpdateText = this.effectUpdateText.bind(this);
        this.parseTspanElements = this.parseTspanElements.bind(this);
        this.alignTextNodes = this.alignTextNodes.bind(this);
        this.locateTextNodes = this.locateTextNodes.bind(this);
        this.strokeTextNodes = this.strokeTextNodes.bind(this)
    }
    get config() {
        if ("ConfigContext" in this.context) {
            return this.context.ConfigContext
        }
        return ConfigContext
    }
    createEffects() {
        return [new InfernoEffect(this.effectUpdateText, [this.props.text, this.props.encodeHtml, this.props.stroke, this.props.strokeWidth, this.props.textsAlignment, this.props.x, this.props.y, this.props.styles, this.props.strokeOpacity])]
    }
    updateEffects() {
        var _this$_effects$;
        null === (_this$_effects$ = this._effects[0]) || void 0 === _this$_effects$ ? void 0 : _this$_effects$.update([this.props.text, this.props.encodeHtml, this.props.stroke, this.props.strokeWidth, this.props.textsAlignment, this.props.x, this.props.y, this.props.styles, this.props.strokeOpacity])
    }
    effectUpdateText() {
        var texts = this.textItems;
        if (texts) {
            var items = this.parseTspanElements(texts);
            this.alignTextNodes(items);
            if (void 0 !== this.props.x || void 0 !== this.props.y) {
                this.locateTextNodes(items)
            }
            this.strokeTextNodes(items)
        }
    }
    get styles() {
        var style = this.props.styles || {};
        return _extends({
            whiteSpace: "pre"
        }, style)
    }
    get textItems() {
        var items;
        var parsedHtml;
        var {
            text: text
        } = this.props;
        if (!text) {
            return
        }
        if (!this.props.encodeHtml && (/<[a-z][\s\S]*>/i.test(text) || -1 !== text.indexOf("&"))) {
            parsedHtml = removeExtraAttrs(text);
            items = parseHTML(parsedHtml)
        } else if (/\n/g.test(text)) {
            items = parseMultiline(text)
        } else if (this.isStroked) {
            items = [{
                value: text.trim(),
                height: 0
            }]
        }
        return items
    }
    get isStroked() {
        return isDefined(this.props.stroke) && isDefined(this.props.strokeWidth)
    }
    get textAnchor() {
        var _this$config;
        return convertAlignmentToAnchor(this.props.align, null === (_this$config = this.config) || void 0 === _this$config ? void 0 : _this$config.rtlEnabled)
    }
    get computedProps() {
        return this.props
    }
    parseTspanElements(texts) {
        var items = [...texts];
        var textElements = this.textRef.current.children;
        var strokeLength = !this.isStroked ? 0 : items.length;
        for (var i = 0; i < textElements.length; i++) {
            if (i < strokeLength) {
                items[i].stroke = textElements[i]
            } else {
                items[i % items.length].tspan = textElements[i]
            }
        }
        return items
    }
    alignTextNodes(items) {
        var alignment = this.props.textsAlignment;
        if (!items || !alignment || "center" === alignment) {
            return
        }
        var direction = "left" === alignment ? -1 : 1;
        var maxTextWidth = Math.max(...items.map(t => getTextWidth(t)));
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var textWidth = getTextWidth(item);
            if (0 !== maxTextWidth && maxTextWidth !== textWidth) {
                setTextNodeAttribute(item, "dx", direction * (Math.round((maxTextWidth - textWidth) / 2 * 10) / 10))
            }
        }
    }
    locateTextNodes(items) {
        var {
            styles: styles,
            x: x,
            y: y
        } = this.props;
        var lineHeight = getLineHeight(styles || {});
        var item = items[0];
        setTextNodeAttribute(item, "x", x);
        setTextNodeAttribute(item, "y", y);
        for (var i = 1, ii = items.length; i < ii; ++i) {
            item = items[i];
            if (isDefined(item.height) && item.height >= 0) {
                setTextNodeAttribute(item, "x", x);
                var height = getItemLineHeight(item, lineHeight);
                setTextNodeAttribute(item, "dy", height)
            }
        }
    }
    strokeTextNodes(items) {
        if (!this.isStroked) {
            return
        }
        var {
            stroke: stroke,
            strokeWidth: strokeWidth
        } = this.props;
        var strokeOpacity = this.props.strokeOpacity || 1;
        var tspan;
        for (var i = 0, ii = items.length; i < ii; ++i) {
            tspan = items[i].stroke;
            tspan.setAttribute(KEY_STROKE, stroke);
            tspan.setAttribute("stroke-width", strokeWidth.toString());
            tspan.setAttribute("stroke-opacity", strokeOpacity.toString());
            tspan.setAttribute("stroke-linejoin", "round")
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
            textRef: this.textRef,
            config: this.config,
            styles: this.styles,
            textItems: this.textItems,
            isStroked: this.isStroked,
            textAnchor: this.textAnchor,
            computedProps: this.computedProps,
            parseTspanElements: this.parseTspanElements,
            alignTextNodes: this.alignTextNodes,
            locateTextNodes: this.locateTextNodes,
            strokeTextNodes: this.strokeTextNodes,
            restAttributes: this.restAttributes
        })
    }
}
TextSvgElement.defaultProps = _extends({}, TextSvgElementProps);
