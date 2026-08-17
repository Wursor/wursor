import { useState } from 'react';
import { ApproveBar } from './components/ApproveBar.tsx';
import { ChatPanel } from './components/ChatPanel.tsx';
import { Preview } from './components/Preview.tsx';
import { SignUp } from './components/SignUp.tsx';
import { useChat } from './hooks/useChat.ts';

async function signUp(email: string, password: string): Promise<string> {
  const res = await fetch('/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? 'Sign up failed');
  }
  const body = (await res.json()) as { sessionToken: string };
  return body.sessionToken;
}

export function App() {
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [applied, setApplied] = useState(false);
  const chat = useChat(sessionToken);

  if (sessionToken === null) {
    return (
      <div className="auth-screen">
        <SignUp onSignUp={async (email, password) => setSessionToken(await signUp(email, password))} />
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-topbar">
        <span className="app-logo">Wursor</span>
        <span className="app-badge">Preview sandbox</span>
      </header>
      <div className="app-body">
        <ChatPanel messages={chat.messages} status={chat.status} onSend={chat.send} />
        <Preview heading={chat.heading} status={chat.status} applied={applied} />
      </div>
      <ApproveBar
        visible={chat.status === 'done' && !applied}
        onApprove={() => setApplied(true)}
        onReject={() => setApplied(false)}
      />
    </div>
  );
}
