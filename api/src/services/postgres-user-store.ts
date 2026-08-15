import type { User, UserStore } from './user-store.ts';

export type Queryable = {
  query(text: string, values?: unknown[]): Promise<{ rows: unknown[] }>;
};

type UserRow = {
  id: string;
  email: string;
  password_hash: string;
};

export class PostgresUserStore implements UserStore {
  constructor(private readonly db: Queryable) {}

  async findByEmail(email: string): Promise<User | undefined> {
    const result = await this.db.query('SELECT id, email, password_hash FROM users WHERE email = $1', [email]);
    const row = result.rows[0] as UserRow | undefined;
    return row === undefined
      ? undefined
      : { id: row.id, email: row.email, passwordHash: row.password_hash };
  }

  async create(user: User): Promise<User> {
    await this.db.query('INSERT INTO users (id, email, password_hash) VALUES ($1, $2, $3)', [
      user.id,
      user.email,
      user.passwordHash,
    ]);
    return user;
  }
}
