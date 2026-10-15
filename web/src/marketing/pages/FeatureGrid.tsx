import { Icon, type IconName } from '../../ui/Icon.tsx';
import { SectionHeader } from '../home/SectionHeader.tsx';

export type FeatureCardData = { icon: IconName; title: string; body: string };

type Props = { eyebrow?: string; title: string; subtitle?: string; cards: readonly FeatureCardData[] };

/** A heading and a grid of icon cards, three across. */
export function FeatureGrid({ eyebrow, title, subtitle, cards }: Props) {
  return (
    <section className="m-grid-section">
      <SectionHeader {...(eyebrow ? { eyebrow } : {})} title={title} {...(subtitle ? { subtitle } : {})} />
      <div className="m-featuregrid">
        {cards.map((c) => (
          <div key={c.title} className="m-rule">
            <span className="m-rule-icon">
              <Icon name={c.icon} size={20} />
            </span>
            <h3 className="t-title-s">{c.title}</h3>
            <p className="t-body-m m-section-sub">{c.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
