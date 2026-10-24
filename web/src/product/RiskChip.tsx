import { Icon } from '../ui/Icon.tsx';

const LABEL = { everyday: 'Everyday', noticeable: 'Noticeable', sensitive: 'Sensitive', careful: 'Careful' } as const;
export type RiskLevel = keyof typeof LABEL;

/** Plain-word risk level: Everyday, Noticeable, Sensitive or Careful. */
export function RiskChip({ level }: { level: RiskLevel }) {
  return (
    <span className="p-risk" data-level={level}>
      <Icon name="shield-check" size={14} />
      <span>{LABEL[level]}</span>
    </span>
  );
}
