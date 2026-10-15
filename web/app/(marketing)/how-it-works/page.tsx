import type { Metadata } from 'next';
import { ActivityCard } from '../../../src/product/ActivityCard.tsx';
import { ApprovalCard } from '../../../src/product/ApprovalCard.tsx';
import { HarborConversation } from '../../../src/product/HarborConversation.tsx';
import { SetupChecklist } from '../../../src/product/SetupChecklist.tsx';
import { Zoom } from '../../../src/ui/Zoom.tsx';
import { Button } from '../../../src/marketing/Button.tsx';
import { ROUTES } from '../../../src/marketing/content.ts';
import { ClosingCta } from '../../../src/marketing/home/ClosingCta.tsx';
import { Faq } from '../../../src/marketing/home/Faq.tsx';
import { FeatureRow } from '../../../src/marketing/pages/FeatureRow.tsx';
import { PageHero } from '../../../src/marketing/pages/PageHero.tsx';
import { ACTIVITY_ROWS, SETUP_STEPS } from '../../../src/marketing/pages/setup-steps.ts';
import { Shell } from '../../../src/marketing/Shell.tsx';

export const metadata: Metadata = { title: 'How it works' };

export default function HowItWorksPage() {
  return (
    <Shell page>
      <PageHero
        eyebrow="How it works"
        title="Four steps. You stay in charge."
        subtitle="From “please change this” to a live, checked page, with your approval in the middle."
      >
        <Button href={ROUTES.signUp} size="lg">
          Get started
        </Button>
      </PageHero>
      <FeatureRow
        eyebrow="Step 1"
        title="Start or connect your site"
        subtitle="Start on Wursor Cloud or connect your WordPress. Wursor works on a safe copy."
        bullets={['Standard themes and plugins just work, on either host', 'Access you can revoke at any time']}
      >
        <SetupChecklist steps={SETUP_STEPS} />
      </FeatureRow>
      <FeatureRow
        reverse
        eyebrow="Step 2"
        title="Ask for a change"
        subtitle="Type what you want in plain words, or point at the page. Wursor explains each step as it goes."
        bullets={['No jargon, no tickets', 'Watch at the level of detail you like']}
        card={{ left: 76, top: 30, width: 448, height: 424 }}
      >
        <div className="m-convowindow">
          <Zoom ratio={448 / 440}>
            <div style={{ width: 440, height: 852 }}>
              <HarborConversation />
            </div>
          </Zoom>
        </div>
      </FeatureRow>
      <FeatureRow
        eyebrow="Step 3"
        title="Review the proof"
        subtitle="Drag to compare before and after, read what Wursor checked, then approve or ask for changes."
        bullets={['Nine plain-language checks', 'Looks right on a phone, tablet and laptop']}
        card={{ left: 60, top: 20, width: 480 }}
      >
        <ApprovalCard />
      </FeatureRow>
      <FeatureRow
        reverse
        eyebrow="Step 4"
        title="Publish, or undo"
        subtitle="One click puts it live. Changed your mind? One click takes it back, and the record shows what happened."
        bullets={['Nothing goes live without you', 'Every step is recorded']}
        card={{ left: 70, top: 119, width: 460 }}
      >
        <ActivityCard rows={ACTIVITY_ROWS} />
      </FeatureRow>
      <Faq />
      <ClosingCta />
    </Shell>
  );
}
