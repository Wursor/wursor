import { Icon } from '../ui/Icon.tsx';

type Props = { site: string; siteInitial: string };

/** The phone's top bar (56 px): the site, search and notifications. The detail of the desktop bar moves into the screens themselves. */
export function MobileTopBar({ site, siteInitial }: Props) {
  return (
    <header className="ws-mtop">
      <button type="button" className="ws-mtop-site">
        <span className="ws-mtop-mark" aria-hidden="true">
          {siteInitial}
        </span>
        <span>{site}</span>
        <Icon name="chevron-down" size={20} />
      </button>
      <span className="p-spacer" />
      <button type="button" className="ws-mtop-icon" aria-label="Search">
        <Icon name="search" size={20} />
      </button>
      <button type="button" className="ws-mtop-icon" aria-label="Notifications">
        <Icon name="bell" size={20} />
      </button>
    </header>
  );
}
