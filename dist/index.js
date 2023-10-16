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
const changelog_1 = require("./helpers/changelog");
const meta_1 = require("./helpers/meta");
const readme_1 = require("./helpers/readme");
const txt_to_md_1 = require("./helpers/txt-to-md");
const figlet_1 = __importDefault(require("figlet"));
const chalk_1 = __importDefault(require("chalk"));
const node_process_1 = require("node:process");
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
        [chalk_1.default.magenta('{{__PLUGIN_TESTED_WP_VERSION__}}'), 'The latest WordPress core version the plugin has been tested against.', 'Tested up to:', '--main-file'],
        [chalk_1.default.magenta('{{__READ_MORE_LINK__}}'), 'A link to the full project changelog.', 'changelog:', 'package.json'],
        [chalk_1.default.magenta('{{__CHANGELOG_ENTRIES__}}'), 'The most recent changelog entries.', '', '--changelog'],
    ];
    const config = {
        border: (0, table_1.getBorderCharacters)('norc'),
        columns: {
            1: { width: 30 },
        },
    };
    return `\nMerge codes:\n\n  The following merge codes can be used in any of the readme part markdown files.\n\n${(0, table_1.table)(data, config)}`;
}
// Setup the CLI program.
program
    .name('generate-wp-readme')
    .description(`${(0, utils_1.getPackageField)('description', '', utils_1.PKG)}`)
    .version((0, utils_1.getPackageField)('version', '', utils_1.PKG))
    .option('-o, --output-file <filename>', 'Specify the output readme file name.', 'readme.txt')
    .option('-c, --changelog-file <filename>', 'Specify the input changelog file name.', 'CHANGELOG.md')
    .option('-m, --main-file <filename>', 'Specify the main plugin php file name where metadata is stored.')
    .option('-t, --template-file <filename>', 'Specify the template readme file name.', '.readme-template')
    .option('-p, --package-file <filename>', 'Specify the package.json relative path.', 'package.json')
    .option('-s, --screenshots <directory>', 'Specify the directory where the screenshots are stored', 'assets')
    .option('-l, --changelog-length <number>', 'Specify the number of versions to display before truncating the changelog.', '5')
    .option('-d, --debug', 'Debug your setup');
program.addOption(new commander_1.Option('-p, --preset <preset>', 'Specify a conventional commits preset.').choices(['angular', 'atom', 'codemirror', 'conventionalcommits', 'ember', 'eslint', 'express', 'jquery', 'jshint']).default('conventionalcommits'));
function run() {
    let { outputFile, changelogFile, mainFile, templateFile, packageFile, changelogLength } = program.opts();
    (0, utils_1.log)(program.opts(), 'info');
    if ((0, utils_1.isEmpty)(mainFile)) {
        mainFile = `${(0, utils_1.getProjectSlug)()}.php`;
    }
    let templateFilePath = (0, utils_1.fullPath)(templateFile), mainFilePath = (0, utils_1.fullPath)(mainFile), changelogFilePath = (0, utils_1.fullPath)(changelogFile);
    if (!fs_extra_1.default.pathExistsSync(templateFilePath)) {
        program.error(`${chalk_1.default.cyan(templateFile)} file is missing!`, { exitCode: 9 });
    }
    if (!fs_extra_1.default.pathExistsSync(mainFilePath)) {
        program.error(`${chalk_1.default.cyan(mainFile)} file is missing!`, { exitCode: 9 });
    }
    if (!fs_extra_1.default.pathExistsSync(changelogFilePath)) {
        program.error(`${chalk_1.default.cyan(changelogFile)} file is missing!`, { exitCode: 9 });
    }
    if (fs_extra_1.default.pathExistsSync(templateFilePath) && fs_extra_1.default.pathExistsSync(mainFilePath) && fs_extra_1.default.pathExistsSync(changelogFilePath)) {
        const meta = (0, meta_1.parsePluginMetadata)(mainFile, changelogFile);
        (0, readme_1.readmeText)(templateFile, mainFile, packageFile, changelogFile, changelogLength).then((res) => {
            fs_extra_1.default.writeFile(outputFile, res, (err) => {
                if (err) {
                    program.error(err, { code: err.name });
                }
                (0, utils_1.log)(`Generated the file ${chalk_1.default.cyan(outputFile)}`, 'success');
            });
        });
    }
}
program
    .hook('preAction', (thisCommand, actionCommand) => {
    // Create the conventional commit changelog
    let { changelogFile, preset, debug } = actionCommand.opts();
    node_process_1.env.debug = debug;
    (0, changelog_1.writeChangelog)(changelogFile, preset);
})
    .action(run)
    .hook('postAction', (thisCommand, actionCommand) => {
    let { outputFile, screenshots, packageFile } = actionCommand.opts();
    (0, txt_to_md_1.convertToMd)(outputFile, packageFile, screenshots);
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
//# sourceMappingURL=index.js.map