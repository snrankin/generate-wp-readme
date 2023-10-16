"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePluginMetadata = void 0;
const utils_1 = require("./utils");
function getWPProfile(obj) {
    let wpProfile = new RegExp('(?<=https:\\/\\/profiles.wordpress.org\\/)[^\\/\\s]+', 'gm');
    let profile = '';
    if (typeof obj === 'object') {
        obj = (0, utils_1.get)(obj, 'url', false);
    }
    if (typeof obj === 'string') {
        let authorMatch = obj.match(wpProfile);
        if (authorMatch && authorMatch.length >= 1) {
            profile = authorMatch[0];
        }
    }
    return profile;
}
function getWPDonate(packageFile = 'package.json') {
    let funding = (0, utils_1.getPackageField)('funding', false, packageFile);
    let donate = '';
    if (typeof funding === 'object') {
        funding = (0, utils_1.get)(funding, 'url', false);
        if (!funding) {
            funding = (0, utils_1.get)(funding, '0', false);
            if (typeof funding === 'object') {
                funding = (0, utils_1.get)(funding, 'url', false);
            }
        }
    }
    if (typeof funding === 'string') {
        donate = funding;
    }
    return donate;
}
function getPluginContributors(packageFile = 'package.json') {
    let author = getWPProfile((0, utils_1.getPackageField)('author', '', packageFile));
    let contributors = (0, utils_1.getPackageField)('contributors', [], packageFile);
    let wpContributors = [];
    if (!(0, utils_1.isEmpty)(author)) {
        wpContributors.push(author);
    }
    if (contributors.length > 0) {
        contributors.forEach((obj) => {
            let contributor = getWPProfile(obj);
            wpContributors.push(contributor);
        });
    }
    return wpContributors.join(', ');
}
function getPluginHomepage(packageFile = 'package.json') {
    var pluginHomepage = (0, utils_1.getPackageField)('homepage', '', packageFile);
    pluginHomepage = pluginHomepage.replace('#readme', '');
    return pluginHomepage;
}
/**
 * Parses WordPress project metadata from a file header comment.
 *
 * @since [version]
 *
 * @return {Object} A key/value object containing the metadata found within the file.
 */
function parsePluginMetadata(file, changelog, packageFile = 'package.json') {
    let matches, metas = {
        PLUGIN_NAME: '',
        PLUGIN_SLUG: (0, utils_1.getProjectSlug)(),
        PLUGIN_URI: (0, utils_1.getPackageField)('homepage', '', packageFile),
        PLUGIN_LICENSE: '',
        PLUGIN_LICENSE_URI: '',
        PLUGIN_AUTHOR: '',
        PLUGIN_AUTHOR_URI: '',
        PLUGIN_MIN_WP: '',
        PLUGIN_TESTED_WP: '',
        PLUGIN_MIN_PHP: '',
        PLUGIN_DESCRIPTION: '',
        PLUGIN_VERSION: (0, utils_1.getPackageField)('version', '', packageFile),
        PLUGIN_CHANGELOG_URI: new URL(changelog, getPluginHomepage(packageFile)).toString(),
        PLUGIN_CHANGELOG: '',
        PLUGIN_DONATE: getWPDonate(packageFile),
        PLUGIN_CONTRIBUTORS: getPluginContributors(packageFile),
        PLUGIN_TAGS: (0, utils_1.getPackageField)('keywords', [], packageFile).join(', '),
    };
    if (!(0, utils_1.isEmpty)(file)) {
        const contents = (0, utils_1.fileContents)(file), regex = new RegExp(/ \* (?<key>[A-Z][A-Za-z ]+)\: (?<val>.*)\n/g, 'g');
        while ((matches = regex.exec(contents))) {
            var key = (0, utils_1.get)(matches, 'groups.key', '').trim();
            var val = (0, utils_1.get)(matches, 'groups.val', '').trim();
            if (!(0, utils_1.isEmpty)(key) && !(0, utils_1.isEmpty)(val)) {
                switch (key) {
                    case 'Plugin Name':
                        metas.PLUGIN_NAME = val;
                        break;
                    case 'Plugin URI':
                        metas.PLUGIN_URI = val;
                        break;
                    case 'Description':
                        metas.PLUGIN_DESCRIPTION = val;
                        break;
                    case 'Author':
                        metas.PLUGIN_AUTHOR = val;
                        break;
                    case 'Author URI':
                        metas.PLUGIN_AUTHOR_URI = val;
                        break;
                    case 'License':
                        metas.PLUGIN_LICENSE = val;
                        break;
                    case 'License URI':
                        metas.PLUGIN_LICENSE_URI = val;
                        break;
                    case 'Tested up to':
                        metas.PLUGIN_TESTED_WP = val;
                        break;
                    case 'Requires at least':
                        metas.PLUGIN_MIN_WP = val;
                        break;
                    case 'Requires PHP':
                        metas.PLUGIN_MIN_PHP = val;
                        break;
                }
            }
        }
    }
    return metas;
}
exports.parsePluginMetadata = parsePluginMetadata;
//# sourceMappingURL=meta.js.map