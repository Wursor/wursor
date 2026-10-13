'use client';

import { useEffect, useState } from 'react';
import { SearchField } from '../../product/SearchField.tsx';
import { useCommandPalette } from '../CommandPalette.tsx';
import { isApplePlatform, shortcutLabel } from '../search.ts';

/** The Docs hero search field. It opens the site search, so there is one search with one result list. */
export function DocsSearch() {
  const { open } = useCommandPalette();
  // The server can't know the visitor's platform, so it renders the design's ⌘K and the browser corrects it.
  const [hint, setHint] = useState(shortcutLabel(true));
  useEffect(() => setHint(shortcutLabel(isApplePlatform())), []);
  return <SearchField label="Search the docs" shortcut={hint} placeholder="Search the docs…" onActivate={open} />;
}
