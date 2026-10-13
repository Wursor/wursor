import type { ReactNode } from 'react';
import { Icon } from './Icon.tsx';

type Props = {
  children: ReactNode;
  tone?: 'info' | 'warning';
  /** An optional ghost button on the right, for example Details. */
  action?: { label: string; onClick: () => void } | undefined;
};

/** Inline message bar (Figma "Banner"): info is blue, warning is amber. */
export function Banner({ children, tone = 'info', action }: Props) {
  return (
    <div className="ui-banner" data-tone={tone}>
      <Icon name={tone === 'warning' ? 'alert-triangle' : 'info'} size={20} />
      <p className="t-body-m">{children}</p>
      {action && (
        <button type="button" className="ui-banner-action t-label-m" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  );
}
