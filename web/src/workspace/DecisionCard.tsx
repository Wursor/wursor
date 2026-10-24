import { Icon } from '../ui/Icon.tsx';

type Props = { question: string; options: readonly string[]; onAnswer?: ((option: string) => void) | undefined };

/** Wursor asks a question it cannot decide alone. The change pauses until it is answered here, from the board, or from a notification. */
export function DecisionCard({ question, options, onAnswer }: Props) {
  return (
    <section className="p-decision" aria-label="Wursor needs a decision">
      <p className="p-decision-eyebrow">Wursor needs a decision</p>
      <p className="p-decision-question">{question}</p>
      <div className="p-decision-options">
        {options.map((o) => (
          <button key={o} type="button" className="p-btn p-btn-secondary p-btn-md" onClick={() => onAnswer?.(o)}>
            {o}
          </button>
        ))}
      </div>
      <p className="p-decision-footer">
        <Icon name="clock" size={20} />
        <span>This change is paused until you answer.</span>
      </p>
    </section>
  );
}
