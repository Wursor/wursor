import type { ReactNode } from 'react';
import { IconButton } from './IconButton.tsx';
import { Tab } from './Tab.tsx';
import { Tag } from './Tag.tsx';

export type PreviewView = 'preview' | 'compare' | 'proof';
const TABS: ReadonlyArray<{ value: PreviewView; label: string }> = [
  { value: 'preview', label: 'Preview' },
  { value: 'compare', label: 'Compare' },
  { value: 'proof', label: 'Proof' },
];

type Props = { selected: PreviewView; tag?: string; onSelect?: (view: PreviewView) => void; trailing?: ReactNode };

export function PreviewToolbar({ selected, tag, onSelect, trailing }: Props) {
  return (
    <div className="p-previewbar">
      <div role="tablist" aria-label="View" className="p-tabs">
        {TABS.map((t) => (
          <Tab key={t.value} label={t.label} selected={t.value === selected} onSelect={() => onSelect?.(t.value)} />
        ))}
      </div>
      <span className="p-spacer" />
      {tag && <Tag label={tag} />}
      <IconButton icon="monitor" label="Desktop" />
      <IconButton icon="smartphone" label="Phone" />
      {trailing}
    </div>
  );
}
