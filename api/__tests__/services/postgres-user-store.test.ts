import { describe, it, expect } from 'vitest';
import { PostgresUserStore } from '../../src/services/postgres-user-store.ts';
import type { Queryable } from '../../src/services/postgres-user-store.ts';

class FakeDb implements Queryable {
  calls: Array<{ text: string; values?: unknown[] }> = [];
  rows: unknown[] = [];

  async query(text: string, values?: unknown[]) {
    this.calls.push({ text, values });
    return { rows: this.rows };
  }
}

describe('PostgresUserStore', () => {
  it('returns a user when the email exists', async () => {
    const db = new FakeDb();
    db.rows = [{ id: 'u1', email: 'a@example.com', password_hash: 'hash' }];
    const store = new PostgresUserStore(db);

    const user = await store.findByEmail('a@example.com');
    expect(user).toEqual({ id: 'u1', email: 'a@example.com', passwordHash: 'hash' });
    expect(db.calls[0]?.text).toContain('SELECT');
  });

  it('returns undefined when the email is absent', async () => {
    const db = new FakeDb();
    db.rows = [];
    const store = new PostgresUserStore(db);

    expect(await store.findByEmail('nope@example.com')).toBeUndefined();
  });

  it('inserts a new user and returns it', async () => {
    const db = new FakeDb();
    const store = new PostgresUserStore(db);

    const created = await store.create({ id: 'u1', email: 'a@example.com', passwordHash: 'hash' });
    expect(created).toEqual({ id: 'u1', email: 'a@example.com', passwordHash: 'hash' });
    const insert = db.calls[0];
    expect(insert?.text).toContain('INSERT INTO users');
    expect(insert?.values).toEqual(['u1', 'a@example.com', 'hash']);
  });
});
