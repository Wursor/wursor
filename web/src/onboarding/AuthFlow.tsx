'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Icon } from '../ui/Icon.tsx';
import { AuthShell } from './AuthShell.tsx';
import { createFakeAuthClient, type AuthClient, type AuthMode } from './auth-client.ts';
import { isValidEmail } from './email.ts';
import { TextField } from './TextField.tsx';
import { VerifyStep } from './VerifyStep.tsx';

type Props = {
  mode: AuthMode;
  client?: AuthClient;
  /** Called once the code has been sent, with the email it went to. */
  onCodeSent?: (email: string) => void;
  /** Called after Continue with Google completes. */
  onGoogleDone?: () => void;
  /** Called once the emailed code is accepted. */
  onVerified?: (email: string) => void;
};

const defaultClient = createFakeAuthClient();

const COPY = {
  signup: {
    welcomeTitle: 'Create your account',
    welcomeBody: 'Tell Wursor what to change on your WordPress site. It does the work, shows you every step, and asks before anything goes live.',
    emailTitle: "What's your email?",
    emailBody: "We'll send you a code. No password to remember.",
  },
  signin: {
    welcomeTitle: 'Welcome back',
    welcomeBody: 'Sign in to pick up where Wursor left off. Wursor still asks before anything goes live.',
    emailTitle: 'Welcome back',
    emailBody: "Enter your email and we'll send you a code to sign in.",
  },
} as const;

const EMAIL_ERROR = 'Enter a full email address, like you@company.com';

type Failure = 'no-account' | 'unavailable' | null;

/** Sign up and sign in share one card; only the wording and the "no account" case differ. */
export function AuthFlow({ mode, client = defaultClient, onCodeSent, onGoogleDone, onVerified }: Props) {
  const copy = COPY[mode];
  const [step, setStep] = useState<'welcome' | 'email' | 'verify'>('welcome');
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const [sending, setSending] = useState(false);
  const [failure, setFailure] = useState<Failure>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inFlight = useRef(false);

  useEffect(() => {
    if (step === 'email') inputRef.current?.focus();
  }, [step]);

  const google = async () => {
    await client.continueWithGoogle(mode);
    onGoogleDone?.();
  };

  const valid = isValidEmail(email);
  const formatError = touched && email.trim() !== '' && !valid;
  const blocked = sending || !valid || failure === 'no-account';

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (inFlight.current) return;
    if (!valid) {
      setTouched(true);
      inputRef.current?.focus();
      return;
    }
    if (failure === 'no-account') return;
    inFlight.current = true;
    setSending(true);
    setFailure(null);
    const trimmed = email.trim();
    let result: Awaited<ReturnType<AuthClient['requestCode']>>;
    try {
      result = await client.requestCode(trimmed, mode);
    } catch {
      result = { ok: false, reason: 'unavailable' };
    }
    inFlight.current = false;
    if (result.ok) {
      onCodeSent?.(trimmed);
      setSending(false);
      setStep('verify');
      return;
    }
    setSending(false);
    setFailure(result.reason);
  };

  if (step === 'verify') {
    return (
      <AuthShell>
        <VerifyStep
          mode={mode}
          email={email.trim()}
          client={client}
          onVerified={(e) => onVerified?.(e)}
          onBack={() => setStep('email')}
          onChangeEmail={() => {
            setEmail('');
            setTouched(false);
            setStep('email');
          }}
        />
      </AuthShell>
    );
  }

  if (step === 'welcome') {
    return (
      <AuthShell signIn={mode === 'signup' ? 'link' : 'current'}>
        <div className="ob-card">
          <div className="ob-heading">
            <h1 className="t-title-l">{copy.welcomeTitle}</h1>
            <p className="t-body-l">{copy.welcomeBody}</p>
          </div>
          <div className="ob-options">
            <button type="button" className="ob-provider ob-provider-primary t-label-m" onClick={google}>
              <span className="ob-glyph" aria-hidden="true">G</span>
              <span className="ob-btn-label">Continue with Google</span>
            </button>
            <button type="button" className="ob-provider ob-provider-secondary t-label-m" onClick={() => setStep('email')}>
              <Icon name="mail" size={20} />
              <span className="ob-btn-label">Continue with email</span>
            </button>
          </div>
          <p className="ob-terms t-caption">By continuing, you agree to the Terms of Service and Privacy Policy.</p>
        </div>
        <p className="ob-account-row t-body-m">
          {mode === 'signup' ? (
            <>
              Already have an account? <Link href="/signin" className="t-label-m">Sign in</Link>
            </>
          ) : (
            <>
              New to Wursor? <Link href="/signup" className="t-label-m">Create an account</Link>
            </>
          )}
        </p>
      </AuthShell>
    );
  }

  const error =
    failure === 'no-account' ? (
      <Link href="/signup">No account with that email. Create one instead.</Link>
    ) : failure === 'unavailable' ? (
      "We couldn't send the code. Check your connection and try again."
    ) : formatError ? (
      EMAIL_ERROR
    ) : undefined;

  return (
    <AuthShell>
      <form className="ob-card" noValidate onSubmit={submit}>
        <button type="button" className="ob-back t-label-m" onClick={() => setStep('welcome')}>
          <Icon name="arrow-left" size={16} />
          Back
        </button>
        <div className="ob-heading">
          <h1 className="t-title-l">{copy.emailTitle}</h1>
          <p className="t-body-l">{copy.emailBody}</p>
        </div>
        <TextField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@harborbakery.com"
          value={email}
          readOnly={sending}
          invalid={formatError || failure === 'no-account'}
          error={error}
          inputRef={inputRef}
          onChange={(v) => {
            setEmail(v);
            setFailure(null);
          }}
          onBlur={() => setTouched(true)}
        />
        <button type="submit" className="ob-continue t-body-m-strong" aria-disabled={blocked} aria-busy={sending}>
          <span className="ob-btn-label">{sending ? 'Sending code…' : 'Continue'}</span>
        </button>
        <button type="button" className="ob-link t-label-m" onClick={google}>
          Use Google instead
        </button>
      </form>
    </AuthShell>
  );
}
