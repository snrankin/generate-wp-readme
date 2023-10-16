#!/usr/bin/env node

import gradient from 'gradient-string';
import fs from 'fs-extra';
import { table, getBorderCharacters } from 'table';
import { Command, Option } from 'commander';
import { PKG, getPackageField, getProjectSlug, log, logColor, fullPath, isEmpty } from './helpers/utils';
import { writeChangelog } from './helpers/changelog';
import { parsePluginMetadata } from './helpers/meta';
import { readmeText } from './helpers/readme';
import { convertToMd } from './helpers/txt-to-md';
import figlet from 'figlet';
import chalk from 'chalk';
import { env } from 'node:process';
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
		[chalk.magenta('{{__PLUGIN_SLUG__}}'), 'Taken from the current working folder', '', 'process.cwd()'],
		[chalk.magenta('{{__PLUGIN_URI__}}'), 'The plugin homepage', 'Plugin URI:', '--main-file'],
		[chalk.magenta('{{__PLUGIN_DESCRIPTION__}}'), 'Plugin Description', 'Description:', '--main-file'],
		[chalk.magenta('{{__PLUGIN_VERSION__}}'), 'The current project version.', 'version:', '--package-file'],
		[chalk.magenta('{{__PLUGIN_LICENSE__}}'), "The project's license.", 'License:', '--main-file'],
		[chalk.magenta('{{__PLUGIN_LICENSE_URI__}}'), "The URI to the project's license.", 'License URI:', '--main-file'],
		[chalk.magenta('{{__PLUGIN_MIN_WP__}}'), 'The minimum required WordPress core version.', 'Requires at least:', '--main-file'],
		[chalk.magenta('{{__PLUGIN_MIN_PHP__}}'), 'The minimum required PHP version.', 'Requires PHP:', '--main-file'],
		[chalk.magenta('{{__PLUGIN_TESTED_WP__}}'), 'The latest WordPress core version the plugin has been tested against.', 'Tested up to:', '--main-file'],
		[chalk.magenta('{{__PLUGIN_DONATE__}}'), 'The plugin donation link.', 'funding:', '--package-file'],
		[chalk.magenta('{{__PLUGIN_CONTRIBUTORS__}}'), 'The plugin contributors (including author)', 'author:, contributors:', '--package-file'],
		[chalk.magenta('{{__PLUGIN_TAGS__}}'), 'The plugin tags', 'keywords:', '--package-file'],
		[chalk.magenta('{{__PLUGIN_CHANGELOG_URI__}}'), 'A link to the full project changelog.', '', '--changelog-file'],
		[chalk.magenta('{{__PLUGIN_CHANGELOG__}}'), 'The most recent changelog entries.', '', '--changelog-file'],
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
	.option('-c, --changelog-file <filename>', 'Specify the input changelog file name.', 'CHANGELOG.md')
	.option('-m, --main-file <filename>', 'Specify the main plugin php file name where metadata is stored.')
	.option('-t, --template-file <filename>', 'Specify the template readme file name.', '.readme-template')
	.option('-p, --package-file <filename>', 'Specify the package.json relative path.', 'package.json')
	.option('-s, --screenshots <directory>', 'Specify the directory where the screenshots are stored', 'assets')
	.option('-l, --changelog-length <number>', 'Specify the number of versions to display before truncating the changelog.', '5')
	.option('-d, --debug', 'Debug your setup');

program.addOption(new Option('-p, --preset <preset>', 'Specify a conventional commits preset.').choices(['angular', 'atom', 'codemirror', 'conventionalcommits', 'ember', 'eslint', 'express', 'jquery', 'jshint']).default('conventionalcommits'));

function run() {
	let { outputFile, changelogFile, mainFile, templateFile, packageFile, changelogLength } = program.opts();
	log(program.opts(), 'info');
	if (isEmpty(mainFile)) {
		mainFile = `${getProjectSlug()}.php`;
	}
	let templateFilePath = fullPath(templateFile),
		mainFilePath = fullPath(mainFile),
		changelogFilePath = fullPath(changelogFile);

	if (!fs.pathExistsSync(templateFilePath)) {
		program.error(`${chalk.cyan(templateFile)} file is missing!`, { exitCode: 9 });
	}

	if (!fs.pathExistsSync(mainFilePath)) {
		program.error(`${chalk.cyan(mainFile)} file is missing!`, { exitCode: 9 });
	}

	if (!fs.pathExistsSync(changelogFilePath)) {
		program.error(`${chalk.cyan(changelogFile)} file is missing!`, { exitCode: 9 });
	}

	if (fs.pathExistsSync(templateFilePath) && fs.pathExistsSync(mainFilePath) && fs.pathExistsSync(changelogFilePath)) {
		const meta = parsePluginMetadata(mainFile, changelogFile);

		readmeText(templateFile, mainFile, packageFile, changelogFile, changelogLength).then((res) => {
			fs.writeFile(outputFile, res, (err: any) => {
				if (err) {
					program.error(err, { code: err.name });
				}
				log(`Generated the file ${chalk.cyan(outputFile)}`, 'success');
			});
		});
	}
}
program
	.hook('preAction', (thisCommand, actionCommand) => {
		// Create the conventional commit changelog
		let { changelogFile, preset, debug } = actionCommand.opts();
		env.debug = debug;

		writeChangelog(changelogFile, preset);
	})
	.action(run)
	.hook('postAction', (thisCommand, actionCommand) => {
		let { outputFile, screenshots, packageFile } = actionCommand.opts();
		convertToMd(outputFile, packageFile, screenshots);
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
