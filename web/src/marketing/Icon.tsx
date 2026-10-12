import type { CSSProperties } from 'react';

type Props = { name: 'menu' | 'chevron-right'; size?: number; className?: string };

/**
 * Draws a single-colour Figma icon with a CSS mask so it takes the text colour
 * of the current theme. The SVG file is the exact export from Figma.
 */
export function Icon({ name, size = 16, className }: Props) {
  const style = {
    '--icon-src': `url(/marketing/icons/${name}.svg)`,
    width: size,
    height: size,
  } as CSSProperties;
  return <span aria-hidden="true" className={['icon', className].filter(Boolean).join(' ')} style={style} />;
}
