/**
* DevExtreme (file_management/error.d.ts)
* Version: 21.1.5
* Build date: Mon Aug 02 2021
*
* Copyright (c) 2012 - 2021 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import FileSystemItem from "./file_system_item";

/**
  * An object that contains information about the error.
  */
 export default class FileSystemError {
   constructor(errorCode?: number, fileSystemItem?: FileSystemItem, errorText?: string)
    /**
     * The processed file or directory.
     */
    fileSystemItem?: FileSystemItem;

    /**
     * The error code.
     */
    errorCode?: number;

    /**
      * The error message.
      */
     errorText?: string;
}
