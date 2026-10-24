'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Icon } from '../ui/Icon.tsx';
import { Toast } from '../ui/Toast.tsx';
import type { AuthClient, AuthMode, VerifyResult } from './auth-client.ts';
import { CodeInput } from './CodeInput.tsx';
import { formatClock, formatCountdown } from './format.ts';

type Props = {
  mode: AuthMode;
  email: string;
  client: AuthClient;
  onVerified: (email: string) => void;
  onBack: () => void;
  onChangeEmail: () => void;
};

type Status = 'idle' | 'checking' | 'wrong' | 'expired' | 'locked' | 'unavailable';

const COOLDOWN_SECONDS = 59;
const TOAST_MS = 4000;

/** "Check your email": enter the eight-digit code. Handles checking, wrong, expired, locked and resend. */
export function VerifyStep({ mode, email, client, onVerified, onBack, onChangeEmail }: Props) {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [cooldown, setCooldown] = useState(COOLDOWN_SECONDS);
  const [retryAt, setRetryAt] = useState(0);
  const [lockLeft, setLockLeft] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [resendFailed, setResendFailed] = useState(false);
  const checking = useRef(false);
  const boxes = useRef<HTMLDivElement>(null);

  const focusFirst = useCallback(() => boxes.current?.querySelector('input')?.focus(), []);
  useEffect(focusFirst, [focusFirst]);

  useEffect(() => {
    const id = setInterval(() => {
      setCooldown((c) => Math.max(0, c - 1));
      if (retryAt) setLockLeft(Math.max(0, Math.ceil((retryAt - Date.now()) / 1000)));
    }, 1000);
    return () => clearInterval(id);
  }, [retryAt]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), TOAST_MS);
    return () => clearTimeout(id);
  }, [toast]);

  const locked = status === 'locked' && lockLeft > 0;

  const check = async (value: string) => {
    if (checking.current) return;
    checking.current = true;
    setStatus('checking');
    setResendFailed(false);
    let result: VerifyResult;
    try {
      result = await client.verifyCode(email, value, mode);
    } catch {
      result = { ok: false, reason: 'unavailable' };
    }
    checking.current = false;
    if (result.ok) {
      onVerified(email);
      return;
    }
    if (result.reason === 'expired') {
      setCode('');
      setStatus('expired');
      setTimeout(focusFirst, 0);
    } else if (result.reason === 'locked') {
      setRetryAt(result.retryAt);
      setLockLeft(Math.max(0, Math.ceil((result.retryAt - Date.now()) / 1000)));
      setStatus('locked');
    } else {
      setStatus(result.reason);
    }
  };

  const resend = async () => {
    let ok = false;
    try {
      ok = (await client.resendCode(email, mode)).ok;
    } catch {
      ok = false;
    }
    if (!ok) {
      setResendFailed(true);
      return;
    }
    setResendFailed(false);
    setCode('');
    setStatus('idle');
    setCooldown(COOLDOWN_SECONDS);
    setToast(`New code sent to ${email}`);
    setTimeout(focusFirst, 0);
  };

  const body =
    status === 'expired'
      ? 'That code has expired. Codes last ten minutes. Send a new one to continue.'
      : status === 'locked'
        ? 'Too many attempts. For your security, wait five minutes, then ask for a new code.'
        : `We sent an eight-digit code to ${email}. It works for ten minutes.${mode === 'signin' ? ' Entering it signs you in.' : ''}`;

  // The most recent thing to go wrong comes first: a failed resend replaces an older "wrong code" message.
  const problem = resendFailed
    ? "We couldn't send a new code. Check your connection and try again."
    : status === 'wrong'
      ? "That code didn't match. Check it and try again, or send a new one."
      : status === 'unavailable'
        ? "We couldn't check that code. Check your connection and try again."
        : locked
          ? `You can try again at ${formatClock(retryAt)}.`
          : null;

  const canResend = !locked && status !== 'checking' && (cooldown === 0 || status === 'wrong' || status === 'expired' || status === 'locked');

  return (
    <>
      <div className="ob-card ob-card-verify">
        <button type="button" className="ob-back t-label-m" onClick={onBack}>
          <Icon name="arrow-left" size={16} />
          Back
        </button>
        <div className="ob-heading">
          <h1 className="t-title-l">Check your email</h1>
          <p className="t-body-l">{body}</p>
        </div>
        <div ref={boxes} className="ob-code-wrap">
          <CodeInput
            value={code}
            invalid={status === 'wrong' || status === 'unavailable' || status === 'locked'}
            readOnly={status === 'checking' || locked}
            onChange={(v) => {
              setCode(v);
              if (status === 'wrong' || status === 'unavailable') setStatus('idle');
            }}
            onComplete={check}
          />
        </div>
        {status === 'checking' && <p className="ob-status t-body-m">Checking…</p>}
        {problem && (
          <p role="alert" className="ob-status ob-status-error t-body-m">
            {problem}
          </p>
        )}
        <div className="ob-resend-row">
          {status === 'checking' ? (
            <p className="t-body-m">Almost there…</p>
          ) : locked ? (
            <p className="t-body-m">Resend locked for {formatCountdown(lockLeft)}</p>
          ) : canResend ? (
            <button type="button" className="ob-resend t-body-m" onClick={resend}>
              Resend code
            </button>
          ) : (
            <p className="t-body-m">Didn&apos;t get it? Resend in {formatCountdown(cooldown)}</p>
          )}
          <button type="button" className="ob-link-inline t-label-m" onClick={onChangeEmail}>
            Use a different email
          </button>
        </div>
        {status === 'expired' && (
          <button type="button" className="ob-continue t-body-m-strong" onClick={resend}>
            <span className="ob-btn-label">Send a new code</span>
          </button>
        )}
      </div>
      <div className="ob-toast-region" role="status">
        {toast && <Toast>{toast}</Toast>}
      </div>
    </>
  );
}
