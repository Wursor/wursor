import type { FastifyInstance } from 'fastify';
import { requireSession } from '../middleware/auth.ts';
import { newId } from '../lib/crypto.ts';
import type { PairingService } from '../services/pairing-service.ts';
import type { SessionStore } from '../services/session-store.ts';
import type { SiteStore } from '../services/site-store.ts';

export type SiteRoutesDeps = {
  sessionStore: SessionStore;
  pairingService: PairingService;
  siteStore: SiteStore;
};

type RedeemBody = {
  code?: string;
  siteUrl?: string;
};

export async function siteRoutes(app: FastifyInstance, deps: SiteRoutesDeps): Promise<void> {
  app.post('/sites/pair', { preHandler: requireSession(deps.sessionStore) }, async (request, reply) => {
    const { code, expiresAt } = deps.pairingService.issue(request.userId as string);
    return reply.status(201).send({ code, expiresAt });
  });

  app.post('/sites/redeem', async (request, reply) => {
    const { code, siteUrl } = request.body as RedeemBody;
    if (code === undefined || siteUrl === undefined) {
      return reply.status(400).send({ error: 'invalid' });
    }
    const result = deps.pairingService.redeem(code, siteUrl);
    if (!result.ok) {
      return reply.status(400).send({ error: result.error });
    }
    const site = await deps.siteStore.create({
      id: newId(),
      accountId: result.accountId,
      siteUrl: result.siteUrl,
      readToken: result.readToken,
      deployToken: result.deployToken,
      hmacSecret: result.hmacSecret,
      connected: false,
    });
    return reply.status(201).send({
      siteId: site.id,
      readToken: site.readToken,
      deployToken: site.deployToken,
      hmacSecret: site.hmacSecret,
    });
  });

  app.get('/sites/:siteId', { preHandler: requireSession(deps.sessionStore) }, async (request, reply) => {
    const site = await deps.siteStore.findById((request.params as { siteId: string }).siteId);
    if (site === undefined || site.accountId !== request.userId) {
      return reply.status(404).send({ error: 'not_found' });
    }
    return { id: site.id, siteUrl: site.siteUrl, connected: site.connected };
  });

  app.post('/sites/:siteId/confirm', { preHandler: requireSession(deps.sessionStore) }, async (request, reply) => {
    const site = await deps.siteStore.findById((request.params as { siteId: string }).siteId);
    if (site === undefined || site.accountId !== request.userId) {
      return reply.status(404).send({ error: 'not_found' });
    }
    await deps.siteStore.setConnected(site.id, true);
    return { connected: true };
  });
}
