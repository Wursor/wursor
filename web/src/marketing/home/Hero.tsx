import { Workspace } from '../../product/Workspace.tsx';
import { Fit } from '../../ui/Fit.tsx';
import { Icon } from '../../ui/Icon.tsx';
import Link from 'next/link';
import { Button } from '../Button.tsx';
import { ROUTES, TAGLINE } from '../content.ts';

export function Hero() {
  return (
    <section className="m-hero">
      <Link href="/trust" className="m-announce">
        <span className="m-announce-new t-label-s">New</span>
        <span className="t-label-m">Approve with proof: nine checks on every change</span>
        <Icon name="chevron-right" size={20} />
      </Link>
      <h1 className="t-display-xl m-hero-title">{TAGLINE}</h1>
      <p className="t-body-l m-hero-sub">Tell Wursor what to change. Watch it work. Approve what you like.</p>
      <div className="m-hero-actions">
        <Button href={ROUTES.signUp} size="lg">
          Get started
        </Button>
        <Button href="/how-it-works" variant="ghost" size="lg" trailingIcon="arrow-right">
          See how it works
        </Button>
      </div>
      <p className="t-caption m-hero-footnote">For WordPress sites · We host it, or you do</p>
      <div className="m-hero-visual">
        <div className="m-visual" aria-hidden="true" inert>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="m-backdrop" src="/marketing/backdrop.svg" alt="" />
          <div className="m-hero-shot">
            <Fit designWidth={1440} designHeight={900} initialScale={1100 / 1440} minScale={0.454}>
              <Workspace />
            </Fit>
          </div>
        </div>
      </div>
    </section>
  );
}
