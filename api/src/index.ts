import Docker from 'dockerode';
import { dirname, join } from 'node:path';
import { loadEnvFile } from 'node:process';
import { fileURLToPath } from 'node:url';
import { Pool } from 'pg';
import { buildApp } from './app.ts';
import { OpenRouterLlmClient } from './agents/openrouter-client.ts';
import { WpRestExecutor } from './agents/wp-executor.ts';
import { DockerodeClient } from './sandbox/dockerode-client.ts';
import { ImageManager } from './sandbox/image-manager.ts';
import { PostgresUserStore } from './services/postgres-user-store.ts';
import { SandboxManager } from './services/sandbox-manager.ts';
import { InMemoryUserStore } from './services/user-store.ts';

try {
  loadEnvFile(join(dirname(fileURLToPath(import.meta.url)), '..', '..', '.env'));
} catch {
  // no .env — rely on the ambient environment
}

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

const llmClient = process.env.OPENROUTER_API_KEY
  ? new OpenRouterLlmClient({ apiKey: process.env.OPENROUTER_API_KEY, model: process.env.OPENROUTER_MODEL })
  : undefined;

const toolExecutor =
  process.env.WP_URL !== undefined && process.env.WP_USER !== undefined && process.env.WP_APP_PASSWORD !== undefined
    ? new WpRestExecutor({
        baseUrl: process.env.WP_URL,
        username: process.env.WP_USER,
        appPassword: process.env.WP_APP_PASSWORD,
      })
    : undefined;

const app = await buildApp({ userStore, sandboxManager, llmClient, toolExecutor });

await app.listen({ port, host: '0.0.0.0' });
