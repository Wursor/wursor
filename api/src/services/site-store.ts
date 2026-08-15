export type Site = {
  id: string;
  accountId: string;
  siteUrl: string;
  readToken: string;
  deployToken: string;
  hmacSecret: string;
  connected: boolean;
};

export interface SiteStore {
  create(site: Site): Promise<Site>;
  findById(id: string): Promise<Site | undefined>;
  setConnected(id: string, connected: boolean): Promise<void>;
}

export class InMemorySiteStore implements SiteStore {
  private byId = new Map<string, Site>();

  async create(site: Site): Promise<Site> {
    this.byId.set(site.id, site);
    return site;
  }

  async findById(id: string): Promise<Site | undefined> {
    return this.byId.get(id);
  }

  async setConnected(id: string, connected: boolean): Promise<void> {
    const site = this.byId.get(id);
    if (site !== undefined) {
      this.byId.set(id, { ...site, connected });
    }
  }
}
