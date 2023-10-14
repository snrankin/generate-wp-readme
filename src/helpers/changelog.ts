import parseChangelog from 'changelog-parser';
import { isEmpty, fileContents, log } from './utils';
import fs from 'fs-extra';
function formatBody(entry: Record<string, string[]>): string[] {
	var length = Object.keys(entry).length;
	var lines: string[] = [];
	if (length == 1) {
		entry._.forEach((line: string) => {
			line = `* ${line}`;
			lines.push(line);
		});
	} else {
		for (const key in entry) {
			var groupLines = entry[key];
			if (key !== '_' && groupLines.length > 0) {
				lines.push('');
				lines.push(`**${key}**`);
				groupLines.forEach((line: string) => {
					line = `* ${line}`;
					lines.push(line);
				});
			}
		}
	}
	return lines;
}

export function formatChangelog(inFile: string, outFile: string, readme: string, total: number = 5) {
	let fileText = fileContents(inFile);
	if (!isEmpty(fileText)) {
		parseChangelog({
			text: fileText,
			removeMarkdown: true,
		}).then((entries: parseChangelog.Changelog) => {
			const lines: string[] = [];

			let i = 0;
			let added = 0;

			var versions = entries.versions.slice(0, total);

			versions.forEach((tag) => {
				var title = `= v${tag.version} - ${tag.date} =`;
				if (i > 0) {
					lines.push('');
					lines.push('');
				}
				lines.push(title);
				var tagBody = formatBody(tag.parsed);
				lines.push(...tagBody);

				i++;
			});

			var text = lines.join('\n');

			readme = readme.replace('{{__CHANGELOG_ENTRIES__}}', text);

			fs.writeFileSync(outFile, readme);
		});
	} else {
		readme = readme.replace('{{__CHANGELOG_ENTRIES__}}', '');

		fs.writeFileSync(outFile, readme);
		log('Empty changelog!', 'warning');
	}
}
