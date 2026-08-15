import { describe, it, expect } from 'vitest';
import { SandboxManager } from '../../src/services/sandbox-manager.ts';
import type { DockerClient } from '../../src/sandbox/docker-client.ts';

class FakeDocker implements DockerClient {
  created: string[] = [];
  destroyed: string[] = [];

  async createSandbox(image: string) {
    this.created.push(image);
    return { id: 'sb-1', status: 'running' as const };
  }

  async destroySandbox(id: string) {
    this.destroyed.push(id);
  }

  async status(id: string) {
    return this.destroyed.includes(id) ? undefined : { id, status: 'running' as const };
  }
}

describe('SandboxManager', () => {
  it('spins up a sandbox and returns a preview URL', async () => {
    const docker = new FakeDocker();
    const manager = new SandboxManager(docker, { image: 'wursor-base:latest', previewBaseUrl: 'https://preview.wursor.dev' });

    const result = await manager.start();
    expect(result).toEqual({ sandboxId: 'sb-1', previewUrl: 'https://preview.wursor.dev/sb-1' });
    expect(docker.created).toEqual(['wursor-base:latest']);
  });

  it('honors an explicit image override', async () => {
    const docker = new FakeDocker();
    const manager = new SandboxManager(docker, { image: 'wursor-base:latest', previewBaseUrl: 'https://preview.wursor.dev' });

    await manager.start('wursor-base:canary');
    expect(docker.created).toEqual(['wursor-base:canary']);
  });

  it('destroys a sandbox', async () => {
    const docker = new FakeDocker();
    const manager = new SandboxManager(docker, { image: 'wursor-base:latest', previewBaseUrl: 'https://preview.wursor.dev' });

    await manager.destroy('sb-1');
    expect(docker.destroyed).toEqual(['sb-1']);
  });
});
