'use client';

import { useId, useState, type ReactNode } from 'react';
import { Icon } from '../ui/Icon.tsx';
import { Toggle } from '../sites/Toggle.tsx';

/** A drop-down choice. The label is its name; the text beside it explains it. */
export function Select({ label, options, value, onChange, narrow }: { label: string; options: readonly string[]; value: string; onChange: (v: string) => void; narrow?: boolean }) {
  return (
    <span className="app-select" data-narrow={narrow ? 'true' : undefined}>
      <select aria-label={label} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <Icon name="chevron-down" size={16} />
    </span>
  );
}

/** A single-line field with a label above and a quiet line below. */
export function Field({ label, value, onChange, helper }: { label: string; value: string; onChange: (v: string) => void; helper?: string }) {
  const id = useId();
  return (
    <div className="app-field">
      <label htmlFor={id}>{label}</label>
      <input id={id} type="text" value={value} onChange={(e) => onChange(e.target.value)} aria-describedby={helper ? `${id}-h` : undefined} />
      {helper && <p id={`${id}-h`}>{helper}</p>}
    </div>
  );
}

type RowProps = { title: string; detail: string } & (
  | { control: 'select'; options: readonly string[]; initial: string }
  | { control: 'toggle'; initial: boolean }
  | { control: 'locked' }
  | { control: 'state'; text: string }
  | { control: 'button'; label: string }
  | { control?: undefined }
);

/** One setting: what it is, what it does, and the control for it. Owns its own value, so a page of these just works. */
export function SettingRow(p: RowProps) {
  const [text, setText] = useState(p.control === 'select' ? p.initial : '');
  const [on, setOn] = useState(p.control === 'toggle' ? p.initial : false);
  let control: ReactNode = null;
  if (p.control === 'select') control = <Select label={p.title} options={p.options} value={text} onChange={setText} />;
  if (p.control === 'toggle') control = <Toggle label={p.title} checked={on} onChange={setOn} />;
  if (p.control === 'locked')
    control = (
      <span className="app-locked">
        <Icon name="lock" size={20} />
        Always on
      </span>
    );
  if (p.control === 'state') control = <span className="app-row-state">{p.text}</span>;
  if (p.control === 'button') control = <button type="button" className="p-btn p-btn-secondary p-btn-sm">{p.label}</button>;
  return (
    <div className="app-settingrow">
      <div className="app-settingrow-text">
        <p>{p.title}</p>
        <p>{p.detail}</p>
      </div>
      {control}
    </div>
  );
}

/** A heading with an optional line under it, then the rows. */
export function Section({ title, description, action, children }: { title: string; description?: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="app-group" aria-labelledby={undefined}>
      <div className="app-group-head">
        <h2>{title}</h2>
        {action}
      </div>
      {description && <p className="app-group-desc">{description}</p>}
      {children}
    </section>
  );
}
