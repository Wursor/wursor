export type AuthMode = 'signup' | 'signin';

export type RequestCodeResult = { ok: true } | { ok: false; reason: 'no-account' | 'unavailable' };

/** `locked` carries the moment (epoch milliseconds) the visitor may try again. */
export type VerifyResult =
  | { ok: true }
  | { ok: false; reason: 'wrong' | 'expired' | 'unavailable' }
  | { ok: false; reason: 'locked'; retryAt: number };

/**
 * What the sign-in screens need from the identity service (ADR 0019). Screens depend on this interface only,
 * so the real service replaces the stand-in below without touching them.
 */
export interface AuthClient {
  requestCode(email: string, mode: AuthMode): Promise<RequestCodeResult>;
  continueWithGoogle(mode: AuthMode): Promise<void>;
  verifyCode(email: string, code: string, mode: AuthMode): Promise<VerifyResult>;
  resendCode(email: string, mode: AuthMode): Promise<{ ok: boolean }>;
}

type FakeOptions = {
  /** Emails that already have an account. Sign in with any other email says there is no account. */
  knownEmails?: readonly string[];
  delayMs?: number;
};

const MAX_WRONG = 10;
const LOCK_MS = 5 * 60 * 1000;

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/**
 * Stand-in used until the identity service exists. It sends nothing and stores nothing.
 * To try the states by hand: 12345678 signs in, 00000000 is an expired code, anything else is wrong, and ten wrong codes lock for five minutes.
 */
export function createFakeAuthClient({ knownEmails = ['amara@harborbakery.com'], delayMs = 900 }: FakeOptions = {}): AuthClient {
  let wrong = 0;
  let lockedUntil = 0;
  return {
    async requestCode(email, mode) {
      await wait(delayMs);
      if (mode === 'signin' && !knownEmails.includes(email.trim().toLowerCase())) return { ok: false, reason: 'no-account' };
      return { ok: true };
    },
    async continueWithGoogle() {
      await wait(delayMs);
    },
    async verifyCode(_email, code) {
      await wait(delayMs);
      if (Date.now() < lockedUntil) return { ok: false, reason: 'locked', retryAt: lockedUntil };
      if (code === '00000000') return { ok: false, reason: 'expired' };
      if (code === '12345678') {
        wrong = 0;
        return { ok: true };
      }
      wrong += 1;
      if (wrong >= MAX_WRONG) {
        wrong = 0;
        lockedUntil = Date.now() + LOCK_MS;
        return { ok: false, reason: 'locked', retryAt: lockedUntil };
      }
      return { ok: false, reason: 'wrong' };
    },
    async resendCode() {
      await wait(delayMs);
      return { ok: true };
    },
  };
}
