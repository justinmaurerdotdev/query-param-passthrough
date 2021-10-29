<?php

/**
 * Plugin Name: Query Param Passthrough
 * Plugin URI: http://360zen.com
 * Description: A plugin to store query params as cookies and pass them to affiliate sites
 * Version: 1.0
 * Author: Justin Maurer
 * Author URI: https://360zen.com
 * License: GPL3
 */

add_action( 'wp_enqueue_scripts', 'enqueue_query_param_passthrough_script' );

function enqueue_query_param_passthrough_script() {
	wp_enqueue_script( 'query-param-passthrough', plugin_dir_url( __FILE__ ) . '/qppt.js', array(), '1.0.0', true );
	if ( defined( 'QPTPARAMS_TARGET_DOMAIN' ) ) {
		$target_domain = QPTPARAMS_TARGET_DOMAIN;
		wp_localize_script( 'query-param-passthrough', 'qppt_settings', [ 'qppt_target_domain' => $target_domain ] );
	}
}
