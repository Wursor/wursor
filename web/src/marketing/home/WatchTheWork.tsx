import type { Density } from '../../product/ConversationPanel.tsx';
import { Workspace } from '../../product/Workspace.tsx';
import { Fit } from '../../ui/Fit.tsx';
import { SectionHeader } from './SectionHeader.tsx';

const LEVELS: ReadonlyArray<{ density: Density; title: string; description: string }> = [
  { density: 'headline', title: 'Headline', description: 'Only what changed and what needs you.' },
  { density: 'steps', title: 'Steps', description: 'Each step, in a sentence. The default.' },
  { density: 'everything', title: 'Everything', description: 'Every look, edit, check and decision.' },
];

export function WatchTheWork() {
  return (
    <section className="m-section">
      <SectionHeader
        eyebrow="The play-by-play"
        title="Watch the work, your way."
        subtitle="Wursor narrates every step. Choose how much you see: just the headlines, the steps, or everything it does."
        mobileTitle="Watch every step."
        mobileSubtitle="Choose how much you see: the headlines, the steps, or everything."
      />
      <div className="m-densities">
        {LEVELS.map((l) => (
          <div key={l.density} className="m-density">
            <div className="m-density-head">
              <h3 className="t-title-m">{l.title}</h3>
              <p className="t-body-m m-section-sub">{l.description}</p>
            </div>
            <div className="m-crop" aria-hidden="true" inert>
              <Fit designWidth={440} designHeight={600}>
                <div className="m-crop-frame">
                  <div className="m-crop-shot">
                    <Workspace defaultDensity={l.density} />
                  </div>
                </div>
              </Fit>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
