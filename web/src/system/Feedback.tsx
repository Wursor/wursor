'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Toast, type ToastTone } from '../ui/Toast.tsx';
import { ConfirmDialog } from './ConfirmDialog.tsx';

type Ask = { title: string; body: ReactNode; confirmLabel: string; cancelLabel?: string; tone?: 'danger'; onConfirm?: () => void; done?: string };
type Api = {
  /** Say what just happened, in a toast that goes away by itself. */
  notify: (text: string, tone?: ToastTone) => void;
  /** Ask before something that matters. `done` is the toast shown once they agree. */
  confirm: (ask: Ask) => void;
};

const NOOP: Api = { notify: () => undefined, confirm: () => undefined };
const Ctx = createContext<Api>(NOOP);

/** Where an action's answer shows up (toasts) and where "are you sure?" is asked (a dialog), for every screen below it. */
export function useFeedback(): Api {
  return useContext(Ctx);
}

type Item = { id: number; text: string; tone: ToastTone };
const SHOW_MS = 4200;

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);
  const [asking, setAsking] = useState<Ask | null>(null);
  const next = useRef(1);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const notify = useCallback((text: string, tone: ToastTone = 'success') => {
    const id = next.current++;
    setItems((cur) => [...cur.slice(-2), { id, text, tone }]);
    timers.current.set(
      id,
      setTimeout(() => setItems((cur) => cur.filter((i) => i.id !== id)), SHOW_MS),
    );
  }, []);
  const opener = useRef<HTMLElement | null>(null);
  const confirm = useCallback((ask: Ask) => {
    opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setAsking(ask);
  }, []);
  const close = () => {
    setAsking(null);
    // Back to the button that asked, so the keyboard picks up where it left off.
    const back = opener.current;
    opener.current = null;
    if (back?.isConnected) back.focus();
  };
  useEffect(() => {
    const t = timers.current;
    return () => t.forEach((id) => clearTimeout(id));
  }, []);

  const api = useMemo<Api>(() => ({ notify, confirm }), [notify, confirm]);
  return (
    <Ctx.Provider value={api}>
      {children}
      <div role="status" aria-live="polite" className="fb-toasts">
        {items.map((i) => (
          <Toast key={i.id} tone={i.tone}>
            {i.text}
          </Toast>
        ))}
      </div>
      {asking && (
        <div className="sy-scrim">
          <ConfirmDialog
            title={asking.title}
            confirmLabel={asking.confirmLabel}
            {...(asking.cancelLabel ? { cancelLabel: asking.cancelLabel } : {})}
            {...(asking.tone ? { tone: asking.tone } : {})}
            onConfirm={() => {
              const a = asking;
              close();
              a.onConfirm?.();
              if (a.done) notify(a.done);
            }}
            onCancel={close}
          >
            {asking.body}
          </ConfirmDialog>
        </div>
      )}
    </Ctx.Provider>
  );
}
