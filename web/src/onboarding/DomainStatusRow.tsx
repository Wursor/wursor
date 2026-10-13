import { Icon } from '../ui/Icon.tsx';

export type DomainStatus = 'waiting' | 'wrong' | 'securing' | 'secure';

type Props = {
  state: DomainStatus;
  /** The address being connected, named in the secure message. */
  address?: string;
  /** Right-hand timing, for example "Checked 12 s ago". */
  note: string;
};

/** One card that says where the address connection stands (Figma "Domain Status Row"). Announced politely as it changes. */
export function DomainStatusRow({ state, address = 'Your address', note }: Props) {
  const copy = {
    waiting: { title: 'Waiting for the record', body: 'We are checking every 30 seconds. This can take up to an hour.' },
    wrong: { title: 'The record points somewhere else', body: 'Your address points to another service. Change the record to the one shown.' },
    securing: { title: 'Securing the connection', body: 'This usually takes a minute.' },
    secure: { title: 'Connected and secure', body: `${address} now shows your site with a valid certificate.` },
  }[state];
  return (
    <div className="ob-domainstatus" data-state={state} role="status">
      <span className="ob-domainstatus-mark" aria-hidden="true">
        {state === 'waiting' && <Icon name="clock" size={20} />}
        {state === 'wrong' && <Icon name="alert-triangle" size={20} />}
        {state === 'securing' && <Icon name="loader" size={20} className="ob-spin" />}
        {state === 'secure' && <Icon name="check-circle" size={20} />}
      </span>
      <span className="ob-domainstatus-text">
        <span className="t-body-m-strong">{copy.title}</span>
        <span className="t-body-m">{copy.body}</span>
      </span>
      <span className="ob-domainstatus-note t-caption">{note}</span>
    </div>
  );
}
