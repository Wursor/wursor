import type { ReactNode } from 'react';

/** A radio group named by a string. Cards inside are label + input pairs. */
export function RadioGroupLabel({ label, className, children }: { label: string; className?: string; children: ReactNode }) {
  return (
    <div role="radiogroup" aria-label={label} className={className}>
      {children}
    </div>
  );
}
