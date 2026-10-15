import type { CSSProperties, ReactNode } from 'react';

/**
 * Shows content designed at one width at a smaller (or larger) fixed ratio, laid out at the scaled size.
 * Use for a fixed ratio; use Fit when the ratio follows the container width.
 */
export function Zoom({ ratio, children, className }: { ratio: number; children: ReactNode; className?: string }) {
  return (
    <div className={className} style={{ zoom: ratio } as CSSProperties}>
      {children}
    </div>
  );
}
