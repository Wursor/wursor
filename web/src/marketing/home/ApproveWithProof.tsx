import { ApprovalCard } from '../../product/ApprovalCard.tsx';
import { Fit } from '../../ui/Fit.tsx';
import { Icon } from '../../ui/Icon.tsx';
import { Button } from '../Button.tsx';
import { SectionHeader } from './SectionHeader.tsx';

const POINTS = [
  'Nine checks, written in plain words',
  'Looks right on a phone, a tablet and a laptop',
  'One click to approve and publish, one click to undo',
] as const;

export function ApproveWithProof() {
  return (
    <section className="m-approve">
      <div className="m-approve-text">
        <SectionHeader
          align="left"
          eyebrow="Approve with proof"
          title="See it before it’s real."
          subtitle="Drag to compare before and after. Read what Wursor checked. Then approve, or ask for changes."
          mobileSubtitle="Drag to compare before and after, read what Wursor checked, then approve."
        />
        <ul className="m-points">
          {POINTS.map((p) => (
            <li key={p} className="t-body-l">
              <Icon name="check-circle" size={20} />
              {p}
            </li>
          ))}
        </ul>
        <Button href="/trust" variant="secondary" size="lg" trailingIcon="arrow-right" className="m-hide-mobile">
          How approval works
        </Button>
      </div>
      <div className="m-approve-visual" aria-hidden="true" inert>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="m-backdrop m-approve-backdrop" src="/marketing/backdrop.svg" alt="" />
        <div className="m-approve-card">
          <Fit designWidth={480} designHeight={441}>
            <ApprovalCard />
          </Fit>
        </div>
      </div>
    </section>
  );
}
