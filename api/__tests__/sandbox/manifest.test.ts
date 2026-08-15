import { describe, it, expect } from 'vitest';
import { diffManifest } from '../../src/sandbox/manifest.ts';

describe('diffManifest', () => {
  it('detects added, changed, and removed paths', () => {
    const before = {
      '/theme/style.css': 'a1',
      '/theme/theme.json': 'b2',
      '/theme/old.css': 'c3',
    };
    const after = {
      '/theme/style.css': 'a1',
      '/theme/theme.json': 'b2-new',
      '/theme/new.css': 'd4',
    };

    expect(diffManifest(before, after)).toEqual({
      added: ['/theme/new.css'],
      changed: ['/theme/theme.json'],
      removed: ['/theme/old.css'],
    });
  });

  it('reports empty arrays when nothing changed', () => {
    const manifest = { '/a.css': 'x' };
    expect(diffManifest(manifest, { ...manifest })).toEqual({ added: [], changed: [], removed: [] });
  });
});
