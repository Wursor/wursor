import { Icon } from '../ui/Icon.tsx';

type Props = { place: string; summary: string; added: number; removed: number };

/** One line in the What changed drawer: the place that changed, what changed in plain words, and the size of the change. */
export function ChangeRow({ place, summary, added, removed }: Props) {
  return (
    <div className="p-changerow">
      <span className="p-change-tile" aria-hidden="true">
        <Icon name="file" size={20} />
      </span>
      <div className="p-changerow-text">
        <p className="p-changerow-place">{place}</p>
        <p className="p-changerow-summary">{summary}</p>
      </div>
      <div className="p-changerow-diff">
        <span className="p-diff-add">+{added}</span>
        <span className="p-diff-remove">−{removed}</span>
      </div>
    </div>
  );
}
