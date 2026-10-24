import { Icon, type IconName } from '../ui/Icon.tsx';

type Props = {
  icon: IconName;
  label: string;
  variant?: 'ghost' | 'inverse';
  size?: 'sm' | 'md';
  onClick?: (() => void) | undefined;
  'aria-pressed'?: boolean | undefined;
};

/** Round button with an icon, for toolbars and the composer. `label` is its accessible name. */
export function IconButton({ icon, label, variant = 'ghost', size = 'sm', onClick, 'aria-pressed': pressed }: Props) {
  return (
    <button type="button" aria-label={label} className={`p-iconbtn p-iconbtn-${variant} p-iconbtn-${size}`} aria-pressed={pressed} onClick={onClick}>
      <Icon name={icon} size={size === 'sm' ? 16 : 20} />
    </button>
  );
}
