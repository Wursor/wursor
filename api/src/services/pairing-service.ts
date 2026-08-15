import { generateHmacSecret, generatePairingCode, generateToken, isHttpsUrl } from '../lib/codes.ts';

export type PendingPairing = {
  code: string;
  accountId: string;
  expiresAt: number;
  attempts: number;
  locked: boolean;
  consumed: boolean;
};

export type RedeemError = 'invalid' | 'expired' | 'locked' | 'consumed';

export type RedeemResult =
  | { ok: true; accountId: string; siteUrl: string; readToken: string; deployToken: string; hmacSecret: string }
  | { ok: false; error: RedeemError };

export type PairingServiceOptions = {
  ttlMs?: number;
  maxAttempts?: number;
  now?: () => number;
};

const DEFAULT_TTL_MS = 5 * 60 * 1000;
const DEFAULT_MAX_ATTEMPTS = 5;

export class PairingService {
  private readonly pending = new Map<string, PendingPairing>();
  private readonly now: () => number;
  private readonly ttlMs: number;
  private readonly maxAttempts: number;

  constructor(opts: PairingServiceOptions = {}) {
    this.now = opts.now ?? Date.now;
    this.ttlMs = opts.ttlMs ?? DEFAULT_TTL_MS;
    this.maxAttempts = opts.maxAttempts ?? DEFAULT_MAX_ATTEMPTS;
  }

  issue(accountId: string): { code: string; expiresAt: number } {
    const code = generatePairingCode();
    const expiresAt = this.now() + this.ttlMs;
    this.pending.set(code, { code, accountId, expiresAt, attempts: 0, locked: false, consumed: false });
    return { code, expiresAt };
  }

  redeem(code: string, siteUrl: string): RedeemResult {
    const pairing = this.pending.get(code);
    if (pairing === undefined) {
      return { ok: false, error: 'invalid' };
    }
    if (pairing.consumed) {
      return { ok: false, error: 'consumed' };
    }
    if (pairing.locked) {
      return { ok: false, error: 'locked' };
    }
    if (this.now() > pairing.expiresAt) {
      return { ok: false, error: 'expired' };
    }
    if (!isHttpsUrl(siteUrl)) {
      pairing.attempts += 1;
      if (pairing.attempts >= this.maxAttempts) {
        pairing.locked = true;
      }
      return { ok: false, error: 'invalid' };
    }

    pairing.consumed = true;
    return {
      ok: true,
      accountId: pairing.accountId,
      siteUrl,
      readToken: generateToken(),
      deployToken: generateToken(),
      hmacSecret: generateHmacSecret(),
    };
  }
}
