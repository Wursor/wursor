import type { ReactNode } from 'react';
import { Composer } from './Composer.tsx';
import { SegmentedControl } from './SegmentedControl.tsx';

export type Density = 'headline' | 'steps' | 'everything';

const DENSITIES = [
  { value: 'headline', label: 'Headline' },
  { value: 'steps', label: 'Steps' },
  { value: 'everything', label: 'Everything' },
] as const;

type Props = {
  density: Density;
  onDensityChange: (density: Density) => void;
  composer?: ReactNode;
  children?: ReactNode;
};

/** The conversation: header with the detail level, the stream, and the composer. */
export function ConversationPanel({ density, onDensityChange, composer, children }: Props) {
  return (
    <section aria-label="Conversation panel" className="p-convo">
      <div className="p-convo-header">
        <h2 className="p-convo-title">Conversation</h2>
        <span className="p-spacer" />
        <SegmentedControl label="Detail" options={DENSITIES} value={density} onChange={onDensityChange} />
      </div>
      <div className="p-stream" data-density={density}>
        {children}
      </div>
      <div className="p-composer-area">{composer ?? <Composer state="working" autonomy="Ask first" />}</div>
    </section>
  );
}
