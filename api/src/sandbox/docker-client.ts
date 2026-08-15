export type SandboxInfo = {
  id: string;
  status: 'running' | 'destroyed';
};

export interface DockerClient {
  createSandbox(image: string): Promise<SandboxInfo>;
  destroySandbox(id: string): Promise<void>;
  status(id: string): Promise<SandboxInfo | undefined>;
}
