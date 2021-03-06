/**
* DevExtreme (file_management/provider_base.d.ts)
* Version: 21.1.5
* Build date: Mon Aug 02 2021
*
* Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import FileSystemItem from './file_system_item';
import UploadInfo from './upload_info';

import {
    DxPromise
} from '../core/utils/deferred';

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export interface FileSystemProviderBaseOptions<T = FileSystemProviderBase> {
    /**
     * Specifies which data field provides timestamps that indicate when a file was last modified.
     */
    dateModifiedExpr?: string | Function;
    /**
     * Specifies which data field provides information about whether a file system item is a directory.
     */
    isDirectoryExpr?: string | Function;
    /**
     * Specifies the data field that provides keys.
     */
    keyExpr?: string | Function;
    /**
     * Specifies which data field provides file and directory names.
     */
    nameExpr?: string | Function;
    /**
     * Specifies which data field provides file sizes.
     */
    sizeExpr?: string | Function;
    /**
     * Specifies which data field provides icons to be used as thumbnails.
     */
    thumbnailExpr?: string | Function;
}
/**
 * Contains base provider settings.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please describe your scenario in the following GitHub Issue, and we will suggest a public alternative: {@link https://github.com/DevExpress/DevExtreme/issues/17885|Internal Types}.
 */
export default class FileSystemProviderBase {
    constructor(options?: FileSystemProviderBaseOptions)
    /**
     * Gets file system items.
     */
    getItems(parentDirectory: FileSystemItem): DxPromise<Array<FileSystemItem>>;

    /**
     * Renames a file or folder.
     */
    renameItem(item: FileSystemItem, newName: string): DxPromise<any>;

    /**
     * Creates a directory.
     */
    createDirectory(parentDirectory: FileSystemItem, name: string): DxPromise<any>;

    /**
     * Deletes files or folders.
     */
    deleteItems(items: Array<FileSystemItem>): Array<DxPromise<any>>;

    /**
     * Moves files and folders.
     */
    moveItems(items: Array<FileSystemItem>, destinationDirectory: FileSystemItem): Array<DxPromise<any>>;

    /**
     * Copies files or folders.
     */
    copyItems(items: Array<FileSystemItem>, destinationDirectory: FileSystemItem): Array<DxPromise<any>>;

    /**
     * Uploads a file in chunks.
     */
    uploadFileChunk(fileData: File, uploadInfo: UploadInfo, destinationDirectory: FileSystemItem): DxPromise<any>;

    /**
     * Cancels the file upload.
     */
    abortFileUpload(fileData: File, uploadInfo: UploadInfo, destinationDirectory: FileSystemItem): DxPromise<any>;

    /**
     * Downloads files.
     */
    downloadItems(items: Array<FileSystemItem>): void;

    /**
     * Gets items content.
     */
    getItemsContent(items: Array<FileSystemItem>): DxPromise<any>;
}
