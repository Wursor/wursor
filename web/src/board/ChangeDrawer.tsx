'use client';

import { useEffect } from 'react';
import { Button } from '../product/Button.tsx';
import { IconButton } from '../product/IconButton.tsx';
import { RiskChip } from '../product/RiskChip.tsx';
import { StatusPill } from '../product/StatusPill.tsx';
import { Icon } from '../ui/Icon.tsx';
import { useFeedback } from '../system/Feedback.tsx';
import { LANES, type Change } from './data.ts';

const PLAN = ['Turn the number on the Contact page into a tap-to-call link', 'Do the same in the footer', 'Check both on a phone and a laptop', 'Show you the result before anything goes live'];

/** One change in detail: what was asked, the plan, what has happened so far, and what keeps it safe (Figma BD5). */
export function ChangeDrawer({ change, onClose }: { change: Change; onClose: () => void }) {
  const lane = LANES.find((l) => l.id === change.lane)!;
  const { confirm } = useFeedback();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && !document.querySelector('[role="alertdialog"]') && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="bd-scrim" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <aside aria-label="Change" className="bd-drawer">
        <div className="bd-drawer-head">
          <p className="bd-overline">Change</p>
          <IconButton icon="x" label="Close" onClick={onClose} />
        </div>
        <div className="bd-drawer-body">
          <h2>{change.title}</h2>
          <div className="bd-drawer-pills">
            <StatusPill status={lane.status} />
            <RiskChip level={change.risk} />
            <span>{change.page} · started 2 min ago</span>
          </div>
          <p className="bd-overline">What you asked</p>
          <p className="bd-text">Make the phone number on the Contact page tappable on phones.</p>
          <p className="bd-overline">The plan</p>
          <ol className="bd-plan">
            {PLAN.map((s, i) => (
              <li key={s} data-pending={i >= 2 ? 'true' : undefined}>
                <span>{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
          <p className="bd-overline">Progress</p>
          <ul className="bd-progress" aria-label="Progress">
            <li>
              <span className="bd-progress-icon" aria-hidden="true">
                <Icon name="pencil" size={20} />
              </span>
              <span>Changed the number on the Contact page</span>
              <span>1 min ago</span>
            </li>
            <li>
              <span className="bd-progress-icon" aria-hidden="true">
                <Icon name="shield-check" size={20} />
              </span>
              <span>Checking the footer on a phone width</span>
              <span>Now</span>
            </li>
          </ul>
          <p className="bd-overline">Safety</p>
          <p className="bd-text bd-muted">Everyday change. A copy of the page is saved first, and you can undo this from Activity.</p>
        </div>
        <div className="bd-drawer-foot">
          <Button
            variant="secondary"
            size="md"
            onClick={() =>
              confirm({
                title: 'Stop this change?',
                body: 'Wursor stops working on it. Nothing is published, and you can start it again from the board.',
                confirmLabel: 'Stop',
                done: 'Stopped. Nothing was published.',
                onConfirm: onClose,
              })
            }
          >
            Stop
          </Button>
          <Button variant="primary" size="md" onClick={() => window.location.assign('/workspace?phase=ready')}>
            Open preview
          </Button>
        </div>
      </aside>
    </div>
  );
}
