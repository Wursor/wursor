'use client';

import { useState } from 'react';
import { ConversationPanel, type Density } from './ConversationPanel.tsx';
import { HARBOR } from './harbor-bakery.ts';
import { HarborStream } from './HarborStream.tsx';
import { PreviewColumn } from './PreviewColumn.tsx';
import { Sidebar } from './Sidebar.tsx';
import { TopBar } from './TopBar.tsx';

/** The workspace at its design size of 1440 × 900: top bar, sidebar, conversation, preview and board. */
export function Workspace({ defaultDensity = 'steps' }: { defaultDensity?: Density }) {
  const [density, setDensity] = useState<Density>(defaultDensity);
  return (
    <div className="p-workspace">
      <TopBar
        site={HARBOR.site.name}
        siteInitial={HARBOR.site.initial}
        change={HARBOR.change.title}
        status={HARBOR.change.status}
        autonomy={HARBOR.autonomy}
        account={HARBOR.account}
      />
      <div className="p-workspace-body">
        <Sidebar changes={HARBOR.changes} account={HARBOR.account} />
        <ConversationPanel density={density} onDensityChange={setDensity}>
          <HarborStream density={density} />
        </ConversationPanel>
        <PreviewColumn />
      </div>
    </div>
  );
}
