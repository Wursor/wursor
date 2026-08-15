export type ImageManagerOptions = {
  baseImage: string;
  webPort: number;
};

export type SandboxContainerSpec = {
  image: string;
  name: string;
  ports: { container: number; host: number }[];
  labels: Record<string, string>;
};

export class ImageManager {
  constructor(private readonly opts: ImageManagerOptions) {}

  imageRef(): string {
    return this.opts.baseImage;
  }

  containerSpec(name: string): SandboxContainerSpec {
    return {
      image: this.opts.baseImage,
      name,
      ports: [{ container: 80, host: this.opts.webPort }],
      labels: { 'wursor.managed': 'true' },
    };
  }
}
