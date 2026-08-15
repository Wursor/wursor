import type { FastifyReply, FastifyRequest } from 'fastify';
import type { SessionStore } from '../services/session-store.ts';

declare module 'fastify' {
  interface FastifyRequest {
    userId?: string;
  }
}

export function requireSession(store: SessionStore) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const header = request.headers.authorization;
    const token = header !== undefined && header.startsWith('Bearer ') ? header.slice('Bearer '.length) : undefined;
    if (token === undefined) {
      await reply.status(401).send({ error: 'unauthorized' });
      return;
    }
    const session = await store.findByToken(token);
    if (session === undefined) {
      await reply.status(401).send({ error: 'unauthorized' });
      return;
    }
    request.userId = session.userId;
  };
}
