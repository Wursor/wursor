import { useState, type FormEvent } from 'react';

type SignUpProps = {
  onSignUp: (email: string, password: string) => Promise<void>;
};

export function SignUp({ onSignUp }: SignUpProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await onSignUp(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="wursor-signup" onSubmit={submit}>
      <input name="email" type="email" aria-label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input
        name="password"
        type="password"
        aria-label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error ? <p role="alert">{error}</p> : null}
      <button type="submit" disabled={submitting}>
        Sign up
      </button>
    </form>
  );
}
