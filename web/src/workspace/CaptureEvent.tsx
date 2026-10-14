import { Icon } from '../ui/Icon.tsx';

/** A photo Wursor took of the page, before or after the change. The proof that something looks right. */
export function CaptureEvent({ when, caption }: { when: 'before' | 'after'; caption: string }) {
  return (
    <figure className="p-capture">
      <div className="p-capture-photo" role="img" aria-label={`${when === 'before' ? 'Before' : 'After'}: ${caption}`}>
        <Icon name="camera" size={20} />
      </div>
      <figcaption className="p-capture-caption">
        <span className="p-capture-when" data-when={when}>
          {when === 'before' ? 'Before' : 'After'}
        </span>
        <span>{caption}</span>
      </figcaption>
    </figure>
  );
}
