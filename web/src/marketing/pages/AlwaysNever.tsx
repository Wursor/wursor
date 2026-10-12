import { Icon } from '../../ui/Icon.tsx';
import { SectionHeader } from '../home/SectionHeader.tsx';

const ALWAYS = [
  'Works on a safe copy first',
  'Shows you the result before it goes live',
  'Runs checks on every change',
  'Asks before anything is published',
  'Records every step',
] as const;

const NEVER = [
  'Publishes without your approval',
  'Changes your live site while you are reviewing',
  'Deletes content without a way back',
  'Hides what it did or why',
  'Keeps working after you pause it',
] as const;

function Column({ title, items, kind }: { title: string; items: readonly string[]; kind: 'always' | 'never' }) {
  return (
    <div className="m-boundary">
      <h3 className="t-title-m">{title}</h3>
      <ul aria-label={title} className="m-points">
        {items.map((i) => (
          <li key={i} className="t-body-l" data-kind={kind}>
            <Icon name={kind === 'always' ? 'check-circle' : 'x'} size={20} />
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AlwaysNever() {
  return (
    <section className="m-grid-section">
      <SectionHeader eyebrow="Boundaries" title="What Wursor does, and what it never does." />
      <div className="m-boundaries">
        <Column title="Always" items={ALWAYS} kind="always" />
        <Column title="Never" items={NEVER} kind="never" />
      </div>
    </section>
  );
}
