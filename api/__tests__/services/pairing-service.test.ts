import { describe, it, expect } from 'vitest';
import { PairingService } from '../../src/services/pairing-service.ts';

describe('PairingService', () => {
  it('issues an 8-char code with a 5-minute expiry', () => {
    const svc = new PairingService({ now: () => 1_000_000 });
    const { code, expiresAt } = svc.issue('acct-1');
    expect(code).toMatch(/^[A-Z0-9]{8}$/);
    expect(expiresAt).toBe(1_000_000 + 5 * 60 * 1000);
  });

  it('redeems a valid code once and returns distinct scoped tokens', () => {
    const svc = new PairingService({ now: () => 1_000_000 });
    const { code } = svc.issue('acct-1');
    const result = svc.redeem(code, 'https://example.com');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.accountId).toBe('acct-1');
      expect(result.readToken).toBeTruthy();
      expect(result.deployToken).toBeTruthy();
      expect(result.hmacSecret).toBeTruthy();
      expect(result.readToken).not.toBe(result.deployToken);
    }
  });

  it('rejects a second redeem of the same code', () => {
    const svc = new PairingService({ now: () => 1_000_000 });
    const { code } = svc.issue('acct-1');
    svc.redeem(code, 'https://example.com');
    expect(svc.redeem(code, 'https://example.com')).toEqual({ ok: false, error: 'consumed' });
  });

  it('expires a code after five minutes', () => {
    let t = 1_000_000;
    const svc = new PairingService({ now: () => t });
    const { code } = svc.issue('acct-1');
    t += 5 * 60 * 1000 + 1;
    expect(svc.redeem(code, 'https://example.com')).toEqual({ ok: false, error: 'expired' });
  });

  it('locks a code after five failed attempts', () => {
    const svc = new PairingService({ now: () => 1_000_000 });
    const { code } = svc.issue('acct-1');
    for (let i = 0; i < 5; i += 1) {
      svc.redeem(code, 'http://insecure.example.com');
    }
    expect(svc.redeem(code, 'https://example.com')).toEqual({ ok: false, error: 'locked' });
  });

  it('rejects a non-https site URL as an invalid attempt', () => {
    const svc = new PairingService({ now: () => 1_000_000 });
    const { code } = svc.issue('acct-1');
    expect(svc.redeem(code, 'http://insecure.example.com')).toEqual({ ok: false, error: 'invalid' });
  });

  it('returns invalid for an unknown code', () => {
    expect(new PairingService().redeem('NOPE0000', 'https://example.com')).toEqual({ ok: false, error: 'invalid' });
  });
});
