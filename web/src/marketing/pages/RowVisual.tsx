import type { CSSProperties, ReactNode } from 'react';
import { Fit } from '../../ui/Fit.tsx';

type Props = {
  children: ReactNode;
  /** Where the card sits in the 600 × 480 picture. */
  card?: { left: number; top: number; width: number; height?: number };
};

/** A 600 × 480 backdrop with one card on it, scaled to the column. Decorative: hidden from assistive technology. */
export function RowVisual({ children, card = { left: 70, top: 95, width: 460 } }: Props) {
  const style: CSSProperties = { left: card.left, top: card.top, width: card.width, ...(card.height ? { height: card.height } : {}) };
  return (
    <div className="m-rowvisual" aria-hidden="true" inert>
      <Fit designWidth={600} designHeight={480}>
        <div className="m-rowscene">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="m-rowbackdrop" src="/marketing/backdrop.svg" alt="" />
          <div className="m-rowcard" style={style}>
            {children}
          </div>
        </div>
      </Fit>
    </div>
  );
}
