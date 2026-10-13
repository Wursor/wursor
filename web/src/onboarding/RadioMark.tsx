/** The selected radio from the design: a ring and a 4px-radius dot. Same geometry as the Figma "Circle", themed by colour. */
export function RadioMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="ob-radio-mark">
      <circle cx="8" cy="8" r="7.25" fill="var(--color-bg-surface)" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="8" r="4" fill="currentColor" />
    </svg>
  );
}
