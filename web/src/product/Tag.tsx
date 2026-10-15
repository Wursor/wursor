import { Icon } from '../ui/Icon.tsx';

type Props = { label: string; closable?: boolean; onClose?: () => void };

/** Small outlined label, optionally removable. */
export function Tag({ label, closable = false, onClose }: Props) {
  return (
    <span className="p-tag">
      <span>{label}</span>
      {closable && (
        <button type="button" aria-label={`Remove ${label}`} className="p-tag-close" onClick={onClose}>
          <Icon name="close" size={14} />
        </button>
      )}
    </span>
  );
}
