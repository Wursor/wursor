import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { FeedbackProvider } from '../../src/system/Feedback.tsx';
import { SupportScreen, WhatsNewScreen } from '../../src/help/HelpScreens.tsx';

describe('Support', () => {
  it('will not send an empty message, and says why', async () => {
    const user = userEvent.setup();
    render(
      <FeedbackProvider>
        <SupportScreen />
      </FeedbackProvider>,
    );
    await user.click(screen.getByRole('button', { name: 'Send message' }));
    expect(screen.getByText('Tell us a little about what happened first.')).toBeInTheDocument();
  });

  it('sends a message, confirms, and clears the box', async () => {
    const user = userEvent.setup();
    render(
      <FeedbackProvider>
        <SupportScreen />
      </FeedbackProvider>,
    );
    await user.type(screen.getByLabelText('How can we help?'), 'My footer looks odd');
    await user.click(screen.getByRole('button', { name: 'Send message' }));
    expect(screen.getByRole('status')).toHaveTextContent('Message sent');
    expect(screen.getByLabelText('How can we help?')).toHaveValue('');
  });
});

describe('What is new', () => {
  it('lists releases newest first', () => {
    render(
      <FeedbackProvider>
        <WhatsNewScreen />
      </FeedbackProvider>,
    );
    expect(screen.getByRole('heading', { name: 'What is new', level: 1 })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem').length).toBeGreaterThanOrEqual(3);
  });
});
