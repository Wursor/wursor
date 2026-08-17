import { useState, type FormEvent } from 'react';
import type { ChatMessage, ChatStatus } from '../hooks/useChat.ts';

type ChatPanelProps = {
  messages: ChatMessage[];
  status: ChatStatus;
  onSend: (text: string) => void;
};

export function ChatPanel({ messages, status, onSend }: ChatPanelProps) {
  const [draft, setDraft] = useState('');

  function submit(event: FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (text === '') return;
    setDraft('');
    onSend(text);
  }

  return (
    <aside className="chat">
      <div className="chat-scroll">
        {messages.length === 0 ? (
          <div className="wursor-welcome">
            <p className="welcome-kicker">Wursor</p>
            <h2>Describe what you want.</h2>
            <p className="welcome-sub">Change wording, colors, add a page — just say it. We preview it first.</p>
          </div>
        ) : (
          <ul className="chat-list">
            {messages.map((message) => (
              <li key={message.id} className={`message message-${message.role} wursor-message-${message.role}`}>
                {message.text}
              </li>
            ))}
          </ul>
        )}
        {status === 'working' && <div className="wursor-working">Working on it…</div>}
      </div>
      <form className="chat-composer" onSubmit={submit}>
        <input
          className="wursor-chat-input"
          placeholder="Describe what you want…"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
        <button className="wursor-chat-send" type="submit" aria-label="Send">
          ↑
        </button>
      </form>
    </aside>
  );
}
