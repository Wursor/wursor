<?php

class Wursor_Auth_Test extends WP_UnitTestCase {

	private function sign( $secret, $timestamp, $method, $route, $body ) {
		$canonical = $timestamp . "\n" . strtoupper( $method ) . "\n" . $route . "\n" . hash( 'sha256', $body );
		return hash_hmac( 'sha256', $canonical, $secret );
	}

	public function tear_down() {
		Wursor_Auth::clear_tokens();
		parent::tear_down();
	}

	public function test_store_tokens_hashes_tokens_not_plaintext() {
		Wursor_Auth::store_tokens( 'read-token', 'deploy-token', 'hmac-secret' );

		$this->assertNotEquals( 'read-token', get_option( Wursor_Auth::OPTION_READ_HASH ) );
		$this->assertEquals( hash( 'sha256', 'read-token' ), get_option( Wursor_Auth::OPTION_READ_HASH ) );
		$this->assertNotEquals( 'hmac-secret', get_option( Wursor_Auth::OPTION_HMAC_SECRET ) );
	}

	public function test_verify_token_accepts_matching_token() {
		Wursor_Auth::store_tokens( 'read-token', 'deploy-token', 'hmac-secret' );
		$this->assertTrue( Wursor_Auth::verify_token( 'read-token', 'read' ) );
		$this->assertTrue( Wursor_Auth::verify_token( 'deploy-token', 'deploy' ) );
	}

	public function test_verify_token_rejects_wrong_token() {
		Wursor_Auth::store_tokens( 'read-token', 'deploy-token', 'hmac-secret' );
		$this->assertFalse( Wursor_Auth::verify_token( 'wrong', 'read' ) );
	}

	public function test_read_token_does_not_verify_as_deploy() {
		Wursor_Auth::store_tokens( 'read-token', 'deploy-token', 'hmac-secret' );
		$this->assertFalse( Wursor_Auth::verify_token( 'read-token', 'deploy' ) );
	}

	public function test_hmac_accepts_valid_signature() {
		Wursor_Auth::store_tokens( 'read-token', 'deploy-token', 'hmac-secret' );
		$ts    = (string) time();
		$route = '/wursor/v1/site-info';
		$body  = '';
		$this->assertTrue( Wursor_Auth::verify_hmac( $ts, 'GET', $route, $body, $this->sign( 'hmac-secret', $ts, 'GET', $route, $body ) ) );
	}

	public function test_hmac_rejects_stale_timestamp() {
		Wursor_Auth::store_tokens( 'read-token', 'deploy-token', 'hmac-secret' );
		$ts    = (string) ( time() - 120 );
		$route = '/wursor/v1/site-info';
		$body  = '';
		$this->assertFalse( Wursor_Auth::verify_hmac( $ts, 'GET', $route, $body, $this->sign( 'hmac-secret', $ts, 'GET', $route, $body ) ) );
	}

	public function test_hmac_rejects_tampered_body() {
		Wursor_Auth::store_tokens( 'read-token', 'deploy-token', 'hmac-secret' );
		$ts    = (string) time();
		$route = '/wursor/v1/files';
		$sig   = $this->sign( 'hmac-secret', $ts, 'POST', $route, '{"a":1}' );
		$this->assertFalse( Wursor_Auth::verify_hmac( $ts, 'POST', $route, '{"a":2}', $sig ) );
	}

	public function test_hmac_rejects_missing_signature() {
		Wursor_Auth::store_tokens( 'read-token', 'deploy-token', 'hmac-secret' );
		$this->assertFalse( Wursor_Auth::verify_hmac( (string) time(), 'GET', '/wursor/v1/site-info', '', null ) );
	}

	public function test_rotated_tokens_invalidate_old_hashes() {
		Wursor_Auth::store_tokens( 'old-read', 'old-deploy', 'old-secret' );
		Wursor_Auth::store_tokens( 'new-read', 'new-deploy', 'new-secret' );

		$this->assertFalse( Wursor_Auth::verify_token( 'old-read', 'read' ) );
		$this->assertTrue( Wursor_Auth::verify_token( 'new-read', 'read' ) );
	}

	public function test_disconnect_clears_tokens() {
		Wursor_Auth::store_tokens( 'read-token', 'deploy-token', 'hmac-secret' );
		Wursor_Auth::clear_tokens();
		$this->assertFalse( Wursor_Auth::is_connected() );
	}
}
