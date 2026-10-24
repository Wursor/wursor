import { Icon } from '../ui/Icon.tsx';
import { StatusPill } from '../product/StatusPill.tsx';
import { AccessBadge } from './AccessBadge.tsx';
import type { SiteInfo } from './data.ts';

/** One site in the list: its name and address, where it lives and what Wursor may do, how it is doing, and a menu. */
export function SiteRow({ site, href }: { site: SiteInfo; href: string }) {
  return (
    <a href={href} className="app-siterow">
      <span className="app-siterow-favicon" aria-hidden="true">
        {site.name.charAt(0)}
      </span>
      <span className="app-siterow-text">
        <span className="app-siterow-name">{site.name}</span>
        <span className="app-siterow-meta">
          <span className="app-siterow-url">{site.url}</span>
          <span className="app-siterow-home">
            <Icon name={site.home === 'cloud' ? 'cloud' : 'globe'} size={16} />
            <span>{site.home === 'cloud' ? 'Lives on Wursor Cloud' : 'Lives on your WordPress'}</span>
          </span>
          <AccessBadge access={site.access} />
        </span>
      </span>
      <span className="app-siterow-note">{site.note}</span>
      <StatusPill status={site.status} />
      <span className="app-siterow-menu" aria-hidden="true">
        <Icon name="dots" size={16} />
      </span>
    </a>
  );
}
