import { Icon } from '../ui/Icon.tsx';

type Props = { result: 'passed'; title: string; detail: string };

/** Wursor's own checks after a change. Passed is quiet and green. "Needs attention" is not designed yet. */
export function CheckEvent({ result, title, detail }: Props) {
  return (
    <div className="p-check" data-result={result}>
      <span className="p-check-icon">
        <Icon name="check-circle" size={20} />
      </span>
      <div className="p-check-text">
        <p className="p-check-title">{title}</p>
        <p className="p-check-detail">{detail}</p>
      </div>
      <Icon name="chevron-right" size={20} />
    </div>
  );
}
