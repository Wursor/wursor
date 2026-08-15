export type User = {
  id: string;
  email: string;
  passwordHash: string;
};

export interface UserStore {
  findByEmail(email: string): Promise<User | undefined>;
  create(user: User): Promise<User>;
}

export class InMemoryUserStore implements UserStore {
  private byEmail = new Map<string, User>();

  async findByEmail(email: string): Promise<User | undefined> {
    return this.byEmail.get(email);
  }

  async create(user: User): Promise<User> {
    this.byEmail.set(user.email, user);
    return user;
  }
}
