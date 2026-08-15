<?php

/**
 * Site information provider: theme, plugins, versions, builder, capability tiers, preflight.
 * Builder detection mirrors e2e/golden/src/builder-detect.ts (see ADR 0006).
 */
class Wursor_Site_Info {

	public static function get_site_info() {
		$theme = wp_get_theme();
		return array(
			'theme'             => $theme->get_stylesheet(),
			'plugins'           => self::plugins(),
			'wordpress_version' => get_bloginfo( 'version' ),
			'php_version'       => PHP_VERSION,
			'builder'           => self::detect_builder(),
			'capabilities'      => self::capabilities(),
			'preflight'         => self::preflight(),
		);
	}

	private static function plugins() {
		if ( ! function_exists( 'get_plugins' ) ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}
		$all    = get_plugins();
		$active = (array) get_option( 'active_plugins', array() );
		$result = array();
		foreach ( $all as $plugin_file => $data ) {
			$result[] = array(
				'slug'   => self::slug_from_file( $plugin_file ),
				'active' => in_array( $plugin_file, $active, true ),
			);
		}
		return $result;
	}

	private static function active_slugs() {
		$active = (array) get_option( 'active_plugins', array() );
		return array_map( array( __CLASS__, 'slug_from_file' ), $active );
	}

	private static function slug_from_file( $file ) {
		$dir = dirname( $file );
		return '.' === $dir ? basename( $file, '.php' ) : $dir;
	}

	private static function front_page_id() {
		$front = (int) get_option( 'page_on_front' );
		if ( $front > 0 ) {
			return $front;
		}
		$pages = get_pages( array( 'number' => 1 ) );
		return empty( $pages ) ? 0 : $pages[0]->ID;
	}

	private static function front_page_content() {
		$id = self::front_page_id();
		return $id > 0 ? (string) get_post_field( 'post_content', $id ) : '';
	}

	private static function detect_builder() {
		$theme    = wp_get_theme()->get_stylesheet();
		$active   = self::active_slugs();
		$id       = self::front_page_id();
		$content  = self::front_page_content();

		$elementor_mode = $id > 0 ? get_post_meta( $id, '_elementor_edit_mode', true ) : '';
		$elementor_data = $id > 0 ? get_post_meta( $id, '_elementor_data', true ) : '';
		$fl_builder     = $id > 0 ? get_post_meta( $id, '_fl_builder_data', true ) : '';
		$et_pb          = $id > 0 ? get_post_meta( $id, '_et_pb_use_builder', true ) : '';

		if ( in_array( 'elementor', $active, true ) && ( '' !== $elementor_mode || '' !== $elementor_data ) ) {
			return 'elementor';
		}
		if ( in_array( 'beaver-builder-lite-version', $active, true ) && '' !== $fl_builder ) {
			return 'beaver';
		}
		if ( false !== stripos( $theme, 'divi' ) && 'on' === $et_pb ) {
			return 'divi';
		}
		if ( false !== strpos( $content, '<!-- wp:' ) ) {
			return 'gutenberg';
		}
		return 'classic';
	}

	private static function capabilities() {
		$full = version_compare( get_bloginfo( 'version' ), '6.1', '>=' ) && version_compare( PHP_VERSION, '8.0', '>=' );
		$install_safe = ! defined( 'DISALLOW_FILE_MODS' ) || ! DISALLOW_FILE_MODS;
		return array(
			'content' => true,
			'design'  => $full,
			'install' => $full && $install_safe,
		);
	}

	private static function preflight() {
		return array(
			'https'                => is_ssl(),
			'disallow_file_mods'   => defined( 'DISALLOW_FILE_MODS' ) && DISALLOW_FILE_MODS,
			'disk_free'            => function_exists( 'disk_free_space' ) ? disk_free_space( ABSPATH ) : null,
		);
	}
}
