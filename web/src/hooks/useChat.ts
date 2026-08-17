import { useCallback, useState } from 'react';

export type ChatMessage = { id: string; role: 'user' | 'agent'; text: string };
export type ChatStatus = 'idle' | 'working' | 'done';

function extractHeading(text: string): string | undefined {
  const match = text.match(/["“']([^"”']+)["”']/);
  return match?.[1];
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ChatStatus>('idle');
  const [heading, setHeading] = useState('Welcome to our site');

  const send = useCallback(async (text: string) => {
    const nextHeading = extractHeading(text);
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'user', text }]);
    setStatus('working');
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: 'agent',
        text:
          nextHeading !== undefined
            ? `Done — I updated the homepage heading to “${nextHeading}”. Preview it below.`
            : 'Done — your change is ready to preview.',
      },
    ]);
    if (nextHeading !== undefined) {
      setHeading(nextHeading);
    }
    setStatus('done');
  }, []);

  return { messages, status, heading, send };
}
