import { Icon } from '../ui/Icon.tsx';

type Props = {
  name: string;
  url: string;
  /** Recognised shows the WordPress version; connected shows Connected and the read-only reassurance; live shows Live and where it is hosted. */
  state: 'recognised' | 'connected' | 'live';
};

/** Shown the moment an address is recognised as WordPress, and again once it is connected (Figma "Site Confirm Card"). */
export function SiteConfirmCard({ name, url, state }: Props) {
  return (
    <div className="ob-siteconfirm" data-state={state}>
      <div className="ob-siteconfirm-top">
        <span className="ob-siteconfirm-favicon t-title-s" aria-hidden="true">
          {name.charAt(0).toUpperCase()}
        </span>
        <span className="ob-siteconfirm-text">
          <span className="t-title-s">{name}</span>
          <span className="t-caption">{url}</span>
        </span>
        <span className="ob-siteconfirm-status t-label-s">
          <Icon name="check-circle" size={20} />
          {state === 'live' ? 'Live' : state === 'connected' ? 'Connected' : 'WordPress 6.8'}
        </span>
      </div>
      {state === 'live' && (
        <div className="ob-siteconfirm-note t-body-m">
          <Icon name="lock" size={20} />
          <span>Secure connection · Hosted by Wursor Cloud</span>
        </div>
      )}
      {state === 'connected' && (
        <div className="ob-siteconfirm-note t-body-m">
          <Icon name="shield-check" size={20} />
          <span>Wursor can see your site but cannot change it without your approval.</span>
        </div>
      )}
    </div>
  );
}
