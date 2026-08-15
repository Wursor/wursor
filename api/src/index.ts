import Docker from 'dockerode';
import { Pool } from 'pg';
import { buildApp } from './app.ts';
import { DockerodeClient } from './sandbox/dockerode-client.ts';
import { ImageManager } from './sandbox/image-manager.ts';
import { PostgresUserStore } from './services/postgres-user-store.ts';
import { SandboxManager } from './services/sandbox-manager.ts';
import { InMemoryUserStore } from './services/user-store.ts';

const port = Number(process.env.PORT ?? 3000);

const userStore = process.env.DATABASE_URL
  ? new PostgresUserStore(new Pool({ connectionString: process.env.DATABASE_URL }))
  : new InMemoryUserStore();

const imageManager = new ImageManager({
  baseImage: process.env.WUR_IMAGE ?? 'wursor-base:latest',
  webPort: Number(process.env.WUR_WEB_PORT ?? 8080),
});

const sandboxManager =
  process.env.WUR_ENABLE_SANDBOX === '1'
    ? new SandboxManager(new DockerodeClient(new Docker()), {
        image: imageManager.imageRef(),
        previewBaseUrl: process.env.PREVIEW_BASE_URL ?? 'http://localhost:8080',
      })
    : undefined;

const app = await buildApp({ userStore, sandboxManager });

await app.listen({ port, host: '0.0.0.0' });
