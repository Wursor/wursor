'use client';

import { useState } from 'react';
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
          <IconButton icon="paperclip" label="Attach a file" />
          <IconButton icon="pointer" label="Point at something on the page" />
          <Button variant="ghost" trailingIcon="chevron-down">
            {autonomy}
          </Button>
        </div>
        <div className="p-composer-side">
          <IconButton icon="mic" label="Dictate" />
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
