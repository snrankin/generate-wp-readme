"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = exports.logColor = exports.arraysToObject = exports.zip = exports.parsePluginMetadata = exports.fileContents = exports.getPackageField = exports.getPackageInfo = exports.get = exports.has = exports.isEmpty = exports.fullPath = exports.PKG = exports.getProjectSlug = void 0;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const normalize_package_data_1 = __importDefault(require("normalize-package-data"));
const chalk_1 = __importDefault(require("chalk"));
const node_util_1 = require("node:util");
const getProjectSlug = () => {
    return path_1.default.basename(process.cwd());
};
exports.getProjectSlug = getProjectSlug;
/**
 * Package
 * @date 10/12/2023 - 12:16:31 PM
 *
 * @type {string}
 */
exports.PKG = path_1.default.resolve(__dirname, '..', '..', 'package.json');
function fullPath(filePath) {
    return path_1.default.resolve(process.cwd(), filePath);
}
exports.fullPath = fullPath;
/**
 * Check if a variable is empty
 *
 * @export
 * @param {*} el The variable to check
 * @return {boolean} True if empty, false if not
 */
function isEmpty(el) {
    if (el == undefined) {
        return true;
    }
    if (el == null) {
        return true;
    }
    if (typeof el === 'string') {
        if (el.length == 0) {
            return true;
        }
        else if (el.trim() === '') {
            return true;
        }
    }
    else if (el instanceof Object) {
        if (Array.isArray(el) && el.length == 0) {
            return true;
        }
    }
    return false;
}
exports.isEmpty = isEmpty;
/**
 * Check if object has a key or path using dot notation
 *
 * @export
 * @param {Object} obj The object to check
 * @param {string} path The path to check for
 * @returns {boolean}
 */
function has(obj, path) {
    // Regex explained: https://regexr.com/58j0k
    const pathArray = Array.isArray(path) ? path : path.match(/([^[.\]])+/g);
    if (pathArray != null) {
        var result = pathArray.reduce((prevObj, key) => prevObj && prevObj[key], obj);
        if (result != null && result !== undefined) {
            return true;
        }
    }
    return false;
}
exports.has = has;
/**
 * Get the value of a key from an object or use the provided default value
 *
 * @export
 * @param {Object} obj The object to pull from
 * @param {string} path The path
 * @param {*} defValue The default value
 * @returns {*}
 */
function get(obj, path, defValue) {
    // If path is not defined or it has false value
    if (!path)
        return defValue;
    if (has(obj, path)) {
        const pathArray = Array.isArray(path) ? path : path.match(/([^[.\]])+/g);
        if (pathArray != null) {
            return pathArray.reduce((prevObj, key) => prevObj && prevObj[key], obj);
        }
    }
    return defValue;
}
exports.get = get;
/**
 * Description placeholder
 * @date 10/12/2023 - 1:27:45 PM
 *
 * @export
 * @param {string} packageFile
 * @returns {object}
 */
function getPackageInfo(packageFile = 'package.json') {
    packageFile = fullPath(packageFile);
    try {
        if (fs_extra_1.default.pathExistsSync(packageFile)) {
            let packageData = fs_extra_1.default.readJSONSync(packageFile);
            (0, normalize_package_data_1.default)(packageData);
            return packageData;
        }
    }
    catch (error) {
        console.error(error);
    }
}
exports.getPackageInfo = getPackageInfo;
function getPackageField(field, defaultVal = '', packageFile = 'package.json') {
    const packageData = getPackageInfo(packageFile);
    const fieldVal = get(packageData, field, defaultVal);
    return fieldVal;
}
exports.getPackageField = getPackageField;
function fileContents(filePath) {
    filePath = fullPath(filePath);
    if (fs_extra_1.default.pathExistsSync(filePath)) {
        const file = fs_extra_1.default.readFileSync(filePath);
        if (file) {
            return file.toString();
        }
        return '';
    }
    else {
        console.error(`${filePath} does not exist`);
        return '';
    }
}
exports.fileContents = fileContents;
/**
 * Parses WordPress project metadata from a file header comment.
 *
 * @since [version]
 *
 * @return {Object} A key/value object containing the metadata found within the file.
 */
function parsePluginMetadata(file) {
    const contents = fileContents(file), regex = new RegExp(/ \* (?<key>[A-Z][A-Za-z ]+)\: (?<val>.*)\n/g, 'g');
    let matches, metas = {};
    while ((matches = regex.exec(contents))) {
        var key = get(matches, 'groups.key', '').trim();
        var val = get(matches, 'groups.val', '').trim();
        if (!isEmpty(key) && !isEmpty(val)) {
            metas[key] = val;
        }
    }
    return metas;
}
exports.parsePluginMetadata = parsePluginMetadata;
const zip = (a, b) => Array.from(Array(Math.max(b.length, a.length)), (_, i) => [a[i], b[i]]);
exports.zip = zip;
const arraysToObject = (keys, values) => {
    let totalItems = Math.max(values.length, keys.length);
    keys = keys.slice(0, totalItems);
    values = values.slice(0, totalItems);
    let obj = {};
    keys.forEach((key, i) => {
        obj[key] = values[i];
    });
    return obj;
};
exports.arraysToObject = arraysToObject;
function logColor(msg, type = 'info') {
    let title = chalk_1.default.bold(type.charAt(0).toUpperCase() + type.slice(1)) + ': ';
    if (typeof msg === 'object') {
        msg = (0, node_util_1.inspect)(msg, false, 10, true);
    }
    switch (type) {
        case 'success':
            msg = chalk_1.default.green('✔ ' + title) + msg;
            break;
        case 'warning':
            msg = chalk_1.default.yellow('⚠ ' + title) + msg;
            break;
        case 'error':
            msg = chalk_1.default.red('✘ ' + title) + msg;
            break;
        case 'info':
            msg = chalk_1.default.blue('ℹ ' + title) + msg;
            break;
    }
    return msg;
}
exports.logColor = logColor;
/**
 * Log a result to the console
 *
 * @since 0.0.1
 *
 * @param {string} msg  Message to log.
 * @param {string} type Message type. Accepts success, warning, error, or info.
 * @return {void}
 */
function log(msg, type = 'info') {
    msg = logColor(msg, type);
    console.log(msg);
}
exports.log = log;
//# sourceMappingURL=utils.js.map