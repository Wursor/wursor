import type { ReactNode } from 'react';

/** Shows `desktop` on wide screens and `mobile` on narrow ones. The design words a few lines more briefly on a phone. */
export function Responsive({ desktop, mobile }: { desktop: ReactNode; mobile?: ReactNode }) {
  if (mobile === undefined) return <>{desktop}</>;
  return (
    <>
      <span className="m-d">{desktop}</span>
      <span className="m-m">{mobile}</span>
    </>
  );
}

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  mobileTitle?: string;
  mobileSubtitle?: string;
  align?: 'center' | 'left';
  /** Use h1 for the page's first heading only. */
  as?: 'h1' | 'h2';
};

/** Eyebrow, headline and one supporting sentence. Centred by default. */
export function SectionHeader({ eyebrow, title, subtitle, mobileTitle, mobileSubtitle, align = 'center', as: Heading = 'h2' }: Props) {
  return (
    <div className={`m-section-header m-align-${align}`}>
      {eyebrow && <p className="t-overline m-eyebrow">{eyebrow}</p>}
      <Heading className="t-display-l m-section-title">
        <Responsive desktop={title} mobile={mobileTitle} />
      </Heading>
      {subtitle && (
        <p className="t-body-l m-section-sub">
          <Responsive desktop={subtitle} mobile={mobileSubtitle} />
        </p>
      )}
    </div>
  );
}
