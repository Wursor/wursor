import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { WorkspaceStep } from '../../src/onboarding/WorkspaceStep.tsx';
import { StepIndicator } from '../../src/onboarding/StepIndicator.tsx';
import { Banner } from '../../src/ui/Banner.tsx';

const setup = () => {
  const handlers = { onContinue: vi.fn(), onSkip: vi.fn(), onBack: vi.fn(), onSaveAndExit: vi.fn() };
  render(<WorkspaceStep {...handlers} />);
  return handlers;
};
const business = () => screen.getByRole('textbox', { name: "What's your business called?" });
const roles = () => screen.getByRole('radiogroup', { name: 'What best describes you?' });
const continueBtn = () => screen.getByRole('button', { name: 'Continue' });

describe('StepIndicator', () => {
  it('shows how far along the setup is, in words and in segments', () => {
    render(<StepIndicator step={3} label="Name your workspace" />);
    const bar = screen.getByRole('progressbar', { name: 'Setup progress' });
    expect(bar).toHaveAttribute('aria-valuenow', '3');
    expect(bar).toHaveAttribute('aria-valuemax', '8');
    expect(screen.getByText('Name your workspace')).toBeInTheDocument();
    expect(screen.getByText('3 of 8')).toBeInTheDocument();
    const segments = bar.querySelectorAll('[data-segment]');
    expect(segments).toHaveLength(8);
    expect([...segments].map((s) => s.getAttribute('data-filled'))).toEqual(['true', 'true', 'true', 'false', 'false', 'false', 'false', 'false']);
  });
});

describe('Banner', () => {
  it('carries a message with an info mark', () => {
    render(<Banner>Every feature stays the same.</Banner>);
    expect(screen.getByText('Every feature stays the same.')).toBeInTheDocument();
  });
});

describe('Name your workspace (3a to 3c)', () => {
  it('sits in the setup frame: Help, Save and exit, step 3 of 8, the heading and its explanation', () => {
    setup();
    expect(screen.getByRole('link', { name: 'Help' })).toHaveAttribute('href', '/docs');
    expect(screen.getByRole('button', { name: 'Save and exit' })).toBeInTheDocument();
    expect(screen.getByText('3 of 8')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Name your workspace' })).toBeInTheDocument();
    expect(screen.getByText('Two quick questions so Wursor starts with the right defaults. You can change both later.')).toBeInTheDocument();
  });

  it('starts on the business name, with Harbor Bakery as the example', () => {
    setup();
    expect(business()).toHaveFocus();
    expect(business()).toHaveAttribute('placeholder', 'Harbor Bakery');
  });

  it('offers owner, agency and in-house, none chosen yet', () => {
    setup();
    const options = within(roles()).getAllByRole('radio');
    expect(options.map((o) => o.getAttribute('value'))).toEqual(['owner', 'agency', 'in-house']);
    expect(options.every((o) => !(o as HTMLInputElement).checked)).toBe(true);
    expect(within(roles()).getByText('I run the business and approve changes myself.')).toBeInTheDocument();
    expect(within(roles()).getByText('I manage WordPress sites for clients.')).toBeInTheDocument();
    expect(within(roles()).getByText('I look after my company’s site as part of a team.')).toBeInTheDocument();
  });

  it('asks how many sites, with one chosen to begin with', () => {
    setup();
    const sites = screen.getByRole('radiogroup', { name: 'How many sites will you connect?' });
    const choices = within(sites).getAllByRole('radio');
    expect(choices.map((c) => c.textContent)).toEqual(['1', '2 to 5', '6 or more']);
    expect(choices.map((c) => c.getAttribute('aria-checked'))).toEqual(['true', 'false', 'false']);
  });

  it('keeps Continue quiet until there is a name and a role', async () => {
    setup();
    expect(continueBtn()).toHaveAttribute('aria-disabled', 'true');
    await userEvent.type(business(), 'Harbor Bakery');
    expect(continueBtn()).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(within(roles()).getByRole('radio', { name: /Owner/ }));
    expect(continueBtn()).toHaveAttribute('aria-disabled', 'false');
  });

  it('does not count a name made only of spaces', async () => {
    setup();
    await userEvent.type(business(), '   ');
    await userEvent.click(within(roles()).getByRole('radio', { name: /Owner/ }));
    expect(continueBtn()).toHaveAttribute('aria-disabled', 'true');
  });

  it('passes on the trimmed name, the role and the number of sites', async () => {
    const { onContinue } = setup();
    await userEvent.type(business(), '  Harbor Bakery ');
    await userEvent.click(within(roles()).getByRole('radio', { name: /Owner/ }));
    await userEvent.click(screen.getByRole('radio', { name: '2 to 5' }));
    await userEvent.click(continueBtn());
    expect(onContinue).toHaveBeenCalledWith({ name: 'Harbor Bakery', role: 'owner', sites: '2-5' });
  });

  it('does nothing when Continue is pressed too early', async () => {
    const { onContinue } = setup();
    await userEvent.click(continueBtn());
    expect(onContinue).not.toHaveBeenCalled();
  });

  it('tells an agency how its sites are grouped, and only an agency', async () => {
    setup();
    const note = 'As an agency, your sites will be grouped by client. Every feature stays the same.';
    expect(screen.queryByText(note)).not.toBeInTheDocument();
    await userEvent.click(within(roles()).getByRole('radio', { name: /Agency/ }));
    expect(screen.getByText(note)).toBeInTheDocument();
    await userEvent.click(within(roles()).getByRole('radio', { name: /In-house/ }));
    expect(screen.queryByText(note)).not.toBeInTheDocument();
  });

  it('lets the visitor go back, skip, or save and leave', async () => {
    const { onBack, onSkip, onSaveAndExit } = setup();
    await userEvent.click(screen.getByRole('button', { name: 'Back' }));
    await userEvent.click(screen.getByRole('button', { name: 'Skip for now' }));
    await userEvent.click(screen.getByRole('button', { name: 'Save and exit' }));
    expect([onBack, onSkip, onSaveAndExit].map((f) => f.mock.calls.length)).toEqual([1, 1, 1]);
  });
});
