import { CheckEvent } from '../product/CheckEvent.tsx';
import { CaptureEvent } from './CaptureEvent.tsx';

/** The Proof tab: the photos Wursor took and the checks it ran, so the owner can see for themselves. */
export function ProofView() {
  return (
    <section className="ws-proof" aria-label="Proof">
      <h2 className="ws-proof-title">Proof from Wursor’s own checks</h2>
      <div className="ws-proof-grid">
        <CaptureEvent when="before" caption="Contact page on a phone" />
        <CaptureEvent when="after" caption="Contact page on a phone" />
      </div>
      <div className="ws-proof-grid">
        <CheckEvent result="passed" title="Checked 9 things. All passed." detail="Phone link works, 3 screen sizes, no new errors, speed unchanged." />
        <CheckEvent result="attention" title="Looked at the footer on small phones" detail="The footer number wraps onto two lines below 340 px wide. Wursor fixed it and re-checked." />
      </div>
    </section>
  );
}
