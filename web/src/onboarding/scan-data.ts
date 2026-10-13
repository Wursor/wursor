import type { IconName } from '../ui/Icon.tsx';

export type ScanAccess = 'full' | 'content';

export type Finding = {
  icon: IconName;
  title: string;
  detail: string;
  value: string;
  /** True when it is worth fixing. */
  attention?: boolean;
  /** What the live panel says while this one is being read, and what it says once done. */
  running: string;
  done: { kind: 'group'; title: string; count: number; steps: string[] } | { kind: 'line'; icon: 'look' | 'check' | 'capture'; text: string; time: string };
};

const PAGES: Finding = {
  icon: 'file', title: 'Pages', detail: 'Found by reading your sitemap', value: '14',
  running: 'Reading your pages',
  done: { kind: 'group', title: 'Looked at 14 pages', count: 14, steps: ['Read 14 pages from your sitemap', 'Checked each one loads'] },
};
const SAFE_COPY: Finding = {
  icon: 'shield', title: 'Safe copy', detail: 'Taken just now, so nothing can be lost', value: 'Ready',
  running: 'Taking a safe copy of your site',
  done: { kind: 'line', icon: 'capture', text: 'Took a safe copy of your site', time: '8s' },
};

export const FINDINGS: Record<ScanAccess, Finding[]> = {
  full: [
    PAGES,
    { icon: 'pencil', title: 'Forms', detail: 'Contact and Order enquiry', value: '2', running: 'Looking at your forms', done: { kind: 'line', icon: 'look', text: 'Found 2 forms: Contact and Order enquiry', time: '3s' } },
    { icon: 'plug', title: 'Plugins', detail: '3 are out of date', value: '11', attention: true, running: 'Counting your plugins', done: { kind: 'group', title: 'Checked 11 plugins', count: 11, steps: ['Listed every plugin', 'Found 3 that are out of date'] } },
    { icon: 'activity', title: 'Speed on phones', detail: 'Slower than it could be', value: '78', attention: true, running: 'Checking speed on a phone', done: { kind: 'line', icon: 'check', text: 'Checked speed on a phone', time: '12s' } },
    { icon: 'eye', title: 'Accessibility', detail: 'Missing labels and low contrast', value: '3 to fix', attention: true, running: 'Checking accessibility', done: { kind: 'line', icon: 'check', text: 'Checked accessibility on a phone', time: '4s' } },
    SAFE_COPY,
  ],
  content: [
    PAGES,
    { icon: 'plug', title: 'Plugins', detail: '3 are out of date', value: '11', running: 'Counting your plugins', done: { kind: 'line', icon: 'look', text: 'Tried to open the Contact form', time: 'blocked' } },
    { icon: 'activity', title: 'Speed on phones', detail: 'Slower than it could be', value: '78', attention: true, running: 'Checking speed on a phone', done: { kind: 'line', icon: 'check', text: 'Checked speed on a phone', time: '9s' } },
    SAFE_COPY,
  ],
};

/** What the live panel shows once the scan is over. */
export const FINISHED: Record<ScanAccess, { header: string; message: string; lines: Finding['done'][] }> = {
  full: {
    header: 'Finished',
    message: 'That’s everything. Your site is in good shape. Three things are worth fixing, and I’ve picked the safest ones for your first change.',
    lines: [
      FINDINGS.full[0]!.done,
      FINDINGS.full[2]!.done,
      { kind: 'line', icon: 'check', text: 'Checked speed and accessibility on a phone', time: '12s' },
      SAFE_COPY.done,
    ],
  },
  content: {
    header: 'Finished with a note',
    message: 'I couldn’t read your forms because a security plugin blocked me, so I’ve left them alone. Everything else looks fine.',
    lines: [
      PAGES.done,
      { kind: 'line', icon: 'look', text: 'Tried to open the Contact form', time: 'blocked' },
      { kind: 'line', icon: 'check', text: 'Checked speed on a phone', time: '9s' },
    ],
  },
};
