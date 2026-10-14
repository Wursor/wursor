import { CompareSlider } from '../product/CompareSlider.tsx';
import type { PreviewView } from '../product/PreviewToolbar.tsx';
import { SiteMock } from '../product/SiteMock.tsx';
import { BrowserFrame } from './BrowserFrame.tsx';
import { FitFrame } from './FitFrame.tsx';
import { PointOverlay } from './PointOverlay.tsx';
import { ProofView } from './ProofView.tsx';
import { PAGE_URL, type Phase } from './scenario.ts';

/** What the stage shows: the page as it is now (with a marker where Wursor is working), the comparison, or the proof. */
export function PreviewStage({ phase, view }: { phase: Phase; view: PreviewView }) {
  if (view === 'proof') return <ProofView />;

  if (view === 'compare') {
    return (
      <FitFrame>
        <div className="ws-compare">
          <CompareSlider before={<SiteMock state="before" />} after={<SiteMock state="after" />} />
        </div>
      </FitFrame>
    );
  }

  const after = phase === 'working' || phase === 'ready' || phase === 'publishing' || phase === 'published';
  const marker =
    phase === 'plan'
      ? { target: 'phone', label: 'Phone number', pad: { x: 10, y: 6 }, cursor: false }
      : phase === 'working'
        ? { target: 'phone', label: 'Editing', pad: { x: 10, y: 4 }, cursor: true }
        : phase === 'needs-you'
          ? { target: 'footer', label: 'Footer', pad: { x: 4, y: 2 }, cursor: false }
          : null;

  return (
    <FitFrame overlay={(zoom) => (marker ? <PointOverlay {...marker} zoom={zoom} /> : null)}>
      <BrowserFrame url={PAGE_URL}>
        <SiteMock state={after ? 'after' : 'before'} />
      </BrowserFrame>
    </FitFrame>
  );
}
