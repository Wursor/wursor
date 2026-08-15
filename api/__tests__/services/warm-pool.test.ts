import { describe, it, expect } from 'vitest';
import { WarmPool, computeSpares } from '../../src/services/warm-pool.ts';
import type { DockerClient, SandboxInfo } from '../../src/sandbox/docker-client.ts';

class FakeDocker implements DockerClient {
  created: string[] = [];

  async createSandbox(image: string): Promise<SandboxInfo> {
    this.created.push(image);
    return { id: `sb-${this.created.length}`, status: 'running' };
  }

  async destroySandbox(): Promise<void> {}

  async status(): Promise<SandboxInfo | undefined> {
    return undefined;
  }
}

describe('computeSpares', () => {
  it('returns the shortfall', () => {
    expect(computeSpares(1, 3)).toBe(2);
  });

  it('never returns a negative number', () => {
    expect(computeSpares(5, 2)).toBe(0);
  });
});

describe('WarmPool', () => {
  it('tops up the pool to the target hot-spare count', async () => {
    const docker = new FakeDocker();
    const pool = new WarmPool(docker, { image: 'wursor-base:latest', hotSpares: 2 });

    const result = await pool.topUp(0);
    expect(result.created).toBe(2);
    expect(docker.created).toEqual(['wursor-base:latest', 'wursor-base:latest']);
  });

  it('does nothing when the pool is already full', async () => {
    const docker = new FakeDocker();
    const pool = new WarmPool(docker, { image: 'wursor-base:latest', hotSpares: 2 });

    const result = await pool.topUp(3);
    expect(result.created).toBe(0);
    expect(docker.created).toEqual([]);
  });
});
