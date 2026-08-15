import { describe, it, expect } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { buildApp } from '../../src/app.ts';

async function signup(app: FastifyInstance): Promise<string> {
  const res = await app.inject({
    method: 'POST',
    url: '/auth/signup',
    payload: { email: `a-${Date.now()}@example.com`, password: 'password123' },
  });
  return res.json().sessionToken as string;
}

describe('sites pairing flow', () => {
  it('requires a session to pair', async () => {
    const app = await buildApp();
    const res = await app.inject({ method: 'POST', url: '/sites/pair' });
    expect(res.statusCode).toBe(401);
  });

  it('redeems a code once, binds site_url, and returns tokens', async () => {
    const app = await buildApp();
    const token = await signup(app);

    const pair = await app.inject({
      method: 'POST',
      url: '/sites/pair',
      headers: { authorization: `Bearer ${token}` },
    });
    expect(pair.statusCode).toBe(201);
    const { code } = pair.json();

    const redeem = await app.inject({
      method: 'POST',
      url: '/sites/redeem',
      payload: { code, siteUrl: 'https://example.com' },
    });
    expect(redeem.statusCode).toBe(201);
    const body = redeem.json();
    expect(body.siteId).toBeTruthy();
    expect(body.readToken).toBeTruthy();
    expect(body.deployToken).toBeTruthy();
    expect(body.hmacSecret).toBeTruthy();

    const second = await app.inject({
      method: 'POST',
      url: '/sites/redeem',
      payload: { code, siteUrl: 'https://example.com' },
    });
    expect(second.statusCode).toBe(400);
  });

  it('does not mark the site connected until confirmed', async () => {
    const app = await buildApp();
    const token = await signup(app);

    const pair = await app.inject({
      method: 'POST',
      url: '/sites/pair',
      headers: { authorization: `Bearer ${token}` },
    });
    const { code } = pair.json();

    const redeem = await app.inject({
      method: 'POST',
      url: '/sites/redeem',
      payload: { code, siteUrl: 'https://example.com' },
    });
    const { siteId } = redeem.json();

    const before = await app.inject({
      method: 'GET',
      url: `/sites/${siteId}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(before.json().connected).toBe(false);

    const confirm = await app.inject({
      method: 'POST',
      url: `/sites/${siteId}/confirm`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(confirm.statusCode).toBe(200);

    const after = await app.inject({
      method: 'GET',
      url: `/sites/${siteId}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(after.json().connected).toBe(true);
  });
});
