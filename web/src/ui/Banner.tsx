import type { ReactNode } from 'react';
import { Icon } from './Icon.tsx';

/** Inline message bar (Figma "Banner", info tone). */
export function Banner({ children }: { children: ReactNode }) {
  return (
    <div className="ui-banner" data-tone="info">
      <Icon name="info" size={20} />
      <p className="t-body-m">{children}</p>
    </div>
  );
}
