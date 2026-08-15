<?php

/**
 * Token storage, verification, and request signing (HMAC).
 *
 * Tokens are stored only as SHA-256 hashes; the HMAC secret is stored encrypted
 * with a key derived from the site's AUTH_KEY + AUTH_SALT. See spikes/pairing-threat-model.md.
 */
class Wursor_Auth {
	const OPTION_READ_HASH   = 'wursor_read_token_hash';
	const OPTION_DEPLOY_HASH = 'wursor_deploy_token_hash';
	const OPTION_HMAC_SECRET = 'wursor_hmac_secret';
	const MAX_SKEW_SECONDS   = 60;

	public static function store_tokens( $read_token, $deploy_token, $hmac_secret ) {
		update_option( self::OPTION_READ_HASH, hash( 'sha256', $read_token ), true );
		update_option( self::OPTION_DEPLOY_HASH, hash( 'sha256', $deploy_token ), true );
		update_option( self::OPTION_HMAC_SECRET, self::encrypt( $hmac_secret ), true );
	}

	public static function clear_tokens() {
		delete_option( self::OPTION_READ_HASH );
		delete_option( self::OPTION_DEPLOY_HASH );
		delete_option( self::OPTION_HMAC_SECRET );
	}

	public static function is_connected() {
		return false !== get_option( self::OPTION_READ_HASH );
	}

	public static function verify_token( $token, $scope ) {
		$option = 'deploy' === $scope ? self::OPTION_DEPLOY_HASH : self::OPTION_READ_HASH;
		$stored = get_option( $option );
		return is_string( $stored ) && hash_equals( $stored, hash( 'sha256', $token ) );
	}

	public static function verify_hmac( $timestamp, $method, $route, $body, $signature ) {
		if ( ! is_string( $signature ) ) {
			return false;
		}
		if ( abs( time() - intval( $timestamp ) ) > self::MAX_SKEW_SECONDS ) {
			return false;
		}
		$canonical = $timestamp . "\n" . strtoupper( $method ) . "\n" . $route . "\n" . hash( 'sha256', $body );
		$expected  = hash_hmac( 'sha256', $canonical, self::hmac_secret() );
		return hash_equals( $expected, $signature );
	}

	private static function hmac_secret() {
		$encrypted = get_option( self::OPTION_HMAC_SECRET );
		return false === $encrypted ? '' : self::decrypt( $encrypted );
	}

	private static function encryption_key() {
		return hash( 'sha256', wp_salt( 'auth' ) . wp_salt( 'auth_salt' ) );
	}

	private static function encrypt( $value ) {
		$iv         = random_bytes( 16 );
		$tag        = '';
		$ciphertext = openssl_encrypt( $value, 'aes-256-gcm', self::encryption_key(), OPENSSL_RAW_DATA, $iv, $tag );
		if ( false === $ciphertext ) {
			return false;
		}
		return base64_encode( $iv . $tag . $ciphertext );
	}

	private static function decrypt( $value ) {
		$data = base64_decode( $value, true );
		if ( false === $data || strlen( $data ) < 32 ) {
			return '';
		}
		$iv         = substr( $data, 0, 16 );
		$tag        = substr( $data, 16, 16 );
		$ciphertext = substr( $data, 32 );
		$plaintext  = openssl_decrypt( $ciphertext, 'aes-256-gcm', self::encryption_key(), OPENSSL_RAW_DATA, $iv, $tag );
		return false === $plaintext ? '' : $plaintext;
	}
}
