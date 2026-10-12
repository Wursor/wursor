import { Icon, type IconName } from '../../ui/Icon.tsx';
import { SectionHeader } from './SectionHeader.tsx';

const RULES: ReadonlyArray<{ icon: IconName; title: string; body: string }> = [
  {
    icon: 'shield',
    title: 'Works on a safe copy',
    body: 'Every change is made on a copy of your site first, so your live pages stay untouched until you say so.',
  },
  {
    icon: 'check-circle',
    title: 'Nothing goes live without you',
    body: 'Wursor shows you the result and waits. Nothing is published without your approval.',
  },
  {
    icon: 'list',
    title: 'Everything is recorded',
    body: 'Every step, check and decision is written down, so you can see exactly what happened and why.',
  },
  {
    icon: 'undo',
    title: 'Undo in one click',
    body: 'If you change your mind, one click puts your site back the way it was.',
  },
];

/** The four rules as cards. Used on the home page and on the Trust page. */
export function SafetyRules() {
  return (
    <div className="m-rules">
      {RULES.map((r) => (
        <div key={r.title} className="m-rule">
          <span className="m-rule-icon">
            <Icon name={r.icon} size={20} />
          </span>
          <h3 className="t-title-s">{r.title}</h3>
          <p className="t-body-m m-section-sub">{r.body}</p>
        </div>
      ))}
    </div>
  );
}

export function SafeByDesign() {
  return (
    <section className="m-section">
      <SectionHeader
        eyebrow="Safe by design"
        title="Nothing goes live until you say so."
        subtitle="Four rules Wursor can’t break, however you set it up."
        mobileSubtitle="Four rules Wursor can’t break."
      />
      <SafetyRules />
    </section>
  );
}
