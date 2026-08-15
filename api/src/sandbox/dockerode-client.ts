import Docker from 'dockerode';
import { randomUUID } from 'node:crypto';
import type { DockerClient, SandboxInfo } from './docker-client.ts';

export type ContainerInspect = {
  Id: string;
  State: { Running: boolean };
};

export type ContainerLike = {
  start(): Promise<void>;
  inspect(): Promise<ContainerInspect>;
  remove(opts?: { force?: boolean }): Promise<void>;
};

export type DockerEngine = {
  createContainer(opts: { Image: string; name: string }): Promise<ContainerLike>;
  getContainer(id: string): ContainerLike;
};

export class DockerodeClient implements DockerClient {
  constructor(private readonly engine: DockerEngine = new Docker() as unknown as DockerEngine) {}

  async createSandbox(image: string): Promise<SandboxInfo> {
    const container = await this.engine.createContainer({ Image: image, name: `wursor-${randomUUID()}` });
    await container.start();
    const info = await container.inspect();
    return { id: info.Id, status: info.State.Running ? 'running' : 'destroyed' };
  }

  async destroySandbox(id: string): Promise<void> {
    await this.engine.getContainer(id).remove({ force: true });
  }

  async status(id: string): Promise<SandboxInfo | undefined> {
    try {
      const info = await this.engine.getContainer(id).inspect();
      return { id: info.Id, status: info.State.Running ? 'running' : 'destroyed' };
    } catch {
      return undefined;
    }
  }
}
