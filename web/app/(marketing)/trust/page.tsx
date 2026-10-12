import type { Metadata } from 'next';
import { ActivityCard } from '../../../src/product/ActivityCard.tsx';
import { Button } from '../../../src/marketing/Button.tsx';
import { ROUTES } from '../../../src/marketing/content.ts';
import { ClosingCta } from '../../../src/marketing/home/ClosingCta.tsx';
import { Faq } from '../../../src/marketing/home/Faq.tsx';
import { SafetyRules } from '../../../src/marketing/home/SafeByDesign.tsx';
import { AlwaysNever } from '../../../src/marketing/pages/AlwaysNever.tsx';
import { FeatureGrid } from '../../../src/marketing/pages/FeatureGrid.tsx';
import { FeatureRow } from '../../../src/marketing/pages/FeatureRow.tsx';
import { PageHero } from '../../../src/marketing/pages/PageHero.tsx';
import { ACTIVITY_ROWS } from '../../../src/marketing/pages/setup-steps.ts';
import { Shell } from '../../../src/marketing/Shell.tsx';

export const metadata: Metadata = { title: 'Trust and safety' };

export default function TrustPage() {
  return (
    <Shell page>
      <PageHero eyebrow="Trust" title="Safe by design, not by promise." subtitle="Four rules Wursor can’t break, however you set it up.">
        <Button href={ROUTES.signUp} size="lg">
          Get started
        </Button>
      </PageHero>
      <section className="m-grid-section m-grid-tight">
        <SafetyRules />
      </section>
      <AlwaysNever />
      <FeatureRow
        eyebrow="Everything is recorded"
        title="A record you can read."
        subtitle="Every request, check and decision is written down in plain words, so you can see what happened and why."
        bullets={['Who asked, who approved, and when', 'Checks and results, kept with each change']}
        card={{ left: 70, top: 119, width: 460 }}
      >
        <ActivityCard rows={ACTIVITY_ROWS} />
      </FeatureRow>
      <FeatureGrid
        eyebrow="Your control"
        title="You decide who can do what."
        cards={[
          {
            icon: 'key',
            title: 'Access you control',
            body: 'Pause or revoke Wursor’s access at any time. Choose Full access or Content only, and move your site in or out whenever you like.',
          },
          { icon: 'user', title: 'Roles for your team', body: 'Choose who can ask for changes, who can approve and who can publish.' },
          { icon: 'lock', title: 'Sensitive changes need more', body: 'Higher-risk changes ask for an extra confirmation before they go live.' },
        ]}
      />
      <Faq />
      <ClosingCta />
    </Shell>
  );
}
