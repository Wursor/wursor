'use client';

import { useState } from 'react';
import { ConversationPanel, type Density } from './ConversationPanel.tsx';
import { HarborStream } from './HarborStream.tsx';

/** The Harbor Bakery conversation on its own, with its own detail level. */
export function HarborConversation({ defaultDensity = 'steps' }: { defaultDensity?: Density }) {
  const [density, setDensity] = useState<Density>(defaultDensity);
  return (
    <ConversationPanel density={density} onDensityChange={setDensity}>
      <HarborStream density={density} />
    </ConversationPanel>
  );
}
