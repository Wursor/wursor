'use client';

import { useRef, type ClipboardEvent, type KeyboardEvent } from 'react';

const LENGTH = 8;

type Props = {
  /** The digits entered so far, 0 to 8 of them, with no gaps. */
  value: string;
  onChange: (value: string) => void;
  /** Called with the full code as soon as the eighth digit is in. */
  onComplete?: (code: string) => void;
  invalid?: boolean;
  readOnly?: boolean;
};

/**
 * Eight-box verification code (Figma "Code Input"). Typing moves on to the next box, Backspace steps back,
 * a pasted code fills every box, and a box past the next empty one hands focus to that one.
 */
export function CodeInput({ value, onChange, onComplete, invalid, readOnly }: Props) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  // The length is also kept in a ref, updated the moment a digit is committed: focus moves to the next box before
  // React re-renders, and that box's focus handler must see the new length, not the old one.
  const length = useRef(value.length);
  length.current = value.length;
  const focusBox = (i: number) => refs.current[Math.max(0, Math.min(LENGTH - 1, i))]?.focus();
  const commit = (next: string) => {
    length.current = next.length;
    onChange(next);
    if (next.length === LENGTH) onComplete?.(next);
  };

  const onKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      focusBox(i - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      focusBox(Math.min(i + 1, value.length));
    } else if (e.key === 'Backspace' && !readOnly) {
      e.preventDefault();
      if (value[i] !== undefined) {
        commit(value.slice(0, i) + value.slice(i + 1));
      } else if (i > 0) {
        commit(value.slice(0, i - 1) + value.slice(i));
        focusBox(i - 1);
      }
    }
  };

  const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (readOnly) return;
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, LENGTH);
    if (!digits) return;
    commit(digits);
    focusBox(digits.length);
  };

  return (
    <div role="group" aria-label="Verification code" className="ob-code">
      {Array.from({ length: LENGTH }, (_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          aria-label={`Digit ${i + 1} of ${LENGTH}`}
          aria-invalid={invalid ? 'true' : 'false'}
          readOnly={readOnly}
          value={value[i] ?? ''}
          className="ob-code-box"
          onFocus={(e) => {
            if (i > length.current) focusBox(length.current);
            else e.target.select();
          }}
          onChange={(e) => {
            if (readOnly) return;
            const digit = e.target.value.replace(/\D/g, '').slice(-1);
            if (!digit) return;
            commit((value.slice(0, i) + digit + value.slice(i + 1)).slice(0, LENGTH));
            focusBox(i + 1);
          }}
          onKeyDown={(e) => onKeyDown(i, e)}
          onPaste={onPaste}
        />
      ))}
    </div>
  );
}
