import { describe, it, expect } from 'vitest';
import { buildApp } from '../../src/app.ts';
import { SandboxManager } from '../../src/services/sandbox-manager.ts';
import type { DockerClient, SandboxInfo } from '../../src/sandbox/docker-client.ts';

class FakeDocker implements DockerClient {
  async createSandbox(): Promise<SandboxInfo> {
    return { id: 'sb-1', status: 'running' };
  }

  async destroySandbox(): Promise<void> {}

  async status(): Promise<SandboxInfo | undefined> {
    return undefined;
  }
}

describe('POST /sessions', () => {
  it('spins up a sandbox and returns a preview URL', async () => {
    const manager = new SandboxManager(new FakeDocker(), {
      image: 'wursor-base:latest',
      previewBaseUrl: 'https://preview.wursor.dev',
    });
    const app = await buildApp({ sandboxManager: manager });

    const res = await app.inject({ method: 'POST', url: '/sessions' });
    expect(res.statusCode).toBe(201);
    const body = res.json();
    expect(body.sandboxId).toBe('sb-1');
    expect(body.previewUrl).toBe('https://preview.wursor.dev/sb-1');
    expect(body.sessionId).toBeTruthy();
  });

  it('returns 503 when no sandbox manager is configured', async () => {
    const app = await buildApp();
    const res = await app.inject({ method: 'POST', url: '/sessions' });
    expect(res.statusCode).toBe(503);
    expect(res.json().error).toBe('sandbox_not_configured');
  });
});
