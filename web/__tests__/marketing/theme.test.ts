import { beforeEach, describe, expect, it } from 'vitest';
import { THEME_KEY, applyTheme, currentTheme, readStoredTheme, themeInitScript } from '../../src/marketing/theme.ts';

describe('theme', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('has no stored theme until the visitor chooses one', () => {
    expect(readStoredTheme()).toBeNull();
  });

  it('ignores a stored value that is not light or dark', () => {
    localStorage.setItem(THEME_KEY, 'purple');
    expect(readStoredTheme()).toBeNull();
  });

  it('applies a theme to the page and remembers it', () => {
    applyTheme('dark');
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(readStoredTheme()).toBe('dark');
  });

  it('still applies the theme when storage is blocked', () => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = () => {
      throw new Error('blocked');
    };
    try {
      expect(() => applyTheme('light')).not.toThrow();
      expect(document.documentElement).toHaveAttribute('data-theme', 'light');
    } finally {
      Storage.prototype.setItem = original;
    }
  });

  it('gives the head script that sets the saved theme before first paint', () => {
    localStorage.setItem(THEME_KEY, 'dark');
    new Function(themeInitScript)();
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  });

  it('leaves the page on the device theme when nothing is saved', () => {
    new Function(themeInitScript)();
    expect(document.documentElement).not.toHaveAttribute('data-theme');
  });

  it('treats a browser without matchMedia as light instead of crashing', () => {
    const original = window.matchMedia;
    // @ts-expect-error simulating an environment that lacks matchMedia
    window.matchMedia = undefined;
    try {
      expect(currentTheme()).toBe('light');
    } finally {
      window.matchMedia = original;
    }
  });
});
