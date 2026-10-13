import { Icon } from '../ui/Icon.tsx';

/** Where the site lives and how much Wursor may do there: Full access, or Content only (pages, posts, media). */
export function AccessRow({ access }: { access: 'full' | 'content' }) {
  return (
    <div className="ob-access">
      <Icon name="globe" size={16} />
      <span className="t-caption">Lives on your WordPress</span>
      <span className="ob-access-badge t-label-s" data-access={access}>
        <Icon name={access === 'full' ? 'shield-check' : 'file'} size={14} />
        {access === 'full' ? 'Full access' : 'Content only'}
      </span>
    </div>
  );
}
