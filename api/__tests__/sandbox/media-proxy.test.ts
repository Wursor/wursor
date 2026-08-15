import { describe, it, expect } from 'vitest';
import { mediaProxyTarget, resolveMediaPath, stageReplacement } from '../../src/sandbox/media-proxy.ts';

describe('media proxy', () => {
  it('proxies an upload to the origin', () => {
    expect(mediaProxyTarget('https://example.com', '/wp-content/uploads/2024/hero.jpg')).toBe(
      'https://example.com/wp-content/uploads/2024/hero.jpg',
    );
  });

  it('serves a staged replacement locally instead of proxying', () => {
    const staged = new Set(['/wp-content/uploads/2024/hero.jpg']);
    expect(resolveMediaPath('https://example.com', '/wp-content/uploads/2024/hero.jpg', staged)).toBe(
      '/wp-content/uploads/2024/hero.jpg',
    );
    expect(resolveMediaPath('https://example.com', '/wp-content/uploads/2024/other.jpg', staged)).toBe(
      'https://example.com/wp-content/uploads/2024/other.jpg',
    );
  });

  it('copies a file only when it is replaced', () => {
    expect(stageReplacement('https://example.com', '/wp-content/uploads/2024/hero.jpg', 12)).toEqual({
      copiedPaths: ['/wp-content/uploads/2024/hero.jpg'],
    });
  });
});
