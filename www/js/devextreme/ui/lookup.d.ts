/**
* DevExtreme (ui/lookup.d.ts)
* Version: 21.1.5
* Build date: Mon Aug 02 2021
*
* Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import {
    animationConfig
} from '../animation/fx';

import {
    positionConfig
} from '../animation/position';

import {
    UserDefinedElement,
    DxElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import {
    DxEvent,
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
    ItemInfo
} from '../events/index';

import {
    SelectionChangedInfo
} from './collection/ui.collection_widget.base';

import {
    ValueChangedInfo
} from './editor/editor';

import dxDropDownList, {
    dxDropDownListOptions
} from './drop_down_editor/ui.drop_down_list';

import {
    ScrollInfo
} from './list';

import {
    dxPopoverOptions,
} from './popover';

import {
    TitleRenderedInfo
} from './popup';

export type ClosedEvent = EventInfo<dxLookup>;

export type ContentReadyEvent = EventInfo<dxLookup>;

export type DisposingEvent = EventInfo<dxLookup>;

export type InitializedEvent = InitializedEventInfo<dxLookup>;

export type ItemClickEvent = NativeEventInfo<dxLookup> & ItemInfo;

export type OpenedEvent = EventInfo<dxLookup>;

export type OptionChangedEvent = EventInfo<dxLookup> & ChangedOptionInfo;

export type PageLoadingEvent = EventInfo<dxLookup>;

export type PullRefreshEvent = EventInfo<dxLookup>;

export type ScrollEvent = NativeEventInfo<dxLookup> & ScrollInfo;

export type SelectionChangedEvent = EventInfo<dxLookup> & SelectionChangedInfo;

export type TitleRenderedEvent = EventInfo<dxLookup> & TitleRenderedInfo;

export type ValueChangedEvent = NativeEventInfo<dxLookup> & ValueChangedInfo;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxLookupOptions extends dxDropDownListOptions<dxLookup> {
    /**
     * Configures UI component visibility animations. This object contains two fields: show and hide.
     * @deprecated Use the dropDownOptions option instead.
     */
    animation?: {
      /**
       * An object that defines the animation properties used when the UI component is being hidden.
       */
      hide?: animationConfig,
      /**
       * An object that defines the animation properties used when the UI component is being shown.
       */
      show?: animationConfig
    };
    /**
     * The text displayed on the Apply button.
     */
    applyButtonText?: string;
    /**
     * Specifies the way an end-user applies the selected value.
     */
    applyValueMode?: 'instantly' | 'useButtons';
    /**
     * The text displayed on the Cancel button.
     */
    cancelButtonText?: string;
    /**
     * Specifies whether or not the UI component cleans the search box when the popup window is displayed.
     */
    cleanSearchOnOpening?: boolean;
    /**
     * The text displayed on the Clear button.
     */
    clearButtonText?: string;
    /**
     * Specifies whether to close the drop-down menu if a user clicks outside it.
     * @deprecated Use the dropDownOptions option instead.
     */
    closeOnOutsideClick?: boolean | ((event: DxEvent) => boolean);
    /**
     * Specifies a custom template for the input field.
     */
    fieldTemplate?: template | ((selectedItem: any, fieldElement: DxElement) => string | UserDefinedElement);
    /**
     * Specifies whether the UI component can be focused using keyboard navigation.
     */
    focusStateEnabled?: boolean;
    /**
     * A Boolean value specifying whether or not to display the lookup in full-screen mode.
     * @deprecated Use the dropDownOptions option instead.
     */
    fullScreen?: boolean;
    /**
     * Specifies a custom template for group captions.
     */
    groupTemplate?: template | ((itemData: any, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement);
    /**
     * A Boolean value specifying whether or not to group UI component items.
     */
    grouped?: boolean;
    /**
     * The text displayed on the button used to load the next page from the data source.
     */
    nextButtonText?: string;
    /**
     * A function that is executed before the next page is loaded.
     */
    onPageLoading?: ((e: PageLoadingEvent) => void);
    /**
     * A function that is executed when the &apos;pull to refresh&apos; gesture is performed on the drop-down item list. Supported on mobile devices only.
     */
    onPullRefresh?: ((e: PullRefreshEvent) => void);
    /**
     * A function that is executed on each scroll gesture performed on the drop-down item list.
     */
    onScroll?: ((e: ScrollEvent) => void);
    /**
     * A function that is executed when the drop-down list&apos;s title is rendered.
     * @deprecated Use the dropDownOptions option instead.
     */
    onTitleRendered?: ((e: TitleRenderedEvent) => void);
    /**
     * A function that is executed after the UI component&apos;s value is changed.
     */
    onValueChanged?: ((e: ValueChangedEvent) => void);
    /**
     * Specifies whether the next page is loaded when a user scrolls the UI component to the bottom or when the &apos;next&apos; button is clicked.
     */
    pageLoadMode?: 'nextButton' | 'scrollBottom';
    /**
     * Specifies the text shown in the pullDown panel, which is displayed when the UI component is scrolled to the bottom.
     */
    pageLoadingText?: string;
    /**
     * The text displayed by the UI component when nothing is selected.
     */
    placeholder?: string;
    /**
     * Specifies the popup element&apos;s height. Applies only if fullScreen is false.
     * @deprecated Use the dropDownOptions option instead.
     */
    popupHeight?: number | string | (() => number | string);
    /**
     * Specifies the popup element&apos;s width. Applies only if fullScreen is false.
     * @deprecated Use the dropDownOptions option instead.
     */
    popupWidth?: number | string | (() => number | string);
    /**
     * An object defining UI component positioning properties.
     * @deprecated Use the dropDownOptions option instead.
     */
    position?: positionConfig;
    /**
     * A Boolean value specifying whether or not the UI component supports the &apos;pull down to refresh&apos; gesture.
     */
    pullRefreshEnabled?: boolean;
    /**
     * Specifies the text displayed in the pullDown panel when the UI component is pulled below the refresh threshold.
     */
    pulledDownText?: string;
    /**
     * Specifies the text shown in the pullDown panel while the list is being pulled down to the refresh threshold.
     */
    pullingDownText?: string;
    /**
     * Specifies the text displayed in the pullDown panel while the UI component is being refreshed.
     */
    refreshingText?: string;
    /**
     * Specifies whether the search box is visible.
     */
    searchEnabled?: boolean;
    /**
     * The text that is provided as a hint in the lookup&apos;s search bar.
     */
    searchPlaceholder?: string;
    /**
     * Specifies whether to shade the container when the lookup is active. Applies only if usePopover is false.
     * @deprecated Use the dropDownOptions option instead.
     */
    shading?: boolean;
    /**
     * Specifies whether to display the Cancel button in the lookup window.
     */
    showCancelButton?: boolean;
    /**
     * Specifies whether to display the Clear button in the lookup window.
     */
    showClearButton?: boolean;
    /**
     * A Boolean value specifying whether or not to display the title in the popup window.
     * @deprecated Use the dropDownOptions option instead.
     */
    showPopupTitle?: boolean;
    /**
     * The title of the lookup window.
     * @deprecated Use the dropDownOptions option instead.
     */
    title?: string;
    /**
     * Specifies a custom template for the title.
     * @deprecated Use the dropDownOptions option instead.
     */
    titleTemplate?: template | ((titleElement: DxElement) => string | UserDefinedElement);
    /**
     * Specifies whether or not the UI component uses native scrolling.
     */
    useNativeScrolling?: boolean;
    /**
     * Specifies whether to show lookup contents in the Popover UI component.
     */
    usePopover?: boolean;
    /**
     * Specifies whether to vertically align the drop-down menu so that the selected item is in its center. Applies only in Material Design themes.
     */
    dropDownCentered?: boolean;
    /**
     * Configures the drop-down field.
     */
    dropDownOptions?: dxPopoverOptions;

}
/**
 * The Lookup is a UI component that allows an end user to search for an item in a collection shown in a drop-down menu.
 */
export default class dxLookup extends dxDropDownList {
    constructor(element: UserDefinedElement, options?: dxLookupOptions)
}

export type Properties = dxLookupOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type Options = dxLookupOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type IOptions = dxLookupOptions;
