import path from 'path';

import fs from 'fs-extra';
import normalizeData from 'normalize-package-data';
import chalk from 'chalk';
import { inspect } from 'node:util';
export const getProjectSlug = () => {
	return path.basename(process.cwd());
};

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
export const PKG: string = path.resolve(__dirname, '..', '..', 'package.json');

export function fullPath(filePath: string) {
	return path.resolve(process.cwd(), filePath);
}

/**
 * Check if a variable is empty
 *
 * @export
 * @param {*} el The variable to check
 * @return {boolean} True if empty, false if not
 */
export function isEmpty(el: any): boolean {
	if (el == undefined) {
		return true;
	}

	if (el == null) {
		return true;
	}

	if (typeof el === 'string') {
		if (el.length == 0) {
			return true;
		} else if (el.trim() === '') {
			return true;
		}
	} else if (el instanceof Object) {
		if (Array.isArray(el) && el.length == 0) {
			return true;
		}
	}
	return false;
}

/**
 * Check if object has a key or path using dot notation
 *
 * @export
 * @param {Object} obj The object to check
 * @param {string} path The path to check for
 * @returns {boolean}
 */
export function has(obj: Object, path: string) {
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

/**
 * Get the value of a key from an object or use the provided default value
 *
 * @export
 * @param {Object} obj The object to pull from
 * @param {string} path The path
 * @param {*} defValue The default value
 * @returns {*}
 */
export function get<Type>(obj: Object, path: string, defValue: any): Type {
	// If path is not defined or it has false value
	if (!path) return defValue;

	if (has(obj, path)) {
		const pathArray = Array.isArray(path) ? path : path.match(/([^[.\]])+/g);

		if (pathArray != null) {
			return pathArray.reduce((prevObj, key) => prevObj && prevObj[key], obj);
		}
	}
	return defValue;
}

/**
 * Description placeholder
 * @date 10/12/2023 - 1:27:45 PM
 *
 * @export
 * @param {string} packageFile
 * @returns {object}
 */
export function getPackageInfo(packageFile: string = 'package.json') {
	packageFile = fullPath(packageFile);

	try {
		if (fs.pathExistsSync(packageFile)) {
			let packageData = fs.readJSONSync(packageFile);
			normalizeData(packageData);
			return packageData;
		}
	} catch (error) {
		console.error(error);
	}
}

export function getPackageField<Type>(field: string, defaultVal: any = '', packageFile: string = 'package.json'): Type {
	const packageData = getPackageInfo(packageFile);
	const fieldVal = get<Type>(packageData, field, defaultVal);
	return fieldVal;
}

export function fileContents(filePath: string) {
	filePath = fullPath(filePath);

	if (fs.pathExistsSync(filePath)) {
		const file = fs.readFileSync(filePath);
		if (file) {
			return file.toString();
		}
		return '';
	} else {
		console.error(`${filePath} does not exist`);
		return '';
	}
}

/**
 * Parses WordPress project metadata from a file header comment.
 *
 * @since [version]
 *
 * @return {Object} A key/value object containing the metadata found within the file.
 */
export function parsePluginMetadata(file: string) {
	const contents = fileContents(file),
		regex = new RegExp(/ \* (?<key>[A-Z][A-Za-z ]+)\: (?<val>.*)\n/g, 'g');

	let matches,
		metas: StringDictionary = {};
	while ((matches = regex.exec(contents))) {
		var key = get<string>(matches, 'groups.key', '').trim();
		var val = get<string>(matches, 'groups.val', '').trim();

		if (!isEmpty(key) && !isEmpty(val)) {
			metas[key] = val;
		}
	}

	return metas;
}

export const zip = (a: any[], b: any[]) => Array.from(Array(Math.max(b.length, a.length)), (_, i) => [a[i], b[i]]);

export const arraysToObject = (keys: string[], values: string[]) => {
	let totalItems = Math.max(values.length, keys.length);

	keys = keys.slice(0, totalItems);

	values = values.slice(0, totalItems);

	let obj: StringDictionary = {};
	keys.forEach((key, i) => {
		obj[key] = values[i];
	});

	return obj;
};

export function logColor(msg: any, type: string = 'info'): string {
	let title = chalk.bold(type.charAt(0).toUpperCase() + type.slice(1)) + ': ';

	if (typeof msg === 'object') {
		msg = inspect(msg, false, 10, true);
	}

	switch (type) {
		case 'success':
			msg = chalk.green('✔ ' + title) + msg;
			break;

		case 'warning':
			msg = chalk.yellow('⚠ ' + title) + msg;
			break;

		case 'error':
			msg = chalk.red('✘ ' + title) + msg;
			break;

		case 'info':
			msg = chalk.blue('ℹ ' + title) + msg;
			break;
	}
	return msg;
}

/**
 * Log a result to the console
 *
 * @since 0.0.1
 *
 * @param {string} msg  Message to log.
 * @param {string} type Message type. Accepts success, warning, error, or info.
 * @return {void}
 */
export function log(msg: any, type = 'info') {
	msg = logColor(msg, type);

	console.log(msg);
}
