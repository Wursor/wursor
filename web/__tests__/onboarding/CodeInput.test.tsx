import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { CodeInput } from '../../src/onboarding/CodeInput.tsx';

function Harness({ onComplete = () => {}, invalid = false, readOnly = false, initial = '' }: { onComplete?: (c: string) => void; invalid?: boolean; readOnly?: boolean; initial?: string }) {
  const [value, setValue] = useState(initial);
  return <CodeInput value={value} onChange={setValue} onComplete={onComplete} invalid={invalid} readOnly={readOnly} />;
}

const boxes = () => screen.getAllByRole('textbox') as HTMLInputElement[];

describe('CodeInput', () => {
  it('is a group of eight labelled boxes', () => {
    render(<Harness />);
    expect(screen.getByRole('group', { name: 'Verification code' })).toBeInTheDocument();
    expect(boxes()).toHaveLength(8);
    expect(boxes().map((b) => b.getAttribute('aria-label'))).toEqual(['Digit 1 of 8', 'Digit 2 of 8', 'Digit 3 of 8', 'Digit 4 of 8', 'Digit 5 of 8', 'Digit 6 of 8', 'Digit 7 of 8', 'Digit 8 of 8']);
  });

  it('asks for a numeric keyboard and lets the phone suggest the emailed code', () => {
    render(<Harness />);
    expect(boxes()[0]).toHaveAttribute('inputmode', 'numeric');
    expect(boxes()[0]).toHaveAttribute('autocomplete', 'one-time-code');
  });

  it('moves to the next box after each digit', async () => {
    render(<Harness />);
    await userEvent.click(boxes()[0]!);
    await userEvent.keyboard('48');
    expect(boxes().slice(0, 2).map((b) => b.value)).toEqual(['4', '8']);
    expect(boxes()[2]).toHaveFocus();
  });

  it('ignores anything that is not a digit', async () => {
    render(<Harness />);
    await userEvent.click(boxes()[0]!);
    await userEvent.keyboard('a-4 ');
    expect(boxes().map((b) => b.value).join('')).toBe('4');
  });

  it('reports the code once the eighth digit is in', async () => {
    const onComplete = vi.fn();
    render(<Harness onComplete={onComplete} />);
    await userEvent.click(boxes()[0]!);
    await userEvent.keyboard('4829173');
    expect(onComplete).not.toHaveBeenCalled();
    await userEvent.keyboard('5');
    expect(onComplete).toHaveBeenCalledWith('48291735');
  });

  it('Backspace clears the digit before the cursor and steps back', async () => {
    render(<Harness initial="482" />);
    await userEvent.click(boxes()[3]!);
    expect(boxes()[3]).toHaveFocus();
    await userEvent.keyboard('{Backspace}');
    expect(boxes().map((b) => b.value).join('')).toBe('48');
    expect(boxes()[2]).toHaveFocus();
  });

  it('Backspace in a box that has a digit removes that digit', async () => {
    render(<Harness initial="482" />);
    await userEvent.click(boxes()[1]!);
    await userEvent.keyboard('{Backspace}');
    expect(boxes().map((b) => b.value).join('')).toBe('42');
  });

  it('takes a pasted code in one go, ignoring spaces and dashes', async () => {
    const onComplete = vi.fn();
    render(<Harness onComplete={onComplete} />);
    await userEvent.click(boxes()[0]!);
    await userEvent.paste('4829 1735');
    expect(boxes().map((b) => b.value).join('')).toBe('48291735');
    expect(onComplete).toHaveBeenCalledWith('48291735');
  });

  it('trims a pasted code that is too long', async () => {
    render(<Harness />);
    await userEvent.click(boxes()[0]!);
    await userEvent.paste('1234567890');
    expect(boxes().map((b) => b.value).join('')).toBe('12345678');
  });

  it('sends focus to the first empty box when a later box is clicked', async () => {
    render(<Harness initial="48" />);
    await userEvent.click(boxes()[6]!);
    expect(boxes()[2]).toHaveFocus();
  });

  it('moves with the arrow keys', async () => {
    render(<Harness initial="4829" />);
    await userEvent.click(boxes()[2]!);
    await userEvent.keyboard('{ArrowLeft}');
    expect(boxes()[1]).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}{ArrowRight}');
    expect(boxes()[3]).toHaveFocus();
  });

  it('marks every box invalid together', () => {
    render(<Harness initial="48291735" invalid />);
    expect(boxes().every((b) => b.getAttribute('aria-invalid') === 'true')).toBe(true);
  });

  it('cannot be edited when read only', async () => {
    render(<Harness initial="4829" readOnly />);
    await userEvent.click(boxes()[4]!);
    await userEvent.keyboard('7');
    expect(boxes().map((b) => b.value).join('')).toBe('4829');
    fireEvent.paste(boxes()[4]!, { clipboardData: { getData: () => '11111111' } });
    expect(boxes().map((b) => b.value).join('')).toBe('4829');
  });
});
