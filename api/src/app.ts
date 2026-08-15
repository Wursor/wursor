import Fastify from 'fastify';
import { authRoutes } from './routes/auth.ts';
import { InMemoryUserStore } from './services/user-store.ts';

export async function buildApp() {
  const app = Fastify();
  const store = new InMemoryUserStore();
  await authRoutes(app, store);
  return app;
}
