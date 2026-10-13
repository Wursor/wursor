import type { ReactNode, Ref } from 'react';

type Props = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  type?: 'email' | 'text';
  autoComplete?: string;
  readOnly?: boolean;
  invalid?: boolean;
  /** An icon inside the field, before the text. */
  leading?: ReactNode;
  /** Quiet helper text under the field, replaced by `error` when there is one. */
  helper?: ReactNode;
  /** Helper text under the field. Shown in the error colour and announced as the field's description. */
  error?: ReactNode;
  inputRef?: Ref<HTMLInputElement>;
};

/** Single-line input with a label and an error line (Figma "Text Field", Lg 44). Focus uses the accent ring. */
export function TextField({ id, label, value, onChange, onBlur, placeholder, type = 'text', autoComplete, readOnly, invalid, error, helper, leading, inputRef }: Props) {
  const errorId = `${id}-error`;
  return (
    <div className="ob-textfield">
      <label htmlFor={id} className="t-label-m">
        {label}
      </label>
      <div className="ob-field" data-invalid={invalid ? 'true' : undefined}>
        {leading}
        <input
          ref={inputRef}
          id={id}
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          readOnly={readOnly}
          aria-invalid={invalid ? 'true' : 'false'}
          aria-describedby={error || helper ? errorId : undefined}
          spellCheck={false}
          className="ob-input t-body-m"
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
        />
      </div>
      {error ? (
        <p id={errorId} className="ob-error t-caption">
          {error}
        </p>
      ) : (
        helper && (
          <p id={errorId} className="ob-helper t-caption">
            {helper}
          </p>
        )
      )}
    </div>
  );
}
