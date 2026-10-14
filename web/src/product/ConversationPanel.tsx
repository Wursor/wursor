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
  /** Where the stream sits when it is short: at the top (default) or against the composer. */
  anchor?: 'top' | 'bottom';
  /** Shown in the header before the detail control, for example Publish on a phone. */
  headerExtra?: ReactNode;
  children?: ReactNode;
};

/** The conversation: header with the detail level, the stream, and the composer. */
export function ConversationPanel({ density, onDensityChange, composer, anchor = 'top', headerExtra, children }: Props) {
  return (
    <section aria-label="Conversation panel" className="p-convo">
      <div className="p-convo-header">
        <h2 className="p-convo-title">Conversation</h2>
        <span className="p-spacer" />
        {headerExtra}
        <SegmentedControl label="Detail" options={DENSITIES} value={density} onChange={onDensityChange} />
      </div>
      <div className="p-stream" data-density={density} data-anchor={anchor}>
        {children}
      </div>
      <div className="p-composer-area">{composer ?? <Composer state="working" autonomy="Ask first" />}</div>
    </section>
  );
}
