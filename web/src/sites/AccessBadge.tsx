import { Icon } from '../ui/Icon.tsx';

/** What Wursor may do on a site: Full access, or Content only (pages, posts and images). */
export function AccessBadge({ access }: { access: 'full' | 'content' }) {
  return (
    <span className="app-badge" data-access={access}>
      <Icon name={access === 'full' ? 'shield-check' : 'file'} size={14} />
      <span>{access === 'full' ? 'Full access' : 'Content only'}</span>
    </span>
  );
}
