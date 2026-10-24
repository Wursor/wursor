import type { ReactNode } from 'react';
import { Icon, type IconName } from './Icon.tsx';

export type ToastTone = 'info' | 'success' | 'warning';
const ICON: Record<ToastTone, IconName> = { info: 'info', success: 'check-circle', warning: 'alert-triangle' };

/** Transient dark message (Figma "Toast"): info, success or warning. Place it in a live region so it is announced. */
export function Toast({ children, tone = 'success' }: { children: ReactNode; tone?: ToastTone }) {
  return (
    <div className="ui-toast" data-tone={tone}>
      <Icon name={ICON[tone]} size={18} />
      <span className="t-body-m">{children}</span>
    </div>
  );
}
