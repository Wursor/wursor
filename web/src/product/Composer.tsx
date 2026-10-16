'use client';

import { useRef, useState } from 'react';
import { useFeedback } from '../system/Feedback.tsx';
import { Button } from './Button.tsx';
import { IconButton } from './IconButton.tsx';
import { Icon } from '../ui/Icon.tsx';

type Props = {
  /** Empty: ask for a change. Working: stop is offered and typing still works. */
  state: 'empty' | 'working';
  autonomy: string;
  placeholder?: string;
  /** Text already in the box, for example a question being answered. */
  defaultValue?: string;
  onStop?: (() => void) | undefined;
  onSend?: ((text: string) => void) | undefined;
};

/** Where the owner talks to Wursor. While Wursor works, stop is offered and typing still works. */
export function Composer({ state, autonomy, placeholder, defaultValue = '', onStop, onSend }: Props) {
  const [value, setValue] = useState(defaultValue);
  const [pointing, setPointing] = useState(false);
  const file = useRef<HTMLInputElement>(null);
  const { notify } = useFeedback();
  const hint = placeholder ?? (state === 'working' ? 'Wursor is working. Add a note, or stop.' : 'Ask Wursor to change something…');
  const ready = value.trim() !== '';
  const send = () => {
    if (!ready) return;
    onSend?.(value.trim());
    setValue('');
  };
  return (
    <div className="p-composer" data-state={state}>
      <textarea
        aria-label="Message to Wursor"
        placeholder={hint}
        rows={1}
        className="p-composer-input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            send();
          }
        }}
      />
      <div className="p-composer-toolbar">
        <div className="p-composer-side">
          <input
            ref={file}
            type="file"
            hidden
            tabIndex={-1}
            aria-hidden="true"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) notify(`${f.name} attached`);
              e.target.value = '';
            }}
          />
          <IconButton icon="paperclip" label="Attach a file" onClick={() => file.current?.click()} />
          <IconButton
            icon="pointer"
            label="Point at something on the page"
            aria-pressed={pointing}
            onClick={() => {
              setPointing(!pointing);
              notify(pointing ? 'Pointing is off' : 'Click anything in the preview to point at it', 'info');
            }}
          />
          <Button variant="ghost" trailingIcon="chevron-down" onClick={() => notify("Change how much Wursor asks first in Settings, under Autonomy.", 'info')}>
            {autonomy}
          </Button>
        </div>
        <div className="p-composer-side">
          <IconButton icon="mic" label="Dictate" onClick={() => notify("Dictation isn't switched on yet. Typing works as usual.", 'info')} />
          {state === 'working' ? (
            <IconButton icon="stop" label="Stop" variant="inverse" onClick={onStop} />
          ) : (
            <button type="button" aria-label="Send" aria-disabled={!ready} className="p-iconbtn p-iconbtn-sm p-send" data-ready={ready ? 'true' : 'false'} onClick={send}>
              <Icon name="arrow-up" size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
