import type { ToolExecutor, ToolResult } from './tool-executor.ts';

export type WpRestCredentials = {
  baseUrl: string;
  username: string;
  appPassword: string;
};

function basicAuth(username: string, password: string): string {
  return `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
}

export class WpRestExecutor implements ToolExecutor {
  private readonly base: string;
  private readonly auth: string;

  constructor(private readonly creds: WpRestCredentials) {
    this.base = creds.baseUrl.replace(/\/$/, '');
    this.auth = basicAuth(creds.username, creds.appPassword);
  }

  async execute(name: string, args: Record<string, string>): Promise<ToolResult> {
    switch (name) {
      case 'read_page':
        return this.readPage(args.page);
      case 'update_post':
        return this.updatePost(args);
      case 'create_page':
        return this.createPage(args);
      case 'update_option':
        return this.updateOption(args);
      default:
        throw new Error(`unsupported tool: ${name}`);
    }
  }

  private async json(url: string, init?: RequestInit): Promise<unknown> {
    const res = await fetch(url, { ...init, headers: { Authorization: this.auth, ...(init?.headers ?? {}) } });
    if (!res.ok) {
      throw new Error(`WP HTTP ${res.status} ${url}`);
    }
    return res.json();
  }

  private async readPage(page: string): Promise<ToolResult> {
    const data = await this.json(`${this.base}/wp-json/wp/v2/pages?slug=${encodeURIComponent(page)}&_fields=id,title,content`);
    return { result: JSON.stringify(data) };
  }

  private async pageIdBySlug(slug: string): Promise<number | undefined> {
    const data = (await this.json(
      `${this.base}/wp-json/wp/v2/pages?slug=${encodeURIComponent(slug)}&_fields=id`,
    )) as Array<{ id: number }>;
    return data[0]?.id;
  }

  private async updatePost(args: Record<string, string>): Promise<ToolResult> {
    const id = await this.pageIdBySlug(args.page ?? '');
    if (id === undefined) {
      return { result: `no page with slug ${args.page}` };
    }
    const body: Record<string, string> = {};
    if (args.title !== undefined) body.title = args.title;
    if (args.content !== undefined) body.content = args.content;
    const updated = await this.json(`${this.base}/wp-json/wp/v2/pages/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return { result: JSON.stringify(updated) };
  }

  private async createPage(args: Record<string, string>): Promise<ToolResult> {
    const created = await this.json(`${this.base}/wp-json/wp/v2/pages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: args.title, content: args.content, status: 'publish' }),
    });
    return { result: JSON.stringify(created) };
  }

  private async updateOption(args: Record<string, string>): Promise<ToolResult> {
    const updated = await this.json(`${this.base}/wp-json/wp/v2/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [args.key ?? '']: args.value }),
    });
    return { result: JSON.stringify(updated) };
  }
}
