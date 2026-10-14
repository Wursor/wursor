'use client';

import { useState } from 'react';
import { Toast } from '../ui/Toast.tsx';
import { ConfirmDialog } from './ConfirmDialog.tsx';
import { EmptyState } from './EmptyState.tsx';

/** Toasts and confirmation dialogs as designed (Figma SY9). The dialogs are shown in place, not over the page. */
export function FeedbackSpec() {
  const [gone, setGone] = useState<string | null>(null);
  const noop = () => {};
  return (
    <div className="sy-spec">
      <section className="sy-spec-group" aria-label="Toasts">
        <h2>Toasts</h2>
        <div role="status" className="sy-spec-row">
          <Toast tone="info">Change moved to Plan ready</Toast>
          <Toast tone="success">Published to harborbakery.com</Toast>
          <Toast tone="warning">Couldn’t publish. Nothing changed.</Toast>
        </div>
      </section>
      <section className="sy-spec-group" aria-label="Dialogs">
        <h2>Dialogs</h2>
        {gone ? (
          <p role="status">{gone}</p>
        ) : (
          <div className="sy-spec-row">
            <ConfirmDialog title="Publish this change?" confirmLabel="Publish" onConfirm={() => setGone('Published')} onCancel={noop}>
              This goes live on harborbakery.com. You can undo it for 30 days.
            </ConfirmDialog>
            <ConfirmDialog title="Disconnect Harbor Bakery?" confirmLabel="Disconnect" tone="danger" onConfirm={() => setGone('Disconnected')} onCancel={noop}>
              Wursor stops watching this site and can no longer make changes. Your site stays exactly as it is.
            </ConfirmDialog>
          </div>
        )}
      </section>
    </div>
  );
}

/** The four empty places (Figma SY10). */
export function EmptySpec() {
  return (
    <div className="sy-spec">
      <section className="sy-spec-group" aria-label="Empty states">
        <h2>Empty states</h2>
        <div className="sy-spec-grid">
          <EmptyState title="No sites yet" action={{ label: 'Add a site', onClick: () => {} }}>
            Add your first site to get started.
          </EmptyState>
          <EmptyState title="No activity yet">Everything Wursor does will show up here.</EmptyState>
          <EmptyState title="No changes yet" action={{ label: 'Add a site', onClick: () => {} }}>
            Describe something you want to change.
          </EmptyState>
          <EmptyState title="No results">Try a different word or clear the filter.</EmptyState>
        </div>
      </section>
    </div>
  );
}

/** The same three feedback pieces on a phone (Figma N4): toasts fill the width, one dialog, and a sheet's resting look. */
export function MobileFeedbackSpec() {
  return (
    <div className="mb-feedback">
      <h1>Feedback on mobile</h1>
      <section className="mb-feedback-group" aria-label="Toasts">
        <h2>Toasts</h2>
        <div role="status" className="mb-feedback-group">
          <Toast tone="info">Change moved to Plan ready</Toast>
          <Toast tone="success">Published to harborbakery.com</Toast>
          <Toast tone="warning">Couldn’t publish. Nothing changed.</Toast>
        </div>
      </section>
      <section className="mb-feedback-group" aria-label="Dialog">
        <h2>Dialog</h2>
        <ConfirmDialog title="Disconnect Harbor Bakery?" confirmLabel="Disconnect" tone="danger" onConfirm={() => {}} onCancel={() => {}}>
          Wursor stops watching this site and can no longer make changes. Your site stays exactly as it is.
        </ConfirmDialog>
      </section>
      <section className="mb-feedback-group" aria-label="Sheet">
        <h2>Sheet</h2>
        <div className="mb-sheet-demo">
          <span className="mb-grab" aria-hidden="true" />
          <h3>Sheet title</h3>
          <p>Sheet content goes here.</p>
        </div>
      </section>
    </div>
  );
}
