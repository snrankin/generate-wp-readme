"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToMd = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const utils_1 = require("./utils");
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
function contributors(readme) {
    // Include w.org profiles for contributors.
    const contributorsMatch = readme.match(new RegExp('(\\*\\*Contributors:\\*\\* )(.+)', 'm'));
    if (contributorsMatch && contributorsMatch.length >= 1) {
        const contributorsSearch = contributorsMatch[0];
        let contributorsReplace = contributorsMatch[1];
        const profiles = [];
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
function screenshots(readme, packageFile, screenshotsDir) {
    // process screenshots, if any
    const screenshotMatch = readme.match(new RegExp('## Screenshots ##([^#]*)', 'im'));
    if (packageFile && screenshotMatch && screenshotMatch.length > 1) {
        const imageDir = (0, utils_1.fullPath)(screenshotsDir);
        const packagePath = path_1.default.dirname((0, utils_1.fullPath)(packageFile));
        // Collect screenshots content
        const screenshotFiles = [];
        let files = fs_extra_1.default.readdirSync(imageDir);
        if (files.length > 0) {
            files.forEach(function (file) {
                const imageDirRel = path_1.default.relative(packagePath, path_1.default.join(imageDir, file));
                screenshotFiles.push(imageDirRel);
            });
        }
        // parse screenshot list into array
        const globalMatch = screenshotMatch[1].match(new RegExp('^[0-9]+\\. (.*)', 'gim'));
        const matchArray = [];
        let nonGlobalMatch, i;
        if (globalMatch != null && globalMatch.length > 0) {
            globalMatch.forEach((matchItem) => {
                nonGlobalMatch = matchItem.match(new RegExp('^[0-9]+\\. (.*)', 'im'));
                if (nonGlobalMatch != null && nonGlobalMatch.length > 0) {
                    matchArray.push(nonGlobalMatch[1]);
                }
            });
            const screenshots = (0, utils_1.arraysToObject)(screenshotFiles, matchArray);
            if (matchArray.length > 0) {
                Object.entries(screenshots).forEach(([screenshot, match]) => {
                    readme = readme.replace(match, '![' + match + '](' + screenshot + ')\n');
                });
            }
        }
    }
    return readme;
}
function convertToMd(file, packageFile, screenshotsDir) {
    var fileDir = path_1.default.dirname((0, utils_1.fullPath)(file));
    const md = path_1.default.join(fileDir, 'README.md');
    let readme = (0, utils_1.fileContents)(file);
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
    fs_extra_1.default.writeFileSync(md, readme);
    (0, utils_1.log)(`Generated the file ${chalk_1.default.cyan(path_1.default.relative(process.cwd(), md))}`, 'success');
}
exports.convertToMd = convertToMd;
//# sourceMappingURL=txt-to-md.js.map