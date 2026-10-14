import type { BoardLaneData } from '../product/harbor-bakery.ts';
import type { PreviewView } from '../product/PreviewToolbar.tsx';
import type { Status } from '../product/StatusPill.tsx';

/** The life of one change: a plan, the work, a question, the review, publishing, and live. */
export type Phase = 'plan' | 'working' | 'needs-you' | 'ready' | 'publishing' | 'published';

export const PHASES: readonly Phase[] = ['plan', 'working', 'needs-you', 'ready', 'publishing', 'published'];

export const CHANGE_TITLE = 'Make phone number tappable';
export const USER_REQUEST = 'Make the phone number tappable on mobile, and the same in the footer.';
export const LIVE_URL = 'harborbakery.com';
export const PAGE_URL = 'harborbakery.com/contact';

/** What the top bar says about each phase. */
export const PHASE_STATUS: Record<Phase, Status> = {
  plan: 'plan-ready',
  working: 'working',
  'needs-you': 'needs-you',
  ready: 'ready',
  publishing: 'approved',
  published: 'live',
};

/** Phases that show the expanded sidebar and the board under the preview; the rest show the 56 px rail. */
export const WIDE_PHASES: ReadonlySet<Phase> = new Set(['plan', 'working', 'needs-you']);

/** The tag in the preview toolbar says which copy of the site is on show. */
export const PREVIEW_TAG: Record<Phase, string> = {
  plan: 'Live site',
  working: 'Draft copy',
  'needs-you': 'Live site',
  ready: 'Draft vs live',
  publishing: 'Draft vs live',
  published: 'Live site',
};

/** The preview tab each phase opens on. */
export const PHASE_VIEW: Record<Phase, PreviewView> = {
  plan: 'preview',
  working: 'preview',
  'needs-you': 'preview',
  ready: 'compare',
  publishing: 'compare',
  published: 'preview',
};

export const PLAN_STEPS = [
  'Make the Contact page number a tap-to-call link',
  'Do the same in the footer',
  'Check both on a phone and a laptop',
  'Show you the result before anything goes live',
] as const;

export const DECISION = {
  question: 'Your header and footer both show the phone number. Change both?',
  options: ['Change both', 'Only the Contact page'],
} as const;

export const CHANGES = [
  { place: 'Contact page', summary: 'Phone number is now a tap-to-call link', added: 8, removed: 2 },
  { place: 'Footer', summary: 'Same number, same tap-to-call link', added: 3, removed: 1 },
] as const;

/** The changes listed in the sidebar. The first is the one open in the workspace. */
export function sidebarChanges(phase: Phase): { title: string; status: Status; active?: boolean }[] {
  const mine: Status = phase === 'published' ? 'live' : PHASE_STATUS[phase];
  return [
    { title: CHANGE_TITLE, status: mine, active: true },
    { title: 'Update opening hours', status: phase === 'needs-you' ? 'plan-ready' : 'needs-you' },
    { title: 'Describe 3 images', status: 'idea' },
    { title: 'Refresh footer links', status: 'done' },
  ];
}

/** The board under the preview. While a question is open the change itself moves to Needs you. */
export function boardLanes(phase: Phase): BoardLaneData[] {
  const mine = { title: CHANGE_TITLE, risk: 'everyday' as const };
  const idea: BoardLaneData = { status: 'idea', title: 'Idea', cards: [{ title: 'Describe 3 images', meta: 'Home page · Suggested', status: 'idea' }] };
  const done: BoardLaneData = { status: 'done', title: 'Done', cards: [{ title: 'Refresh footer links', meta: 'Footer · Yesterday', status: 'done' }] };
  const hours = { title: 'Update opening hours', meta: 'Home page · 1 hour ago' };
  if (phase === 'needs-you') {
    return [
      { status: 'needs-you', title: 'Needs you', cards: [{ title: CHANGE_TITLE, meta: 'Footer · Waiting for you', status: 'needs-you' }] },
      { status: 'plan-ready', title: 'Plan ready', cards: [{ ...hours, status: 'plan-ready' }] },
      idea,
      done,
    ];
  }
  const needs: BoardLaneData = { status: 'needs-you', title: 'Needs you', cards: [{ ...hours, status: 'needs-you' }] };
  if (phase === 'plan') {
    return [needs, { status: 'plan-ready', title: 'Plan ready', cards: [{ title: CHANGE_TITLE, meta: 'Contact page · Just now', status: 'plan-ready' }] }, idea, done];
  }
  return [needs, { status: 'working', title: 'Working', cards: [{ title: CHANGE_TITLE, meta: 'Contact page · 1 min ago', status: 'working', risk: mine.risk, progress: 0.42 }] }, idea, done];
}
