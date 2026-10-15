import { Button } from '../Button.tsx';
import { ROUTES } from '../content.ts';

export function ClosingCta() {
  return (
    <section className="m-cta">
      <div className="m-cta-panel">
        <h2 className="t-display-m m-cta-title">Hand off the busywork. Keep the final say.</h2>
        <p className="t-body-l m-cta-sub">Start a site or connect yours, and make your first change in minutes.</p>
        <Button href={ROUTES.signUp} variant="light" size="lg">
          Get started
        </Button>
      </div>
    </section>
  );
}
