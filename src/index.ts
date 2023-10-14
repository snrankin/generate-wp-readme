#!/usr/bin/env node

import gradient from 'gradient-string';
import fs from 'fs-extra';
import { table, getBorderCharacters } from 'table';
import { Command, Argument, Option } from 'commander';
import { PKG, getPackageField, getProjectSlug, parsePluginMetadata, get, fileContents, StringDictionary, log, logColor, fullPath, isEmpty } from './helpers/utils';

import conventionalChangelog from 'conventional-changelog';
import { formatChangelog } from './helpers/changelog';
import { convertToMd } from './helpers/txt-to-md';
import figlet from 'figlet';
import chalk from 'chalk';
import { on } from 'events';

// const figlet = require('figlet');

const program = new Command();
/**
 * Generates the merge code help text.
 *
 * @since [version]
 *
 * @returns string
 */
function getMergeCodeHelp() {
	const data = [
		[chalk.bold('Merge Code'), chalk.bold('Description'), chalk.bold('Field'), chalk.bold('Source')],
		[chalk.magenta('{{__PLUGIN_NAME__}}'), 'The name of the plugin', 'Plugin Name:', '--main-file'],
		[chalk.magenta('{{__PLUGIN_URI__}}'), 'The plugin homepage', 'Plugin URI:', '--main-file'],
		[chalk.magenta('{{__PLUGIN_DESCRIPTION__}}'), 'Plugin Description', 'Description:', '--main-file'],
		[chalk.magenta('{{__PLUGIN_VERSION__}}'), 'The current project version.', 'version:', 'package.json'],
		[chalk.magenta('{{__PLUGIN_LICENSE__}}'), "The project's license.", 'License:', '--main-file'],
		[chalk.magenta('{{__PLUGIN_LICENSE_URI__}}'), "The URI to the project's license.", 'License URI:', '--main-file'],
		[chalk.magenta('{{__PLUGIN_MIN_WP_VERSION__}}'), 'The minimum required WordPress core version.', 'Requires at least:', '--main-file'],
		[chalk.magenta('{{__PLUGIN_MIN_PHP_VERSION__}}'), 'The minimum required PHP version.', 'Requires PHP:', '--main-file'],
		[chalk.magenta('{{__PLUGIN_TESTED_WP_VERSION__}}'), 'The latest WordPress core version the project has been tested against.', 'Tested up to:', '--main-file'],
		[chalk.magenta('{{__READ_MORE_LINK__}}'), 'A link to the full project changelog.', 'changelog:', 'package.json'],
		[chalk.magenta('{{__CHANGELOG_ENTRIES__}}'), 'The most recent changelog entries.', '', '--changelog'],
	];

	const config: import('table').TableUserConfig = {
		border: getBorderCharacters('norc'),
	};

	return `\nMerge codes:\n\n  The following merge codes can be used in any of the readme part markdown files.\n\n${table(data, config)}`;
}
// Setup the CLI program.
program
	.name('generate-wp-readme')
	.description(`${getPackageField<string>('description', '', PKG)}`)
	.version(getPackageField<string>('version', '', PKG))
	.option('-o, --output-file <filename>', 'Specify the output readme file name.', 'readme.txt')
	.option('-c, --changelog <filename>', 'Specify the input changelog file name.', 'CHANGELOG.md')
	.option('-m, --main-file <filename>', 'Specify the main plugin php file name where metadata is stored.')
	.option('-t, --template-file <filename>', 'Specify the template readme file name.', '.readme-template')
	.option('-s, --screenshots <directory>', 'Specify the directory where the screenshots are stored', 'docs/screenshots')
	.option('-l, --changelog-length <number>', 'Specify the number of versions to display before truncating the changelog.', '5')
	.option('-d, --debug', 'Debug your setup');

program.addOption(
	new Option('-p, --preset <preset>', 'Specify a conventional commits preset.').choices(['angular', 'atom', 'codemirror', 'conventionalcommits', 'ember', 'eslint', 'express', 'jquery', 'jshint']).default('conventionalcommits')
);

program
	.hook('preAction', (thisCommand, actionCommand) => {
		// Create the conventional commit changelog
		let { changelog, preset, templateFile } = actionCommand.opts();

		fs.ensureFileSync(changelog);
		const writer = fs.createWriteStream(changelog);
		const logStream = conventionalChangelog({
			preset,
		});
		logStream.on('error', (err) => {
			program.error(err.message, { code: err.name });
		});
		logStream.pipe(writer);

		writer.on('finish', () => {
			log(`Generated the file ${chalk.cyan(changelog)}`, 'success');
		});
	})
	.action(function ({ outputFile, changelog, mainFile, templateFile, changelogLength }) {
		if (isEmpty(mainFile)) {
			let mainfilename = `${getProjectSlug()}.php`;
			mainFile = fullPath(mainfilename);
		}
		let templateFileFull = fullPath(templateFile);
		if (!fs.pathExistsSync(fullPath(templateFileFull))) {
			program.error('Template file is missing!', { exitCode: 9 });
		}

		if (!fs.pathExistsSync(fullPath(templateFile))) {
			program.error('Template file is missing!', { exitCode: 9 });
		}

		const meta = parsePluginMetadata(mainFile);

		var readMoreLink = new URL(changelog, getPackageField<string>('homepage', ''));

		const replacements: StringDictionary = {
			PLUGIN_NAME: get<string>(meta, 'Plugin Name', ''),
			PLUGIN_SLUG: getProjectSlug(),
			PLUGIN_URI: get<string>(meta, 'Plugin URI', ''),
			PLUGIN_LICENSE: get<string>(meta, 'License', ''),
			PLUGIN_LICENSE_URI: get<string>(meta, 'License URI', ''),
			PLUGIN_MIN_WP_VERSION: get<string>(meta, 'Requires at least', ''),
			PLUGIN_TESTED_WP_VERSION: get<string>(meta, 'Tested up to', ''),
			PLUGIN_MIN_PHP_VERSION: get<string>(meta, 'Requires PHP', ''),
			PLUGIN_DESCRIPTION: get<string>(meta, 'Description', ''),
			PLUGIN_VERSION: getPackageField<string>('version'),
			READ_MORE_LINK: readMoreLink.toString(),
		};

		let readme = fileContents(templateFile);
		// Replace variables.
		Object.entries(replacements).forEach(([key, val]) => {
			readme = readme.replace(new RegExp(`{{__${key}__}}`, 'g'), val);
		});

		formatChangelog(changelog, outputFile, readme, changelogLength);
		//convertToMd(outputFile, `./${screenshots}`, screenshots);
		log(`Generated the file ${chalk.cyan(outputFile)}`, 'success');
	})
	.hook('postAction', (thisCommand, actionCommand) => {
		let { outputFile, inputFile, mainFile, templateFile, screenshots, changelogLength, preset } = actionCommand.opts();
		convertToMd(outputFile, `./${screenshots}`, screenshots);
	});
program.addHelpText('after', getMergeCodeHelp());
program.addHelpText('beforeAll', gradient.rainbow(figlet.textSync('Generate WP ReadMe')));

program.configureOutput({
	writeErr: (str) => {
		str = str.replace('error: ', '');
		process.stdout.write(logColor(str, 'error'));
	},
});

program.parse();
const options = program.opts();
if (options.debug) log(options);
