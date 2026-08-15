import type { DockerClient } from '../sandbox/docker-client.ts';

export type SandboxManagerOptions = {
  image: string;
  previewBaseUrl: string;
};

export class SandboxManager {
  constructor(
    private readonly docker: DockerClient,
    private readonly opts: SandboxManagerOptions,
  ) {}

  async start(image?: string): Promise<{ sandboxId: string; previewUrl: string }> {
    const info = await this.docker.createSandbox(image ?? this.opts.image);
    return { sandboxId: info.id, previewUrl: `${this.opts.previewBaseUrl}/${info.id}` };
  }

  async destroy(id: string): Promise<void> {
    await this.docker.destroySandbox(id);
  }
}
