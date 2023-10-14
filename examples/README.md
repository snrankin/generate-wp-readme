# Generate WP Readme #
**Contributors:** [snrankin](https://profiles.wordpress.org/snrankin/)  
**Tags:** fixes, enhancements  
**Requires at least:** 5.6  
**Requires at least:** 5.6  
**Tested up to:** 6.2  
**Requires PHP:** 8.0  
**Stable tag:** trunk  
**License:** GPL-2.0+  
**License URI:** http://www.gnu.org/licenses/gpl-2.0.txt  

Example plugin description

## Description ##

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

## Installation ##

This section describes how to install the plugin and get it working.

e.g.

### Uploading in WordPress Dashboard ###

1. Navigate to the 'Add New' in the plugins dashboard
2. Navigate to the 'Upload' area
3. Select `generate-wp-readme.zip` from your computer
4. Click 'Install Now'
5. Activate the plugin in the Plugin dashboard

### Using FTP ###

1. Download `generate-wp-readme.zip`
2. Extract the `generate-wp-readme` directory to your computer
3. Upload the `generate-wp-readme` directory to the `/wp-content/plugins/` directory
4. Activate the generate-wp-readme in the Plugin dashboard

## Frequently Asked Questions ##

### A question that someone might have ###

An answer to that question.

### What about foo bar? ###

Answer to foo bar dilemma.

## Screenshots ##

1. ![This screen shot description corresponds to screenshot-1.(png|jpg|jpeg|gif). Note that the screenshot is taken from the /assets directory or the directory that contains the stable readme.txt (tags or trunk). Screenshots in the /assets directory take precedence. For example, `/assets/screenshot-1.png` would win over `/tags/4.3/screenshot-1.png` (or jpg, jpeg, gif).](./examples/screenshots/screenshot-1.png)

2. ![This is the second screen shot](./examples/screenshots/screenshot-2.png)


## Changelog ##

### v0.8.0 - 2023-10-14 ###

**Features**
* 🎉 initializing project [skip ci] (25baee7)
* release.config.js:** add release configuration file (95412cd)
* templates:** add commit template files (f47aa1e)

[See full list of changes here](https://github.com/snrankin/examples/CHANGELOG.md)
