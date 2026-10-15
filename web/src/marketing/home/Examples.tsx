import { SiteMock } from '../../product/SiteMock.tsx';
import { Icon } from '../../ui/Icon.tsx';
import { Zoom } from '../../ui/Zoom.tsx';
import { EXAMPLES } from '../content.ts';
import { SectionHeader } from './SectionHeader.tsx';

function Thumb({ state }: { state: 'before' | 'after' }) {
  return (
    <div className="m-thumb" data-state={state}>
      <Zoom ratio={130 / 760}>
        <SiteMock state={state} />
      </Zoom>
      <span className="m-thumb-label t-caption">{state === 'before' ? 'Before' : 'After'}</span>
    </div>
  );
}

export function Examples() {
  return (
    <section className="m-section">
      <SectionHeader
        eyebrow="Examples"
        title="Small jobs, done in minutes."
        subtitle="Real requests from real owners. Each one ends with a preview you approve."
      />
      <ul aria-label="Examples" className="m-carousel">
        {EXAMPLES.map((e) => (
          <li key={e.title} className="m-example">
            <div className="m-thumbs" aria-hidden="true">
              <Thumb state="before" />
              <Thumb state="after" />
            </div>
            <p className="t-title-s">{e.title}</p>
            <p className="m-example-meta t-caption">
              <Icon name="clock" size={20} />
              {e.meta}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
