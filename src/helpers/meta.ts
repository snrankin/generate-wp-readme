import { getPackageField, fileContents, get, isEmpty, getProjectSlug } from './utils';

export interface FileReplacements {
	PLUGIN_NAME: string;
	PLUGIN_SLUG: string;
	PLUGIN_URI: string;
	PLUGIN_AUTHOR: string;
	PLUGIN_AUTHOR_URI: string;
	PLUGIN_LICENSE: string;
	PLUGIN_LICENSE_URI: string;
	PLUGIN_MIN_WP: string;
	PLUGIN_TESTED_WP: string;
	PLUGIN_MIN_PHP: string;
	PLUGIN_DESCRIPTION: string;
	PLUGIN_VERSION: string;
	PLUGIN_CHANGELOG_URI: string;
	PLUGIN_CHANGELOG: string;
	PLUGIN_DONATE: string;
	PLUGIN_CONTRIBUTORS: string;
	PLUGIN_TAGS: string;
}

function getWPProfile(obj: object | string): string {
	let wpProfile = new RegExp('(?<=https:\\/\\/profiles.wordpress.org\\/)[^\\/\\s]+', 'gm');
	let profile = '';
	if (typeof obj === 'object') {
		obj = get(obj, 'url', false);
	}

	if (typeof obj === 'string') {
		let authorMatch = obj.match(wpProfile);

		if (authorMatch && authorMatch.length >= 1) {
			profile = authorMatch[0];
		}
	}
	return profile;
}

function getWPDonate(packageFile: string = 'package.json'): string {
	let funding = getPackageField<string | object | boolean>('funding', false, packageFile);
	let donate = '';
	if (typeof funding === 'object') {
		funding = get(funding, 'url', false);
		if (!funding) {
			funding = get(funding, '0', false);
			if (typeof funding === 'object') {
				funding = get(funding, 'url', false);
			}
		}
	}

	if (typeof funding === 'string') {
		donate = funding;
	}
	return donate;
}

function getPluginContributors(packageFile: string = 'package.json') {
	let author = getWPProfile(getPackageField('author', '', packageFile));
	let contributors = getPackageField<object[]>('contributors', [], packageFile);

	let wpContributors: string[] = [];
	if (!isEmpty(author)) {
		wpContributors.push(author);
	}
	if (contributors.length > 0) {
		contributors.forEach((obj: object) => {
			let contributor = getWPProfile(obj);
			wpContributors.push(contributor);
		});
	}

	return wpContributors.join(', ');
}

function getPluginHomepage(packageFile: string = 'package.json'): string {
	var pluginHomepage = getPackageField<string>('homepage', '', packageFile);
	pluginHomepage = pluginHomepage.replace('#readme', '');

	return pluginHomepage;
}

/**
 * Parses WordPress project metadata from a file header comment.
 *
 * @since [version]
 *
 * @return {Object} A key/value object containing the metadata found within the file.
 */
export function parsePluginMetadata(file: string, changelog: string, packageFile: string = 'package.json'): FileReplacements {
	let matches,
		metas: FileReplacements = {
			PLUGIN_NAME: '',
			PLUGIN_SLUG: getProjectSlug(),
			PLUGIN_URI: getPackageField('homepage', '', packageFile),
			PLUGIN_LICENSE: '',
			PLUGIN_LICENSE_URI: '',
			PLUGIN_AUTHOR: '',
			PLUGIN_AUTHOR_URI: '',
			PLUGIN_MIN_WP: '',
			PLUGIN_TESTED_WP: '',
			PLUGIN_MIN_PHP: '',
			PLUGIN_DESCRIPTION: '',
			PLUGIN_VERSION: getPackageField('version', '', packageFile),
			PLUGIN_CHANGELOG_URI: new URL(changelog, getPluginHomepage(packageFile)).toString(),
			PLUGIN_CHANGELOG: '',
			PLUGIN_DONATE: getWPDonate(packageFile),
			PLUGIN_CONTRIBUTORS: getPluginContributors(packageFile),
			PLUGIN_TAGS: getPackageField<string[]>('keywords', [], packageFile).join(', '),
		};

	if (!isEmpty(file)) {
		const contents = fileContents(file),
			regex = new RegExp(/ \* (?<key>[A-Z][A-Za-z ]+)\: (?<val>.*)\n/g, 'g');

		while ((matches = regex.exec(contents))) {
			var key = get<string>(matches, 'groups.key', '').trim();
			var val = get<string>(matches, 'groups.val', '').trim();

			if (!isEmpty(key) && !isEmpty(val)) {
				switch (key) {
					case 'Plugin Name':
						metas.PLUGIN_NAME = val;
						break;
					case 'Plugin URI':
						metas.PLUGIN_URI = val;
						break;
					case 'Description':
						metas.PLUGIN_DESCRIPTION = val;
						break;
					case 'Author':
						metas.PLUGIN_AUTHOR = val;
						break;
					case 'Author URI':
						metas.PLUGIN_AUTHOR_URI = val;
						break;
					case 'License':
						metas.PLUGIN_LICENSE = val;
						break;
					case 'License URI':
						metas.PLUGIN_LICENSE_URI = val;
						break;
					case 'Tested up to':
						metas.PLUGIN_TESTED_WP = val;
						break;
					case 'Requires at least':
						metas.PLUGIN_MIN_WP = val;
						break;
					case 'Requires PHP':
						metas.PLUGIN_MIN_PHP = val;
						break;
				}
			}
		}
	}

	return metas;
}
