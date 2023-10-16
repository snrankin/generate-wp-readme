import parseChangelog from 'changelog-parser';
import { isEmpty, fileContents, log } from './utils';
import fs from 'fs-extra';
import conventionalChangelog from 'conventional-changelog';
import chalk from 'chalk';
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

export async function formatChangelog(changelog: string, total: number = 5) {
	let fileText = fileContents(changelog);
	const lines: string[] = [];

	if (!isEmpty(fileText)) {
		let entries = await parseChangelog({
			text: fileText,
			removeMarkdown: true,
		});
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
	}

	return lines.join('\n');
}

export function writeChangelog(changelog: string, preset: string) {
	fs.ensureFileSync(changelog);
	const writer = fs.createWriteStream(changelog);
	const logStream = conventionalChangelog({
		preset,
	});

	logStream.pipe(writer);

	writer.on('finish', () => {
		log(`Generated the file ${chalk.cyan(changelog)}`, 'success');
	});
}
