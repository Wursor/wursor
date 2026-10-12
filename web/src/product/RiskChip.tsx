import { Icon } from '../ui/Icon.tsx';

const LABEL = { everyday: 'Everyday' } as const;

/** Plain-word risk level. Only "Everyday" is designed so far; add the others when their designs exist. */
export function RiskChip({ level }: { level: keyof typeof LABEL }) {
  return (
    <span className="p-risk">
      <Icon name="shield-check" size={14} />
      <span>{LABEL[level]}</span>
    </span>
  );
}
