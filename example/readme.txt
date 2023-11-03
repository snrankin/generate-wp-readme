=== Generate WP Readme ===
Contributors: snrankin
Tags: wordpress, readme, template
Donate link: http://example.com/donate
Requires at least: 5.6
Tested up to: 6.2
Requires PHP: 8.0
Stable tag: 1.0.0
License: GPL-2.0+
License URI: http://www.gnu.org/licenses/gpl-2.0.txt

Example plugin description

== Description ==

This is the long description.  No limit, and you can use Markdown (as well as in the following sections).

For backwards compatibility, if this section is missing, the full length of the short description will be used, and Markdown parsed.

A few notes about the sections above:

*   "Contributors" is a comma separated list of wp.org/wp-plugins.org usernames
*   "Tags" is a comma separated list of tags that apply to the plugin
*   "Requires at least" is the lowest version that the plugin will work on
*   "Tested up to" is the highest version that you've *successfully used to test the plugin*. Note that it might work on higher versions... this is just the highest one you've verified.
*   Stable tag should indicate the Subversion "tag" of the latest stable version, or "trunk," if you use `/trunk/` for stable.

Note that the `readme.txt` of the stable tag is the one that is considered the defining one for the plugin, so if the `/trunk/readme.txt` file says that the stable tag is `4.3`, then it is `/tags/4.3/readme.txt` that'll be used for displaying information about the plugin. In this situation, the only thing considered from the trunk `readme.txt` is the stable tag pointer. Thus, if you develop in trunk, you can update the trunk `readme.txt` to reflect changes in your in-development version, without having that information incorrectly disclosed about the current stable version that lacks those changes -- as long as the trunk's `readme.txt` points to the correct stable tag.

If no stable tag is provided, it is assumed that trunk is stable, but you should specify "trunk" if that's where you put the stable version, in order to eliminate any doubt.

== Installation ==

This section describes how to install the plugin and get it working.

e.g.

= Uploading in WordPress Dashboard =

1. Navigate to the 'Add New' in the plugins dashboard
2. Navigate to the 'Upload' area
3. Select `generate-wp-readme.zip` from your computer
4. Click 'Install Now'
5. Activate the plugin in the Plugin dashboard

= Using FTP =

1. Download `generate-wp-readme.zip`
2. Extract the `generate-wp-readme` directory to your computer
3. Upload the `generate-wp-readme` directory to the `/wp-content/plugins/` directory
4. Activate the generate-wp-readme in the Plugin dashboard

== Frequently Asked Questions ==

= A question that someone might have =

An answer to that question.

= What about foo bar? =

Answer to foo bar dilemma.

== Screenshots ==

1. This screen shot description corresponds to screenshot-1.(png|jpg|jpeg|gif). Note that the screenshot is taken from the /assets directory or the directory that contains the stable readme.txt (tags or trunk). Screenshots in the /assets directory take precedence. For example, `/assets/screenshot-1.png` would win over `/tags/4.3/screenshot-1.png` (or jpg, jpeg, gif).
2. This is the second screen shot

== Changelog ==

= v1.1.0 - 2023-10-16 =
* chore(release.yml): add step to set npm access to public to ensure packages can be published correct (7af6b31)
* feat: adding npmignore (ecc09f2)


= v1.0.0 - 2023-10-16 =
* feat: 🎉 initializing project [skip ci] (25baee7)
* feat(changelog.ts): add function to format changelog entries and update readme file (762ed49)
* feat(index.ts): add support for generating a conventional commit changelog (c7c1d5e)
* feat(meta.ts): add helper functions to parse WordPress project metadata from file header comment (183991d)
* feat(readme-template): add template for plugin readme file (33219d6)
* feat(README.md): add README.md file with project information and instructions (dcb15a4)
* feat(readme.ts): add new helper function readmeText to generate readme text based on template file (8463647)
* feat(release.config.js): add release configuration file (95412cd)
* feat(release.yml): add GitHub Actions workflow for releasing the application (ab8766f)
* feat(templates): add commit template files (f47aa1e)
* feat(txt-to-md.ts): add functionality to convert a txt file to markdown format (3f02c88)
* feat(utils.ts): add utility functions for working with files and objects (de1a0f4)
* chore: 🚚 changing 'examples' folder to just 'example' (ed5640a)
* chore: add .env.vault file for cloud-agnostic vaulting of sensitive environment variables (b5e5815)
* chore: add .prettierignore file to exclude certain files from prettier formatting (4183160)
* chore: updating example files (acaa07b)
* chore(.gitignore): add exclusion patterns for .env* and .flaskenv* files, except for .env.project an (205aa3e)
* chore(.gitignore): add specific files and directories to be tracked in the repository (b8686de)
* chore(.prettierignore): add _variables.scss to the list of files to be ignored by Prettier to preven (e8b22d3)
* chore(.prettierrc): update printWidth to 9999 to prevent line wrapping and improve code readability (a082b2c)
* chore(eslint): add .eslintignore and .eslintrc.js files (e729260)
* chore(eslintrc.js): update eslint configuration to use TypeScript parser and recommended rules (9913e9f)
* chore(index.ts): refactor imports and remove unused imports to improve code organization and reduce  (3fb4cec)
* chore(package.json): update "main" field to point to "dist/generate-wp-readme.js" to reflect the cor (2a8ee5f)
* chore(package.json): update author field to include name, url, and email for better identification (b2b5443)
* chore(package.json): update package description to include conventional changelog generation and imp (5473c47)
* chore(package.json): update test script to use correct readme template file path (d5abead)
* chore(release.config.js): update semantic-release configuration (e7977d3)
* chore(templates): remove unused template files (bcfd757)
* chore(tsconfig.json): update module value from "commonjs" to "NodeNext" to align with project's modu (03e1dc0)
* chore(tsconfig.json): update target to "ESNext" and module to "NodeNext" to align with latest ECMASc (e34e2cf)
* test: ⚗️ updating example files (28cfd5a)
* build: 🚧 updating dist files (d09ae3f)
* refactor(changelog.ts): change formatChangelog function to be asynchronous and accept changelog stri (bffccde)
* refactor(index.ts): improve readability and maintainability of the getMergeCodeHelp function (c7320c8)
* fix(release.config.js): change single quotes to double quotes for consistency (cf8d3fe)
* fix(txt-to-md.ts): remove unused import StringDictionary from utils (720559a)
* fix(utils.ts): change default value type of getPackageField function to any to allow for more flexib (118ee70)
* ci: Reset after .gitignore change (4e1c8f2)

[See full list of changes here](https://github.com/snrankin/example/CHANGELOG.md)
