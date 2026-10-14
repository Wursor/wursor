'use client';

import { useState } from 'react';
import { Banner } from '../ui/Banner.tsx';
import { Icon } from '../ui/Icon.tsx';
import { IconButton } from '../product/IconButton.tsx';
import { RiskChip } from '../product/RiskChip.tsx';
import { ChangeRow } from './ChangeRow.tsx';

type Change = { place: string; summary: string; added: number; removed: number };
type Props = { verdict: string; changes: readonly Change[]; onClose?: (() => void) | undefined };

/** Right-hand drawer in the Ready for you state: Wursor's verdict, the risk in plain words, each change, and developer details for people who want the code. */
export function WhatChangedDrawer({ verdict, changes, onClose }: Props) {
  const [dev, setDev] = useState(false);
  return (
    <aside className="p-drawer" aria-label="What changed">
      <div className="p-drawer-header">
        <h2 className="p-drawer-title">What changed</h2>
        <IconButton icon="x" label="Close" onClick={onClose} />
      </div>
      <Banner tone="success">{verdict}</Banner>
      <div className="p-drawer-risk">
        <RiskChip level="everyday" />
        <p>Easy to undo. Nothing goes live until you approve.</p>
      </div>
      <p className="p-drawer-count">{changes.length} changes</p>
      <ul className="p-drawer-rows" aria-label="Each change">
        {changes.map((c) => (
          <li key={c.place}>
            <ChangeRow {...c} />
          </li>
        ))}
      </ul>
      <hr className="p-drawer-rule" />
      <button type="button" className="p-drawer-dev" aria-expanded={dev} onClick={() => setDev((v) => !v)}>
        <Icon name={dev ? 'chevron-down' : 'chevron-right'} size={20} />
        <span>Developer details</span>
        <span className="p-spacer" />
        <Icon name="code" size={20} />
      </button>
      {dev && (
        <pre className="p-drawer-code">{`contact.html   +8  −2\nfooter.html    +3  −1`}</pre>
      )}
    </aside>
  );
}
