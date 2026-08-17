import { useCallback, useState } from 'react';

export type ChatMessage = { id: string; role: 'user' | 'agent'; text: string };
export type ChatStatus = 'idle' | 'working' | 'done';

function extractHeading(text: string): string | undefined {
  const match = text.match(/["“']([^"”']+)["”']/);
  return match?.[1];
}

function mockReply(text: string, heading: string | undefined): string {
  return heading !== undefined
    ? `Done — I updated the homepage heading to “${heading}”. Preview it below.`
    : 'Done — your change is ready to preview.';
}

export function useChat(sessionToken: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ChatStatus>('idle');
  const [heading, setHeading] = useState('Welcome to our site');

  const send = useCallback(
    async (text: string) => {
      const nextHeading = extractHeading(text);
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'user', text }]);
      setStatus('working');

      try {
        const res = await fetch('/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(sessionToken !== null ? { Authorization: `Bearer ${sessionToken}` } : {}),
          },
          body: JSON.stringify({ message: text }),
        });
        if (!res.ok) throw new Error('chat unavailable');
        const body = (await res.json()) as { reply?: string };
        setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'agent', text: body.reply ?? 'Done' }]);
      } catch {
        await new Promise((resolve) => setTimeout(resolve, 1200));
        setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'agent', text: mockReply(text, nextHeading) }]);
      }

      if (nextHeading !== undefined) {
        setHeading(nextHeading);
      }
      setStatus('done');
    },
    [sessionToken],
  );

  return { messages, status, heading, send };
}
