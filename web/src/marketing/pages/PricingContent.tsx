import { Button } from '../Button.tsx';
import { PRICING_CONFIRMED, ROUTES } from '../content.ts';
import { Faq } from '../home/Faq.tsx';
import { ClosingCta } from '../home/ClosingCta.tsx';
import { PlanCards } from '../home/PricingTeaser.tsx';
import { ComparePlans } from './ComparePlans.tsx';
import { PageHero } from './PageHero.tsx';

/**
 * The pricing page. Plans, prices, allowances and the free trial are shown only once they are decided
 * (PRD D-HL-8, PX-13). Until then the page says so and still leads to sign-up.
 */
export function PricingContent({ confirmed = PRICING_CONFIRMED }: { confirmed?: boolean }) {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Simple plans. No surprises."
        subtitle={
          confirmed
            ? 'Start free for 14 days. Hosting on Wursor Cloud is included. Change or cancel any time.'
            : 'Plans and prices will be published before launch.'
        }
      >
        {!confirmed && (
          <Button href={ROUTES.signUp} size="lg">
            Get started
          </Button>
        )}
      </PageHero>
      {confirmed && (
        <>
          <section className="m-grid-section">
            <PlanCards />
            <p className="t-caption m-draft-note">Draft pricing. Final plans and prices will be confirmed before launch.</p>
          </section>
          <ComparePlans />
        </>
      )}
      <Faq />
      <ClosingCta />
    </>
  );
}
