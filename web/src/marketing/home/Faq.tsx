import { Icon } from '../../ui/Icon.tsx';
import { FAQ } from '../content.ts';
import { SectionHeader } from './SectionHeader.tsx';

export function Faq() {
  return (
    <section className="m-section">
      <SectionHeader eyebrow="FAQ" title="Questions, answered." />
      <div className="m-faq">
        {FAQ.map((item) => (
          <details key={item.question} className="m-faq-item" open={item.open}>
            <summary className="m-faq-question t-title-s">
              <span>{item.question}</span>
              <Icon name="chevron-down" size={20} className="m-faq-chevron" />
            </summary>
            <p className="t-body-m m-section-sub">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
