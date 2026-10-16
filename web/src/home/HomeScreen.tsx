'use client';

import { Button } from '../product/Button.tsx';
import { Icon } from '../ui/Icon.tsx';
import { AppShell } from '../shell/AppShell.tsx';
import { useFeedback } from '../system/Feedback.tsx';
import { sidebarChanges } from '../workspace/scenario.ts';
import { GuidedSetup, type GuidedStep } from './GuidedSetup.tsx';
import { AttentionRow, Banner, LogList, OptionsCard, PageHeader, SectionHeading, SiteCard, Stats, TryAsking, type LogRow, type StatData } from './parts.tsx';

export type HomeVariant = 'first-run' | 'active' | 'caught-up' | 'problem';
export type HomeHost = 'wordpress' | 'cloud';

type Props = {
  variant: HomeVariant;
  host?: HomeHost;
  part?: 'morning' | 'afternoon';
  /** A phone sheet that is already open. */
  sheet?: 'sites' | 'notifications' | undefined;
  onContinue?: (() => void) | undefined;
  onNewChange?: (() => void) | undefined;
  onAnswer?: (() => void) | undefined;
  onLook?: (() => void) | undefined;
  onFix?: (() => void) | undefined;
  onSeeAll?: (() => void) | undefined;
  onOpenActivity?: (() => void) | undefined;
};

const IDEAS = ['Add Sunday hours to the footer', 'Describe the 3 images that have no description', 'Make the menu page easier to read on a phone'];

const SETUP: Record<HomeHost, GuidedStep[]> = {
  wordpress: [
    { state: 'done', title: 'Create your account', detail: 'You’re signed in as Amara.' },
    { state: 'done', title: 'Connect Harbor Bakery', detail: 'harborbakery.com is paired and watching.' },
    { state: 'done', title: 'Let Wursor take a look', detail: 'It read 14 pages and found 3 things worth fixing.' },
    { state: 'next', title: 'Make your first change', detail: 'Pick one of the suggestions, or ask in your own words.' },
    { state: 'todo', title: 'Invite someone to approve', detail: 'Optional. A teammate can approve changes when you’re away.' },
  ],
  cloud: [
    { state: 'done', title: 'Create your account', detail: 'You’re signed in as Amara.' },
    { state: 'done', title: 'Tell Wursor about your site', detail: 'Your answers are saved.' },
    { state: 'done', title: 'Wursor builds your site', detail: 'You will see it come together and can change anything.' },
    { state: 'next', title: 'Go live on your web address', detail: 'Until then it lives on a preview address.' },
    { state: 'todo', title: 'Invite someone to approve', detail: 'Optional. A teammate can approve changes when you’re away.' },
  ],
};

const ACTIVITY: LogRow[] = [
  { icon: 'rocket', text: 'Published “Make phone number tappable”', trailing: 'Today, 9:41', tone: 'success' },
  { icon: 'shield-check', text: 'Checked 9 things. All passed.', trailing: 'Today, 9:38' },
  { icon: 'pencil', text: 'Changed the Contact page and footer', trailing: 'Today, 9:36' },
  { icon: 'camera', text: 'Took a safe copy of your site', trailing: 'Today, 9:34' },
  { icon: 'rocket', text: 'Published “Update Saturday hours”', trailing: 'Yesterday', tone: 'success' },
];

const CHECKED: LogRow[] = [
  { icon: 'camera', text: 'Safe copy from 2:01 PM is ready to restore', trailing: 'Ready' },
  { icon: 'pencil', text: 'Today’s change touched 2 pages and no settings', trailing: 'Checked' },
  { icon: 'shield-check', text: 'Site address answers on retry 6 of 6 failed', trailing: 'Failing' },
];

function stats(variant: HomeVariant): StatData[] {
  if (variant === 'active') {
    return [
      { label: 'Site', value: 'Live', hint: 'Watching for errors' },
      { label: 'Waiting for you', value: '2', hint: '1 question · 1 to approve', tone: 'attention' },
      { label: 'Changes this month', value: '12', hint: 'All checked, none undone' },
      { label: 'Last published', value: '2 h ago', hint: 'Make phone number tappable' },
    ];
  }
  if (variant === 'caught-up') {
    return [
      { label: 'Site', value: 'Live', hint: 'Watching for errors' },
      { label: 'Waiting for you', value: '0', hint: 'Nothing to review' },
      { label: 'Changes this month', value: '13', hint: 'All checked, none undone' },
      { label: 'Last published', value: 'Today', hint: 'Make phone number tappable' },
    ];
  }
  return [
    { label: 'Site', value: 'Down', hint: 'Since 2:14 PM', tone: 'attention' },
    { label: 'Waiting for you', value: '1', hint: 'Site problem', tone: 'attention' },
    { label: 'Changes this month', value: '13', hint: 'None affected' },
    { label: 'Last published', value: 'Today', hint: '2:02 PM · Looked fine at the time' },
  ];
}

/** Home: what needs the owner, how the site is doing, and what just happened (Figma H1 to H6). */
export function HomeScreen({ variant, host = 'wordpress', part = 'morning', onContinue, onNewChange, onAnswer, onLook, onFix, onSeeAll, onOpenActivity, sheet }: Props) {
  const { confirm, notify } = useFeedback();
  const greeting = `Good ${part}, Amara`;
  const first = variant === 'first-run';
  const cloud = host === 'cloud';
  const url = first && cloud ? 'harbor-bakery.wursor.site' : 'harborbakery.com';
  const newChange = (
    <Button variant="primary" size="md" leadingIcon="plus" onClick={onNewChange}>
      New change
    </Button>
  );

  return (
    <AppShell active="home" sheet={sheet} changes={first ? [] : sidebarChanges('working')}>
      {variant === 'caught-up' && (
        <div className="app-banner">
          <Banner tone="success">Everything is up to date. Nothing needs you right now.</Banner>
        </div>
      )}
      {variant === 'problem' && (
        <div className="app-banner" role="alert">
          <Banner tone="danger">
            {cloud ? 'harborbakery.com isn’t responding. Wursor is checking it on WeOwn Cloud and paused publishing.' : 'harborbakery.com isn’t responding. Wursor paused publishing and is checking every minute.'}
          </Banner>
        </div>
      )}
      <PageHeader
        title={first ? 'Welcome, Amara' : greeting}
        sub={
          first
            ? cloud
              ? 'Wursor is building Harbor Bakery. We will show you each step.'
              : 'Harbor Bakery is connected. Let’s make your first change together.'
            : variant === 'active'
              ? 'Harbor Bakery is live. Wursor has one question and one change ready for you.'
              : variant === 'caught-up'
                ? 'Harbor Bakery is live and Wursor is watching it.'
                : 'Your site needs attention before anything else goes live.'
        }
        action={first ? undefined : newChange}
      />
      {!first && <Stats stats={stats(variant)} />}
      <div className="app-columns">
        <div className="app-col-main">
          {first && <GuidedSetup steps={SETUP[host]} onContinue={onContinue} />}
          {variant === 'active' && (
            <>
              <section className="app-section">
                <SectionHeading title="Needs you" link="See all" onLink={onSeeAll} />
                <AttentionRow tone="question" title="Which opening hours should Wursor use?" body="Update opening hours · Your site shows two different times for Saturday." time="1 h ago" action="Answer" onAction={onAnswer} />
                <AttentionRow tone="ready" title="Make phone number tappable is ready" body="2 changes · Everyday risk · Checked 9 things, all passed." time="12 min ago" action="Look" onAction={onLook} />
              </section>
              <section className="app-section">
                <SectionHeading title="Recent activity" link="Open activity" onLink={onOpenActivity} />
                <LogList label="Recent activity" rows={ACTIVITY} href="/activity" />
              </section>
            </>
          )}
          {variant === 'caught-up' && (
            <>
              <section className="app-section">
                <SectionHeading title="Needs you" />
                <div className="app-empty">
                  <Icon name="check-circle" size={20} />
                  <h3>You’re all caught up</h3>
                  <p>When Wursor has a question or a change to approve, it will appear here and in your notifications.</p>
                  <Button variant="secondary" size="md" leadingIcon="sparkles" onClick={onNewChange}>
                    Ask Wursor for a change
                  </Button>
                </div>
              </section>
              <section className="app-section">
                <SectionHeading title="Recent activity" link="Open activity" onLink={onOpenActivity} />
                <LogList label="Recent activity" rows={ACTIVITY.slice(0, 4)} href="/activity" />
              </section>
            </>
          )}
          {variant === 'problem' && (
            <>
              <section className="app-section">
                <SectionHeading title="Needs you" />
                <AttentionRow
                  tone="problem"
                  title="Your site stopped responding at 2:14 PM"
                  body={cloud ? 'Wursor can undo today’s change, or keep waiting. Wursor is already looking at the hosting side.' : 'Wursor can undo today’s change, or keep waiting. Your host may also be having trouble.'}
                  time="8 min ago"
                  action="Fix"
                  onAction={onFix}
                />
              </section>
              <section className="app-section">
                <SectionHeading title="What Wursor has checked" />
                <LogList label="What Wursor has checked" rows={CHECKED} />
              </section>
            </>
          )}
        </div>
        <div className="app-col-side">
          <SiteCard
            name="Harbor Bakery"
            url={url}
            href={`https://${url}`}
            status={first ? (cloud ? 'preview' : 'watching') : variant === 'problem' ? 'stopped' : 'live'}
            detail={
              first
                ? cloud
                  ? 'Hosted on Wursor Cloud. Not live on your web address yet.'
                  : 'Wursor is watching for errors. Nothing has changed yet.'
                : variant === 'problem'
                  ? 'Last seen working at 2:13 PM.'
                  : 'Published 9:41 AM · Wursor is watching for errors.'
            }
          />
          {variant === 'problem' ? (
            <OptionsCard title="What you can do">
              <Button
                variant="primary"
                size="md"
                leadingIcon="undo-16"
                onClick={() =>
                  confirm({
                    title: 'Undo today’s change?',
                    body: 'Your site goes back to how it was this morning. A safe copy of today’s version is kept.',
                    confirmLabel: 'Undo today’s change',
                    done: 'Undone. Wursor is checking that your site is back.',
                  })
                }
              >
                Undo today’s change
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() =>
                  confirm({
                    title: 'Restore the safe copy?',
                    body: 'Your site is replaced with the last copy Wursor saved before the problem, from 9:41 AM today.',
                    confirmLabel: 'Restore',
                    done: 'Restoring the safe copy. This takes about a minute.',
                  })
                }
              >
                Restore the safe copy
              </Button>
              {cloud ? (
                <a href="/support" className="p-btn p-btn-ghost p-btn-md app-fullwidth">
                  <span>Contact Wursor support</span>
                  <Icon name="external-link-16" size={16} />
                </a>
              ) : (
                <button type="button" className="p-btn p-btn-ghost p-btn-md app-fullwidth" onClick={() => notify('Your host looks after the server. Wursor has noted the time it went down to share with them.', 'info')}>
                  <span>Contact your host</span>
                  <Icon name="external-link-16" size={16} />
                </button>
              )}
            </OptionsCard>
          ) : (
            <TryAsking ideas={IDEAS} />
          )}
        </div>
      </div>
    </AppShell>
  );
}
