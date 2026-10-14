import type { CSSProperties } from 'react';

export type IconName =
  | 'activity' | 'building' | 'arrow-up' | 'code' | 'play' | 'alert-triangle' | 'arrow-left' | 'arrow-left-20' | 'arrow-right' | 'bell' | 'board' | 'check' | 'camera' | 'check-circle' | 'cloud' | 'chevron-down' | 'chevron-right' | 'chevron-up' | 'clock' | 'close' | 'copy' | 'credit-card' | 'dots' | 'download'
  | 'external-link' | 'external-link-16' | 'eye' | 'file' | 'globe' | 'help' | 'home' | 'info' | 'key' | 'list' | 'loader' | 'lock' | 'mail' | 'menu' | 'mic' | 'monitor' | 'paperclip'
  | 'pencil' | 'plug' | 'plus' | 'pointer' | 'refresh' | 'rocket' | 'search' | 'shield-check' | 'sidebar' | 'sliders'
  | 'shield' | 'smartphone' | 'sparkles' | 'split' | 'stop' | 'sun' | 'moon' | 'undo' | 'x-circle' | 'undo-16' | 'user' | 'x';

type Props = { name: IconName; size?: number; className?: string | undefined };

/**
 * Draws a single-colour Figma icon (public/icons) with a CSS mask, so its colour is the
 * text colour of the surrounding element and follows the theme. The SVG is the exact Figma export.
 */
export function Icon({ name, size = 16, className }: Props) {
  const style = { '--icon-src': `url(/icons/${name}.svg)`, width: size, height: size } as CSSProperties;
  return <span aria-hidden="true" className={['icon', className].filter(Boolean).join(' ')} style={style} />;
}
