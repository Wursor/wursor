import { useState } from 'react';
import { ApproveBar } from './components/ApproveBar.tsx';
import { ChatPanel } from './components/ChatPanel.tsx';
import { Preview } from './components/Preview.tsx';
import { SignUp } from './components/SignUp.tsx';
import { useChat } from './hooks/useChat.ts';

export function App() {
  const [signedUp, setSignedUp] = useState(false);
  const [applied, setApplied] = useState(false);
  const chat = useChat();

  if (!signedUp) {
    return (
      <div className="auth-screen">
        <SignUp onSignUp={async () => setSignedUp(true)} />
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
