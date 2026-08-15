<?php

/**
 * Admin settings page: paste the Wursor pairing code, connect, disconnect.
 */
class Wursor_Admin {

	public static function register_menu() {
		add_menu_page( 'Wursor', 'Wursor', 'manage_options', 'wursor', array( __CLASS__, 'render' ), 'dashicons-update' );
	}

	public static function render() {
		self::handle_post();
		$connected = Wursor_Auth::is_connected();
		?>
		<div class="wrap">
			<h1>Wursor</h1>
			<?php if ( $connected ) : ?>
				<p>This site is connected to Wursor.</p>
				<form method="post">
					<input type="hidden" name="wursor_disconnect" value="1" />
					<?php submit_button( 'Disconnect' ); ?>
				</form>
			<?php else : ?>
				<p>Paste the pairing code from Wursor to connect this site.</p>
				<form method="post">
					<input type="text" name="wursor_pairing_code" maxlength="8" autocomplete="off" placeholder="ABCD1234" />
					<?php submit_button( 'Connect' ); ?>
				</form>
			<?php endif; ?>
		</div>
		<?php
	}

	private static function handle_post() {
		if ( isset( $_POST['wursor_disconnect'] ) ) {
			Wursor_Auth::clear_tokens();
			return;
		}
		if ( empty( $_POST['wursor_pairing_code'] ) ) {
			return;
		}

		$code    = sanitize_text_field( wp_unslash( $_POST['wursor_pairing_code'] ) );
		$api_url = get_option( 'wursor_api_url', 'https://api.wursor.dev' );

		$response = wp_remote_post(
			rtrim( $api_url, '/' ) . '/sites/redeem',
			array(
				'body'    => wp_json_encode( array( 'code' => $code, 'siteUrl' => home_url( '/' ) ) ),
				'headers' => array( 'Content-Type' => 'application/json' ),
				'timeout' => 15,
			)
		);

		if ( is_wp_error( $response ) ) {
			return;
		}

		$body = json_decode( wp_remote_retrieve_body( $response ), true );
		if ( isset( $body['readToken'], $body['deployToken'], $body['hmacSecret'] ) ) {
			Wursor_Auth::store_tokens( $body['readToken'], $body['deployToken'], $body['hmacSecret'] );
		}
	}
}
