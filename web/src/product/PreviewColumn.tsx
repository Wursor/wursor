'use client';

import { useState } from 'react';
import { AgentCursor } from './AgentCursor.tsx';
import { BoardStrip } from './BoardStrip.tsx';
import { DeviceFrame } from './DeviceFrame.tsx';
import { HARBOR } from './harbor-bakery.ts';
import { PointHighlight } from './PointHighlight.tsx';
import { PreviewToolbar, type PreviewView } from './PreviewToolbar.tsx';
import { SiteMock } from './SiteMock.tsx';

/** The right-hand column of the workspace: view tabs, the live preview of the draft, and the board strip. */
export function PreviewColumn({ defaultView = 'preview' }: { defaultView?: PreviewView }) {
  const [view, setView] = useState<PreviewView>(defaultView);
  return (
    <div className="p-previewcol">
      <PreviewToolbar selected={view} tag="Draft copy" onSelect={setView} />
      <div className="p-stage">
        <DeviceFrame url={HARBOR.site.url}>
          <SiteMock state="after" />
        </DeviceFrame>
        <PointHighlight left={409.96} top={312.17} width={152} height={33} label="Editing" />
        <AgentCursor left={503.76} top={351.17} />
      </div>
      <BoardStrip lanes={HARBOR.board} />
    </div>
  );
}
