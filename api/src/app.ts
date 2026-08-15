import Fastify from 'fastify';
import { authRoutes } from './routes/auth.ts';
import { sessionRoutes } from './routes/sessions.ts';
import { InMemoryUserStore, type UserStore } from './services/user-store.ts';
import type { SandboxManager } from './services/sandbox-manager.ts';

export type BuildAppOptions = {
  userStore?: UserStore;
  sandboxManager?: SandboxManager;
};

export async function buildApp(opts: BuildAppOptions = {}) {
  const app = Fastify();
  const store = opts.userStore ?? new InMemoryUserStore();
  app.get('/health', async () => ({ ok: true }));
  await authRoutes(app, store);
  await sessionRoutes(app, opts.sandboxManager);
  return app;
}
