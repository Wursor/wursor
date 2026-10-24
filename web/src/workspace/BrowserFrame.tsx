import type { ReactNode } from 'react';
import { Icon } from '../ui/Icon.tsx';

/** A browser window around a page at its design width. Scale it with FitFrame. */
export function BrowserFrame({ url, children }: { url: string; children: ReactNode }) {
  return (
    <div className="ws-browser">
      <div className="p-device-bar">
        <span className="ws-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <div className="p-device-address">
          <Icon name="lock" size={20} />
          <span>{url}</span>
        </div>
        <Icon name="refresh" size={20} />
      </div>
      {children}
    </div>
  );
}
