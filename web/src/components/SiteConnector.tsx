import { useEffect, useState } from 'react';

type SiteConnectorProps = {
  code: string;
  checkConnected: () => Promise<{ connected: boolean }>;
  pollIntervalMs?: number;
};

type State = 'pending' | 'connected' | 'error';

export function SiteConnector({ code, checkConnected, pollIntervalMs = 2000 }: SiteConnectorProps) {
  const [state, setState] = useState<State>('pending');

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    async function poll() {
      try {
        const { connected } = await checkConnected();
        if (cancelled) return;
        if (connected) {
          setState('connected');
          return;
        }
        timer = setTimeout(poll, pollIntervalMs);
      } catch {
        if (!cancelled) setState('error');
      }
    }

    void poll();
    return () => {
      cancelled = true;
      if (timer !== undefined) clearTimeout(timer);
    };
  }, [checkConnected, pollIntervalMs]);

  if (state === 'connected') {
    return <div className="wursor-connected">Site connected</div>;
  }
  if (state === 'error') {
    return <div className="wursor-error">Connection failed</div>;
  }
  return (
    <div className="wursor-pairing">
      <p>Enter this code in your Wursor plugin:</p>
      <code className="wursor-pairing-code">{code}</code>
    </div>
  );
}
