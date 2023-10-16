"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readmeText = void 0;
const utils_1 = require("./utils");
const meta_1 = require("./meta");
const changelog_1 = require("./changelog");
const node_process_1 = require("node:process");
async function readmeText(templateFile, mainFile, packageFile, changelog, changelogLength) {
    const meta = (0, meta_1.parsePluginMetadata)(mainFile, changelog, packageFile);
    meta.PLUGIN_CHANGELOG = await (0, changelog_1.formatChangelog)(changelog, changelogLength);
    if (node_process_1.env.debug) {
        (0, utils_1.log)(meta, 'info');
    }
    let readme = (0, utils_1.fileContents)(templateFile);
    // Replace variables.
    Object.entries(meta).forEach(([key, val]) => {
        readme = readme.replace(new RegExp(`{{__${key}__}}`, 'g'), val);
    });
    return readme;
}
exports.readmeText = readmeText;
//# sourceMappingURL=readme.js.map