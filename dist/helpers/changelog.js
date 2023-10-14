"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatChangelog = void 0;
const changelog_parser_1 = __importDefault(require("changelog-parser"));
const utils_1 = require("./utils");
const fs_extra_1 = __importDefault(require("fs-extra"));
function formatBody(entry) {
    var length = Object.keys(entry).length;
    var lines = [];
    if (length == 1) {
        entry._.forEach((line) => {
            line = `* ${line}`;
            lines.push(line);
        });
    }
    else {
        for (const key in entry) {
            var groupLines = entry[key];
            if (key !== '_' && groupLines.length > 0) {
                lines.push('');
                lines.push(`**${key}**`);
                groupLines.forEach((line) => {
                    line = `* ${line}`;
                    lines.push(line);
                });
            }
        }
    }
    return lines;
}
function formatChangelog(inFile, outFile, readme, total = 5) {
    let fileText = (0, utils_1.fileContents)(inFile);
    if (!(0, utils_1.isEmpty)(fileText)) {
        (0, changelog_parser_1.default)({
            text: fileText,
            removeMarkdown: true,
        }).then((entries) => {
            const lines = [];
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
            fs_extra_1.default.writeFileSync(outFile, readme);
        });
    }
    else {
        readme = readme.replace('{{__CHANGELOG_ENTRIES__}}', '');
        fs_extra_1.default.writeFileSync(outFile, readme);
        (0, utils_1.log)('Empty changelog!', 'warning');
    }
}
exports.formatChangelog = formatChangelog;
//# sourceMappingURL=changelog.js.map