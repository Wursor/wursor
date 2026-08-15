import { createHash, createHmac } from 'node:crypto';
import { isHttpsUrl } from '../lib/codes.ts';

export type PluginCredentials = {
  siteUrl: string;
  readToken: string;
  deployToken?: string;
  hmacSecret: string;
};

function sha256hex(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

export class PluginClient {
  private readonly baseUrl: string;

  constructor(private readonly creds: PluginCredentials) {
    if (!isHttpsUrl(creds.siteUrl)) {
      throw new Error('Site URL must be https');
    }
    this.baseUrl = `${creds.siteUrl.replace(/\/$/, '')}/wp-json/wursor/v1`;
  }

  async get(path: string): Promise<unknown> {
    return this.request('GET', path);
  }

  async post(path: string, body?: unknown): Promise<unknown> {
    return this.request('POST', path, body);
  }

  private async request(method: string, path: string, body?: unknown): Promise<unknown> {
    const bodyText = body === undefined ? '' : JSON.stringify(body);
    const timestamp = String(Math.floor(Date.now() / 1000));
    const canonical = `${timestamp}\n${method}\n${path}\n${sha256hex(bodyText)}`;
    const signature = createHmac('sha256', this.creds.hmacSecret).update(canonical).digest('hex');

    const token = method === 'GET' ? this.creds.readToken : (this.creds.deployToken ?? this.creds.readToken);

    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      'X-Wursor-Timestamp': timestamp,
      'X-Wursor-Signature': signature,
    };
    if (bodyText !== '') {
      headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers,
      body: bodyText === '' ? undefined : bodyText,
    });

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error('Authentication failed');
      }
      throw new Error(`Plugin HTTP ${res.status}`);
    }
    return res.json();
  }
}
