'use client';

import { useState, type ReactNode } from 'react';
import { AppShell } from '../shell/AppShell.tsx';
import { Button } from '../product/Button.tsx';
import { Tab } from '../product/Tab.tsx';
import { Icon } from '../ui/Icon.tsx';
import { Banner } from '../ui/Banner.tsx';
import { sidebarChanges } from '../workspace/scenario.ts';
import { StepList, type GuidedStep } from '../home/GuidedSetup.tsx';
import { LogList, PageHeader, SectionHeading, SiteCard, type LogRow } from '../home/parts.tsx';
import { AccessBadge } from './AccessBadge.tsx';
import { Toggle } from './Toggle.tsx';
import { UsageMeter } from './UsageMeter.tsx';

export type DetailTab = 'overview' | 'changes' | 'where' | 'settings';
export type DetailHost = 'wordpress' | 'cloud' | 'content' | 'preview';

const TABS: ReadonlyArray<{ id: DetailTab; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'changes', label: 'Changes' },
  { id: 'where', label: 'Where it lives' },
  { id: 'settings', label: 'Settings' },
];

const SUB: Record<DetailHost, string> = {
  wordpress: 'harborbakery.com · Connected 12 days ago · WordPress 6.8',
  cloud: 'Hosted on Wursor Cloud · harborbakery.com',
  content: 'Your WordPress · harborbakery.com · Content only',
  preview: 'Hosted on Wursor Cloud · harbor-bakery.wursor.site',
};

const RECENT: LogRow[] = [
  { icon: 'rocket', text: 'Make phone number tappable', trailing: 'Today, 9:41', tone: 'success' },
  { icon: 'rocket', text: 'Update Saturday hours', trailing: 'Yesterday', tone: 'success' },
  { icon: 'rocket', text: 'Describe 3 images', trailing: 'Mon, 12 Oct', tone: 'success' },
  { icon: 'shield-check', text: 'Weekly check: 14 pages, no problems', trailing: 'Sun, 11 Oct' },
];
const COPIES: LogRow[] = [
  { icon: 'camera', text: 'Before “Make phone number tappable”', trailing: 'Today, 9:34' },
  { icon: 'camera', text: 'Before “Update Saturday hours”', trailing: 'Yesterday' },
  { icon: 'camera', text: 'Weekly copy', trailing: 'Sun, 11 Oct' },
];

function Overview() {
  return (
    <div className="app-columns app-columns-tight">
      <div className="app-col-main">
        <section className="app-section">
          <SectionHeading title="Recent changes" link="Open all" />
          <LogList label="Recent changes" rows={RECENT} />
        </section>
        <section className="app-section">
          <SectionHeading title="Safe copies" link="Restore a copy" />
          <LogList label="Safe copies" rows={COPIES} />
        </section>
      </div>
      <div className="app-col-side">
        <SiteCard name="Harbor Bakery" url="harborbakery.com" href="https://harborbakery.com" status="live" detail="Watching for errors since 9:41 AM." actionLabel="Open workspace" actionHref="/workspace" />
        <section aria-label="This month" className="app-card app-usage">
          <h2>This month</h2>
          <UsageMeter label="Changes" value="12 of 50" fill={12 / 50} />
          <UsageMeter label="Safe copies" value="9 of 30" fill={9 / 30} />
        </section>
      </div>
    </div>
  );
}

function Row({ title, detail, children }: { title: string; detail: string; children?: ReactNode }) {
  return (
    <div className="app-settingrow">
      <div className="app-settingrow-text">
        <p>{title}</p>
        <p>{detail}</p>
      </div>
      {children}
    </div>
  );
}

function Group({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="app-group">
      <h2>{title}</h2>
      {description && <p className="app-group-desc">{description}</p>}
      {children}
    </section>
  );
}

function Definition({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="app-def">
      <p className="app-def-label">{label}</p>
      <div className="app-def-value">{children}</div>
    </div>
  );
}

function Connection() {
  const [perms, setPerms] = useState({ pages: true, menus: true, theme: false, plugins: false });
  const set = (k: keyof typeof perms) => (v: boolean) => setPerms((p) => ({ ...p, [k]: v }));
  return (
    <>
      <Banner tone="warning">The Wursor helper on harborbakery.com is one version behind. Update it to keep checks accurate.</Banner>
      <Group title="Connection">
        <div className="app-rows">
          <Row title="Wursor helper" detail="Version 1.4.2. The latest is 1.5.0.">
            <Button variant="secondary">Update</Button>
          </Row>
          <Row title="Paired" detail="12 days ago from this computer.">
            <span className="app-row-state">Healthy</span>
          </Row>
          <Row title="Pairing code" detail="Make a new code if you move the site or reinstall the helper.">
            <Button variant="secondary">Pair again</Button>
          </Row>
        </div>
      </Group>
      <Group title="What Wursor can do on this site" description="Wursor always asks you first for anything marked Ask.">
        <div className="app-rows">
          <Row title="Edit pages and posts" detail="Allowed, with your approval before anything goes live.">
            <Toggle label="Edit pages and posts" checked={perms.pages} onChange={set('pages')} />
          </Row>
          <Row title="Change menus and widgets" detail="Allowed, with your approval before anything goes live.">
            <Toggle label="Change menus and widgets" checked={perms.menus} onChange={set('menus')} />
          </Row>
          <Row title="Change theme settings" detail="Wursor will ask you first, every time.">
            <Toggle label="Change theme settings" checked={perms.theme} onChange={set('theme')} />
          </Row>
          <Row title="Install or update plugins" detail="Wursor will ask you first, every time.">
            <Toggle label="Install or update plugins" checked={perms.plugins} onChange={set('plugins')} />
          </Row>
        </div>
      </Group>
      <section className="app-danger" aria-label="Disconnect this site">
        <h2>Disconnect this site</h2>
        <p>Wursor stops watching this site and can no longer make changes. Your site and its content are not touched.</p>
        <Button variant="danger" size="md">
          Disconnect harborbakery.com
        </Button>
      </section>
    </>
  );
}

function MovesOut() {
  return (
    <Definition label="Moves">
      <Button variant="secondary" size="md" leadingIcon="swap">
        Move to my own WordPress
      </Button>
      <Button variant="ghost" size="md" leadingIcon="download">
        Download everything
      </Button>
      <p className="app-def-note">Moving out is free. Your site stays live until you confirm.</p>
    </Definition>
  );
}

const GO_LIVE: GuidedStep[] = [
  { state: 'done', title: 'Site is built and checked', detail: 'Last check passed 9:41 AM.' },
  { state: 'next', title: 'Point harborbakery.com at WeOwn Cloud', detail: 'Add two records at your registrar. We show you exactly which.' },
  { state: 'todo', title: 'Wait for DNS and certificate', detail: 'Usually under an hour. We keep checking.' },
];

function Cloud({ preview }: { preview: boolean }) {
  return (
    <>
      {preview && <Banner tone="warning">This site is on a preview address. Connect your own domain to take it live.</Banner>}
      <div className="app-deftable">
        <Definition label="Where it lives">
          <p className="app-def-strong">Wursor Cloud</p>
          <p className="app-def-text">Hosted for you on WeOwn Cloud. Updates, backups and the certificate are handled.</p>
        </Definition>
        <Definition label="What Wursor can do">
          <AccessBadge access="full" />
          <p className="app-def-text">Pages, theme, plugins and settings, always on a safe copy first.</p>
        </Definition>
        <Definition label="Looked after">
          <p className="app-def-main">Backed up today at 3:02 am</p>
          <p className="app-def-sub">Updated 2 days ago · Up 100% this month</p>
        </Definition>
        <MovesOut />
      </div>
      {preview ? (
        <Group title="Go live on your domain">
          <div className="app-card app-steps">
            <StepList steps={GO_LIVE} label="Go live steps" />
          </div>
        </Group>
      ) : (
        <Group title="Address and email" description="Your domain points at WeOwn Cloud. Wursor renews the certificate for you.">
          <div className="app-rows">
            <Row title="Address" detail="harborbakery.com">
              <span className="app-row-state">Connected</span>
            </Row>
            <Row title="Certificate" detail="Valid until 14 Jan · renews automatically">
              <span className="app-row-state">Valid</span>
            </Row>
            <Row title="Change domain" detail="Point a different domain at this site.">
              <Button variant="secondary">Manage</Button>
            </Row>
          </div>
        </Group>
      )}
    </>
  );
}

function ContentOnly() {
  return (
    <>
      <Banner>Wursor can change pages, posts and images, but not your theme, plugins or settings. Your WordPress account didn’t grant more.</Banner>
      <div className="app-deftable">
        <Definition label="Where it lives">
          <p className="app-def-strong">Your WordPress</p>
          <p className="app-def-text">Hosted by you. Wursor works on a safe copy and publishes here after you approve.</p>
        </Definition>
        <Definition label="What Wursor can do">
          <AccessBadge access="content" />
          <p className="app-def-text">Wursor can change pages, posts and images. Changing your theme needs Full access, and your host does not allow that on this plan.</p>
          <a href="/docs" className="app-link">
            What would change this
          </a>
        </Definition>
        <Definition label="Moves">
          <Button variant="secondary" size="md" leadingIcon="cloud">
            Host on Wursor Cloud
          </Button>
          <p className="app-def-note">Your current site is not changed until you confirm.</p>
        </Definition>
      </div>
      <Group title="Allow more" description="Full access lets Wursor fix errors in your theme and update plugins on a safe copy first.">
        <div className="app-rows">
          <Row title="Give Wursor full access" detail="You’ll sign in to WordPress once more and approve the extra permissions.">
            <Button variant="secondary">Manage</Button>
          </Row>
        </div>
      </Group>
    </>
  );
}

/** One site: its header and tabs, then the tab's content (Figma S3, S4, S6, S7, S8). */
export function SiteDetail({ tab: initialTab = 'overview', host = 'wordpress' }: { tab?: DetailTab; host?: DetailHost }) {
  const [tab, setTab] = useState<DetailTab>(initialTab);
  const narrow = tab === 'where' && host === 'wordpress';
  return (
    <AppShell active="sites" changes={sidebarChanges('working')}>
      <div className="app-detail" data-narrow={narrow ? 'true' : undefined} data-loose={tab === 'where' && host !== 'wordpress' ? 'true' : undefined}>
        <nav aria-label="Breadcrumb" className="app-breadcrumb">
          <a href="/sites">Sites</a>
          <Icon name="chevron-right" size={20} />
          <span aria-current="page">Harbor Bakery</span>
        </nav>
        <PageHeader
          title="Harbor Bakery"
          sub={SUB[host]}
          action={
            <div className="app-pageactions">
              <a href="https://harborbakery.com" className="p-btn p-btn-secondary p-btn-md">
                Open site
              </a>
              <Button variant="primary" size="md" leadingIcon="plus">
                New change
              </Button>
            </div>
          }
        />
        <div role="tablist" aria-label="Site" className="app-tabbar">
          {TABS.map((t) => (
            <Tab key={t.id} label={t.label} selected={tab === t.id} onSelect={() => setTab(t.id)} />
          ))}
        </div>
        <div className="app-tabpanel" role="tabpanel">
          {tab === 'overview' && <Overview />}
          {tab === 'changes' && (
            <p className="app-note">
              Changes to this site are on the <a href="/board">board</a>.
            </p>
          )}
          {tab === 'settings' && (
            <p className="app-note">
              Settings for every site are in <a href="/settings">Settings</a>.
            </p>
          )}
          {tab === 'where' && (host === 'wordpress' ? <Connection /> : host === 'content' ? <ContentOnly /> : <Cloud preview={host === 'preview'} />)}
        </div>
      </div>
    </AppShell>
  );
}
