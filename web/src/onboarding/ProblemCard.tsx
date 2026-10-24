import { Icon, type IconName } from '../ui/Icon.tsx';

type Props = {
  icon: IconName;
  title: string;
  body: string;
  primary: string;
  onPrimary: () => void;
  secondary?: string;
  onSecondary?: () => void;
};

/** A connect-step failure: one plain explanation, one suggested fix, and a person to ask. Never shows codes or technical fields. */
export function ProblemCard({ icon, title, body, primary, onPrimary, secondary, onSecondary }: Props) {
  return (
    <div className="ob-problem">
      <span className="ob-problem-tile" aria-hidden="true">
        <Icon name={icon} size={20} />
      </span>
      <div className="ob-problem-text">
        <p className="t-title-s">{title}</p>
        <p className="t-body-m">{body}</p>
      </div>
      <div className="ob-problem-actions">
        <button type="button" className="ob-pill ob-pill-primary t-label-m" onClick={onPrimary}>
          {primary}
        </button>
        {secondary && (
          <button type="button" className="ob-pill ob-pill-ghost t-label-m" onClick={onSecondary}>
            {secondary}
          </button>
        )}
      </div>
    </div>
  );
}
