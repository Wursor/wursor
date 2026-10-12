import type { Metadata } from 'next';
import { SetupChecklist } from '../../../src/product/SetupChecklist.tsx';
import { Button } from '../../../src/marketing/Button.tsx';
import { ROUTES } from '../../../src/marketing/content.ts';
import { ClosingCta } from '../../../src/marketing/home/ClosingCta.tsx';
import { Faq } from '../../../src/marketing/home/Faq.tsx';
import { SurfacesShowcase } from '../../../src/marketing/home/SurfacesShowcase.tsx';
import { FeatureGrid } from '../../../src/marketing/pages/FeatureGrid.tsx';
import { FeatureRow } from '../../../src/marketing/pages/FeatureRow.tsx';
import { PageHero } from '../../../src/marketing/pages/PageHero.tsx';
import { SETUP_STEPS } from '../../../src/marketing/pages/setup-steps.ts';
import { Shell } from '../../../src/marketing/Shell.tsx';

export const metadata: Metadata = { title: 'Product' };

export default function ProductPage() {
  return (
    <Shell page>
      <PageHero
        eyebrow="Product"
        title="One workspace for every change."
        subtitle="Talk to Wursor, watch your site change on a safe copy, and approve what you like."
      >
        <Button href={ROUTES.signUp} size="lg">
          Get started
        </Button>
        <Button href="/how-it-works" variant="ghost" size="lg" trailingIcon="arrow-right">
          See how it works
        </Button>
      </PageHero>
      <section className="m-grid-section m-grid-first">
        <SurfacesShowcase />
      </section>
      <FeatureGrid
        eyebrow="What you get"
        title="Everything you need to hand off the work."
        subtitle="Six things that make a change small, visible and reversible."
        cards={[
          { icon: 'sparkles', title: 'Ask in plain words', body: 'Describe the change the way you would tell a colleague. Wursor works out the steps.' },
          { icon: 'monitor', title: 'Live preview on every device', body: 'See the real page on a phone, a tablet and a laptop before anything goes live.' },
          { icon: 'board', title: 'A board for every change', body: 'Ideas, work in progress and finished changes in one place, with what needs you on top.' },
          { icon: 'shield-check', title: 'Proof before you publish', body: 'Nine checks, a before-and-after slider and a plain summary of what changed.' },
          { icon: 'undo', title: 'One-click undo', body: 'Every published change can be taken back in one click, any time.' },
          { icon: 'user', title: 'Built for teams', body: 'Invite teammates, choose who can approve, and keep one shared record.' },
        ]}
      />
      <FeatureRow
        eyebrow="Start"
        title="Choose where it lives. Keep your hands free."
        subtitle="Start on Wursor Cloud, connect your WordPress, or build here and publish to yours. Wursor works on a safe copy and never changes your live site without you."
        bullets={[
          'Works with standard WordPress themes and plugins, hosted by us or by you',
          'Access you can pause or revoke at any time',
          'Nothing installed on your visitors’ side',
        ]}
      >
        <SetupChecklist steps={SETUP_STEPS} />
      </FeatureRow>
      <Faq />
      <ClosingCta />
    </Shell>
  );
}
