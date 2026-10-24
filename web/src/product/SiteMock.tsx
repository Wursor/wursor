import { Icon } from '../ui/Icon.tsx';
import { HARBOR } from './harbor-bakery.ts';

/**
 * Harbor Bakery contact page, drawn at its design width of 760 px. Before the change the phone number is
 * plain text; after it, a tap-to-call link with a 44 px touch target.
 */
export function SiteMock({ state, layout = 'desktop' }: { state: 'before' | 'after'; layout?: 'desktop' | 'phone' }) {
  const { phone } = HARBOR;
  return (
    <div className="p-site" data-state={state} data-layout={layout}>
      <div className="p-site-nav">
        <p className="p-site-brand">Harbor Bakery</p>
        <div className="p-site-links">
          <span>Menu</span>
          <span>Order</span>
          <span>About</span>
          <span className="p-site-current">Contact</span>
        </div>
        <span className="p-site-menu">
          <Icon name="list" size={20} />
        </span>
      </div>
      <div className="p-site-rule" />
      <div className="p-site-hero">
        <p className="p-site-title">Find us on Quay Street</p>
        <p className="p-site-sub">Fresh bread from 6:30, every morning.</p>
      </div>
      <div className="p-site-body">
        <div className="p-site-col">
          <p className="p-site-label">Opening hours</p>
          <p className="p-site-line">{'Mon to Fri   6:30 to 17:00'}</p>
          <p className="p-site-line">{'Saturday   7:00 to 15:00'}</p>
          <p className="p-site-line">{'Sunday   Closed'}</p>
        </div>
        <div className="p-site-col">
          <p className="p-site-label">Call or visit</p>
          <p className="p-site-line">12 Quay Street</p>
          {state === 'after' ? (
            <a href={phone.href} className="p-site-phone" data-point="phone">
              <Icon name="smartphone" size={20} />
              <span>{phone.callLabel}</span>
            </a>
          ) : (
            <p className="p-site-phone-plain" data-point="phone">{phone.display}</p>
          )}
        </div>
      </div>
      <div className="p-site-footer">
        <span>12 Quay Street</span>
        <span className={state === 'after' ? 'p-site-footer-link' : undefined} data-point="footer">{phone.display}</span>
      </div>
    </div>
  );
}
