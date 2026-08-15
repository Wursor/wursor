import { describe, it, expect } from 'vitest';
import { DockerodeClient, type ContainerLike, type DockerEngine } from '../../src/sandbox/dockerode-client.ts';

class FakeEngine implements DockerEngine {
  createdImages: string[] = [];
  names: string[] = [];
  removed: string[] = [];

  constructor(
    private readonly opts: { running?: boolean; failInspect?: boolean } = {},
  ) {}

  private container(): ContainerLike {
    return {
      start: async () => {},
      inspect: async () => {
        if (this.opts.failInspect) {
          throw new Error('not found');
        }
        return { Id: 'id-1', State: { Running: this.opts.running ?? true } };
      },
      remove: async () => {
        this.removed.push('id-1');
      },
    };
  }

  async createContainer(spec: { Image: string; name: string }): Promise<ContainerLike> {
    this.createdImages.push(spec.Image);
    this.names.push(spec.name);
    return this.container();
  }

  getContainer(_id: string): ContainerLike {
    return this.container();
  }
}

describe('DockerodeClient', () => {
  it('spins up a sandbox container from an image and reports it running', async () => {
    const engine = new FakeEngine();
    const client = new DockerodeClient(engine);

    const info = await client.createSandbox('wursor-base:latest');
    expect(info).toEqual({ id: 'id-1', status: 'running' });
    expect(engine.createdImages).toEqual(['wursor-base:latest']);
    expect(engine.names[0]?.startsWith('wursor-')).toBe(true);
  });

  it('reports destroyed when the container is not running after start', async () => {
    const engine = new FakeEngine({ running: false });
    const client = new DockerodeClient(engine);

    expect(await client.createSandbox('wursor-base:latest')).toEqual({ id: 'id-1', status: 'destroyed' });
  });

  it('destroys a sandbox container', async () => {
    const engine = new FakeEngine();
    const client = new DockerodeClient(engine);

    await client.destroySandbox('id-1');
    expect(engine.removed).toEqual(['id-1']);
  });

  it('returns undefined status when the container is gone', async () => {
    const engine = new FakeEngine({ failInspect: true });
    const client = new DockerodeClient(engine);

    expect(await client.status('id-1')).toBeUndefined();
  });
});
