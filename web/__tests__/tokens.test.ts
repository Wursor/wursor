import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const css = readFileSync(resolve(process.cwd(), 'src/styles/tokens.css'), 'utf8');

/** Returns the declarations of the first block whose selector contains `selector`. */
function block(selector: string): Record<string, string> {
  const start = css.indexOf(selector);
  if (start === -1) return {};
  const open = css.indexOf('{', start);
  const close = css.indexOf('}', open);
  const out: Record<string, string> = {};
  for (const m of css.slice(open + 1, close).matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    out[m[1]!] = m[2]!.trim();
  }
  return out;
}

const light = block(':root {');
const dark = block(':root[data-theme="dark"]');
const auto = block(':root:not([data-theme="light"])');

const COLOR_TOKENS = [
  '--color-bg-canvas', '--color-bg-surface', '--color-bg-sunken', '--color-bg-inverse',
  '--color-text-primary', '--color-text-secondary', '--color-text-tertiary', '--color-text-inverse',
  '--color-text-on-accent', '--color-text-link',
  '--color-border-subtle', '--color-border-default', '--color-border-strong',
  '--color-accent-default', '--color-accent-fill', '--color-accent-text', '--color-accent-subtle',
  '--color-status-working-dot', '--color-status-working-fg', '--color-status-working-bg',
  '--color-status-needs-you-dot', '--color-status-needs-you-fg', '--color-status-needs-you-bg',
  '--color-status-success-dot', '--color-status-success-fg', '--color-status-success-bg',
  '--color-status-danger-dot', '--color-status-danger-fg', '--color-border-focus',
  '--color-diff-add-fg', '--color-diff-remove-fg', '--icon-color',
];

describe('design tokens', () => {
  it('defines every color token for the light theme', () => {
    expect(COLOR_TOKENS.filter((t) => !(t in light))).toEqual([]);
  });

  it('defines every color token for the dark theme (explicit override)', () => {
    expect(COLOR_TOKENS.filter((t) => !(t in dark))).toEqual([]);
  });

  it('follows the device setting for dark unless the light theme is forced', () => {
    expect(COLOR_TOKENS.filter((t) => !(t in auto))).toEqual([]);
    expect(css).toMatch(/@media \(prefers-color-scheme: dark\)/);
  });

  it('uses the Figma light values', () => {
    expect(light['--color-bg-canvas']).toBe('#f7f7f4');
    expect(light['--color-accent-default']).toBe('#e8590c');
    expect(light['--color-text-primary']).toBe('#14120b');
  });

  it('uses the Figma dark values', () => {
    expect(dark['--color-bg-canvas']).toBe('#0e0e0c');
    expect(dark['--color-accent-default']).toBe('#ff7a33');
  });

  it('uses the Figma values for the error and focus colours (light and dark)', () => {
    expect(light['--color-status-danger-dot']).toBe('#c93a3a');
    expect(light['--color-status-danger-fg']).toBe('#a12a2a');
    expect(light['--color-border-focus']).toBe('#e8590c');
    expect(dark['--color-status-danger-dot']).toBe('#e86a6a');
    expect(dark['--color-status-danger-fg']).toBe('#e86a6a');
    expect(dark['--color-border-focus']).toBe('#ff7a33');
  });

  it('keeps dark and automatic dark in agreement', () => {
    expect(auto).toEqual(dark);
  });

  it('defines the space, radius and control scales', () => {
    expect(light['--space-4']).toBe('16px');
    expect(light['--radius-full']).toBe('999px');
    expect(light['--size-control-lg']).toBe('44px');
  });

  it('defines the Figma type styles as classes', () => {
    for (const name of ['display-xl', 'display-l', 'display-m', 'title-l', 'title-m', 'title-s',
      'body-l', 'body-m', 'body-m-strong', 'label-m', 'label-s', 'caption', 'overline', 'mono-s']) {
      expect(css).toContain(`.t-${name}`);
    }
  });

  it('converts Figma percent tracking to em (Display/XL -3 is -0.03em)', () => {
    expect(css).toMatch(/\.t-display-xl\s*\{[^}]*letter-spacing:\s*-0\.03em/);
  });
});

/** WCAG 2.x relative luminance and contrast ratio. */
function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255) as [number, number, number];
  const f = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

/** Text token on the background token it appears on. All are small text, so AA is 4.5:1 (PX-10). */
const PAIRS: ReadonlyArray<[string, string]> = [
  ['--color-text-primary', '--color-bg-canvas'], ['--color-text-primary', '--color-bg-surface'],
  ['--color-text-primary', '--color-bg-sunken'], ['--color-text-primary', '--color-accent-subtle'],
  ['--color-text-secondary', '--color-bg-canvas'], ['--color-text-secondary', '--color-bg-surface'],
  ['--color-text-secondary', '--color-bg-sunken'], ['--color-text-secondary', '--color-accent-subtle'],
  ['--color-text-tertiary', '--color-bg-canvas'], ['--color-text-tertiary', '--color-bg-surface'],
  ['--color-text-tertiary', '--color-bg-sunken'],
  ['--color-text-inverse', '--color-bg-inverse'],
  ['--color-text-on-accent', '--color-accent-fill'],
  ['--color-accent-text', '--color-bg-canvas'], ['--color-accent-text', '--color-bg-surface'],
  ['--color-accent-text', '--color-accent-subtle'],
  ['--color-text-link', '--color-bg-canvas'], ['--color-text-link', '--color-bg-surface'],
  ['--color-text-link', '--color-bg-sunken'],
  ['--color-status-working-fg', '--color-status-working-bg'],
  ['--color-status-needs-you-fg', '--color-status-needs-you-bg'],
  ['--color-status-success-fg', '--color-status-success-bg'],
  ['--color-diff-add-fg', '--color-bg-surface'], ['--color-diff-remove-fg', '--color-bg-surface'],
  ['--color-status-danger-fg', '--color-bg-surface'], ['--color-status-danger-fg', '--color-bg-canvas'],
];

describe('contrast (WCAG 2.2 AA, PX-10)', () => {
  for (const [theme, tokens] of [['light', light], ['dark', dark]] as const) {
    it(`every text pair is at least 4.5:1 in the ${theme} theme`, () => {
      const failures = PAIRS.map(([fg, bg]) => ({ fg, bg, ratio: contrast(tokens[fg]!, tokens[bg]!) }))
        .filter((p) => p.ratio < 4.5)
        .map((p) => `${p.fg} on ${p.bg} = ${p.ratio.toFixed(2)}`);
      expect(failures).toEqual([]);
    });
  }
});
