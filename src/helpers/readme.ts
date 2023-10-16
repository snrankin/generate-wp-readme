import { fileContents, log } from './utils';

import { parsePluginMetadata } from './meta';
import { formatChangelog } from './changelog';
import { env } from 'node:process';
export async function readmeText(templateFile: string, mainFile: string, packageFile: string, changelog: string, changelogLength: number): Promise<string> {
	const meta = parsePluginMetadata(mainFile, changelog, packageFile);

	meta.PLUGIN_CHANGELOG = await formatChangelog(changelog, changelogLength);

	if (env.debug) {
		log(meta, 'info');
	}

	let readme = fileContents(templateFile);
	// Replace variables.
	Object.entries(meta).forEach(([key, val]) => {
		readme = readme.replace(new RegExp(`{{__${key}__}}`, 'g'), val);
	});

	return readme;
}
