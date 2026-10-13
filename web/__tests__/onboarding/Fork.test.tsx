import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ForkStep } from '../../src/onboarding/ForkStep.tsx';

const setup = () => {
  const handlers = { onContinue: vi.fn(), onBack: vi.fn(), onSaveAndExit: vi.fn() };
  render(<ForkStep {...handlers} />);
  return handlers;
};
const paths = () => screen.getByRole('radiogroup', { name: 'Where should your site live?' });
const card = (name: RegExp) => within(paths()).getByRole('radio', { name });
const continueBtn = () => screen.getByRole('button', { name: 'Continue' });

describe('Where should your site live? (4a to 4d)', () => {
  it('asks the question, with the reassurance that moving is free, at step 4 of 8', () => {
    setup();
    expect(screen.getByRole('heading', { name: 'Where should your site live?' })).toBeInTheDocument();
    expect(screen.getByText('You can change your mind later. Moving out is free.')).toBeInTheDocument();
    expect(screen.getByText('4 of 8')).toBeInTheDocument();
  });

  it('offers the three starting paths, each with its tag, explanation and exit promise', () => {
    setup();
    const radios = within(paths()).getAllByRole('radio');
    expect(radios.map((r) => r.getAttribute('value'))).toEqual(['cloud', 'connect', 'build']);
    for (const text of [
      'Recommended for new sites', 'Start on Wursor Cloud', 'We host it for you. We handle the address, security, updates and backups. Best if you do not have a site yet.', 'Move out any time. It is free.',
      'For a site you already have', 'Connect my WordPress', 'Keep your site where it is. Wursor works on a safe copy and publishes changes to it after you approve.', 'Your site stays where it is.',
      'For a new site on your WordPress', 'Build here, publish to my WordPress', 'Start from a short brief and publish to a WordPress you own, such as an empty or new WordPress.com site.', 'You keep your own host.',
    ]) {
      expect(within(paths()).getByText(text)).toBeInTheDocument();
    }
  });

  it('starts with nothing chosen and Continue quiet', () => {
    setup();
    expect(within(paths()).getAllByRole('radio').every((r) => !(r as HTMLInputElement).checked)).toBe(true);
    expect(continueBtn()).toHaveAttribute('aria-disabled', 'true');
  });

  it.each([
    [/Start on Wursor Cloud/, 'cloud'],
    [/Connect my WordPress/, 'connect'],
    [/Build here, publish to my WordPress/, 'build'],
  ] as const)('choosing %s lets Continue carry on with %s', async (name, value) => {
    const { onContinue } = setup();
    await userEvent.click(card(name));
    expect(card(name)).toBeChecked();
    expect(continueBtn()).toHaveAttribute('aria-disabled', 'false');
    await userEvent.click(continueBtn());
    expect(onContinue).toHaveBeenCalledWith(value);
  });

  it('keeps one path chosen at a time', async () => {
    setup();
    await userEvent.click(card(/Start on Wursor Cloud/));
    await userEvent.click(card(/Connect my WordPress/));
    expect(card(/Start on Wursor Cloud/)).not.toBeChecked();
    expect(card(/Connect my WordPress/)).toBeChecked();
  });

  it('does nothing when Continue is pressed with no choice', async () => {
    const { onContinue } = setup();
    await userEvent.click(continueBtn());
    expect(onContinue).not.toHaveBeenCalled();
  });

  it('suggests Wursor Cloud for anyone unsure', async () => {
    setup();
    await userEvent.click(screen.getByRole('button', { name: 'Not sure? Start on Wursor Cloud and move later.' }));
    expect(card(/Start on Wursor Cloud/)).toBeChecked();
  });

  it('goes back or saves and exits, and cannot be skipped', async () => {
    const { onBack, onSaveAndExit } = setup();
    await userEvent.click(screen.getByRole('button', { name: 'Back' }));
    await userEvent.click(screen.getByRole('button', { name: 'Save and exit' }));
    expect(onBack).toHaveBeenCalledOnce();
    expect(onSaveAndExit).toHaveBeenCalledOnce();
    expect(screen.queryByRole('button', { name: 'Skip for now' })).not.toBeInTheDocument();
  });
});
