import Fastify from 'fastify';
import { authRoutes } from './routes/auth.ts';
import { sessionRoutes } from './routes/sessions.ts';
import { siteRoutes } from './routes/sites.ts';
import { PairingService } from './services/pairing-service.ts';
import { InMemorySessionStore, type SessionStore } from './services/session-store.ts';
import { InMemorySiteStore, type SiteStore } from './services/site-store.ts';
import { InMemoryUserStore, type UserStore } from './services/user-store.ts';
import type { SandboxManager } from './services/sandbox-manager.ts';

export type BuildAppOptions = {
  userStore?: UserStore;
  sessionStore?: SessionStore;
  siteStore?: SiteStore;
  pairingService?: PairingService;
  sandboxManager?: SandboxManager;
};

export async function buildApp(opts: BuildAppOptions = {}) {
  const app = Fastify();
  const userStore = opts.userStore ?? new InMemoryUserStore();
  const sessionStore = opts.sessionStore ?? new InMemorySessionStore();
  const siteStore = opts.siteStore ?? new InMemorySiteStore();
  const pairingService = opts.pairingService ?? new PairingService();

  app.get('/health', async () => ({ ok: true }));
  await authRoutes(app, userStore, sessionStore);
  await sessionRoutes(app, opts.sandboxManager);
  await siteRoutes(app, { sessionStore, siteStore, pairingService });
  return app;
}
