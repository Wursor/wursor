import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CommandPaletteProvider } from '../../src/marketing/CommandPalette.tsx';
import { DocsSearch } from '../../src/marketing/pages/DocsSearch.tsx';
import { Nav } from '../../src/marketing/Nav.tsx';

function setup() {
  return render(
    <CommandPaletteProvider>
      <Nav />
      <DocsSearch />
      <button type="button">Elsewhere</button>
    </CommandPaletteProvider>,
  );
}

const dialog = () => screen.queryByRole('dialog', { name: 'Search' });

describe('CommandPalette', () => {
  beforeEach(() => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }) as unknown as typeof window.matchMedia;
  });
  afterEach(() => {
    document.body.style.overflow = '';
  });

  it('is closed until asked for', () => {
    setup();
    expect(dialog()).not.toBeInTheDocument();
  });

  it.each([
    ['Ctrl+K', '{Control>}k{/Control}'],
    ['Cmd+K', '{Meta>}k{/Meta}'],
  ])('opens with %s and focuses the search box', async (_name, keys) => {
    setup();
    await userEvent.keyboard(keys);
    expect(dialog()).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Search the site' })).toHaveFocus();
  });

  it('opens while typing in a text field, and stops the browser acting on the shortcut', async () => {
    render(
      <CommandPaletteProvider>
        <input aria-label="Name" />
      </CommandPaletteProvider>,
    );
    screen.getByRole('textbox', { name: 'Name' }).focus();
    const handled: boolean[] = [];
    const spy = (e: KeyboardEvent) => e.key === 'k' && handled.push(e.defaultPrevented);
    document.addEventListener('keydown', spy);
    try {
      await userEvent.keyboard('{Control>}k{/Control}');
    } finally {
      document.removeEventListener('keydown', spy);
    }
    expect(dialog()).toBeInTheDocument();
    expect(handled).toEqual([true]);
  });

  it('toggles closed with the same shortcut', async () => {
    setup();
    await userEvent.keyboard('{Control>}k{/Control}');
    await userEvent.keyboard('{Control>}k{/Control}');
    expect(dialog()).not.toBeInTheDocument();
  });

  it('closes with Escape and hands focus back to where it was', async () => {
    setup();
    screen.getByRole('button', { name: 'Elsewhere' }).focus();
    await userEvent.keyboard('{Control>}k{/Control}');
    await userEvent.keyboard('{Escape}');
    expect(dialog()).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Elsewhere' })).toHaveFocus();
  });

  it('closes when the backdrop is clicked, but not when the panel is', async () => {
    setup();
    await userEvent.keyboard('{Control>}k{/Control}');
    await userEvent.click(screen.getByRole('combobox'));
    expect(dialog()).toBeInTheDocument();
    await userEvent.click(screen.getByTestId('palette-backdrop'));
    expect(dialog()).not.toBeInTheDocument();
  });

  it('suggests the pages before anything is typed', async () => {
    setup();
    await userEvent.keyboard('{Control>}k{/Control}');
    const options = within(screen.getByRole('listbox')).getAllByRole('option');
    expect(options.map((o) => o.textContent)).toEqual(expect.arrayContaining([expect.stringContaining('Pricing'), expect.stringContaining('Docs')]));
  });

  it('filters as you type and links each result to its page', async () => {
    setup();
    await userEvent.keyboard('{Control>}k{/Control}');
    await userEvent.keyboard('pricing');
    const options = within(screen.getByRole('listbox')).getAllByRole('option');
    expect(options[0]).toHaveTextContent('Pricing');
    expect(options[0]).toHaveAttribute('href', '/pricing');
  });

  it('says so when nothing matches', async () => {
    setup();
    await userEvent.keyboard('{Control>}k{/Control}');
    await userEvent.keyboard('zzzz');
    expect(screen.queryByRole('option')).not.toBeInTheDocument();
    expect(screen.getByText(/No results for/)).toHaveTextContent('zzzz');
  });

  it('moves the selection with the arrow keys and wraps around', async () => {
    setup();
    await userEvent.keyboard('{Control>}k{/Control}');
    const input = screen.getByRole('combobox');
    const options = () => within(screen.getByRole('listbox')).getAllByRole('option');
    expect(options()[0]).toHaveAttribute('aria-selected', 'true');
    expect(input).toHaveAttribute('aria-activedescendant', options()[0]!.id);

    await userEvent.keyboard('{ArrowDown}');
    expect(options()[1]).toHaveAttribute('aria-selected', 'true');

    await userEvent.keyboard('{ArrowUp}{ArrowUp}');
    expect(options().at(-1)).toHaveAttribute('aria-selected', 'true');
  });

  it('opens the selected result with Enter and closes', async () => {
    setup();
    const clicked = vi.fn();
    const onClick = (e: MouseEvent) => {
      e.preventDefault();
      clicked((e.target as HTMLElement).closest('a')?.getAttribute('href'));
    };
    document.addEventListener('click', onClick);
    try {
      await userEvent.keyboard('{Control>}k{/Control}');
      await userEvent.keyboard('pricing{Enter}');
      expect(clicked).toHaveBeenCalledWith('/pricing');
      expect(dialog()).not.toBeInTheDocument();
    } finally {
      document.removeEventListener('click', onClick);
    }
  });

  it('starts from the top of the list each time it opens', async () => {
    setup();
    await userEvent.keyboard('{Control>}k{/Control}');
    await userEvent.keyboard('zzzz{Escape}');
    await userEvent.keyboard('{Control>}k{/Control}');
    expect(screen.getByRole('combobox')).toHaveValue('');
    expect(screen.getAllByRole('option')[0]).toHaveAttribute('aria-selected', 'true');
  });

  it('keeps the page from scrolling behind it while open', async () => {
    setup();
    await userEvent.keyboard('{Control>}k{/Control}');
    expect(document.body.style.overflow).toBe('hidden');
    await userEvent.keyboard('{Escape}');
    expect(document.body.style.overflow).toBe('');
  });

  it('keeps focus in the search box when Tab is pressed', async () => {
    setup();
    await userEvent.keyboard('{Control>}k{/Control}');
    await userEvent.tab();
    expect(screen.getByRole('combobox')).toHaveFocus();
  });
});

describe('search triggers', () => {
  beforeEach(() => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }) as unknown as typeof window.matchMedia;
  });

  it('opens from the Search button in the navigation', async () => {
    setup();
    await userEvent.click(screen.getByRole('button', { name: 'Search' }));
    expect(dialog()).toBeInTheDocument();
  });

  it('opens from the docs search field, which is no longer disabled', async () => {
    setup();
    const field = screen.getByRole('searchbox', { name: 'Search the docs' });
    expect(field).toBeEnabled();
    await userEvent.click(field);
    expect(dialog()).toBeInTheDocument();
  });

  it('shows the shortcut on the docs search field', () => {
    setup();
    expect(screen.getByText('Ctrl K')).toBeInTheDocument();
  });

  it('does nothing, and does not crash, when there is no provider', async () => {
    render(<Nav />);
    await userEvent.click(screen.getByRole('button', { name: 'Search' }));
    expect(dialog()).not.toBeInTheDocument();
  });
});
