<?php

/**
 * REST API routes under /wp-json/wursor/v1/.
 * Every request requires a Bearer token with the right scope and a valid HMAC signature.
 */
class Wursor_API {

	public static function register_routes() {
		register_rest_route( 'wursor/v1', '/site-info', array(
			'methods'             => 'GET',
			'callback'            => array( __CLASS__, 'get_site_info' ),
			'permission_callback' => array( __CLASS__, 'authorize_read' ),
		) );
		register_rest_route( 'wursor/v1', '/files', array(
			'methods'             => 'POST',
			'callback'            => array( __CLASS__, 'stub' ),
			'permission_callback' => array( __CLASS__, 'authorize_deploy' ),
		) );
		register_rest_route( 'wursor/v1', '/db', array(
			'methods'             => 'POST',
			'callback'            => array( __CLASS__, 'stub' ),
			'permission_callback' => array( __CLASS__, 'authorize_deploy' ),
		) );
		register_rest_route( 'wursor/v1', '/wp-cli', array(
			'methods'             => 'POST',
			'callback'            => array( __CLASS__, 'stub' ),
			'permission_callback' => array( __CLASS__, 'authorize_deploy' ),
		) );
	}

	public static function authorize_read( WP_REST_Request $request ) {
		return self::authorize( $request, 'read' );
	}

	public static function authorize_deploy( WP_REST_Request $request ) {
		return self::authorize( $request, 'deploy' );
	}

	private static function authorize( WP_REST_Request $request, $scope ) {
		$auth = $request->get_header( 'authorization' );
		if ( ! is_string( $auth ) || 0 !== strpos( $auth, 'Bearer ' ) ) {
			return new WP_Error( 'wursor_unauthorized', 'Missing bearer token', array( 'status' => 401 ) );
		}
		$token = substr( $auth, 7 );

		if ( 'deploy' === $scope ) {
			if ( ! Wursor_Auth::verify_token( $token, 'deploy' ) ) {
				return new WP_Error( 'wursor_forbidden', 'Deploy token required', array( 'status' => 403 ) );
			}
		} elseif ( ! Wursor_Auth::verify_token( $token, 'read' ) && ! Wursor_Auth::verify_token( $token, 'deploy' ) ) {
			return new WP_Error( 'wursor_unauthorized', 'Invalid token', array( 'status' => 401 ) );
		}

		$timestamp = $request->get_header( 'x-wursor-timestamp' );
		$signature = $request->get_header( 'x-wursor-signature' );
		$route     = $request->get_route();
		$body      = $request->get_body();

		if ( ! Wursor_Auth::verify_hmac( $timestamp, $request->get_method(), $route, $body, $signature ) ) {
			return new WP_Error( 'wursor_bad_signature', 'Bad HMAC signature', array( 'status' => 401 ) );
		}

		return true;
	}

	public static function get_site_info( WP_REST_Request $request ) {
		return Wursor_Site_Info::get_site_info();
	}

	public static function stub( WP_REST_Request $request ) {
		return new WP_Error( 'wursor_not_implemented', 'Not implemented until Sprint 6', array( 'status' => 501 ) );
	}
}
