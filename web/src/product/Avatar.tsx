type Props =
  | { kind: 'wursor'; size?: 'sm' | 'md' }
  | { kind: 'initials'; initials: string; name: string; size?: 'sm' | 'md' };

/** Person or Wursor agent identity: initials, or the brand mark on the inverse colour. */
export function Avatar(props: Props) {
  const size = props.size ?? 'sm';
  if (props.kind === 'wursor') {
    return (
      <span role="img" aria-label="Wursor" className={`p-avatar p-avatar-${size} p-avatar-wursor`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="p-avatar-mark p-avatar-mark-light" src="/marketing/avatar-mark.svg" alt="" width={14} height={14} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="p-avatar-mark p-avatar-mark-dark" src="/marketing/avatar-mark-dark.svg" alt="" width={14} height={14} />
      </span>
    );
  }
  return (
    <span role="img" aria-label={props.name} className={`p-avatar p-avatar-${size} p-avatar-initials`}>
      {props.initials}
    </span>
  );
}
