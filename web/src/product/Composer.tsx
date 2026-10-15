import { Button } from './Button.tsx';
import { IconButton } from './IconButton.tsx';

type Props = {
  /** Only the working state is designed so far. Empty, typing and pointing come with the app screens. */
  state: 'working';
  autonomy: string;
  placeholder?: string;
  onStop?: () => void;
};

/** Where the owner talks to Wursor. While Wursor works, stop is offered and typing still works. */
export function Composer({ autonomy, placeholder = 'Wursor is working. Add a note, or stop.', onStop }: Props) {
  return (
    <div className="p-composer" data-state="working">
      <textarea aria-label="Message to Wursor" placeholder={placeholder} rows={1} className="p-composer-input" />
      <div className="p-composer-toolbar">
        <div className="p-composer-side">
          <IconButton icon="paperclip" label="Attach a file" />
          <IconButton icon="pointer" label="Point at something on the page" />
          <Button variant="ghost" trailingIcon="chevron-down">
            {autonomy}
          </Button>
        </div>
        <div className="p-composer-side">
          <IconButton icon="mic" label="Dictate" />
          <IconButton icon="stop" label="Stop" variant="inverse" onClick={onStop} />
        </div>
      </div>
    </div>
  );
}
