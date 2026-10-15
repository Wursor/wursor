import type { CSSProperties } from 'react';
import { Icon } from '../ui/Icon.tsx';

/** Wursor's pointer on the preview, with its name. Position is in preview-stage pixels. */
export function AgentCursor({ left, top, name = 'Wursor' }: { left: number; top: number; name?: string }) {
  const style: CSSProperties = { left, top };
  return (
    <div className="p-cursor" style={style} aria-hidden="true">
      <Icon name="pointer" size={20} />
      <span className="p-cursor-name">{name}</span>
    </div>
  );
}
