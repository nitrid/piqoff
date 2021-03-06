/**
 * DevExtreme (esm/file_management/error.js)
 * Version: 21.1.5
 * Build date: Mon Aug 02 2021
 *
 * Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
class FileSystemError {
    constructor(errorCode, fileSystemItem, errorText) {
        this.errorCode = errorCode;
        this.fileSystemItem = fileSystemItem;
        this.errorText = errorText
    }
}
export default FileSystemError;
