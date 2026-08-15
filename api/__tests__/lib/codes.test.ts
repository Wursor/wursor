import { describe, it, expect } from 'vitest';
import { generateHmacSecret, generatePairingCode, generateToken, isHttpsUrl } from '../../src/lib/codes.ts';

describe('generatePairingCode', () => {
  it('returns an 8-char A-Z0-9 code', () => {
    expect(generatePairingCode()).toMatch(/^[A-Z0-9]{8}$/);
  });

  it('returns distinct codes across calls', () => {
    const seen = new Set(Array.from({ length: 50 }, () => generatePairingCode()));
    expect(seen.size).toBeGreaterThan(40);
  });
});

describe('generateToken / generateHmacSecret', () => {
  it('returns a 32-byte base64url token', () => {
    const token = generateToken();
    expect(token).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(token).not.toEqual(generateToken());
  });

  it('returns a distinct hmac secret', () => {
    expect(generateHmacSecret()).not.toEqual(generateHmacSecret());
  });
});

describe('isHttpsUrl', () => {
  it('accepts https URLs', () => {
    expect(isHttpsUrl('https://example.com')).toBe(true);
  });

  it('rejects http and malformed URLs', () => {
    expect(isHttpsUrl('http://example.com')).toBe(false);
    expect(isHttpsUrl('not-a-url')).toBe(false);
  });
});
