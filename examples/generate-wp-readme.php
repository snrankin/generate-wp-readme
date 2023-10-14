<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://github.com/snrankin
 * @since             1.0.0
 * @package           Generate_Wp_Readme
 *
 * @wordpress-plugin
 * Plugin Name:       Generate WP Readme
 * Plugin URI:        https://github.com/snrankin/generate-wp-readme
 * Description:       Example plugin description
 * Version:           1.0.0
 * Author:            Sam Rankin
 * Author URI:        https://github.com/snrankin/
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       generate-wp-readme
 * Domain Path:       /languages,
 * Update Uri:        https://digital.riester.com/plugin/?action=download&slug=hello-riester
 * Tested up to: 6.2
 * Requires PHP: 8.0
 * Requires at least: 5.6
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define( 'GENERATE_WP_README_VERSION', '1.0.0' );

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-generate-wp-readme-activator.php
 */
function activate_generate_wp_readme() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-generate-wp-readme-activator.php';
	Generate_Wp_Readme_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-generate-wp-readme-deactivator.php
 */
function deactivate_generate_wp_readme() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-generate-wp-readme-deactivator.php';
	Generate_Wp_Readme_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_generate_wp_readme' );
register_deactivation_hook( __FILE__, 'deactivate_generate_wp_readme' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-generate-wp-readme.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_generate_wp_readme() {

	$plugin = new Generate_Wp_Readme();
	$plugin->run();

}
run_generate_wp_readme();
