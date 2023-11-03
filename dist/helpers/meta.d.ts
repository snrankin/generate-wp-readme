export interface FileReplacements {
    PLUGIN_NAME: string;
    PLUGIN_SLUG: string;
    PLUGIN_URI: string;
    PLUGIN_AUTHOR: string;
    PLUGIN_AUTHOR_URI: string;
    PLUGIN_LICENSE: string;
    PLUGIN_LICENSE_URI: string;
    PLUGIN_MIN_WP: string;
    PLUGIN_TESTED_WP: string;
    PLUGIN_MIN_PHP: string;
    PLUGIN_DESCRIPTION: string;
    PLUGIN_VERSION: string;
    PLUGIN_CHANGELOG_URI: string;
    PLUGIN_CHANGELOG: string;
    PLUGIN_DONATE: string;
    PLUGIN_CONTRIBUTORS: string;
    PLUGIN_TAGS: string;
}
/**
 * Parses WordPress project metadata from a file header comment.
 *
 * @since [version]
 *
 * @return {Object} A key/value object containing the metadata found within the file.
 */
export declare function parsePluginMetadata(file: string, changelog: string, packageFile?: string): FileReplacements;
//# sourceMappingURL=meta.d.ts.map