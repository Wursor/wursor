import { describe, it, expect } from 'vitest';
import { ImageManager } from '../../src/sandbox/image-manager.ts';

describe('ImageManager', () => {
  const manager = new ImageManager({ baseImage: 'wursor-base:latest', webPort: 8080 });

  it('returns the pre-baked image ref', () => {
    expect(manager.imageRef()).toBe('wursor-base:latest');
  });

  it('produces a container spec with the web port and management label', () => {
    expect(manager.containerSpec('wursor-abc')).toEqual({
      image: 'wursor-base:latest',
      name: 'wursor-abc',
      ports: [{ container: 80, host: 8080 }],
      labels: { 'wursor.managed': 'true' },
    });
  });
});
