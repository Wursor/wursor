'use client';

import { useEffect, useState } from 'react';
import { Icon } from '../ui/Icon.tsx';
import { applyTheme, currentTheme } from './theme.ts';

/**
 * Light/dark switch. The sun/moon swap is pure CSS (like the brand mark), so the right icon is
 * painted from the first frame; only `aria-pressed` waits for the browser, because the server
 * can't know the visitor's saved or device theme.
 */
export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(currentTheme() === 'dark');
  }, []);

  return (
    <button
      type="button"
      className="nav-icon-button"
      aria-label="Dark theme"
      aria-pressed={dark}
      onClick={() => {
        const next = dark ? 'light' : 'dark';
        applyTheme(next);
        setDark(next === 'dark');
      }}
    >
      <Icon name="sun" className="theme-toggle-sun" />
      <Icon name="moon" className="theme-toggle-moon" />
    </button>
  );
}
