import type { CSSProperties } from 'react';

export type IconName =
  | 'activity' | 'arrow-right' | 'bell' | 'board' | 'check' | 'camera' | 'check-circle' | 'chevron-down' | 'chevron-right' | 'chevron-up' | 'clock' | 'close' | 'credit-card' | 'dots'
  | 'eye' | 'globe' | 'help' | 'home' | 'key' | 'list' | 'loader' | 'lock' | 'menu' | 'mic' | 'monitor' | 'paperclip'
  | 'pencil' | 'plug' | 'plus' | 'pointer' | 'refresh' | 'rocket' | 'search' | 'shield-check' | 'sidebar' | 'sliders'
  | 'shield' | 'smartphone' | 'sparkles' | 'split' | 'stop' | 'sun' | 'moon' | 'undo' | 'user' | 'x';

type Props = { name: IconName; size?: number; className?: string };

/**
 * Draws a single-colour Figma icon (public/icons) with a CSS mask, so its colour is the
 * text colour of the surrounding element and follows the theme. The SVG is the exact Figma export.
 */
export function Icon({ name, size = 16, className }: Props) {
  const style = { '--icon-src': `url(/icons/${name}.svg)`, width: size, height: size } as CSSProperties;
  return <span aria-hidden="true" className={['icon', className].filter(Boolean).join(' ')} style={style} />;
}
