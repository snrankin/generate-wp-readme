"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeChangelog = exports.formatChangelog = void 0;
const changelog_parser_1 = __importDefault(require("changelog-parser"));
const utils_1 = require("./utils");
const fs_extra_1 = __importDefault(require("fs-extra"));
const conventional_changelog_1 = __importDefault(require("conventional-changelog"));
const chalk_1 = __importDefault(require("chalk"));
const node_process_1 = require("node:process");
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
async function formatChangelog(changelog, total = 5) {
    let fileText = (0, utils_1.fileContents)(changelog);
    const lines = [];
    if (!(0, utils_1.isEmpty)(fileText)) {
        let entries = await (0, changelog_parser_1.default)({
            text: fileText,
            removeMarkdown: true,
        });
        let i = 0;
        let added = 0;
        var versions = entries.versions.slice(0, total);
        versions.reverse().forEach((tag) => {
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
exports.formatChangelog = formatChangelog;
function writeChangelog(changelog, preset) {
    fs_extra_1.default.ensureFileSync(changelog);
    const writer = fs_extra_1.default.createWriteStream(changelog);
    var config = {
        append: true,
        releaseCount: 0,
    };
    if (node_process_1.env.debug) {
        config.debug = (str) => {
            (0, utils_1.log)(str, 'info');
        };
    }
    const logStream = (0, conventional_changelog_1.default)(config);
    logStream.pipe(writer);
    writer.on('finish', () => {
        (0, utils_1.log)(`Generated the file ${chalk_1.default.cyan(changelog)}`, 'success');
    });
}
exports.writeChangelog = writeChangelog;
//# sourceMappingURL=changelog.js.map