import type { ReactNode } from 'react';
import { Icon } from '../../ui/Icon.tsx';
import { SectionHeader } from '../home/SectionHeader.tsx';
import { RowVisual } from './RowVisual.tsx';

type Props = {
  eyebrow: string;
  title: string;
  subtitle: string;
  bullets: readonly string[];
  /** The card shown on the backdrop. */
  children: ReactNode;
  card?: { left: number; top: number; width: number; height?: number };
  /** Put the picture before the text. */
  reverse?: boolean;
};

/** Text with a short list on one side and a picture on the other. */
export function FeatureRow({ eyebrow, title, subtitle, bullets, children, card, reverse = false }: Props) {
  return (
    <section className={`m-row${reverse ? ' m-row-reverse' : ''}`}>
      <div className="m-row-text">
        <SectionHeader align="left" eyebrow={eyebrow} title={title} subtitle={subtitle} />
        {bullets.length > 0 && (
          <ul className="m-points">
            {bullets.map((b) => (
              <li key={b} className="t-body-l">
                <Icon name="check-circle" size={20} />
                {b}
              </li>
            ))}
          </ul>
        )}
      </div>
      <RowVisual {...(card ? { card } : {})}>{children}</RowVisual>
    </section>
  );
}
