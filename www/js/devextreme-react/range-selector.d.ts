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

import dxRangeSelector, { IOptions } from "devextreme/viz/range_selector";
import { Component as BaseComponent, IHtmlOptions } from "./core/component";
import NestedOption from "./core/nested-option";
interface IRangeSelectorOptions extends IOptions, IHtmlOptions {
    defaultLoadingIndicator?: any;
    defaultValue?: any;
    onLoadingIndicatorChange?: (value: any) => void;
    onValueChange?: (value: any) => void;
}
declare class RangeSelector extends BaseComponent<IRangeSelectorOptions> {
    get instance(): dxRangeSelector;
    protected _WidgetClass: typeof dxRangeSelector;
    protected subscribableOptions: string[];
    protected independentEvents: string[];
    protected _defaults: {
        defaultLoadingIndicator: string;
        defaultValue: string;
    };
    protected _expectedChildren: {
        background: {
            optionName: string;
            isCollectionItem: boolean;
        };
        behavior: {
            optionName: string;
            isCollectionItem: boolean;
        };
        chart: {
            optionName: string;
            isCollectionItem: boolean;
        };
        export: {
            optionName: string;
            isCollectionItem: boolean;
        };
        indent: {
            optionName: string;
            isCollectionItem: boolean;
        };
        loadingIndicator: {
            optionName: string;
            isCollectionItem: boolean;
        };
        margin: {
            optionName: string;
            isCollectionItem: boolean;
        };
        scale: {
            optionName: string;
            isCollectionItem: boolean;
        };
        shutter: {
            optionName: string;
            isCollectionItem: boolean;
        };
        size: {
            optionName: string;
            isCollectionItem: boolean;
        };
        sliderHandle: {
            optionName: string;
            isCollectionItem: boolean;
        };
        sliderMarker: {
            optionName: string;
            isCollectionItem: boolean;
        };
        title: {
            optionName: string;
            isCollectionItem: boolean;
        };
        value: {
            optionName: string;
            isCollectionItem: boolean;
        };
    };
}
interface IAggregationProps {
    calculate?: any;
    enabled?: any;
    method?: any;
}
declare class Aggregation extends NestedOption<IAggregationProps> {
    static OptionName: string;
}
interface IAggregationIntervalProps {
    days?: any;
    hours?: any;
    milliseconds?: any;
    minutes?: any;
    months?: any;
    quarters?: any;
    seconds?: any;
    weeks?: any;
    years?: any;
}
declare class AggregationInterval extends NestedOption<IAggregationIntervalProps> {
    static OptionName: string;
}
interface IArgumentFormatProps {
    currency?: any;
    formatter?: any;
    parser?: any;
    precision?: any;
    type?: any;
}
declare class ArgumentFormat extends NestedOption<IArgumentFormatProps> {
    static OptionName: string;
}
interface IBackgroundProps {
    color?: any;
    image?: object | {
        location?: any;
        url?: any;
    };
    visible?: any;
}
declare class Background extends NestedOption<IBackgroundProps> {
    static OptionName: string;
    static ExpectedChildren: {
        backgroundImage: {
            optionName: string;
            isCollectionItem: boolean;
        };
        image: {
            optionName: string;
            isCollectionItem: boolean;
        };
    };
}
interface IBackgroundImageProps {
    location?: any;
    url?: any;
}
declare class BackgroundImage extends NestedOption<IBackgroundImageProps> {
    static OptionName: string;
}
interface IBehaviorProps {
    allowSlidersSwap?: any;
    animationEnabled?: any;
    callValueChanged?: any;
    manualRangeSelectionEnabled?: any;
    moveSelectedRangeByClick?: any;
    snapToTicks?: any;
}
declare class Behavior extends NestedOption<IBehaviorProps> {
    static OptionName: string;
}
interface IBorderProps {
    color?: any;
    dashStyle?: any;
    visible?: any;
    width?: any;
}
declare class Border extends NestedOption<IBorderProps> {
    static OptionName: string;
}
interface IBreakProps {
    endValue?: any;
    startValue?: any;
}
declare class Break extends NestedOption<IBreakProps> {
    static OptionName: string;
    static IsCollectionItem: boolean;
}
interface IBreakStyleProps {
    color?: any;
    line?: any;
    width?: any;
}
declare class BreakStyle extends NestedOption<IBreakStyleProps> {
    static OptionName: string;
}
interface IChartProps {
    barGroupPadding?: any;
    barGroupWidth?: any;
    bottomIndent?: any;
    commonSeriesSettings?: any;
    dataPrepareSettings?: object | {
        checkTypeForAllData?: any;
        convertToAxisDataType?: any;
        sortingMethod?: any;
    };
    maxBubbleSize?: any;
    minBubbleSize?: any;
    negativesAsZeroes?: any;
    palette?: any;
    paletteExtensionMode?: any;
    series?: any;
    seriesTemplate?: object | {
        customizeSeries?: any;
        nameField?: any;
    };
    topIndent?: any;
    valueAxis?: object | {
        inverted?: any;
        logarithmBase?: any;
        max?: any;
        min?: any;
        type?: any;
        valueType?: any;
    };
}
declare class Chart extends NestedOption<IChartProps> {
    static OptionName: string;
    static ExpectedChildren: {
        commonSeriesSettings: {
            optionName: string;
            isCollectionItem: boolean;
        };
        dataPrepareSettings: {
            optionName: string;
            isCollectionItem: boolean;
        };
        series: {
            optionName: string;
            isCollectionItem: boolean;
        };
        seriesTemplate: {
            optionName: string;
            isCollectionItem: boolean;
        };
        valueAxis: {
            optionName: string;
            isCollectionItem: boolean;
        };
    };
}
interface ICommonSeriesSettingsProps {
    aggregation?: object | {
        calculate?: any;
        enabled?: any;
        method?: any;
    };
    area?: any;
    argumentField?: any;
    axis?: any;
    bar?: any;
    barOverlapGroup?: any;
    barPadding?: any;
    barWidth?: any;
    border?: object | {
        color?: any;
        dashStyle?: any;
        visible?: any;
        width?: any;
    };
    bubble?: any;
    candlestick?: any;
    closeValueField?: any;
    color?: any;
    cornerRadius?: any;
    dashStyle?: any;
    fullstackedarea?: any;
    fullstackedbar?: any;
    fullstackedline?: any;
    fullstackedspline?: any;
    fullstackedsplinearea?: any;
    highValueField?: any;
    hoverMode?: any;
    hoverStyle?: object | {
        border?: object | {
            color?: any;
            dashStyle?: any;
            visible?: any;
            width?: any;
        };
        color?: any;
        dashStyle?: any;
        hatching?: object | {
            direction?: any;
            opacity?: any;
            step?: any;
            width?: any;
        };
        width?: any;
    };
    ignoreEmptyPoints?: any;
    innerColor?: any;
    label?: object | {
        alignment?: any;
        argumentFormat?: any;
        backgroundColor?: any;
        border?: object | {
            color?: any;
            dashStyle?: any;
            visible?: any;
            width?: any;
        };
        connector?: object | {
            color?: any;
            visible?: any;
            width?: any;
        };
        customizeText?: any;
        font?: any;
        format?: any;
        horizontalOffset?: any;
        position?: any;
        rotationAngle?: any;
        showForZeroValues?: any;
        verticalOffset?: any;
        visible?: any;
    };
    line?: any;
    lowValueField?: any;
    maxLabelCount?: any;
    minBarSize?: any;
    opacity?: any;
    openValueField?: any;
    pane?: any;
    point?: object | {
        border?: object | {
            color?: any;
            visible?: any;
            width?: any;
        };
        color?: any;
        hoverMode?: any;
        hoverStyle?: object | {
            border?: object | {
                color?: any;
                visible?: any;
                width?: any;
            };
            color?: any;
            size?: any;
        };
        image?: object | string | {
            height?: number | object | {
                rangeMaxPoint?: any;
                rangeMinPoint?: any;
            };
            url?: object | string | {
                rangeMaxPoint?: any;
                rangeMinPoint?: any;
            };
            width?: number | object | {
                rangeMaxPoint?: any;
                rangeMinPoint?: any;
            };
        };
        selectionMode?: any;
        selectionStyle?: object | {
            border?: object | {
                color?: any;
                visible?: any;
                width?: any;
            };
            color?: any;
            size?: any;
        };
        size?: any;
        symbol?: any;
        visible?: any;
    };
    rangearea?: any;
    rangebar?: any;
    rangeValue1Field?: any;
    rangeValue2Field?: any;
    reduction?: object | {
        color?: any;
        level?: any;
    };
    scatter?: any;
    selectionMode?: any;
    selectionStyle?: object | {
        border?: object | {
            color?: any;
            dashStyle?: any;
            visible?: any;
            width?: any;
        };
        color?: any;
        dashStyle?: any;
        hatching?: object | {
            direction?: any;
            opacity?: any;
            step?: any;
            width?: any;
        };
        width?: any;
    };
    showInLegend?: any;
    sizeField?: any;
    spline?: any;
    splinearea?: any;
    stack?: any;
    stackedarea?: any;
    stackedbar?: any;
    stackedline?: any;
    stackedspline?: any;
    stackedsplinearea?: any;
    steparea?: any;
    stepline?: any;
    stock?: any;
    tagField?: any;
    type?: any;
    valueErrorBar?: object | {
        color?: any;
        displayMode?: any;
        edgeLength?: any;
        highValueField?: any;
        lineWidth?: any;
        lowValueField?: any;
        opacity?: any;
        type?: any;
        value?: any;
    };
    valueField?: any;
    visible?: any;
    width?: any;
}
declare class CommonSeriesSettings extends NestedOption<ICommonSeriesSettingsProps> {
    static OptionName: string;
    static ExpectedChildren: {
        aggregation: {
            optionName: string;
            isCollectionItem: boolean;
        };
        border: {
            optionName: string;
            isCollectionItem: boolean;
        };
        commonSeriesSettingsHoverStyle: {
            optionName: string;
            isCollectionItem: boolean;
        };
        commonSeriesSettingsLabel: {
            optionName: string;
            isCollectionItem: boolean;
        };
        commonSeriesSettingsSelectionStyle: {
            optionName: string;
            isCollectionItem: boolean;
        };
        hoverStyle: {
            optionName: string;
            isCollectionItem: boolean;
        };
        label: {
            optionName: string;
            isCollectionItem: boolean;
        };
        point: {
            optionName: string;
            isCollectionItem: boolean;
        };
        reduction: {
            optionName: string;
            isCollectionItem: boolean;
        };
        selectionStyle: {
            optionName: string;
            isCollectionItem: boolean;
        };
        seriesBorder: {
            optionName: string;
            isCollectionItem: boolean;
        };
        valueErrorBar: {
            optionName: string;
            isCollectionItem: boolean;
        };
    };
}
interface ICommonSeriesSettingsHoverStyleProps {
    border?: object | {
        color?: any;
        dashStyle?: any;
        visible?: any;
        width?: any;
    };
    color?: any;
    dashStyle?: any;
    hatching?: object | {
        direction?: any;
        opacity?: any;
        step?: any;
        width?: any;
    };
    width?: any;
}
declare class CommonSeriesSettingsHoverStyle extends NestedOption<ICommonSeriesSettingsHoverStyleProps> {
    static OptionName: string;
    static ExpectedChildren: {
        border: {
            optionName: string;
            isCollectionItem: boolean;
        };
        hatching: {
            optionName: string;
            isCollectionItem: boolean;
        };
        seriesBorder: {
            optionName: string;
            isCollectionItem: boolean;
        };
    };
}
interface ICommonSeriesSettingsLabelProps {
    alignment?: any;
    argumentFormat?: any;
    backgroundColor?: any;
    border?: object | {
        color?: any;
        dashStyle?: any;
        visible?: any;
        width?: any;
    };
    connector?: object | {
        color?: any;
        visible?: any;
        width?: any;
    };
    customizeText?: any;
    font?: any;
    format?: any;
    horizontalOffset?: any;
    position?: any;
    rotationAngle?: any;
    showForZeroValues?: any;
    verticalOffset?: any;
    visible?: any;
}
declare class CommonSeriesSettingsLabel extends NestedOption<ICommonSeriesSettingsLabelProps> {
    static OptionName: string;
    static ExpectedChildren: {
        argumentFormat: {
            optionName: string;
            isCollectionItem: boolean;
        };
        border: {
            optionName: string;
            isCollectionItem: boolean;
        };
        connector: {
            optionName: string;
            isCollectionItem: boolean;
        };
        font: {
            optionName: string;
            isCollectionItem: boolean;
        };
        format: {
            optionName: string;
            isCollectionItem: boolean;
        };
        seriesBorder: {
            optionName: string;
            isCollectionItem: boolean;
        };
    };
}
interface ICommonSeriesSettingsSelectionStyleProps {
    border?: object | {
        color?: any;
        dashStyle?: any;
        visible?: any;
        width?: any;
    };
    color?: any;
    dashStyle?: any;
    hatching?: object | {
        direction?: any;
        opacity?: any;
        step?: any;
        width?: any;
    };
    width?: any;
}
declare class CommonSeriesSettingsSelectionStyle extends NestedOption<ICommonSeriesSettingsSelectionStyleProps> {
    static OptionName: string;
    static ExpectedChildren: {
        border: {
            optionName: string;
            isCollectionItem: boolean;
        };
        hatching: {
            optionName: string;
            isCollectionItem: boolean;
        };
        seriesBorder: {
            optionName: string;
            isCollectionItem: boolean;
        };
    };
}
interface IConnectorProps {
    color?: any;
    visible?: any;
    width?: any;
}
declare class Connector extends NestedOption<IConnectorProps> {
    static OptionName: string;
}
interface IDataPrepareSettingsProps {
    checkTypeForAllData?: any;
    convertToAxisDataType?: any;
    sortingMethod?: any;
}
declare class DataPrepareSettings extends NestedOption<IDataPrepareSettingsProps> {
    static OptionName: string;
}
interface IExportProps {
    backgroundColor?: any;
    enabled?: any;
    fileName?: any;
    formats?: any;
    margin?: any;
    printingEnabled?: any;
    proxyUrl?: any;
    svgToCanvas?: any;
}
declare class Export extends NestedOption<IExportProps> {
    static OptionName: string;
}
interface IFontProps {
    color?: any;
    family?: any;
    opacity?: any;
    size?: any;
    weight?: any;
}
declare class Font extends NestedOption<IFontProps> {
    static OptionName: string;
}
interface IFormatProps {
    currency?: any;
    formatter?: any;
    parser?: any;
    precision?: any;
    type?: any;
}
declare class Format extends NestedOption<IFormatProps> {
    static OptionName: string;
}
interface IHatchingProps {
    direction?: any;
    opacity?: any;
    step?: any;
    width?: any;
}
declare class Hatching extends NestedOption<IHatchingProps> {
    static OptionName: string;
}
interface IHeightProps {
    rangeMaxPoint?: any;
    rangeMinPoint?: any;
}
declare class Height extends NestedOption<IHeightProps> {
    static OptionName: string;
}
interface IHoverStyleProps {
    border?: object | {
        color?: any;
        dashStyle?: any;
        visible?: any;
        width?: any;
    };
    color?: any;
    dashStyle?: any;
    hatching?: object | {
        direction?: any;
        opacity?: any;
        step?: any;
        width?: any;
    };
    width?: any;
    size?: any;
}
declare class HoverStyle extends NestedOption<IHoverStyleProps> {
    static OptionName: string;
}
interface IImageProps {
    location?: any;
    url?: any;
    height?: number | object | {
        rangeMaxPoint?: any;
        rangeMinPoint?: any;
    };
    width?: number | object | {
        rangeMaxPoint?: any;
        rangeMinPoint?: any;
    };
}
declare class Image extends NestedOption<IImageProps> {
    static OptionName: string;
}
interface IIndentProps {
    left?: any;
    right?: any;
}
declare class Indent extends NestedOption<IIndentProps> {
    static OptionName: string;
}
interface ILabelProps {
    alignment?: any;
    argumentFormat?: any;
    backgroundColor?: any;
    border?: object | {
        color?: any;
        dashStyle?: any;
        visible?: any;
        width?: any;
    };
    connector?: object | {
        color?: any;
        visible?: any;
        width?: any;
    };
    customizeText?: any;
    font?: any;
    format?: any;
    horizontalOffset?: any;
    position?: any;
    rotationAngle?: any;
    showForZeroValues?: any;
    verticalOffset?: any;
    visible?: any;
    overlappingBehavior?: any;
    topIndent?: any;
}
declare class Label extends NestedOption<ILabelProps> {
    static OptionName: string;
}
interface ILengthProps {
    days?: any;
    hours?: any;
    milliseconds?: any;
    minutes?: any;
    months?: any;
    quarters?: any;
    seconds?: any;
    weeks?: any;
    years?: any;
}
declare class Length extends NestedOption<ILengthProps> {
    static OptionName: string;
}
interface ILoadingIndicatorProps {
    backgroundColor?: any;
    enabled?: any;
    font?: any;
    show?: any;
    text?: any;
    defaultShow?: any;
    onShowChange?: (value: any) => void;
}
declare class LoadingIndicator extends NestedOption<ILoadingIndicatorProps> {
    static OptionName: string;
    static DefaultsProps: {
        defaultShow: string;
    };
    static ExpectedChildren: {
        font: {
            optionName: string;
            isCollectionItem: boolean;
        };
    };
}
interface IMarginProps {
    bottom?: any;
    left?: any;
    right?: any;
    top?: any;
}
declare class Margin extends NestedOption<IMarginProps> {
    static OptionName: string;
}
interface IMarkerProps {
    label?: object | {
        customizeText?: any;
        format?: any;
    };
    separatorHeight?: any;
    textLeftIndent?: any;
    textTopIndent?: any;
    topIndent?: any;
    visible?: any;
}
declare class Marker extends NestedOption<IMarkerProps> {
    static OptionName: string;
    static ExpectedChildren: {
        label: {
            optionName: string;
            isCollectionItem: boolean;
        };
        markerLabel: {
            optionName: string;
            isCollectionItem: boolean;
        };
    };
}
interface IMarkerLabelProps {
    customizeText?: any;
    format?: any;
}
declare class MarkerLabel extends NestedOption<IMarkerLabelProps> {
    static OptionName: string;
    static ExpectedChildren: {
        format: {
            optionName: string;
            isCollectionItem: boolean;
        };
    };
}
interface IMaxRangeProps {
    days?: any;
    hours?: any;
    milliseconds?: any;
    minutes?: any;
    months?: any;
    quarters?: any;
    seconds?: any;
    weeks?: any;
    years?: any;
}
declare class MaxRange extends NestedOption<IMaxRangeProps> {
    static OptionName: string;
}
interface IMinorTickProps {
    color?: any;
    opacity?: any;
    visible?: any;
    width?: any;
}
declare class MinorTick extends NestedOption<IMinorTickProps> {
    static OptionName: string;
}
interface IMinorTickIntervalProps {
    days?: any;
    hours?: any;
    milliseconds?: any;
    minutes?: any;
    months?: any;
    quarters?: any;
    seconds?: any;
    weeks?: any;
    years?: any;
}
declare class MinorTickInterval extends NestedOption<IMinorTickIntervalProps> {
    static OptionName: string;
}
interface IMinRangeProps {
    days?: any;
    hours?: any;
    milliseconds?: any;
    minutes?: any;
    months?: any;
    quarters?: any;
    seconds?: any;
    weeks?: any;
    years?: any;
}
declare class MinRange extends NestedOption<IMinRangeProps> {
    static OptionName: string;
}
interface IPointProps {
    border?: object | {
        color?: any;
        visible?: any;
        width?: any;
    };
    color?: any;
    hoverMode?: any;
    hoverStyle?: object | {
        border?: object | {
            color?: any;
            visible?: any;
            width?: any;
        };
        color?: any;
        size?: any;
    };
    image?: object | string | {
        height?: number | object | {
            rangeMaxPoint?: any;
            rangeMinPoint?: any;
        };
        url?: object | string | {
            rangeMaxPoint?: any;
            rangeMinPoint?: any;
        };
        width?: number | object | {
            rangeMaxPoint?: any;
            rangeMinPoint?: any;
        };
    };
    selectionMode?: any;
    selectionStyle?: object | {
        border?: object | {
            color?: any;
            visible?: any;
            width?: any;
        };
        color?: any;
        size?: any;
    };
    size?: any;
    symbol?: any;
    visible?: any;
}
declare class Point extends NestedOption<IPointProps> {
    static OptionName: string;
    static ExpectedChildren: {
        border: {
            optionName: string;
            isCollectionItem: boolean;
        };
        hoverStyle: {
            optionName: string;
            isCollectionItem: boolean;
        };
        image: {
            optionName: string;
            isCollectionItem: boolean;
        };
        pointBorder: {
            optionName: string;
            isCollectionItem: boolean;
        };
        pointHoverStyle: {
            optionName: string;
            isCollectionItem: boolean;
        };
        pointImage: {
            optionName: string;
            isCollectionItem: boolean;
        };
        pointSelectionStyle: {
            optionName: string;
            isCollectionItem: boolean;
        };
        selectionStyle: {
            optionName: string;
            isCollectionItem: boolean;
        };
    };
}
interface IPointBorderProps {
    color?: any;
    visible?: any;
    width?: any;
}
declare class PointBorder extends NestedOption<IPointBorderProps> {
    static OptionName: string;
}
interface IPointHoverStyleProps {
    border?: object | {
        color?: any;
        visible?: any;
        width?: any;
    };
    color?: any;
    size?: any;
}
declare class PointHoverStyle extends NestedOption<IPointHoverStyleProps> {
    static OptionName: string;
    static ExpectedChildren: {
        border: {
            optionName: string;
            isCollectionItem: boolean;
        };
        pointBorder: {
            optionName: string;
            isCollectionItem: boolean;
        };
    };
}
interface IPointImageProps {
    height?: number | object | {
        rangeMaxPoint?: any;
        rangeMinPoint?: any;
    };
    url?: object | string | {
        rangeMaxPoint?: any;
        rangeMinPoint?: any;
    };
    width?: number | object | {
        rangeMaxPoint?: any;
        rangeMinPoint?: any;
    };
}
declare class PointImage extends NestedOption<IPointImageProps> {
    static OptionName: string;
    static ExpectedChildren: {
        height: {
            optionName: string;
            isCollectionItem: boolean;
        };
        url: {
            optionName: string;
            isCollectionItem: boolean;
        };
        width: {
            optionName: string;
            isCollectionItem: boolean;
        };
    };
}
interface IPointSelectionStyleProps {
    border?: object | {
        color?: any;
        visible?: any;
        width?: any;
    };
    color?: any;
    size?: any;
}
declare class PointSelectionStyle extends NestedOption<IPointSelectionStyleProps> {
    static OptionName: string;
    static ExpectedChildren: {
        border: {
            optionName: string;
            isCollectionItem: boolean;
        };
        pointBorder: {
            optionName: string;
            isCollectionItem: boolean;
        };
    };
}
interface IReductionProps {
    color?: any;
    level?: any;
}
declare class Reduction extends NestedOption<IReductionProps> {
    static OptionName: string;
}
interface IScaleProps {
    aggregateByCategory?: any;
    aggregationGroupWidth?: any;
    aggregationInterval?: number | object | string | {
        days?: any;
        hours?: any;
        milliseconds?: any;
        minutes?: any;
        months?: any;
        quarters?: any;
        seconds?: any;
        weeks?: any;
        years?: any;
    };
    allowDecimals?: any;
    breaks?: {
        endValue?: any;
        startValue?: any;
    }[];
    breakStyle?: object | {
        color?: any;
        line?: any;
        width?: any;
    };
    categories?: any;
    endOnTick?: any;
    endValue?: any;
    holidays?: any;
    label?: object | {
        customizeText?: any;
        font?: any;
        format?: any;
        overlappingBehavior?: any;
        topIndent?: any;
        visible?: any;
    };
    linearThreshold?: any;
    logarithmBase?: any;
    marker?: object | {
        label?: object | {
            customizeText?: any;
            format?: any;
        };
        separatorHeight?: any;
        textLeftIndent?: any;
        textTopIndent?: any;
        topIndent?: any;
        visible?: any;
    };
    maxRange?: number | object | string | {
        days?: any;
        hours?: any;
        milliseconds?: any;
        minutes?: any;
        months?: any;
        quarters?: any;
        seconds?: any;
        weeks?: any;
        years?: any;
    };
    minorTick?: object | {
        color?: any;
        opacity?: any;
        visible?: any;
        width?: any;
    };
    minorTickCount?: any;
    minorTickInterval?: number | object | string | {
        days?: any;
        hours?: any;
        milliseconds?: any;
        minutes?: any;
        months?: any;
        quarters?: any;
        seconds?: any;
        weeks?: any;
        years?: any;
    };
    minRange?: number | object | string | {
        days?: any;
        hours?: any;
        milliseconds?: any;
        minutes?: any;
        months?: any;
        quarters?: any;
        seconds?: any;
        weeks?: any;
        years?: any;
    };
    placeholderHeight?: any;
    showCustomBoundaryTicks?: any;
    singleWorkdays?: any;
    startValue?: any;
    tick?: object | {
        color?: any;
        opacity?: any;
        width?: any;
    };
    tickInterval?: number | object | string | {
        days?: any;
        hours?: any;
        milliseconds?: any;
        minutes?: any;
        months?: any;
        quarters?: any;
        seconds?: any;
        weeks?: any;
        years?: any;
    };
    type?: any;
    valueType?: any;
    workdaysOnly?: any;
    workWeek?: any;
}
declare class Scale extends NestedOption<IScaleProps> {
    static OptionName: string;
    static ExpectedChildren: {
        aggregationInterval: {
            optionName: string;
            isCollectionItem: boolean;
        };
        break: {
            optionName: string;
            isCollectionItem: boolean;
        };
        breakStyle: {
            optionName: string;
            isCollectionItem: boolean;
        };
        label: {
            optionName: string;
            isCollectionItem: boolean;
        };
        marker: {
            optionName: string;
            isCollectionItem: boolean;
        };
        maxRange: {
            optionName: string;
            isCollectionItem: boolean;
        };
        minorTick: {
            optionName: string;
            isCollectionItem: boolean;
        };
        minorTickInterval: {
            optionName: string;
            isCollectionItem: boolean;
        };
        minRange: {
            optionName: string;
            isCollectionItem: boolean;
        };
        scaleLabel: {
            optionName: string;
            isCollectionItem: boolean;
        };
        tick: {
            optionName: string;
            isCollectionItem: boolean;
        };
        tickInterval: {
            optionName: string;
            isCollectionItem: boolean;
        };
    };
}
interface IScaleLabelProps {
    customizeText?: any;
    font?: any;
    format?: any;
    overlappingBehavior?: any;
    topIndent?: any;
    visible?: any;
}
declare class ScaleLabel extends NestedOption<IScaleLabelProps> {
    static OptionName: string;
    static ExpectedChildren: {
        font: {
            optionName: string;
            isCollectionItem: boolean;
        };
        format: {
            optionName: string;
            isCollectionItem: boolean;
        };
    };
}
interface ISelectionStyleProps {
    border?: object | {
        color?: any;
        visible?: any;
        width?: any;
    };
    color?: any;
    size?: any;
    dashStyle?: any;
    hatching?: object | {
        direction?: any;
        opacity?: any;
        step?: any;
        width?: any;
    };
    width?: any;
}
declare class SelectionStyle extends NestedOption<ISelectionStyleProps> {
    static OptionName: string;
}
interface ISeriesProps {
    aggregation?: object | {
        calculate?: any;
        enabled?: any;
        method?: any;
    };
    argumentField?: any;
    axis?: any;
    barOverlapGroup?: any;
    barPadding?: any;
    barWidth?: any;
    border?: object | {
        color?: any;
        dashStyle?: any;
        visible?: any;
        width?: any;
    };
    closeValueField?: any;
    color?: any;
    cornerRadius?: any;
    dashStyle?: any;
    highValueField?: any;
    hoverMode?: any;
    hoverStyle?: object | {
        border?: object | {
            color?: any;
            dashStyle?: any;
            visible?: any;
            width?: any;
        };
        color?: any;
        dashStyle?: any;
        hatching?: object | {
            direction?: any;
            opacity?: any;
            step?: any;
            width?: any;
        };
        width?: any;
    };
    ignoreEmptyPoints?: any;
    innerColor?: any;
    label?: object | {
        alignment?: any;
        argumentFormat?: any;
        backgroundColor?: any;
        border?: object | {
            color?: any;
            dashStyle?: any;
            visible?: any;
            width?: any;
        };
        connector?: object | {
            color?: any;
            visible?: any;
            width?: any;
        };
        customizeText?: any;
        font?: any;
        format?: any;
        horizontalOffset?: any;
        position?: any;
        rotationAngle?: any;
        showForZeroValues?: any;
        verticalOffset?: any;
        visible?: any;
    };
    lowValueField?: any;
    maxLabelCount?: any;
    minBarSize?: any;
    name?: any;
    opacity?: any;
    openValueField?: any;
    pane?: any;
    point?: object | {
        border?: object | {
            color?: any;
            visible?: any;
            width?: any;
        };
        color?: any;
        hoverMode?: any;
        hoverStyle?: object | {
            border?: object | {
                color?: any;
                visible?: any;
                width?: any;
            };
            color?: any;
            size?: any;
        };
        image?: object | string | {
            height?: number | object | {
                rangeMaxPoint?: any;
                rangeMinPoint?: any;
            };
            url?: object | string | {
                rangeMaxPoint?: any;
                rangeMinPoint?: any;
            };
            width?: number | object | {
                rangeMaxPoint?: any;
                rangeMinPoint?: any;
            };
        };
        selectionMode?: any;
        selectionStyle?: object | {
            border?: object | {
                color?: any;
                visible?: any;
                width?: any;
            };
            color?: any;
            size?: any;
        };
        size?: any;
        symbol?: any;
        visible?: any;
    };
    rangeValue1Field?: any;
    rangeValue2Field?: any;
    reduction?: object | {
        color?: any;
        level?: any;
    };
    selectionMode?: any;
    selectionStyle?: object | {
        border?: object | {
            color?: any;
            dashStyle?: any;
            visible?: any;
            width?: any;
        };
        color?: any;
        dashStyle?: any;
        hatching?: object | {
            direction?: any;
            opacity?: any;
            step?: any;
            width?: any;
        };
        width?: any;
    };
    showInLegend?: any;
    sizeField?: any;
    stack?: any;
    tag?: any;
    tagField?: any;
    type?: any;
    valueErrorBar?: object | {
        color?: any;
        displayMode?: any;
        edgeLength?: any;
        highValueField?: any;
        lineWidth?: any;
        lowValueField?: any;
        opacity?: any;
        type?: any;
        value?: any;
    };
    valueField?: any;
    visible?: any;
    width?: any;
}
declare class Series extends NestedOption<ISeriesProps> {
    static OptionName: string;
    static IsCollectionItem: boolean;
}
interface ISeriesBorderProps {
    color?: any;
    dashStyle?: any;
    visible?: any;
    width?: any;
}
declare class SeriesBorder extends NestedOption<ISeriesBorderProps> {
    static OptionName: string;
}
interface ISeriesTemplateProps {
    customizeSeries?: any;
    nameField?: any;
}
declare class SeriesTemplate extends NestedOption<ISeriesTemplateProps> {
    static OptionName: string;
}
interface IShutterProps {
    color?: any;
    opacity?: any;
}
declare class Shutter extends NestedOption<IShutterProps> {
    static OptionName: string;
}
interface ISizeProps {
    height?: any;
    width?: any;
}
declare class Size extends NestedOption<ISizeProps> {
    static OptionName: string;
}
interface ISliderHandleProps {
    color?: any;
    opacity?: any;
    width?: any;
}
declare class SliderHandle extends NestedOption<ISliderHandleProps> {
    static OptionName: string;
}
interface ISliderMarkerProps {
    color?: any;
    customizeText?: any;
    font?: any;
    format?: any;
    invalidRangeColor?: any;
    paddingLeftRight?: any;
    paddingTopBottom?: any;
    placeholderHeight?: any;
    visible?: any;
}
declare class SliderMarker extends NestedOption<ISliderMarkerProps> {
    static OptionName: string;
    static ExpectedChildren: {
        font: {
            optionName: string;
            isCollectionItem: boolean;
        };
        format: {
            optionName: string;
            isCollectionItem: boolean;
        };
    };
}
interface ISubtitleProps {
    font?: any;
    offset?: any;
    text?: any;
    textOverflow?: any;
    wordWrap?: any;
}
declare class Subtitle extends NestedOption<ISubtitleProps> {
    static OptionName: string;
    static ExpectedChildren: {
        font: {
            optionName: string;
            isCollectionItem: boolean;
        };
    };
}
interface ITickProps {
    color?: any;
    opacity?: any;
    width?: any;
}
declare class Tick extends NestedOption<ITickProps> {
    static OptionName: string;
}
interface ITickIntervalProps {
    days?: any;
    hours?: any;
    milliseconds?: any;
    minutes?: any;
    months?: any;
    quarters?: any;
    seconds?: any;
    weeks?: any;
    years?: any;
}
declare class TickInterval extends NestedOption<ITickIntervalProps> {
    static OptionName: string;
}
interface ITitleProps {
    font?: any;
    horizontalAlignment?: any;
    margin?: number | object | {
        bottom?: any;
        left?: any;
        right?: any;
        top?: any;
    };
    placeholderSize?: any;
    subtitle?: object | string | {
        font?: any;
        offset?: any;
        text?: any;
        textOverflow?: any;
        wordWrap?: any;
    };
    text?: any;
    textOverflow?: any;
    verticalAlignment?: any;
    wordWrap?: any;
}
declare class Title extends NestedOption<ITitleProps> {
    static OptionName: string;
    static ExpectedChildren: {
        font: {
            optionName: string;
            isCollectionItem: boolean;
        };
        margin: {
            optionName: string;
            isCollectionItem: boolean;
        };
        subtitle: {
            optionName: string;
            isCollectionItem: boolean;
        };
    };
}
interface IUrlProps {
    rangeMaxPoint?: any;
    rangeMinPoint?: any;
}
declare class Url extends NestedOption<IUrlProps> {
    static OptionName: string;
}
interface IValueProps {
    endValue?: any;
    length?: number | object | string | {
        days?: any;
        hours?: any;
        milliseconds?: any;
        minutes?: any;
        months?: any;
        quarters?: any;
        seconds?: any;
        weeks?: any;
        years?: any;
    };
    startValue?: any;
    defaultEndValue?: any;
    onEndValueChange?: (value: any) => void;
    defaultStartValue?: any;
    onStartValueChange?: (value: any) => void;
}
declare class Value extends NestedOption<IValueProps> {
    static OptionName: string;
    static DefaultsProps: {
        defaultEndValue: string;
        defaultStartValue: string;
    };
    static ExpectedChildren: {
        length: {
            optionName: string;
            isCollectionItem: boolean;
        };
    };
}
interface IValueAxisProps {
    inverted?: any;
    logarithmBase?: any;
    max?: any;
    min?: any;
    type?: any;
    valueType?: any;
}
declare class ValueAxis extends NestedOption<IValueAxisProps> {
    static OptionName: string;
}
interface IValueErrorBarProps {
    color?: any;
    displayMode?: any;
    edgeLength?: any;
    highValueField?: any;
    lineWidth?: any;
    lowValueField?: any;
    opacity?: any;
    type?: any;
    value?: any;
}
declare class ValueErrorBar extends NestedOption<IValueErrorBarProps> {
    static OptionName: string;
}
interface IWidthProps {
    rangeMaxPoint?: any;
    rangeMinPoint?: any;
}
declare class Width extends NestedOption<IWidthProps> {
    static OptionName: string;
}
export default RangeSelector;
export { RangeSelector, IRangeSelectorOptions, Aggregation, IAggregationProps, AggregationInterval, IAggregationIntervalProps, ArgumentFormat, IArgumentFormatProps, Background, IBackgroundProps, BackgroundImage, IBackgroundImageProps, Behavior, IBehaviorProps, Border, IBorderProps, Break, IBreakProps, BreakStyle, IBreakStyleProps, Chart, IChartProps, CommonSeriesSettings, ICommonSeriesSettingsProps, CommonSeriesSettingsHoverStyle, ICommonSeriesSettingsHoverStyleProps, CommonSeriesSettingsLabel, ICommonSeriesSettingsLabelProps, CommonSeriesSettingsSelectionStyle, ICommonSeriesSettingsSelectionStyleProps, Connector, IConnectorProps, DataPrepareSettings, IDataPrepareSettingsProps, Export, IExportProps, Font, IFontProps, Format, IFormatProps, Hatching, IHatchingProps, Height, IHeightProps, HoverStyle, IHoverStyleProps, Image, IImageProps, Indent, IIndentProps, Label, ILabelProps, Length, ILengthProps, LoadingIndicator, ILoadingIndicatorProps, Margin, IMarginProps, Marker, IMarkerProps, MarkerLabel, IMarkerLabelProps, MaxRange, IMaxRangeProps, MinorTick, IMinorTickProps, MinorTickInterval, IMinorTickIntervalProps, MinRange, IMinRangeProps, Point, IPointProps, PointBorder, IPointBorderProps, PointHoverStyle, IPointHoverStyleProps, PointImage, IPointImageProps, PointSelectionStyle, IPointSelectionStyleProps, Reduction, IReductionProps, Scale, IScaleProps, ScaleLabel, IScaleLabelProps, SelectionStyle, ISelectionStyleProps, Series, ISeriesProps, SeriesBorder, ISeriesBorderProps, SeriesTemplate, ISeriesTemplateProps, Shutter, IShutterProps, Size, ISizeProps, SliderHandle, ISliderHandleProps, SliderMarker, ISliderMarkerProps, Subtitle, ISubtitleProps, Tick, ITickProps, TickInterval, ITickIntervalProps, Title, ITitleProps, Url, IUrlProps, Value, IValueProps, ValueAxis, IValueAxisProps, ValueErrorBar, IValueErrorBarProps, Width, IWidthProps };
