import { generateToken } from '../lib/codes.ts';

export type Session = {
  token: string;
  userId: string;
  createdAt: number;
};

export interface SessionStore {
  create(userId: string): Promise<Session>;
  findByToken(token: string): Promise<Session | undefined>;
}

export class InMemorySessionStore implements SessionStore {
  private byToken = new Map<string, Session>();

  async create(userId: string): Promise<Session> {
    const session = { token: generateToken(), userId, createdAt: Date.now() };
    this.byToken.set(session.token, session);
    return session;
  }

  async findByToken(token: string): Promise<Session | undefined> {
    return this.byToken.get(token);
  }
}
