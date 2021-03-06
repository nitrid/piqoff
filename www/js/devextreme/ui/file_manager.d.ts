/**
* DevExtreme (ui/file_manager.d.ts)
* Version: 21.1.5
* Build date: Mon Aug 02 2021
*
* Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import {
    UserDefinedElement,
    DxElement
} from '../core/element';

import {
    DxPromise
} from '../core/utils/deferred';

import {
    Cancelable,
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo
} from '../events/index';

import FileSystemItem from '../file_management/file_system_item';

import {
    dxContextMenuItem
} from './context_menu';

import {
    dxToolbarItem
} from './toolbar';

import Widget, {
    WidgetOptions
} from './widget/ui.widget';

import {
    template
} from '../core/templates/template';


export type ContentReadyEvent = EventInfo<dxFileManager>;

export type ContextMenuItemClickEvent = NativeEventInfo<dxFileManager> & {
    readonly itemData: any;
    readonly itemElement: DxElement;
    readonly itemIndex: number;
    readonly fileSystemItem?: FileSystemItem;
    readonly viewArea: 'navPane' | 'itemView';
}

export type ContextMenuShowingEvent = Cancelable & NativeEventInfo<dxFileManager> & {
    readonly fileSystemItem?: FileSystemItem;
    readonly targetElement?: DxElement;
    readonly viewArea: 'navPane' | 'itemView';
}

export type CurrentDirectoryChangedEvent = EventInfo<dxFileManager> & {
    readonly directory: FileSystemItem;
}

export type DisposingEvent = EventInfo<dxFileManager>;

export type ErrorOccurredEvent =  EventInfo<dxFileManager> & {
    readonly errorCode?: number;
    errorText?: string;
    readonly fileSystemItem?: FileSystemItem;
}

export type FocusedItemChangedEvent =  EventInfo<dxFileManager> & {
    readonly item?: FileSystemItem;
    readonly itemElement?: DxElement;
}

export type InitializedEvent = InitializedEventInfo<dxFileManager>;


export type OptionChangedEvent = EventInfo<dxFileManager> & ChangedOptionInfo;

export type SelectedFileOpenedEvent = EventInfo<dxFileManager> & {
    readonly file: FileSystemItem;
}

export type SelectionChangedEvent =  EventInfo<dxFileManager> & {
    readonly currentSelectedItemKeys: Array<string>;
    readonly currentDeselectedItemKeys: Array<string>;
    readonly selectedItems: Array<FileSystemItem>;
    readonly selectedItemKeys: Array<string>;
}

export type ToolbarItemClickEvent = NativeEventInfo<dxFileManager> & {
    readonly itemData: any;
    readonly itemElement: DxElement;
    readonly itemIndex: number;
}

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxFileManagerOptions extends WidgetOptions<dxFileManager> {
    /**
     * Specifies the allowed upload file extensions.
     */
    allowedFileExtensions?: Array<string>;
    /**
     * Configures the context menu settings.
     */
    contextMenu?: dxFileManagerContextMenu;
    /**
     * Specifies the path that is used when the FileManager is initialized.
     */
    currentPath?: string;
    /**
     * Specifies an array of path keys to the current location.
     */
    currentPathKeys?: Array<string>;
    /**
     * Customizes columns in details view. Applies only if itemView.mode is &apos;details&apos;.
     */
    customizeDetailColumns?: ((columns: Array<dxFileManagerDetailsColumn>) => Array<dxFileManagerDetailsColumn>);
    /**
     * Allows you to provide custom icons to be used as thumbnails.
     */
    customizeThumbnail?: ((fileSystemItem: FileSystemItem) => string);
    /**
     * Specifies the file system provider.
     */
    fileSystemProvider?: any;
    /**
     * Configures the file and folder view.
     */
    itemView?: {
      /**
       * Configures the &apos;Details&apos; file system representation mode.
       */
      details?: {
        /**
         * Configures the columns.
         */
        columns?: Array<dxFileManagerDetailsColumn | string>
      },
      /**
       * Specifies the file system representation mode.
       */
      mode?: 'details' | 'thumbnails',
      /**
       * Specifies whether to display folders in the view. When this property is false, folders are displayed in the navigation pane only.
       */
      showFolders?: boolean,
      /**
       * Specifies whether to display the parent folder in the view.
       */
      showParentFolder?: boolean
    };
    /**
     * Configures notification settings.
     */
    notifications?: {
      /**
       * Specifies whether to show the progress panel.
       */
      showPanel?: boolean,
      /**
       * Specifies whether to show the pop-up notification window.
       */
      showPopup?: boolean
    }
    /**
     * A function that is executed when a context menu item is clicked.
     */
    onContextMenuItemClick?: ((e: ContextMenuItemClickEvent) => void);
    /**
     * A function that is executed before a context menu is displayed.
     */
    onContextMenuShowing?: ((e: ContextMenuShowingEvent) => void);
    /**
     * A function that is executed when the current directory is changed.
     */
    onCurrentDirectoryChanged?: ((e: CurrentDirectoryChangedEvent) => void);
    /**
     * A function that is executed when the selected file is opened.
     */
    onSelectedFileOpened?: ((e: SelectedFileOpenedEvent) => void);
    /**
     * A function that is executed when a file system item is selected or selection is canceled.
     */
    onSelectionChanged?: ((e: SelectionChangedEvent) => void);
    /**
     * A function that is executed when a toolbar item is clicked.
     */
    onToolbarItemClick?: ((e: ToolbarItemClickEvent) => void);
    /**
     * A function that is executed when the focused item is changed.
     */
    onFocusedItemChanged?: ((e: FocusedItemChangedEvent) => void);
    /**
     * A function that is executed when an error occurs.
     */
    onErrorOccurred?: ((e: ErrorOccurredEvent) => void);
    /**
     * Specifies actions that a user is allowed to perform on files and folders.
     */
    permissions?: {
      /**
       * Specifies whether a user is allowed to copy files and folders.
       */
      copy?: boolean,
      /**
       * Specifies whether a user is allowed to create files and folders.
       */
      create?: boolean,
      /**
       * Specifies whether a user is allowed to download files.
       */
      download?: boolean,
      /**
       * Specifies whether a user is allowed to move files and folders.
       */
      move?: boolean,
      /**
       * Specifies whether a user is allowed to delete files and folders.
       */
      delete?: boolean,
      /**
       * Specifies whether a user is allowed to rename files and folders.
       */
      rename?: boolean,
      /**
       * Specifies whether a user is allowed to upload files.
       */
      upload?: boolean
    };
    /**
     * Specifies the root folder name.
     */
    rootFolderName?: string;
    /**
     * Specifies whether a user can select a single or multiple files and folders in the item view simultaneously.
     */
    selectionMode?: 'multiple' | 'single';
    /**
     * Contains an array of initially or currently selected files and directories&apos; keys.
     */
    selectedItemKeys?: Array<string>;
    /**
     * Specifies a key of the initially or currently focused item.
     */
    focusedItemKey?: string;
    /**
     * Configures toolbar settings.
     */
    toolbar?: dxFileManagerToolbar;
    /**
     * Configures upload settings.
     */
    upload?: {
      /**
       * Specifies the maximum upload file size, in bytes.
       */
      maxFileSize?: number,
      /**
       * Specifies a chunk size, in bytes.
       */
      chunkSize?: number
    };
}
/**
 * The FileManager is a UI component that allows users to upload, select, and manage files and directories in different file storages.
 */
export default class dxFileManager extends Widget {
    constructor(element: UserDefinedElement, options?: dxFileManagerOptions)
    /**
     * Gets the current directory object.
     */
    getCurrentDirectory(): any;
    /**
     * Gets the selected items.
     */
    getSelectedItems(): Array<any>;
    /**
     * Reloads data and repaints the UI component.
     */
    refresh(): DxPromise<any>;
}

/**
 * Configures the context menu.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxFileManagerContextMenu {
    /**
     * Configures context menu items&apos; settings.
     */
    items?: Array<ContextMenuItem | 'create' | 'upload' | 'refresh' | 'download' | 'move' | 'copy' | 'rename' | 'delete'>;
}

export type ContextMenuItem = dxFileManagerContextMenuItem;

/**
 * @deprecated Use ContexMenuItem instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxFileManagerContextMenuItem extends dxContextMenuItem {
    /**
     * Configures settings of a context menu item&apos;s subitems.
     */
    items?: Array<dxFileManagerContextMenuItem>;
    /**
     * Specifies the context menu item&apos;s name.
     */
    name?: 'create' | 'upload' | 'refresh' | 'download' | 'move' | 'copy' | 'rename' | 'delete' | string;
    /**
     * Specifies the context menu item&apos;s visibility.
     */
    visible?: boolean;
    /**
     * 
     */
    template?: template | (() => string | UserDefinedElement);
}

/**
 * Configures the toolbar.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxFileManagerToolbar {
    /**
     * Configures settings of the toolbar items that are visible when users select files.
     */
    fileSelectionItems?: Array<ToolbarItem | 'showNavPane' | 'create' | 'upload' | 'refresh' | 'switchView' | 'download' | 'move' | 'copy' | 'rename' | 'delete' | 'clearSelection' | 'separator'>;
    /**
     * Configures toolbar items&apos; settings.
     */
    items?: Array<ToolbarItem | 'showNavPane' | 'create' | 'upload' | 'refresh' | 'switchView' | 'download' | 'move' | 'copy' | 'rename' | 'delete' | 'clearSelection' | 'separator'>;
}

export type ToolbarItem = dxFileManagerToolbarItem;

/**
 * @deprecated Use ToolbarItem instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxFileManagerToolbarItem extends dxToolbarItem {
    /**
     * Specifies the icon to be displayed on the toolbar item.
     */
    icon?: string;
    /**
     * Specifies the toolbar item&apos;s location.
     */
    location?: 'after' | 'before' | 'center';
    /**
     * Specifies the toolbar item&apos;s name.
     */
    name?: 'showNavPane' | 'create' | 'upload' | 'refresh' | 'switchView' | 'download' | 'move' | 'copy' | 'rename' | 'delete' | 'clearSelection' | 'separator' | string;
    /**
     * Specifies the toolbar item&apos;s visibility.
     */
    visible?: boolean;
    /**
     * 
     */
    html?: string;
    /**
     * 
     */
    template?: template | (() => string | UserDefinedElement);
    /**
     * 
     */
    menuItemTemplate?: template | (() => string | UserDefinedElement);
}


/**
 * Configures the column.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface dxFileManagerDetailsColumn {
    /**
     * Specifies the column alignment.
     */
    alignment?: 'center' | 'left' | 'right' | undefined;
    /**
     * Specifies the column caption.
     */
    caption?: string;
    /**
     * Specifies a CSS class to be applied to the column.
     */
    cssClass?: string;
    /**
     * Specifies which data field provides data for the column.
     */
    dataField?: string;
    /**
     * Casts column values to a specific data type.
     */
    dataType?: 'string' | 'number' | 'date' | 'boolean' | 'object' | 'datetime';
    /**
     * Specifies the order in which columns are hidden when the UI component adapts to the screen or container size.
     */
    hidingPriority?: number;
    /**
     * Specifies the order in which the column is sorted.
     */
    sortIndex?: number;
    /**
     * Specifies the sort order of column values.
     */
    sortOrder?: 'asc' | 'desc' | undefined;
    /**
     * Specifies the column visibility.
     */
    visible?: boolean;
    /**
     * Specifies the position of the column in the resulting UI component.
     */
    visibleIndex?: number;
    /**
     * Specifies the column width.
     */
    width?: number | string;
}

export type Properties = dxFileManagerOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type Options = dxFileManagerOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export type IOptions = dxFileManagerOptions;
