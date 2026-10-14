import { CompareSlider } from '../product/CompareSlider.tsx';
import type { PreviewView } from '../product/PreviewToolbar.tsx';
import { SiteMock } from '../product/SiteMock.tsx';
import { BrowserFrame } from './BrowserFrame.tsx';
import { FitFrame } from './FitFrame.tsx';
import { PointOverlay } from './PointOverlay.tsx';
import { ProofView } from './ProofView.tsx';
import { PAGE_URL, type Phase } from './scenario.ts';

/**
 * What the stage shows: the page as it is now (with a marker where Wursor is working), the comparison, or the proof.
 * On a phone the page is drawn in its phone layout at its real size instead of being scaled down.
 */
export function PreviewStage({ phase, view, compact = false }: { phase: Phase; view: PreviewView; compact?: boolean }) {
  if (view === 'proof') return <ProofView />;

  if (view === 'compare') {
    if (compact) {
      return (
        <div className="ws-compare-phone">
          <CompareSlider before={<SiteMock state="before" layout="phone" />} after={<SiteMock state="after" layout="phone" />} />
        </div>
      );
    }
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

  if (compact) {
    return (
      <div className="ws-phone-frame">
        <BrowserFrame url={PAGE_URL}>
          <SiteMock state={after ? 'after' : 'before'} layout="phone" />
        </BrowserFrame>
      </div>
    );
  }

  return (
    <FitFrame overlay={(zoom) => (marker ? <PointOverlay {...marker} zoom={zoom} /> : null)}>
      <BrowserFrame url={PAGE_URL}>
        <SiteMock state={after ? 'after' : 'before'} />
      </BrowserFrame>
    </FitFrame>
  );
}
