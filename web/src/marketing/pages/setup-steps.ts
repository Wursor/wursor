import type { SetupStepData } from '../../product/SetupChecklist.tsx';

/** The example first-run checklist shown on the marketing pages (Harbor Bakery). */
export const SETUP_STEPS: readonly SetupStepData[] = [
  { state: 'done', title: 'Site address added', detail: 'harborbakery.com' },
  { state: 'done', title: 'Connection verified', detail: 'Secure, read and write' },
  { state: 'next', title: 'Safe copy ready', detail: 'Wursor is creating it' },
  { state: 'todo', title: 'Make your first change', detail: 'Pick a suggestion' },
];

export const ACTIVITY_ROWS = [
  { kind: 'published', text: 'Published the Contact page', time: 'Just now' },
  { kind: 'check', text: 'Checked 9 things, all passed', time: '2 min ago' },
  { kind: 'change', text: 'Changed the Contact page', time: '3 min ago' },
  { kind: 'safe-copy', text: 'Made a safe copy of your site', time: '5 min ago' },
] as const;
