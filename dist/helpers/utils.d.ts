export declare const getProjectSlug: () => string;
export interface NumberOrStringDictionary {
    [index: string]: number | string;
}
export interface StringDictionary {
    [index: string]: string;
}
/**
 * Package
 * @date 10/12/2023 - 12:16:31 PM
 *
 * @type {string}
 */
export declare const PKG: string;
export declare function fullPath(filePath: string): string;
/**
 * Check if a variable is empty
 *
 * @export
 * @param {*} el The variable to check
 * @return {boolean} True if empty, false if not
 */
export declare function isEmpty(el: any): boolean;
/**
 * Check if object has a key or path using dot notation
 *
 * @export
 * @param {Object} obj The object to check
 * @param {string} path The path to check for
 * @returns {boolean}
 */
export declare function has(obj: Object, path: string): boolean;
/**
 * Get the value of a key from an object or use the provided default value
 *
 * @export
 * @param {Object} obj The object to pull from
 * @param {string} path The path
 * @param {*} defValue The default value
 * @returns {*}
 */
export declare function get<Type>(obj: Object, path: string, defValue: any): Type;
/**
 * Description placeholder
 * @date 10/12/2023 - 1:27:45 PM
 *
 * @export
 * @param {string} packageFile
 * @returns {object}
 */
export declare function getPackageInfo(packageFile?: string): any;
export declare function getPackageField<Type>(field: string, defaultVal?: any, packageFile?: string): Type;
export declare function fileContents(filePath: string): string;
/**
 * Parses WordPress project metadata from a file header comment.
 *
 * @since [version]
 *
 * @return {Object} A key/value object containing the metadata found within the file.
 */
export declare function parsePluginMetadata(file: string): StringDictionary;
export declare const zip: (a: any[], b: any[]) => any[][];
export declare const arraysToObject: (keys: string[], values: string[]) => StringDictionary;
export declare function logColor(msg: any, type?: string): string;
/**
 * Log a result to the console
 *
 * @since 0.0.1
 *
 * @param {string} msg  Message to log.
 * @param {string} type Message type. Accepts success, warning, error, or info.
 * @return {void}
 */
export declare function log(msg: any, type?: string): void;
//# sourceMappingURL=utils.d.ts.map