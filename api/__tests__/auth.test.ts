import { describe, it, expect } from 'vitest';
import { buildApp } from '../src/app.ts';

describe('POST /auth/signup', () => {
  it('creates a user and returns a session token', async () => {
    const app = await buildApp();
    const res = await app.inject({
      method: 'POST',
      url: '/auth/signup',
      payload: { email: 'a@example.com', password: 'password123' },
    });

    expect(res.statusCode).toBe(201);
    const body = res.json();
    expect(body.user.email).toBe('a@example.com');
    expect(body.user.id).toBeTruthy();
    expect(body.sessionToken).toBeTruthy();
  });

  it('rejects an invalid email with 400', async () => {
    const app = await buildApp();
    const res = await app.inject({
      method: 'POST',
      url: '/auth/signup',
      payload: { email: 'not-an-email', password: 'password123' },
    });

    expect(res.statusCode).toBe(400);
  });

  it('rejects a short password with 400', async () => {
    const app = await buildApp();
    const res = await app.inject({
      method: 'POST',
      url: '/auth/signup',
      payload: { email: 'a@example.com', password: 'short' },
    });

    expect(res.statusCode).toBe(400);
  });

  it('rejects a duplicate email with 409', async () => {
    const app = await buildApp();
    const payload = { email: 'a@example.com', password: 'password123' };
    await app.inject({ method: 'POST', url: '/auth/signup', payload });
    const res = await app.inject({ method: 'POST', url: '/auth/signup', payload });

    expect(res.statusCode).toBe(409);
  });

  it('does not return the password hash', async () => {
    const app = await buildApp();
    const res = await app.inject({
      method: 'POST',
      url: '/auth/signup',
      payload: { email: 'a@example.com', password: 'password123' },
    });

    expect(res.json().user.passwordHash).toBeUndefined();
  });
});
