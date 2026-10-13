import { Icon, type IconName } from '../ui/Icon.tsx';

type Props = {
  icon: IconName;
  title: string;
  detail: string;
  /** Running shows a spinner and "Looking…"; attention adds an amber dot for something worth fixing. */
  state: 'running' | 'done' | 'attention';
  value?: string;
};

/** One line of the first read-only scan (Figma "Scan Finding"). */
export function ScanFinding({ icon, title, detail, state, value }: Props) {
  return (
    <div className="ob-finding" data-state={state}>
      <span className="ob-finding-tile" aria-hidden="true">
        <Icon name={icon} size={20} />
      </span>
      <span className="ob-finding-text">
        <span className="t-body-m-strong">{title}</span>
        <span className="t-caption">{detail}</span>
      </span>
      <span className="ob-finding-result t-label-m">
        {state === 'running' ? (
          <>
            <Icon name="loader" size={16} className="ob-spin" />
            <span className="ob-finding-looking">Looking…</span>
          </>
        ) : (
          <>
            {state === 'attention' && (
              <>
                <span className="ob-finding-dot" aria-hidden="true" />
                <span className="sr-only">Worth fixing</span>
              </>
            )}
            {value}
          </>
        )}
      </span>
    </div>
  );
}
