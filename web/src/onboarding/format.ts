/** Seconds as m:ss, like the resend countdown in the design: 0:42, 5:00. */
export function formatCountdown(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

/** A time of day like the design writes it: 9:47 AM. Newer browsers put a narrow no-break space before AM/PM; the design has a normal one. */
export function formatClock(ms: number): string {
  return new Date(ms).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).replace(/ /g, ' ');
}
