import { Icon } from '../../ui/Icon.tsx';
import { Button } from '../Button.tsx';
import { PLAN_FEATURES, PLANS, PRICING_CONFIRMED, ROUTES } from '../content.ts';
import { SectionHeader } from './SectionHeader.tsx';

/** The three plan cards. Draft numbers: render only when pricing is confirmed. */
export function PlanCards() {
  return (
    <div className="m-plans">
      {PLANS.map((p) => (
        <div key={p.name} className={`m-plan${p.featured ? ' m-plan-featured' : ''}`}>
          <div className="m-plan-head">
            <h3 className="t-title-s">{p.name}</h3>
            {p.featured && <span className="m-plan-tag t-label-m">Most popular</span>}
          </div>
          <p className="m-plan-price">
            <span className="t-title-l">{p.price}</span>
            <span className="t-caption">per month</span>
          </p>
          <p className="t-body-m m-section-sub">{p.allowance}</p>
          <ul className="m-plan-features">
            {PLAN_FEATURES.map((f) => (
              <li key={f} className="t-body-m">
                <Icon name="check" size={20} />
                {f}
              </li>
            ))}
          </ul>
          <Button href={ROUTES.signUp} variant={p.featured ? 'primary' : 'secondary'} className="m-plan-cta">
            Choose plan
          </Button>
        </div>
      ))}
    </div>
  );
}

/**
 * Plan names, prices and allowances show only once they are decided (PRD D-HL-8, PX-13). Until then
 * this section says so and sends people to sign up or to the pricing page.
 */
export function PricingTeaser({ confirmed = PRICING_CONFIRMED }: { confirmed?: boolean }) {
  if (!confirmed) {
    return (
      <section className="m-section">
        <SectionHeader eyebrow="Pricing" title="Simple plans. No surprises." subtitle="Plans and prices will be published before launch." />
        <div className="m-pricing-actions">
          <Button href={ROUTES.signUp} size="lg">
            Get started
          </Button>
          <Button href="/pricing" variant="ghost" size="lg" trailingIcon="arrow-right">
            See pricing
          </Button>
        </div>
      </section>
    );
  }
  return (
    <section className="m-section">
      <SectionHeader
        eyebrow="Pricing"
        title="Simple plans. No surprises."
        subtitle="Hosting on Wursor Cloud is included. Change or cancel any time."
      />
      <PlanCards />
    </section>
  );
}
