import fs from 'fs-extra';
import { fullPath, fileContents, getProjectSlug, log, arraysToObject } from './utils';
import path from 'path';
import chalk from 'chalk';
function contributors(readme: string): string {
	// Include w.org profiles for contributors.
	const contributorsMatch = readme.match(new RegExp('(\\*\\*Contributors:\\*\\* )(.+)', 'm'));

	if (contributorsMatch && contributorsMatch.length >= 1) {
		const contributorsSearch = contributorsMatch[0];
		let contributorsReplace = contributorsMatch[1];
		const profiles: string[] = [];

		// Fill profiles.
		contributorsMatch[2].split(',').forEach((value) => {
			value = value.trim();
			profiles.push('[' + value + '](https://profiles.wordpress.org/' + value + '/)');
		});

		contributorsReplace += profiles.join(', ');

		// Add line break.
		contributorsReplace += '  ';

		readme = readme.replace(contributorsSearch, contributorsReplace);
	}

	return readme;
}

function screenshots(readme: string, packageFile: string, screenshotsDir: string): string {
	// process screenshots, if any
	const screenshotMatch = readme.match(new RegExp('## Screenshots ##([^#]*)', 'im'));
	if (packageFile && screenshotMatch && screenshotMatch.length > 1) {
		const imageDir = fullPath(screenshotsDir);

		const packagePath = path.dirname(fullPath(packageFile));

		// Collect screenshots content

		const screenshotFiles: string[] = [];

		let files = fs.readdirSync(imageDir);

		if (files.length > 0) {
			files.forEach(function (file) {
				const imageDirRel = path.relative(packagePath, path.join(imageDir, file));
				screenshotFiles.push(imageDirRel);
			});
		}

		// parse screenshot list into array
		const globalMatch = screenshotMatch[1].match(new RegExp('^[0-9]+\\. (.*)', 'gim'));

		const matchArray: string[] = [];
		let nonGlobalMatch, i;
		if (globalMatch != null && globalMatch.length > 0) {
			globalMatch.forEach((matchItem) => {
				nonGlobalMatch = matchItem.match(new RegExp('^[0-9]+\\. (.*)', 'im'));

				if (nonGlobalMatch != null && nonGlobalMatch.length > 0) {
					matchArray.push(nonGlobalMatch[1]);
				}
			});
			const screenshots = arraysToObject(screenshotFiles, matchArray);

			if (matchArray.length > 0) {
				Object.entries(screenshots).forEach(([screenshot, match]) => {
					readme = readme.replace(match, '![' + match + '](' + screenshot + ')\n');
				});
			}
		}
	}

	return readme;
}
export function convertToMd(file: string, packageFile: string, screenshotsDir: string) {
	var fileDir = path.dirname(fullPath(file));

	const md = path.join(fileDir, 'README.md');

	let readme = fileContents(file);

	// Convert Headings.

	readme = readme.replace(new RegExp('^=([^=]+)=*?[\\s ]*?$', 'gim'), '###$1###');
	readme = readme.replace(new RegExp('^==([^=]+)==*?[\\s ]*?$', 'mig'), '##$1##');
	readme = readme.replace(new RegExp('^===([^=]+)===*?[\\s ]*?$', 'gim'), '#$1#');

	const headerMatch = readme.match(new RegExp(/([^##]*)(?:\n##|$)/, 'm'));
	if (headerMatch && headerMatch.length >= 1) {
		const headerSearch = headerMatch[1];
		const headerReplace = headerSearch.replace(new RegExp('^([^:\r\n*]{1}[^:\r\n#\\]\\[]+): (.+)', 'gim'), '**$1:** $2  '); // eslint-disable-line
		readme = readme.replace(headerSearch, headerReplace);
	}

	readme = contributors(readme);
	readme = screenshots(readme, packageFile, screenshotsDir);
	readme = readme.replace(new RegExp('^`$[\n\r]+([^`]*)[\n\r]+^`$', 'gm'), (codeblock, codeblockContents) => {
		const lines = codeblockContents.split('\n');
		// Add newline and indent all lines in the codeblock by one tab.
		return '\n\t' + lines.join('\n\t') + '\n'; // trailing newline is unnecessary but adds some symmetry.
	});

	fs.writeFileSync(md, readme);

	log(`Generated the file ${chalk.cyan(path.relative(process.cwd(), md))}`, 'success');
}
