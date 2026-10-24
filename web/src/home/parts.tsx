import type { ReactNode } from 'react';
import { Icon, type IconName } from '../ui/Icon.tsx';
import { Banner } from '../ui/Banner.tsx';
import { Button } from '../product/Button.tsx';
import { SiteMock } from '../product/SiteMock.tsx';
import { StatusPill, type Status } from '../product/StatusPill.tsx';

/** The page's title and one line under it, with an optional action on the right. */
export function PageHeader({ title, sub, action }: { title: string; sub: string; action?: ReactNode }) {
  return (
    <header className="app-pageheader">
      <div className="app-pageheader-text">
        <h1>{title}</h1>
        <p>{sub}</p>
      </div>
      {action}
    </header>
  );
}

export type StatData = { label: string; value: string; hint: string; tone?: 'attention' };

/** Four small facts at the top of Home. */
export function Stats({ stats }: { stats: readonly StatData[] }) {
  return (
    <ul aria-label="At a glance" className="app-stats">
      {stats.map((s) => (
        <li key={s.label} className="app-stat" data-tone={s.tone}>
          <span className="app-stat-label">{s.label}</span>
          <span className="app-stat-value">{s.value}</span>
          <span className="app-stat-hint">{s.hint}</span>
        </li>
      ))}
    </ul>
  );
}

/** A heading with a link on its right, for example "Needs you" and "See all". */
export function SectionHeading({ title, link, onLink }: { title: string; link?: string; onLink?: (() => void) | undefined }) {
  return (
    <div className="app-sectionheading">
      <h2>{title}</h2>
      {link && (
        <button type="button" onClick={onLink}>
          {link}
        </button>
      )}
    </div>
  );
}

type AttentionProps = { tone: 'question' | 'ready' | 'problem'; title: string; body: string; time: string; action: string; onAction?: (() => void) | undefined };
const ATTENTION_ICON: Record<AttentionProps['tone'], IconName> = { question: 'pointer', ready: 'check-circle', problem: 'alert-triangle' };

/** One thing that needs the owner: what it is, how long ago, and the button that deals with it. */
export function AttentionRow({ tone, title, body, time, action, onAction }: AttentionProps) {
  return (
    <div className="app-attention" data-tone={tone}>
      <span className="app-attention-icon" aria-hidden="true">
        <Icon name={ATTENTION_ICON[tone]} size={20} />
      </span>
      <div className="app-attention-text">
        <p className="app-attention-title">{title}</p>
        <p className="app-attention-body">{body}</p>
      </div>
      <span className="app-attention-time">{time}</span>
      <Button variant="secondary" onClick={onAction}>
        {action}
      </Button>
    </div>
  );
}

export type LogRow = { icon: IconName; text: string; trailing: string; tone?: 'success' };

/** A short list in a card: an icon, one line, and a time or result on the right. */
export function LogList({ label, rows, href }: { label: string; rows: readonly LogRow[]; href?: string }) {
  return (
    <ul aria-label={label} className="app-log">
      {rows.map((r) => (
        <li key={r.text} {...(href ? {} : { className: 'app-logrow' })}>
          {href ? (
            <a href={href} className="app-logrow">
              <span className="app-logrow-icon" data-tone={r.tone} aria-hidden="true">
                <Icon name={r.icon} size={20} />
              </span>
              <span className="app-logrow-text">{r.text}</span>
              <span className="app-logrow-trailing">{r.trailing}</span>
            </a>
          ) : (
            <>
              <span className="app-logrow-icon" data-tone={r.tone} aria-hidden="true">
                <Icon name={r.icon} size={20} />
              </span>
              <span className="app-logrow-text">{r.text}</span>
              <span className="app-logrow-trailing">{r.trailing}</span>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}

type SiteCardProps = { name: string; url: string; status: Status; detail: string; href: string; actionLabel?: string; actionHref?: string };

/** The site in a card: a small picture of it, its address and state, and a way to open it. */
export function SiteCard({ name, url, status, detail, href, actionLabel = 'Open site', actionHref }: SiteCardProps) {
  return (
    <section aria-label="Your site" className="app-card app-sitecard">
      <div className="app-sitecard-preview" aria-hidden="true">
        <div className="app-sitecard-scale">
          <SiteMock state="after" />
        </div>
      </div>
      <div className="app-sitecard-row">
        <div className="app-sitecard-name">
          <p>{name}</p>
          <p>{url}</p>
        </div>
        <StatusPill status={status} />
      </div>
      <p className="app-sitecard-detail">{detail}</p>
      <a href={actionHref ?? href} className="p-btn p-btn-secondary p-btn-md app-fullwidth">
        {actionLabel}
      </a>
    </section>
  );
}

/** Things the owner could ask Wursor for, taken from what it found on the site. */
export function TryAsking({ ideas }: { ideas: readonly string[] }) {
  return (
    <section aria-label="Try asking" className="app-card app-tryasking">
      <h2>Try asking</h2>
      <ul>
        {ideas.map((i) => (
          <li key={i}>
            <a href={`/board?composer=1&text=${encodeURIComponent(i)}`} className="app-idea">
              <Icon name="sparkles" size={20} />
              <span>{i}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** The few things an owner can do about a problem, in order of how safe they are. */
export function OptionsCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section aria-label={title} className="app-card app-options">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export { Banner };
