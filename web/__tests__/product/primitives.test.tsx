import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Avatar } from '../../src/product/Avatar.tsx';
import { Button } from '../../src/product/Button.tsx';
import { Counter } from '../../src/product/Counter.tsx';
import { IconButton } from '../../src/product/IconButton.tsx';
import { RiskChip } from '../../src/product/RiskChip.tsx';
import { SegmentedControl } from '../../src/product/SegmentedControl.tsx';
import { StatusPill } from '../../src/product/StatusPill.tsx';
import { Tab } from '../../src/product/Tab.tsx';
import { Tag } from '../../src/product/Tag.tsx';

describe('Avatar', () => {
  it('shows initials for a person', () => {
    render(<Avatar kind="initials" initials="AO" name="Amara Okoye" />);
    expect(screen.getByRole('img', { name: 'Amara Okoye' })).toHaveTextContent('AO');
  });

  it('shows the brand mark for Wursor', () => {
    render(<Avatar kind="wursor" />);
    expect(screen.getByRole('img', { name: 'Wursor' })).toHaveClass('p-avatar-wursor');
  });

  it('has a small and a medium size', () => {
    render(<Avatar kind="initials" initials="AO" name="A" size="md" />);
    expect(screen.getByRole('img', { name: 'A' })).toHaveClass('p-avatar-md');
  });
});

describe('Counter', () => {
  it('shows the count', () => {
    render(<Counter count={3} />);
    expect(screen.getByText('3')).toHaveClass('p-counter');
  });
});

describe('StatusPill', () => {
  it.each([
    ['idea', 'Idea'],
    ['working', 'Working'],
    ['needs-you', 'Needs you'],
    ['done', 'Done'],
  ] as const)('labels the %s status in plain words', (status, label) => {
    render(<StatusPill status={status} />);
    expect(screen.getByText(label).closest('.p-status')).toHaveAttribute('data-status', status);
  });
});

describe('RiskChip', () => {
  it('shows the plain-word risk level', () => {
    render(<RiskChip level="everyday" />);
    expect(screen.getByText('Everyday')).toBeInTheDocument();
  });
});

describe('IconButton', () => {
  it('is named by its label and calls onClick', async () => {
    const onClick = vi.fn();
    render(<IconButton icon="search" label="Search" onClick={onClick} />);
    await userEvent.click(screen.getByRole('button', { name: 'Search' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('supports the inverse variant', () => {
    render(<IconButton icon="stop" label="Stop" variant="inverse" />);
    expect(screen.getByRole('button', { name: 'Stop' })).toHaveClass('p-iconbtn-inverse');
  });
});

describe('Button', () => {
  it('renders its label and calls onClick', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>See what changed</Button>);
    await userEvent.click(screen.getByRole('button', { name: 'See what changed' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('defaults to secondary and small, and supports primary and ghost', () => {
    const { rerender } = render(<Button>A</Button>);
    expect(screen.getByRole('button', { name: 'A' })).toHaveClass('p-btn-secondary', 'p-btn-sm');
    rerender(<Button variant="primary" size="md">A</Button>);
    expect(screen.getByRole('button', { name: 'A' })).toHaveClass('p-btn-primary', 'p-btn-md');
    rerender(<Button variant="ghost">A</Button>);
    expect(screen.getByRole('button', { name: 'A' })).toHaveClass('p-btn-ghost');
  });
});

describe('SegmentedControl', () => {
  const options = [
    { value: 'headline', label: 'Headline' },
    { value: 'steps', label: 'Steps' },
    { value: 'everything', label: 'Everything' },
  ];

  it('is a radio group with the current choice checked', () => {
    render(<SegmentedControl label="Detail" options={options} value="steps" onChange={() => {}} />);
    expect(screen.getByRole('radiogroup', { name: 'Detail' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Steps' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Headline' })).not.toBeChecked();
  });

  it('reports the chosen value', async () => {
    const onChange = vi.fn();
    render(<SegmentedControl label="Detail" options={options} value="steps" onChange={onChange} />);
    await userEvent.click(screen.getByRole('radio', { name: 'Everything' }));
    expect(onChange).toHaveBeenCalledWith('everything');
  });
});

describe('Tab', () => {
  it('marks the selected tab', () => {
    render(
      <div role="tablist">
        <Tab label="Preview" selected />
        <Tab label="Compare" />
      </div>,
    );
    expect(screen.getByRole('tab', { name: 'Preview' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Compare' })).toHaveAttribute('aria-selected', 'false');
  });

  it('can show a count', () => {
    render(<Tab label="Proof" count={3} />);
    expect(screen.getByRole('tab', { name: /Proof/ })).toHaveTextContent('3');
  });
});

describe('Tag', () => {
  it('shows its label', () => {
    render(<Tag label="Draft copy" />);
    expect(screen.getByText('Draft copy')).toBeInTheDocument();
  });

  it('can be removed when closable', async () => {
    const onClose = vi.fn();
    render(<Tag label="Draft copy" closable onClose={onClose} />);
    await userEvent.click(screen.getByRole('button', { name: 'Remove Draft copy' }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
