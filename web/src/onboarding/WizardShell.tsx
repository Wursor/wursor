import Link from 'next/link';
import type { ReactNode } from 'react';
import { BrandMark } from '../marketing/BrandMark.tsx';
import { StepIndicator } from './StepIndicator.tsx';

type Props = {
  step: number;
  label: string;
  onSaveAndExit?: (() => void) | undefined;
  /** Tighter spacing, used when an extra banner would otherwise push the actions off a 900px screen. */
  compact?: boolean;
  /** Body width: 560 (default), 600 for the longer forms, 1040 with the step indicator and actions held to 600 for three cards side by side, or 960 for the scan's two columns. */
  size?: 'narrow' | 'medium' | 'wide' | 'scan';
  children: ReactNode;
};

/** The frame for the numbered setup steps: header with Help and Save and exit, a 560px column, and the step indicator on top. */
export function WizardShell({ step, label, onSaveAndExit, compact, size = 'narrow', children }: Props) {
  return (
    <div className="ob-wizard">
      <header className="ob-wizard-header">
        <Link href="/" className="ob-brand t-title-s">
          <BrandMark />
          Wursor
        </Link>
        <nav aria-label="Setup" className="ob-header-right t-label-m">
          <Link href="/docs" className="ob-help">
            Help
          </Link>
          <button type="button" className="ob-save-exit t-label-m" onClick={onSaveAndExit}>
            Save and exit
          </button>
        </nav>
      </header>
      <main className="ob-wizard-body" data-compact={compact ? 'true' : undefined} data-size={size}>
        <StepIndicator step={step} label={label} />
        {children}
      </main>
    </div>
  );
}
