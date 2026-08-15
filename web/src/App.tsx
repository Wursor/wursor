import { useState } from 'react';
import { SignUp } from './components/SignUp.tsx';

async function signUp(email: string, password: string): Promise<void> {
  const res = await fetch('/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? 'Sign up failed');
  }
}

export function App() {
  const [signedUp, setSignedUp] = useState(false);

  if (signedUp) {
    return (
      <div className="wursor-welcome">
        <p>Describe what you want.</p>
        <input className="wursor-chat-input" placeholder="Describe what you want…" />
      </div>
    );
  }

  return (
    <SignUp
      onSignUp={async (email, password) => {
        await signUp(email, password);
        setSignedUp(true);
      }}
    />
  );
}
