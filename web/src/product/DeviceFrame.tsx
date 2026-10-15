import type { ReactNode } from 'react';
import { Icon } from '../ui/Icon.tsx';

/** A browser window around a page. Drawn at 760 px wide and shown at 712 px, the width of the preview stage. */
export function DeviceFrame({ url, children }: { url: string; children: ReactNode }) {
  return (
    <div className="p-device">
      <div className="p-device-scale">
      <div className="p-device-bar">
        <Icon name="dots" size={40} className="p-device-dots" />
        <div className="p-device-address">
          <Icon name="lock" size={20} />
          <span>{url}</span>
        </div>
        <Icon name="refresh" size={20} />
      </div>
      {children}
      </div>
    </div>
  );
}
