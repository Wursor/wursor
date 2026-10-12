import type { CSSProperties } from 'react';

type Props = { left: number; top: number; width: number; height: number; label: string };

/** A dashed accent box over the spot Wursor is editing. Position is in preview-stage pixels. */
export function PointHighlight({ left, top, width, height, label }: Props) {
  const style: CSSProperties = { left, top, width, height };
  return (
    <div className="p-highlight" style={style} aria-hidden="true">
      <span className="p-highlight-fill" />
      <span className="p-highlight-tag">{label}</span>
    </div>
  );
}
