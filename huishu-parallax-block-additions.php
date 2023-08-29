<?php
/**
 * Plugin Name:       HUisHU Parallax Block Additions
 * Description:       Add Parallax Effect to Block Images
 * Version:           1.0.1
 * Requires at least: 5.8
 * Requires PHP:      7.3
 * Author:            HUisHU. Digitale Kreativagentur GmbH
 * Author URI:        https://www.huishu-agentur.de
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 */

/**
 * Load Gutenberg Plugin.
 */
function hu_pba_add_gutenberg_assets() {
    $asset_file = include( plugin_dir_path( __FILE__ ) . 'build/index.asset.php' );
    wp_register_script( 'hu-pba-editor', plugin_dir_url( __FILE__ ).'build/index.js', $asset_file['dependencies'], $asset_file['version']);
	wp_enqueue_script( 'hu-pba-editor' );
}
add_action( 'enqueue_block_editor_assets', 'hu_pba_add_gutenberg_assets' );

function hu_pba_load_scripts_in_frontend(){
    wp_register_script( 'hu-pba-frontend-script', plugin_dir_url( __FILE__ ) . 'assets/hpba-parallax-effect.js', array(), filemtime( plugin_dir_path( __FILE__ ) . 'assets/hpba-parallax-effect.js' ), true );
    wp_enqueue_script( 'hu-pba-frontend-script' );
}
add_action( 'wp_enqueue_scripts', 'hu_pba_load_scripts_in_frontend' );
