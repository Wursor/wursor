import type { FastifyInstance } from 'fastify';
import { hashPassword, newId, newToken } from '../lib/crypto.ts';
import type { UserStore } from '../services/user-store.ts';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SignupBody = {
  email?: string;
  password?: string;
};

export async function authRoutes(app: FastifyInstance, store: UserStore): Promise<void> {
  app.post('/auth/signup', async (request, reply) => {
    const { email: rawEmail, password } = request.body as SignupBody;
    const email = rawEmail?.trim().toLowerCase();

    if (email === undefined || email === '' || !EMAIL_RE.test(email)) {
      return reply.status(400).send({ error: 'invalid_email' });
    }
    if (password === undefined || password.length < 8) {
      return reply.status(400).send({ error: 'weak_password' });
    }
    if ((await store.findByEmail(email)) !== undefined) {
      return reply.status(409).send({ error: 'email_exists' });
    }

    const user = await store.create({ id: newId(), email, passwordHash: hashPassword(password) });
    return reply.status(201).send({ user: { id: user.id, email: user.email }, sessionToken: newToken() });
  });
}
