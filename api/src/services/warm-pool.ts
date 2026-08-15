import type { DockerClient } from '../sandbox/docker-client.ts';

export function computeSpares(current: number, target: number): number {
  return Math.max(0, target - current);
}

export type WarmPoolOptions = {
  image: string;
  hotSpares: number;
};

export class WarmPool {
  constructor(
    private readonly docker: DockerClient,
    private readonly opts: WarmPoolOptions,
  ) {}

  async topUp(currentRunning: number): Promise<{ created: number }> {
    const need = computeSpares(currentRunning, this.opts.hotSpares);
    for (let i = 0; i < need; i += 1) {
      await this.docker.createSandbox(this.opts.image);
    }
    return { created: need };
  }
}
