import type { FastifyInstance } from 'fastify';
import { newId } from '../lib/crypto.ts';
import type { SandboxManager } from '../services/sandbox-manager.ts';

export async function sessionRoutes(
  app: FastifyInstance,
  sandboxManager: SandboxManager | undefined,
): Promise<void> {
  app.post('/sessions', async (_request, reply) => {
    if (sandboxManager === undefined) {
      return reply.status(503).send({ error: 'sandbox_not_configured' });
    }
    const { sandboxId, previewUrl } = await sandboxManager.start();
    return reply.status(201).send({ sessionId: newId(), sandboxId, previewUrl });
  });
}
