import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ApprovalBar } from '../../src/product/ApprovalBar.tsx';
import { CheckEvent } from '../../src/product/CheckEvent.tsx';
import { Composer } from '../../src/product/Composer.tsx';
import { Milestone } from '../../src/product/Milestone.tsx';
import { StatusPill } from '../../src/product/StatusPill.tsx';
import { CaptureEvent } from '../../src/workspace/CaptureEvent.tsx';
import { ChangeRow } from '../../src/workspace/ChangeRow.tsx';
import { DecisionCard } from '../../src/workspace/DecisionCard.tsx';
import { PlanCard } from '../../src/workspace/PlanCard.tsx';
import { SidebarRail } from '../../src/workspace/SidebarRail.tsx';
import { WhatChangedDrawer } from '../../src/workspace/WhatChangedDrawer.tsx';

describe('StatusPill, the whole life of a change', () => {
  it.each([
    ['plan-ready', 'Plan ready'],
    ['ready', 'Ready for you'],
    ['approved', 'Approved'],
    ['live', 'Live'],
  ] as const)('says %s in plain words', (status, label) => {
    render(<StatusPill status={status} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });
});

describe('Milestone kinds', () => {
  it('names each stage and keeps the plain label', () => {
    const { rerender } = render(<Milestone kind="needs-you">Needs you</Milestone>);
    expect(screen.getByRole('separator', { name: 'Needs you' })).toHaveAttribute('data-kind', 'needs-you');
    rerender(<Milestone kind="ready">Ready for you</Milestone>);
    expect(screen.getByRole('separator', { name: 'Ready for you' })).toHaveAttribute('data-kind', 'ready');
    rerender(<Milestone kind="published">Published</Milestone>);
    expect(screen.getByRole('separator', { name: 'Published' })).toHaveAttribute('data-kind', 'published');
  });
});

describe('CheckEvent, passed or needing a look', () => {
  it('is amber and names the one thing to look at when it needs attention', () => {
    render(<CheckEvent result="attention" title="Looked at the footer on small phones" detail="The footer number wraps." />);
    expect(screen.getByText('Looked at the footer on small phones').closest('.p-check')).toHaveAttribute('data-result', 'attention');
  });
});

describe('CaptureEvent', () => {
  it('shows a photo of the page with Before or After', () => {
    const { rerender } = render(<CaptureEvent when="after" caption="Contact page on a phone" />);
    expect(screen.getByText('After')).toBeInTheDocument();
    expect(screen.getByText('Contact page on a phone')).toBeInTheDocument();
    rerender(<CaptureEvent when="before" caption="Contact page on a phone" />);
    expect(screen.getByText('Before')).toBeInTheDocument();
  });
});

describe('PlanCard', () => {
  const steps = ['Make the Contact page number a tap-to-call link', 'Do the same in the footer'];
  it('lists the numbered steps, the risk, and Start and Edit plan', async () => {
    const onStart = vi.fn();
    const onEdit = vi.fn();
    render(<PlanCard steps={steps} meta="About 3 minutes · Easy to undo" onStart={onStart} onEdit={onEdit} />);
    expect(screen.getByText('The plan')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Do the same in the footer')).toBeInTheDocument();
    expect(screen.getByText('Everyday')).toBeInTheDocument();
    expect(screen.getByText('About 3 minutes · Easy to undo')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Start' }));
    await userEvent.click(screen.getByRole('button', { name: 'Edit plan' }));
    expect(onStart).toHaveBeenCalledOnce();
    expect(onEdit).toHaveBeenCalledOnce();
  });
});

describe('DecisionCard', () => {
  it('asks the question, offers each answer, and says the change is paused', async () => {
    const onAnswer = vi.fn();
    render(<DecisionCard question="Your header and footer both show the phone number. Change both?" options={['Change both', 'Only the Contact page']} onAnswer={onAnswer} />);
    expect(screen.getByText('Wursor needs a decision')).toBeInTheDocument();
    expect(screen.getByText('This change is paused until you answer.')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Only the Contact page' }));
    expect(onAnswer).toHaveBeenCalledWith('Only the Contact page');
  });
});

describe('ApprovalBar states', () => {
  it('ready: asks for changes or approves', async () => {
    const onApprove = vi.fn();
    const onAskChanges = vi.fn();
    render(<ApprovalBar state="ready" title="Ready for you" meta="2 changes · Easy to undo" onApprove={onApprove} onAskChanges={onAskChanges} />);
    await userEvent.click(screen.getByRole('button', { name: 'Ask for changes' }));
    await userEvent.click(screen.getByRole('button', { name: 'Approve and publish' }));
    expect(onAskChanges).toHaveBeenCalledOnce();
    expect(onApprove).toHaveBeenCalledOnce();
  });

  it('publishing: shows progress, no buttons', () => {
    render(<ApprovalBar state="publishing" title="Publishing to harborbakery.com…" meta="Wursor takes a safe copy first, then publishes." progress={0.6} />);
    expect(screen.getByRole('progressbar', { name: 'Publishing' })).toHaveAttribute('aria-valuenow', '60');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('published: one click to view the live site or undo', async () => {
    const onUndo = vi.fn();
    render(<ApprovalBar state="published" title="Live on harborbakery.com" meta="Published 9:41 AM" onUndo={onUndo} />);
    expect(screen.getByRole('link', { name: 'View live site' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Undo' }));
    expect(onUndo).toHaveBeenCalledOnce();
  });

  it('keeps the old ready bar working', () => {
    render(<ApprovalBar title="Ready for you" meta="2 changes · Everyday risk" />);
    expect(screen.getByRole('button', { name: 'Approve and publish' })).toBeInTheDocument();
  });
});

describe('Composer states', () => {
  it('empty: ask to change something, send is quiet', () => {
    render(<Composer state="empty" autonomy="Ask first" />);
    expect(screen.getByPlaceholderText('Ask Wursor to change something…')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send' })).toHaveAttribute('aria-disabled', 'true');
  });

  it('typing: send is ready and sends the text', async () => {
    const onSend = vi.fn();
    render(<Composer state="empty" autonomy="Ask first" onSend={onSend} />);
    await userEvent.type(screen.getByRole('textbox', { name: 'Message to Wursor' }), 'Make it blue');
    const send = screen.getByRole('button', { name: 'Send' });
    expect(send).toHaveAttribute('aria-disabled', 'false');
    await userEvent.click(send);
    expect(onSend).toHaveBeenCalledWith('Make it blue');
  });
});

describe('SidebarRail', () => {
  it('keeps only icons: places, changes, new change, account', () => {
    render(<SidebarRail account={{ initials: 'AO', name: 'Amara Okoye' }} />);
    for (const name of ['Home', 'Board', 'Activity', 'Sites']) expect(screen.getByRole('link', { name })).toBeInTheDocument();
    for (const name of ['Changes', 'New change']) expect(screen.getByRole('button', { name })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Amara Okoye' })).toBeInTheDocument();
  });
});

describe('ChangeRow and the What changed drawer', () => {
  it('shows the place, what changed in plain words, and the size', () => {
    render(<ChangeRow place="Contact page" summary="Phone number is now a tap-to-call link" added={8} removed={2} />);
    expect(screen.getByText('Contact page')).toBeInTheDocument();
    expect(screen.getByText('+8')).toBeInTheDocument();
    expect(screen.getByText('−2')).toBeInTheDocument();
  });

  it('gives the verdict, the risk, each change, and developer details on request', async () => {
    const onClose = vi.fn();
    render(
      <WhatChangedDrawer
        verdict="Wursor checked 9 things. All passed."
        changes={[
          { place: 'Contact page', summary: 'Phone number is now a tap-to-call link', added: 8, removed: 2 },
          { place: 'Footer', summary: 'Same number, same tap-to-call link', added: 3, removed: 1 },
        ]}
        onClose={onClose}
      />,
    );
    expect(screen.getByRole('complementary', { name: 'What changed' })).toBeInTheDocument();
    expect(screen.getByText('Wursor checked 9 things. All passed.')).toBeInTheDocument();
    expect(screen.getByText('Easy to undo. Nothing goes live until you approve.')).toBeInTheDocument();
    expect(screen.getByText('2 changes')).toBeInTheDocument();
    const dev = screen.getByRole('button', { name: /Developer details/ });
    expect(dev).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(dev);
    expect(dev).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledOnce();
    expect(within(screen.getByRole('complementary')).getAllByRole('listitem')).toHaveLength(2);
  });
});
