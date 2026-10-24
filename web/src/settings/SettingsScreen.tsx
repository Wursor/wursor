'use client';

import { useState } from 'react';
import { AppShell } from '../shell/AppShell.tsx';
import { Avatar } from '../product/Avatar.tsx';
import { Button } from '../product/Button.tsx';
import { RiskChip, type RiskLevel } from '../product/RiskChip.tsx';
import { Icon, type IconName } from '../ui/Icon.tsx';
import { sidebarChanges } from '../workspace/scenario.ts';
import { PageHeader } from '../home/parts.tsx';
import { UsageMeter } from '../sites/UsageMeter.tsx';
import { useFeedback } from '../system/Feedback.tsx';
import { Field, Section, SettingRow } from './controls.tsx';

export type SettingsSection = 'workspace' | 'safety' | 'team' | 'billing' | 'notifications' | 'account';

const NAV: ReadonlyArray<{ id: SettingsSection; label: string; icon: IconName }> = [
  { id: 'workspace', label: 'Workspace', icon: 'building' },
  { id: 'safety', label: 'Safety and approvals', icon: 'shield-check' },
  { id: 'team', label: 'Team', icon: 'user' },
  { id: 'billing', label: 'Billing', icon: 'credit-card' },
  { id: 'notifications', label: 'Notifications', icon: 'bell' },
  { id: 'account', label: 'Account', icon: 'key' },
];

function Rows({ children, label }: { children: React.ReactNode; label?: string }) {
  return (
    <div className="app-rows" role={label ? 'group' : undefined} aria-label={label}>
      {children}
    </div>
  );
}

function Danger({ title, text, button, confirmBody, done }: { title: string; text: string; button: string; confirmBody: string; done: string }) {
  const { confirm } = useFeedback();
  return (
    <section className="app-danger" aria-label={title}>
      <h2>{title}</h2>
      <p>{text}</p>
      <Button variant="danger" size="md" onClick={() => confirm({ title: `${title}?`, body: confirmBody, confirmLabel: button, tone: 'danger', done })}>
        {button}
      </Button>
    </section>
  );
}

function Workspace() {
  const [name, setName] = useState('Harbor Bakery');
  return (
    <>
      <Section title="Workspace">
        <div className="app-rows">
          <div className="app-fields">
            <Field label="Workspace name" value={name} onChange={setName} helper="Shown to teammates and on safe copies." />
          </div>
          <SettingRow title="I use Wursor as" detail="This sets sensible defaults. You can change it any time." control="select" options={['Owner', 'Agency', 'Freelancer']} initial="Owner" />
          <SettingRow title="Time zone" detail="Used for “today” and for quiet hours." control="select" options={['Central Time (Austin)', 'Eastern Time (New York)', 'Pacific Time (Los Angeles)', 'London']} initial="Central Time (Austin)" />
          <SettingRow title="Language" detail="Wursor writes to you in this language." control="select" options={['English', 'Español', 'Français', 'Deutsch']} initial="English" />
        </div>
      </Section>
      <Danger
        title="Delete this workspace"
        text="Removes your account of this workspace from Wursor, including its history and safe copies. Your WordPress sites are not touched. Sites hosted on Wursor Cloud are deleted after 30 days unless you move them out first."
        button="Delete workspace"
        confirmBody="This can’t be undone from here. Your WordPress sites are not touched."
        done="Workspace deletion is scheduled. Check your email to finish."
      />
    </>
  );
}

const RATINGS: ReadonlyArray<{ level: RiskLevel; text: string }> = [
  { level: 'everyday', text: 'Wording, images and small layout tweaks.' },
  { level: 'noticeable', text: 'Visible changes to a page’s look or structure.' },
  { level: 'sensitive', text: 'Prices, forms, legal text and anything customers rely on.' },
  { level: 'careful', text: 'Settings, plugins and anything that could affect the whole site.' },
];

function Safety() {
  return (
    <>
      <Section title="When Wursor can act" description="You are always in charge of what goes live.">
        <Rows>
          <SettingRow title="Default mode" detail="Ask first: Wursor shows you the result and waits. Act and tell: Wursor publishes everyday changes and tells you." control="select" options={['Ask first', 'Act and tell']} initial="Ask first" />
        </Rows>
      </Section>
      <Section title="Always ask me before" description="These can’t be turned off for sensitive changes.">
        <Rows>
          <SettingRow title="Publishing to your live site" detail="Every change waits for your approval." control="locked" />
          <SettingRow title="Changing prices, legal text or contact details" detail="Marked Sensitive or Careful." control="locked" />
          <SettingRow title="Updating plugins or themes" detail="Updates can change how your site looks." control="toggle" initial />
          <SettingRow title="Deleting pages, posts or media" detail="Wursor keeps a copy for 30 days." control="locked" />
        </Rows>
      </Section>
      <Section title="Safe copies and undo">
        <Rows>
          <SettingRow title="Safe copy before every publish" detail="So any change can be undone in one click." control="locked" />
          <SettingRow title="Keep safe copies for" detail="Older copies are removed automatically." control="select" options={['7 days', '30 days', '90 days']} initial="30 days" />
        </Rows>
      </Section>
      <Section title="How Wursor rates a change">
        <ul aria-label="Risk levels" className="app-ratings">
          {RATINGS.map((r) => (
            <li key={r.level}>
              <RiskChip level={r.level} />
              <span>{r.text}</span>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}

const PEOPLE = [
  { initials: 'AO', name: 'Amara Okoye', email: 'amara@harborbakery.com', role: 'Owner', invited: false },
  { initials: 'CE', name: 'Chidi Eze', email: 'chidi@harborbakery.com', role: 'Approver', invited: false },
  { initials: 'TB', name: 'Tola Bello', email: 'tola@harborbakery.com', role: 'Editor', invited: true },
];
const ROLES = [
  ['Owner', 'Everything, including billing and deleting the workspace.'],
  ['Approver', 'Reviews and publishes changes.'],
  ['Editor', 'Asks Wursor for changes. Can’t publish.'],
  ['Viewer', 'Can look, can’t change.'],
] as const;

function Team() {
  const { notify, confirm } = useFeedback();
  const [people, setPeople] = useState<ReadonlyArray<(typeof PEOPLE)[number]>>(PEOPLE);
  const [inviting, setInviting] = useState(false);
  const [email, setEmail] = useState('');
  const [problem, setProblem] = useState('');
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const send = () => {
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setProblem('Enter a full email address, like name@company.com.');
      return;
    }
    const initials = value.slice(0, 2).toUpperCase();
    setPeople([...people, { initials, name: value.split('@')[0] ?? value, email: value, role: 'Editor', invited: true }]);
    setEmail('');
    setProblem('');
    setInviting(false);
    notify(`Invite sent to ${value}`);
  };
  return (
    <>
      <Section
        title="Teammates"
        action={
          <Button variant="primary" leadingIcon="plus" onClick={() => setInviting(!inviting)}>
            Invite
          </Button>
        }
      >
        {inviting && (
          <form
            className="app-invite"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <Field label="Email to invite" value={email} onChange={setEmail} helper={problem || 'They’ll join as an Editor. You can change that later.'} />
            <Button variant="primary" size="md" onClick={send}>
              Send invite
            </Button>
          </form>
        )}
        <ul aria-label="Teammates" className="app-people">
          {people.map((p) => (
            <li key={p.email}>
              <Avatar kind="initials" initials={p.initials} name={p.name} size="md" />
              <span className="app-people-text">
                <span>{p.name}</span>
                <span>{p.email}</span>
              </span>
              {p.invited && <span className="p-tag">Invited</span>}
              <span className="app-people-role">{p.role}</span>
              {p.role !== 'Owner' ? (
                <span className="app-people-menu">
                  {menuFor === p.email && (
                    <button
                      type="button"
                      className="app-people-remove"
                      onClick={() => {
                        setMenuFor(null);
                        confirm({
                          title: `Remove ${p.name}?`,
                          body: 'They lose access to this workspace straight away. Their past changes stay in Activity.',
                          confirmLabel: `Remove ${p.name.split(' ')[0]}`,
                          tone: 'danger',
                          done: `${p.name} was removed`,
                          onConfirm: () => setPeople((all) => all.filter((x) => x.email !== p.email)),
                        });
                      }}
                    >
                      Remove
                    </button>
                  )}
                  <button
                    type="button"
                    className="app-siterow-menu"
                    aria-label={`More for ${p.name}`}
                    aria-expanded={menuFor === p.email}
                    onClick={() => setMenuFor(menuFor === p.email ? null : p.email)}
                  >
                    <Icon name="dots" size={16} />
                  </button>
                </span>
              ) : (
                <span className="app-siterow-menu" aria-hidden="true" />
              )}
            </li>
          ))}
        </ul>
      </Section>
      <Section title="Approvals">
        <Rows>
          <SettingRow title="Let an approver publish when I’m away" detail="Approvers can approve changes, but can’t change settings or billing." control="toggle" initial />
          <SettingRow title="Changes that need two people" detail="For Sensitive and Careful changes only." control="select" options={['Off', 'Sensitive and Careful', 'Everything']} initial="Off" />
        </Rows>
      </Section>
      <Section title="Roles">
        <ul aria-label="Roles" className="app-roles">
          {ROLES.map(([role, text]) => (
            <li key={role}>
              <span>{role}</span>
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}

const FEATURES = ['Unlimited changes with approval', 'Safe copy before every publish', 'Proof for every change', 'Undo for 30 days'];
const PLANS = [
  { name: 'Starter', price: '$19', detail: 'For one site that changes now and then.' },
  { name: 'Studio', price: '$49', detail: 'For one busy site, or a few small ones.', current: true },
  { name: 'Agency', price: '$149', detail: 'For many client sites with approvals.' },
];

function Billing() {
  const { confirm } = useFeedback();
  const [current, setCurrent] = useState('Studio');
  return (
    <>
      <div className="app-plans">
        {PLANS.map((p) => (
          <section key={p.name} aria-label={`${p.name} plan`} className="app-plan" data-current={p.name === current ? 'true' : undefined}>
            <h2>{p.name}</h2>
            <p className="app-plan-price">
              <span>{p.price}</span>
              <span>per month</span>
            </p>
            <p className="app-plan-detail">{p.detail}</p>
            <ul>
              {FEATURES.map((f) => (
                <li key={f}>
                  <Icon name="check" size={20} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            {p.name === current ? (
              <span className="app-plan-current">Current plan</span>
            ) : (
              <button
                type="button"
                className="p-btn p-btn-secondary p-btn-md app-plan-choose"
                onClick={() =>
                  confirm({
                    title: `Switch to ${p.name}?`,
                    body: `${p.price} per month from your next invoice. You can switch back any time.`,
                    confirmLabel: `Switch to ${p.name}`,
                    done: `You’re on ${p.name}`,
                    onConfirm: () => setCurrent(p.name),
                  })
                }
              >
                Choose plan
              </button>
            )}
          </section>
        ))}
      </div>
      <section aria-label="This month on Studio" className="app-card app-usage">
        <h2>This month on Studio</h2>
        <UsageMeter label="Changes" value="12 of 50" fill={12 / 50} />
        <UsageMeter label="Safe copies" value="9 of 30" fill={9 / 30} />
        <UsageMeter label="Sites" value="1 of 3" fill={1 / 3} />
        <UsageMeter label="Cloud hosting" value="4 of 20 GB" fill={4 / 20} />
      </section>
      <Section title="Payment and invoices">
        <Rows>
          <SettingRow title="Payment method" detail="Visa ending 4242." control="button" label="Update" done="Payment details can be updated once billing is connected." />
          <SettingRow title="Invoice, September" detail="Paid 1 Sep. $49.00." control="button" label="Download" done="Invoices become available to download once billing is connected." />
          <SettingRow title="Invoice, August" detail="Paid 1 Aug. $49.00." control="button" label="Download" done="Invoices become available to download once billing is connected." />
        </Rows>
      </Section>
    </>
  );
}

function Notifications() {
  return (
    <>
      <Section title="Email">
        <Rows>
          <SettingRow title="Wursor needs me" detail="A question, or something to approve." control="toggle" initial />
          <SettingRow title="A change is ready" detail="The result is ready to look at." control="toggle" initial />
          <SettingRow title="A change is published" detail="A short note that it’s live." control="toggle" initial={false} />
          <SettingRow title="Weekly summary" detail="What changed, and what Wursor noticed." control="toggle" initial />
        </Rows>
      </Section>
      <Section title="Phone and desktop">
        <Rows>
          <SettingRow title="Wursor needs me" detail="Pushed as soon as Wursor is waiting." control="toggle" initial />
          <SettingRow title="Something went wrong" detail="Your site is down or a check failed." control="toggle" initial />
        </Rows>
      </Section>
      <Section title="Quiet hours" description="Nothing is pushed to your phone during quiet hours, except if your site goes down.">
        <Rows>
          <SettingRow title="Quiet hours" detail="Email still arrives." control="select" options={['Off', '8 pm to 7 am', '10 pm to 8 am']} initial="8 pm to 7 am" />
        </Rows>
      </Section>
    </>
  );
}

function Account() {
  const [name, setName] = useState('Amara Okoye');
  const [email, setEmail] = useState('amara@harborbakery.com');
  return (
    <>
      <Section title="Profile">
        <div className="app-rows">
          <div className="app-fields">
            <Field label="Your name" value={name} onChange={setName} />
            <Field label="Email" value={email} onChange={setEmail} helper="To change your email, we’ll send a code to both addresses." />
          </div>
        </div>
      </Section>
      <Section title="Sign-in">
        <Rows>
          <SettingRow title="Google" detail="Signed in with amara@harborbakery.com." control="state" text="Connected" />
          <SettingRow title="Two-step sign-in" detail="Ask for a code from your phone when signing in." control="toggle" initial />
        </Rows>
      </Section>
      <Section title="Appearance">
        <Rows>
          <SettingRow title="Theme" detail="Follows your computer by default." control="select" options={['System', 'Light', 'Dark']} initial="System" />
        </Rows>
      </Section>
      <Danger
        title="Delete my account"
        text="Removes you from every workspace. Workspaces you own must be transferred or deleted first."
        button="Delete account"
        confirmBody="You’ll be removed from every workspace. This can’t be undone from here."
        done="Account deletion started. Check your email to finish."
      />
    </>
  );
}

const BODY: Record<SettingsSection, () => React.JSX.Element> = { workspace: Workspace, safety: Safety, team: Team, billing: Billing, notifications: Notifications, account: Account };

/** Settings: a short list of places on the left, the chosen one on the right (Figma T1 to T6). */
export function SettingsScreen({ section }: { section: SettingsSection }) {
  const Body = BODY[section];
  return (
    <AppShell active="more" changes={sidebarChanges('working')}>
      <PageHeader title="Settings" sub="Everything about how Wursor works for you and Harbor Bakery." />
      <div className="app-settings">
        <nav aria-label="Settings" className="app-settingsnav">
          {NAV.map((n) => (
            <a key={n.id} href={`/settings/${n.id}`} aria-current={n.id === section ? 'page' : undefined}>
              <Icon name={n.icon} size={18} />
              <span>{n.label}</span>
            </a>
          ))}
        </nav>
        <div className="app-settingsbody">
          <Body />
        </div>
      </div>
    </AppShell>
  );
}
