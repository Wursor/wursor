export type Theme = 'light' | 'dark';

/** localStorage key holding the visitor's explicit choice. Absent means "follow the device". */
export const THEME_KEY = 'wursor-theme';

const isTheme = (v: unknown): v is Theme => v === 'light' || v === 'dark';

/** The saved choice, or null if none (or storage is blocked or holds something unexpected). */
export function readStoredTheme(): Theme | null {
  try {
    const v = localStorage.getItem(THEME_KEY);
    return isTheme(v) ? v : null;
  } catch {
    return null;
  }
}

/** What the page is showing right now: the saved choice, else the device setting. */
export function currentTheme(): Theme {
  return readStoredTheme() ?? (window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
}

/** Show a theme (tokens.css keys off `data-theme`) and remember it. Works even if storage is blocked. */
export function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute('data-theme', theme);
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* Private mode or blocked storage: the choice still applies for this visit. */
  }
}

/**
 * Inlined in <head> so a saved choice is in place before first paint (no flash of the wrong theme).
 * Self-contained on purpose: it runs as a string, before any bundle loads.
 */
export const themeInitScript = `try{var t=localStorage.getItem('${THEME_KEY}');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t)}catch(e){}`;
