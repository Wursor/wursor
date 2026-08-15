<?php
/**
 * Plugin Name: Wursor
 * Description: Connects this WordPress site to Wursor for safe, previewed changes.
 * Version: 0.1.0
 * Requires PHP: 7.4
 * Author: Wursor
 * License: GPL-2.0-or-later
 */

defined('ABSPATH') || exit;

require_once __DIR__ . '/src/class-auth.php';
require_once __DIR__ . '/src/class-site-info.php';
require_once __DIR__ . '/src/class-api.php';
require_once __DIR__ . '/src/class-admin.php';

add_action('rest_api_init', array('Wursor_API', 'register_routes'));
add_action('admin_menu', array('Wursor_Admin', 'register_menu'));
