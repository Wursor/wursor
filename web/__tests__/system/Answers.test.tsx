import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Composer } from '../../src/product/Composer.tsx';
import { PreviewToolbar } from '../../src/product/PreviewToolbar.tsx';
import { HomeScreen } from '../../src/home/HomeScreen.tsx';
import { ActivityScreen } from '../../src/activity/ActivityScreen.tsx';
import { SiteDetail } from '../../src/sites/SiteDetail.tsx';
import { FeedbackProvider } from '../../src/system/Feedback.tsx';

const wrap = (ui: React.ReactElement) => render(<FeedbackProvider>{ui}</FeedbackProvider>);

describe('Composer tools answer', () => {
  it('dictate says it is not on yet instead of doing nothing', async () => {
    const user = userEvent.setup();
    wrap(<Composer state="empty" autonomy="Ask first" />);
    await user.click(screen.getByRole('button', { name: 'Dictate' }));
    expect(screen.getByRole('status')).toHaveTextContent(/Dictation/);
  });
  it('pointing toggles and says how to use it', async () => {
    const user = userEvent.setup();
    wrap(<Composer state="empty" autonomy="Ask first" />);
    const point = screen.getByRole('button', { name: 'Point at something on the page' });
    expect(point).toHaveAttribute('aria-pressed', 'false');
    await user.click(point);
    expect(point).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('status')).toHaveTextContent(/Pointing is on/);
  });
  it('attach opens the file picker and names what was chosen', async () => {
    const user = userEvent.setup();
    const { container } = wrap(<Composer state="empty" autonomy="Ask first" />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const click = vi.spyOn(input, 'click');
    await user.click(screen.getByRole('button', { name: 'Attach a file' }));
    expect(click).toHaveBeenCalled();
    await user.upload(input, new File(['x'], 'logo.png', { type: 'image/png' }));
    expect(screen.getByRole('status')).toHaveTextContent('logo.png attached');
  });
  it('the autonomy button opens a menu of ways to work, not a hint about settings', async () => {
    const user = userEvent.setup();
    wrap(<Composer state="empty" autonomy="Ask first" />);
    await user.click(screen.getByRole('button', { name: /Ask first/ }));
    expect(screen.getByRole('menu', { name: 'How Wursor works' })).toBeInTheDocument();
  });
});

describe('Preview device toggle', () => {
  it('marks the chosen device and reports it', async () => {
    const user = userEvent.setup();
    const onDevice = vi.fn();
    render(<PreviewToolbar selected="preview" onDevice={onDevice} />);
    await user.click(screen.getByRole('button', { name: 'Phone' }));
    expect(onDevice).toHaveBeenCalledWith('phone');
    expect(screen.getByRole('button', { name: 'Phone' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Desktop' })).toHaveAttribute('aria-pressed', 'false');
  });
});

describe('Home problem actions ask before acting', () => {
  it('undo today’s change opens a question, then reports', async () => {
    const user = userEvent.setup();
    wrap(<HomeScreen variant="problem" />);
    await user.click(screen.getByRole('button', { name: 'Undo today’s change' }));
    const dialog = screen.getByRole('alertdialog');
    await user.click(within(dialog).getByRole('button', { name: 'Undo today’s change' }));
    expect(screen.getByRole('status')).toHaveTextContent(/Undone/);
  });
});

describe('Activity proof drawer', () => {
  it('Undo asks first and Open proof goes to the proof view', async () => {
    const user = userEvent.setup();
    wrap(<ActivityScreen initialOpen="pub1" />);
    await user.click(screen.getByRole('button', { name: 'Undo this change' }));
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  });
});

describe('Site connection', () => {
  it('updating the helper says so and removes the warning', async () => {
    const user = userEvent.setup();
    wrap(<SiteDetail tab="where" />);
    await user.click(screen.getByRole('button', { name: 'Update' }));
    expect(screen.getByRole('status')).toHaveTextContent('updated to 1.5.0');
    expect(screen.queryByText(/one version behind/)).not.toBeInTheDocument();
  });
  it('disconnecting asks first', async () => {
    const user = userEvent.setup();
    wrap(<SiteDetail tab="where" />);
    await user.click(screen.getByRole('button', { name: 'Disconnect harborbakery.com' }));
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  });
});

describe('Drawers close with Escape', () => {
  it('the proof drawer', async () => {
    const user = userEvent.setup();
    wrap(<ActivityScreen initialOpen="pub1" />);
    expect(screen.getByRole('complementary', { name: 'Proof' })).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('complementary', { name: 'Proof' })).not.toBeInTheDocument();
  });
});

describe('The board strip under the preview', () => {
  it('"Open board" and every card lead to the board', async () => {
    const { BoardStrip } = await import('../../src/product/BoardStrip.tsx');
    const { HARBOR } = await import('../../src/product/harbor-bakery.ts');
    render(<BoardStrip lanes={HARBOR.board} />);
    expect(screen.getByRole('link', { name: 'Open board' })).toHaveAttribute('href', '/board');
    const card = screen.getByRole('link', { name: /Update opening hours/ });
    expect(card).toHaveAttribute('href', '/board?open=hours');
    for (const l of screen.getAllByRole('link', { name: /Home page|Contact page|Footer|Suggested|Yesterday|ago|Just now/ })) expect(l.getAttribute('href')).toMatch(/^\/board/);
  });
});

describe('Home suggestions and recent activity lead somewhere', () => {
  it('each "Try asking" idea opens the new-change box with that idea filled in', () => {
    wrap(<HomeScreen variant="caught-up" />);
    const ideas = screen.getByRole('region', { name: 'Try asking' });
    const first = within(ideas).getAllByRole('link')[0]!;
    const href = first.getAttribute('href')!;
    expect(href).toMatch(/^\/board\?composer=1&text=/);
    expect(decodeURIComponent(href.split('text=')[1]!)).toBe(first.textContent);
  });
  it('recent activity rows open Activity', () => {
    wrap(<HomeScreen variant="caught-up" />);
    const list = screen.getByRole('list', { name: 'Recent activity' });
    for (const a of within(list).getAllByRole('link')) expect(a).toHaveAttribute('href', '/activity');
  });
});

describe('New change dialog can start with text', () => {
  it('fills the box from the idea that was chosen', async () => {
    const { BoardScreen } = await import('../../src/board/BoardScreen.tsx');
    wrap(<BoardScreen initialComposer initialText="Add Sunday hours" />);
    expect(screen.getByDisplayValue('Add Sunday hours')).toBeInTheDocument();
  });
});
