import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CoachMark } from '../../src/workspace/CoachMark.tsx';
import { WorkspaceApp } from '../../src/workspace/WorkspaceApp.tsx';

describe('CoachMark', () => {
  it('says where you are in the tour and offers Next and Skip tour', async () => {
    const onNext = vi.fn();
    const onSkip = vi.fn();
    render(<CoachMark step={1} total={4} title="Watch it work" body="Wursor explains each step here. Open any step to see more." arrow="left" onNext={onNext} onSkip={onSkip} />);
    expect(screen.getByText('1 of 4')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Watch it work' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Next' }));
    await userEvent.click(screen.getByRole('button', { name: 'Skip tour' }));
    expect(onNext).toHaveBeenCalledOnce();
    expect(onSkip).toHaveBeenCalledOnce();
  });

  it('is a dialog that is not modal, so the page stays usable', () => {
    render(<CoachMark step={2} total={4} title="T" body="B" arrow="up" onNext={() => {}} onSkip={() => {}} />);
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'false');
  });
});

describe('the guided tour of the workspace', () => {
  it('introduces the conversation, the preview and the to-do list while Wursor works, then the decision point', async () => {
    const user = userEvent.setup();
    render(<WorkspaceApp initialPhase="working" tourStep={1} />);
    const tip = () => within(screen.getByRole('dialog'));
    expect(tip().getByText('1 of 4')).toBeInTheDocument();
    expect(tip().getByText('Watch it work')).toBeInTheDocument();
    await user.click(tip().getByRole('button', { name: 'Next' }));
    expect(tip().getByText('See your site change')).toBeInTheDocument();
    expect(tip().getByText('Your site updates live here. Nothing goes public yet.')).toBeInTheDocument();
    await user.click(tip().getByRole('button', { name: 'Next' }));
    expect(tip().getByText('Your to-do list')).toBeInTheDocument();
    await user.click(tip().getByRole('button', { name: 'Next' }));
    expect(tip().getByText('4 of 4')).toBeInTheDocument();
    expect(tip().getByText('You decide when it goes live')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Approve and publish' })).toBeInTheDocument();
    await user.click(tip().getByRole('button', { name: 'Next' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('can be skipped at any step', async () => {
    const user = userEvent.setup();
    render(<WorkspaceApp initialPhase="working" tourStep={2} />);
    await user.click(screen.getByRole('button', { name: 'Skip tour' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('is not shown unless asked for', () => {
    render(<WorkspaceApp initialPhase="working" />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
