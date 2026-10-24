'use client';

import { useId, useState } from 'react';
import { PageHeader } from '../home/parts.tsx';
import { Button } from '../product/Button.tsx';
import { AppShell } from '../shell/AppShell.tsx';
import { useFeedback } from '../system/Feedback.tsx';
import { sidebarChanges } from '../workspace/scenario.ts';

/** Contact support: one box, one button, and an answer on the screen (stand-in: nothing is sent anywhere). */
export function SupportScreen() {
  const id = useId();
  const { notify } = useFeedback();
  const [text, setText] = useState('');
  const [problem, setProblem] = useState('');
  const send = () => {
    if (text.trim() === '') {
      setProblem('Tell us a little about what happened first.');
      return;
    }
    setText('');
    setProblem('');
    notify('Message sent. We reply within one working day.');
  };
  return (
    <AppShell changes={sidebarChanges('working')}>
      <PageHeader title="Contact support" sub="A person reads every message. Your site is safe while you wait." />
      <form
        className="app-support"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <div className="app-field">
          <label htmlFor={id}>How can we help?</label>
          <textarea id={id} rows={6} value={text} aria-describedby={`${id}-h`} onChange={(e) => setText(e.target.value)} />
          <p id={`${id}-h`} role={problem ? 'alert' : undefined}>
            {problem || 'Say what you were doing and what you saw. No need for technical words.'}
          </p>
        </div>
        <Button variant="primary" size="md" onClick={send}>
          Send message
        </Button>
      </form>
    </AppShell>
  );
}

const RELEASES = [
  { date: 'September 2026', title: 'Proof for every change', text: 'Each change now shows what it looked like before and after, and the checks that passed.' },
  { date: 'August 2026', title: 'Undo for 30 days', text: 'Any published change can be undone from Activity for 30 days, with a safe copy kept.' },
  { date: 'July 2026', title: 'Move in and out', text: 'Bring a site to Wursor Cloud, or take it to your own WordPress, without losing anything.' },
];

/** What is new: a short, plain list of what changed in Wursor. */
export function WhatsNewScreen() {
  return (
    <AppShell changes={sidebarChanges('working')}>
      <PageHeader title="What is new" sub="The latest changes to Wursor, newest first." />
      <ul aria-label="Releases" className="app-releases">
        {RELEASES.map((r) => (
          <li key={r.title}>
            <p className="app-release-date">{r.date}</p>
            <h2>{r.title}</h2>
            <p>{r.text}</p>
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
