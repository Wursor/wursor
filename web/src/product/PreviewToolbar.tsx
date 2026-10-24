import { useState, type ReactNode } from 'react';
import { IconButton } from './IconButton.tsx';
import { Tab } from './Tab.tsx';
import { Tag } from './Tag.tsx';

export type PreviewView = 'preview' | 'compare' | 'proof';
const TABS: ReadonlyArray<{ value: PreviewView; label: string }> = [
  { value: 'preview', label: 'Preview' },
  { value: 'compare', label: 'Compare' },
  { value: 'proof', label: 'Proof' },
];

export type PreviewDevice = 'desktop' | 'phone';
type Props = { selected: PreviewView; tag?: string; onSelect?: (view: PreviewView) => void; onDevice?: (device: PreviewDevice) => void; trailing?: ReactNode };

export function PreviewToolbar({ selected, tag, onSelect, onDevice, trailing }: Props) {
  const [device, setDevice] = useState<PreviewDevice>('desktop');
  const pick = (d: PreviewDevice) => {
    setDevice(d);
    onDevice?.(d);
  };
  return (
    <div className="p-previewbar" data-trailing={trailing ? 'true' : undefined}>
      <div role="tablist" aria-label="View" className="p-tabs">
        {TABS.map((t) => (
          <Tab key={t.value} label={t.label} selected={t.value === selected} onSelect={() => onSelect?.(t.value)} />
        ))}
      </div>
      <span className="p-spacer" />
      {tag && <Tag label={tag} />}
      <IconButton icon="monitor" label="Desktop" aria-pressed={device === 'desktop'} onClick={() => pick('desktop')} />
      <IconButton icon="smartphone" label="Phone" aria-pressed={device === 'phone'} onClick={() => pick('phone')} />
      {trailing}
    </div>
  );
}
