import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ModeMenu } from '../../src/product/ModeMenu.tsx';
import { FeedbackProvider } from '../../src/system/Feedback.tsx';

const setup = () => {
  render(
    <FeedbackProvider>
      <ModeMenu mode="Ask first" />
    </FeedbackProvider>,
  );
  return userEvent.setup();
};

describe('ModeMenu', () => {
  it('opens a menu of the three ways Wursor can work, with the current one checked', async () => {
    const user = setup();
    const trigger = screen.getByRole('button', { name: 'Ask first' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getAllByRole('menuitemradio').map((i) => i.firstElementChild?.textContent)).toEqual(['Ask first', 'Go ahead', 'Plan only']);
    expect(screen.getByRole('menuitemradio', { name: /Ask first/ })).toBeChecked();
  });

  it('choosing one changes the label, closes the menu and says what it means', async () => {
    const user = setup();
    await user.click(screen.getByRole('button', { name: 'Ask first' }));
    await user.click(screen.getByRole('menuitemradio', { name: /Plan only/ }));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Plan only' })).toHaveFocus();
    expect(screen.getByRole('status')).toHaveTextContent(/only write a plan/i);
  });

  it('Escape closes it, and it links to the real settings page', async () => {
    const user = setup();
    await user.click(screen.getByRole('button', { name: 'Ask first' }));
    expect(screen.getByRole('link', { name: 'Safety and approvals settings' })).toHaveAttribute('href', '/settings/safety');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});
