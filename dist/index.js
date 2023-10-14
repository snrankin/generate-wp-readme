#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gradient_string_1 = __importDefault(require("gradient-string"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const table_1 = require("table");
const commander_1 = require("commander");
const utils_1 = require("./helpers/utils");
const conventional_changelog_1 = __importDefault(require("conventional-changelog"));
const changelog_1 = require("./helpers/changelog");
const txt_to_md_1 = require("./helpers/txt-to-md");
const figlet_1 = __importDefault(require("figlet"));
const chalk_1 = __importDefault(require("chalk"));
// const figlet = require('figlet');
const program = new commander_1.Command();
/**
 * Generates the merge code help text.
 *
 * @since [version]
 *
 * @returns string
 */
function getMergeCodeHelp() {
    const data = [
        [chalk_1.default.bold('Merge Code'), chalk_1.default.bold('Description'), chalk_1.default.bold('Field'), chalk_1.default.bold('Source')],
        [chalk_1.default.magenta('{{__PLUGIN_NAME__}}'), 'The name of the plugin', 'Plugin Name:', '--main-file'],
        [chalk_1.default.magenta('{{__PLUGIN_URI__}}'), 'The plugin homepage', 'Plugin URI:', '--main-file'],
        [chalk_1.default.magenta('{{__PLUGIN_DESCRIPTION__}}'), 'Plugin Description', 'Description:', '--main-file'],
        [chalk_1.default.magenta('{{__PLUGIN_VERSION__}}'), 'The current project version.', 'version:', 'package.json'],
        [chalk_1.default.magenta('{{__PLUGIN_LICENSE__}}'), "The project's license.", 'License:', '--main-file'],
        [chalk_1.default.magenta('{{__PLUGIN_LICENSE_URI__}}'), "The URI to the project's license.", 'License URI:', '--main-file'],
        [chalk_1.default.magenta('{{__PLUGIN_MIN_WP_VERSION__}}'), 'The minimum required WordPress core version.', 'Requires at least:', '--main-file'],
        [chalk_1.default.magenta('{{__PLUGIN_MIN_PHP_VERSION__}}'), 'The minimum required PHP version.', 'Requires PHP:', '--main-file'],
        [chalk_1.default.magenta('{{__PLUGIN_TESTED_WP_VERSION__}}'), 'The latest WordPress core version the project has been tested against.', 'Tested up to:', '--main-file'],
        [chalk_1.default.magenta('{{__READ_MORE_LINK__}}'), 'A link to the full project changelog.', 'changelog:', 'package.json'],
        [chalk_1.default.magenta('{{__CHANGELOG_ENTRIES__}}'), 'The most recent changelog entries.', '', '--changelog'],
    ];
    const config = {
        border: (0, table_1.getBorderCharacters)('norc'),
    };
    return `\nMerge codes:\n\n  The following merge codes can be used in any of the readme part markdown files.\n\n${(0, table_1.table)(data, config)}`;
}
// Setup the CLI program.
program
    .name('generate-wp-readme')
    .description(`${(0, utils_1.getPackageField)('description', '', utils_1.PKG)}`)
    .version((0, utils_1.getPackageField)('version', '', utils_1.PKG))
    .option('-o, --output-file <filename>', 'Specify the output readme file name.', 'readme.txt')
    .option('-c, --changelog <filename>', 'Specify the input changelog file name.', 'CHANGELOG.md')
    .option('-m, --main-file <filename>', 'Specify the main plugin php file name where metadata is stored.')
    .option('-t, --template-file <filename>', 'Specify the template readme file name.', '.readme-template')
    .option('-s, --screenshots <directory>', 'Specify the directory where the screenshots are stored', 'docs/screenshots')
    .option('-l, --changelog-length <number>', 'Specify the number of versions to display before truncating the changelog.', '5')
    .option('-d, --debug', 'Debug your setup');
program.addOption(new commander_1.Option('-p, --preset <preset>', 'Specify a conventional commits preset.').choices(['angular', 'atom', 'codemirror', 'conventionalcommits', 'ember', 'eslint', 'express', 'jquery', 'jshint']).default('conventionalcommits'));
program
    .hook('preAction', (thisCommand, actionCommand) => {
    // Create the conventional commit changelog
    let { changelog, preset, templateFile } = actionCommand.opts();
    fs_extra_1.default.ensureFileSync(changelog);
    const writer = fs_extra_1.default.createWriteStream(changelog);
    const logStream = (0, conventional_changelog_1.default)({
        preset,
    });
    logStream.on('error', (err) => {
        program.error(err.message, { code: err.name });
    });
    logStream.pipe(writer);
    writer.on('finish', () => {
        (0, utils_1.log)(`Generated the file ${chalk_1.default.cyan(changelog)}`, 'success');
    });
})
    .action(function ({ outputFile, changelog, mainFile, templateFile, changelogLength }) {
    if ((0, utils_1.isEmpty)(mainFile)) {
        let mainfilename = `${(0, utils_1.getProjectSlug)()}.php`;
        mainFile = (0, utils_1.fullPath)(mainfilename);
    }
    let templateFileFull = (0, utils_1.fullPath)(templateFile);
    if (!fs_extra_1.default.pathExistsSync((0, utils_1.fullPath)(templateFileFull))) {
        program.error('Template file is missing!', { exitCode: 9 });
    }
    if (!fs_extra_1.default.pathExistsSync((0, utils_1.fullPath)(templateFile))) {
        program.error('Template file is missing!', { exitCode: 9 });
    }
    const meta = (0, utils_1.parsePluginMetadata)(mainFile);
    var readMoreLink = new URL(changelog, (0, utils_1.getPackageField)('homepage', ''));
    const replacements = {
        PLUGIN_NAME: (0, utils_1.get)(meta, 'Plugin Name', ''),
        PLUGIN_SLUG: (0, utils_1.getProjectSlug)(),
        PLUGIN_URI: (0, utils_1.get)(meta, 'Plugin URI', ''),
        PLUGIN_LICENSE: (0, utils_1.get)(meta, 'License', ''),
        PLUGIN_LICENSE_URI: (0, utils_1.get)(meta, 'License URI', ''),
        PLUGIN_MIN_WP_VERSION: (0, utils_1.get)(meta, 'Requires at least', ''),
        PLUGIN_TESTED_WP_VERSION: (0, utils_1.get)(meta, 'Tested up to', ''),
        PLUGIN_MIN_PHP_VERSION: (0, utils_1.get)(meta, 'Requires PHP', ''),
        PLUGIN_DESCRIPTION: (0, utils_1.get)(meta, 'Description', ''),
        PLUGIN_VERSION: (0, utils_1.getPackageField)('version'),
        READ_MORE_LINK: readMoreLink.toString(),
    };
    let readme = (0, utils_1.fileContents)(templateFile);
    // Replace variables.
    Object.entries(replacements).forEach(([key, val]) => {
        readme = readme.replace(new RegExp(`{{__${key}__}}`, 'g'), val);
    });
    (0, changelog_1.formatChangelog)(changelog, outputFile, readme, changelogLength);
    //convertToMd(outputFile, `./${screenshots}`, screenshots);
    (0, utils_1.log)(`Generated the file ${chalk_1.default.cyan(outputFile)}`, 'success');
})
    .hook('postAction', (thisCommand, actionCommand) => {
    let { outputFile, inputFile, mainFile, templateFile, screenshots, changelogLength, preset } = actionCommand.opts();
    (0, txt_to_md_1.convertToMd)(outputFile, `./${screenshots}`, screenshots);
});
program.addHelpText('after', getMergeCodeHelp());
program.addHelpText('beforeAll', gradient_string_1.default.rainbow(figlet_1.default.textSync('Generate WP ReadMe')));
program.configureOutput({
    writeErr: (str) => {
        str = str.replace('error: ', '');
        process.stdout.write((0, utils_1.logColor)(str, 'error'));
    },
});
program.parse();
const options = program.opts();
if (options.debug)
    (0, utils_1.log)(options);
//# sourceMappingURL=index.js.map