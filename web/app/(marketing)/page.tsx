import { Footer } from '../../src/marketing/Footer.tsx';
import { ApproveWithProof } from '../../src/marketing/home/ApproveWithProof.tsx';
import { ClosingCta } from '../../src/marketing/home/ClosingCta.tsx';
import { Examples } from '../../src/marketing/home/Examples.tsx';
import { Faq } from '../../src/marketing/home/Faq.tsx';
import { Hero } from '../../src/marketing/home/Hero.tsx';
import { PricingTeaser } from '../../src/marketing/home/PricingTeaser.tsx';
import { ProofStrip } from '../../src/marketing/home/ProofStrip.tsx';
import { SafeByDesign } from '../../src/marketing/home/SafeByDesign.tsx';
import { SectionHeader } from '../../src/marketing/home/SectionHeader.tsx';
import { SurfacesShowcase } from '../../src/marketing/home/SurfacesShowcase.tsx';
import { WatchTheWork } from '../../src/marketing/home/WatchTheWork.tsx';
import { Nav } from '../../src/marketing/Nav.tsx';

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ProofStrip />
        <section className="m-section m-section-first">
          <SectionHeader
            eyebrow="One screen"
            title="Talk. Watch. Decide."
            subtitle="The workspace puts the conversation, your live site and the to-do board side by side, so you always know what Wursor is doing."
            mobileSubtitle="The workspace puts the conversation, your live site and the board side by side."
          />
          <SurfacesShowcase />
        </section>
        <WatchTheWork />
        <ApproveWithProof />
        <SafeByDesign />
        <Examples />
        <PricingTeaser />
        <Faq />
        <ClosingCta />
      </main>
      <Footer />
    </>
  );
}
