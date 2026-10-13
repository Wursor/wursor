import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FirstChangeStep } from '../../src/onboarding/FirstChangeStep.tsx';
import { SuggestionCard } from '../../src/onboarding/SuggestionCard.tsx';

const start = (access: 'full' | 'content' = 'full') => {
  const h = { onStart: vi.fn(), onBack: vi.fn(), onSaveAndExit: vi.fn() };
  render(<FirstChangeStep access={access} {...h} />);
  return { user: userEvent.setup(), ...h };
};

describe('SuggestionCard', () => {
  it('shows what it does, how long it takes, and that it is everyday risk', () => {
    render(<SuggestionCard name="s" value="a" title="Make your phone number easy to tap" body="On phones your number is plain text." meta="About 2 minutes  ·  Changes 2 places" checked={false} onChange={() => {}} />);
    expect(screen.getByText('Make your phone number easy to tap')).toBeInTheDocument();
    expect(screen.getByText('Everyday')).toBeInTheDocument();
    expect(screen.getByText('About 2 minutes · Changes 2 places')).toBeInTheDocument();
    expect(screen.getByRole('radio')).not.toBeChecked();
  });

  it('is chosen by clicking it', async () => {
    const onChange = vi.fn();
    render(<SuggestionCard name="s" value="a" title="T" body="B" meta="M" checked={false} onChange={onChange} />);
    await userEvent.click(screen.getByRole('radio', { name: /T/ }));
    expect(onChange).toHaveBeenCalledWith('a');
  });
});

describe('pick a first change', () => {
  it('offers three safe suggestions and your own, Start quiet until one is chosen', () => {
    start();
    expect(screen.getByRole('heading', { name: 'Pick a first change' })).toBeInTheDocument();
    expect(screen.getByText('Taken from the first look. Each one is low risk, so your first approval is quick and safe.')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', 'Pick a first change, step 8 of 8');
    expect(screen.getAllByRole('radio')).toHaveLength(3);
    expect(screen.getAllByText('Everyday')).toHaveLength(3);
    expect(screen.getByRole('textbox', { name: 'Or describe your own change' })).toHaveAttribute('placeholder', 'For example: add a gluten-free section to the menu page');
    expect(screen.getByRole('button', { name: 'Start this change' })).toHaveAttribute('aria-disabled', 'true');
  });

  it('starts the suggestion that was chosen', async () => {
    const { user, onStart } = start();
    await user.click(screen.getByRole('radio', { name: /Show today’s opening hours/ }));
    expect(screen.getByRole('radio', { name: /Show today’s opening hours/ })).toBeChecked();
    const cta = screen.getByRole('button', { name: 'Start this change' });
    expect(cta).toHaveAttribute('aria-disabled', 'false');
    await user.click(cta);
    expect(onStart).toHaveBeenCalledWith({ kind: 'suggestion', id: 'opening-hours' });
  });

  it('starts their own change instead, and typing clears any suggestion', async () => {
    const { user, onStart } = start();
    await user.click(screen.getByRole('radio', { name: /Make your phone number/ }));
    await user.type(screen.getByRole('textbox', { name: 'Or describe your own change' }), 'Add a gluten-free section to the menu page');
    for (const r of screen.getAllByRole('radio')) expect(r).not.toBeChecked();
    await user.click(screen.getByRole('button', { name: 'Start this change' }));
    expect(onStart).toHaveBeenCalledWith({ kind: 'own', text: 'Add a gluten-free section to the menu page' });
  });

  it('choosing a suggestion after typing clears what was typed', async () => {
    const { user } = start();
    await user.type(screen.getByRole('textbox', { name: 'Or describe your own change' }), 'Something');
    await user.click(screen.getByRole('radio', { name: /Describe 3 images/ }));
    expect(screen.getByRole('textbox', { name: 'Or describe your own change' })).toHaveValue('');
  });

  it('does not count spaces as a change', async () => {
    const { user } = start();
    await user.type(screen.getByRole('textbox', { name: 'Or describe your own change' }), '   ');
    expect(screen.getByRole('button', { name: 'Start this change' })).toHaveAttribute('aria-disabled', 'true');
  });

  it('only suggests content changes when the site allows Content only', () => {
    start('content');
    expect(screen.getByText('Your site allows Content only, so these are all changes to pages, posts and images. Each is low risk.')).toBeInTheDocument();
    expect(screen.getByText('Fix the missing description on 3 images')).toBeInTheDocument();
    expect(screen.getByText('Update your opening hours everywhere')).toBeInTheDocument();
    expect(screen.getByText('Add a holiday notice to the Contact page')).toBeInTheDocument();
  });

  it('goes back', async () => {
    const { user, onBack } = start();
    await user.click(screen.getByRole('button', { name: 'Back' }));
    expect(onBack).toHaveBeenCalledOnce();
  });
});
