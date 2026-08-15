export type User = {
  id: string;
  email: string;
  passwordHash: string;
};

export interface UserStore {
  findByEmail(email: string): User | undefined;
  create(user: User): User;
}

export class InMemoryUserStore implements UserStore {
  private byEmail = new Map<string, User>();

  findByEmail(email: string): User | undefined {
    return this.byEmail.get(email);
  }

  create(user: User): User {
    this.byEmail.set(user.email, user);
    return user;
  }
}
