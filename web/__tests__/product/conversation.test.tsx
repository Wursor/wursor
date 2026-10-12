import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ChangeEvent } from '../../src/product/ChangeEvent.tsx';
import { CheckEvent } from '../../src/product/CheckEvent.tsx';
import { Composer } from '../../src/product/Composer.tsx';
import { ConversationPanel } from '../../src/product/ConversationPanel.tsx';
import { Message } from '../../src/product/Message.tsx';
import { Milestone } from '../../src/product/Milestone.tsx';
import { StepGroup } from '../../src/product/StepGroup.tsx';
import { StepLine } from '../../src/product/StepLine.tsx';
import { Thought } from '../../src/product/Thought.tsx';

describe('Message', () => {
  it('puts what the owner said in a soft box', () => {
    render(<Message role="user">Make the phone number tappable.</Message>);
    expect(screen.getByText('Make the phone number tappable.').closest('.p-message')).toHaveClass('p-message-user');
  });

  it('shows Wursor replies beside the Wursor avatar', () => {
    render(<Message role="wursor">On it.</Message>);
    expect(screen.getByRole('img', { name: 'Wursor' })).toBeInTheDocument();
    expect(screen.getByText('On it.')).toBeInTheDocument();
  });
});

describe('StepGroup', () => {
  it('is collapsed by default and opens on press', async () => {
    render(<StepGroup title="Looked at 4 pages" count={4}>Home, Menu, Contact, About</StepGroup>);
    const toggle = screen.getByRole('button', { name: /Looked at 4 pages/ });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Home, Menu, Contact, About')).not.toBeInTheDocument();
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Home, Menu, Contact, About')).toBeInTheDocument();
  });

  it('shows the count', () => {
    render(<StepGroup title="Looked at 4 pages" count={4} />);
    expect(screen.getByText('4')).toHaveClass('p-counter');
  });
});

describe('Thought', () => {
  it('is collapsed by default, with the reasoning hidden', () => {
    render(<Thought seconds={6}>The number is plain text.</Thought>);
    expect(screen.getByRole('button', { name: 'Thought for 6 seconds' })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('The number is plain text.')).not.toBeInTheDocument();
  });

  it('shows the reasoning in plain words when expanded', async () => {
    render(<Thought seconds={6}>The number is plain text.</Thought>);
    await userEvent.click(screen.getByRole('button', { name: 'Thought for 6 seconds' }));
    expect(screen.getByText('The number is plain text.')).toBeInTheDocument();
  });

  it('can start expanded', () => {
    render(<Thought seconds={6} defaultExpanded>The number is plain text.</Thought>);
    expect(screen.getByText('The number is plain text.')).toBeInTheDocument();
  });
});

describe('StepLine', () => {
  it('shows what Wursor did and how long it took', () => {
    render(<StepLine kind="edit" time="4s">Made the Contact page number a tap-to-call link</StepLine>);
    expect(screen.getByText('Made the Contact page number a tap-to-call link')).toBeInTheDocument();
    expect(screen.getByText('4s')).toBeInTheDocument();
  });

  it('marks a running step so it is announced', () => {
    render(<StepLine kind="running" time="now">Taking a photo of the page on a phone</StepLine>);
    expect(screen.getByRole('status', { name: 'In progress' })).toBeInTheDocument();
  });
});

describe('ChangeEvent', () => {
  const props = {
    title: 'Changed the Contact page',
    meta: '1 section · 2 places',
    risk: 'everyday',
    added: 8,
    removed: 2,
  } as const;

  it('shows the change, its risk and how much changed', () => {
    render(<ChangeEvent {...props} />);
    expect(screen.getByText('Changed the Contact page')).toBeInTheDocument();
    expect(screen.getByText('Everyday')).toBeInTheDocument();
    expect(screen.getByText('+8 lines')).toBeInTheDocument();
    expect(screen.getByText('−2 lines')).toBeInTheDocument();
  });

  it('offers the full comparison', async () => {
    const onSeeChanges = vi.fn();
    render(<ChangeEvent {...props} onSeeChanges={onSeeChanges} />);
    await userEvent.click(screen.getByRole('button', { name: 'See what changed' }));
    expect(onSeeChanges).toHaveBeenCalledOnce();
  });
});

describe('CheckEvent', () => {
  it('reports a passed check quietly', () => {
    render(<CheckEvent result="passed" title="Checked 9 things. All passed." detail="Phone link works, 3 screen sizes." />);
    expect(screen.getByText('Checked 9 things. All passed.')).toBeInTheDocument();
    expect(screen.getByText('Phone link works, 3 screen sizes.')).toBeInTheDocument();
  });
});

describe('Milestone', () => {
  it('marks a stage in the life of a change', () => {
    render(<Milestone>Plan ready</Milestone>);
    expect(screen.getByRole('separator', { name: 'Plan ready' })).toBeInTheDocument();
  });
});

describe('Composer', () => {
  it('invites a note while Wursor is working, and offers to stop', async () => {
    const onStop = vi.fn();
    render(<Composer state="working" autonomy="Ask first" onStop={onStop} />);
    expect(screen.getByPlaceholderText('Wursor is working. Add a note, or stop.')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Stop' }));
    expect(onStop).toHaveBeenCalledOnce();
  });

  it('shows the autonomy level and the toolbar actions', () => {
    render(<Composer state="working" autonomy="Ask first" />);
    expect(screen.getByRole('button', { name: 'Ask first' })).toBeInTheDocument();
    for (const name of ['Attach a file', 'Point at something on the page', 'Dictate']) {
      expect(screen.getByRole('button', { name })).toBeInTheDocument();
    }
  });

  it('lets the owner keep typing while it works', async () => {
    render(<Composer state="working" autonomy="Ask first" />);
    await userEvent.type(screen.getByRole('textbox', { name: 'Message to Wursor' }), 'Also the header');
    expect(screen.getByRole('textbox', { name: 'Message to Wursor' })).toHaveValue('Also the header');
  });
});

describe('ConversationPanel', () => {
  it('has a header with the three detail levels, and a stream', () => {
    render(
      <ConversationPanel density="steps" onDensityChange={() => {}}>
        <Message role="user">Hello</Message>
      </ConversationPanel>,
    );
    expect(screen.getByRole('heading', { name: 'Conversation' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Steps' })).toBeChecked();
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('reports a change of detail level', async () => {
    const onDensityChange = vi.fn();
    render(<ConversationPanel density="steps" onDensityChange={onDensityChange} />);
    await userEvent.click(screen.getByRole('radio', { name: 'Everything' }));
    expect(onDensityChange).toHaveBeenCalledWith('everything');
  });
});
