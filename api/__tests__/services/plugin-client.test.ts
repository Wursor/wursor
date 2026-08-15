import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createHash, createHmac } from 'node:crypto';
import { PluginClient } from '../../src/services/plugin-client.ts';

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  fetchMock = vi.fn();
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const creds = { siteUrl: 'https://example.com', readToken: 'r-token', hmacSecret: 'h-secret' };

function expectedSignature(secret: string, timestamp: string, method: string, path: string, body: string): string {
  const canonical = `${timestamp}\n${method}\n${path}\n${createHash('sha256').update(body).digest('hex')}`;
  return createHmac('sha256', secret).update(canonical).digest('hex');
}

describe('PluginClient', () => {
  it('signs requests and sends the token in Authorization, never the URL', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ theme: 'twentytwentyfour' }) });
    const client = new PluginClient(creds);

    await client.get('/site-info');

    const [url, init] = fetchMock.mock.calls[0] as [string, { headers: Record<string, string> }];
    expect(url).toBe('https://example.com/wp-json/wursor/v1/site-info');
    expect(String(url)).not.toContain('r-token');
    expect(init.headers.Authorization).toBe('Bearer r-token');
    expect(init.headers['X-Wursor-Timestamp']).toBeTruthy();
    expect(init.headers['X-Wursor-Signature']).toMatch(/^[0-9a-f]{64}$/);
  });

  it('computes the HMAC over timestamp + method + path + body hash', async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({}) });
    const client = new PluginClient(creds);

    await client.post('/files', { a: 1 });

    const [, init] = fetchMock.mock.calls[0] as [string, { headers: Record<string, string> }];
    const ts = init.headers['X-Wursor-Timestamp'];
    expect(init.headers['X-Wursor-Signature']).toBe(expectedSignature('h-secret', ts, 'POST', '/wursor/v1/files', '{"a":1}'));
  });

  it('maps a 401 to Authentication failed', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 401 });
    const client = new PluginClient(creds);

    await expect(client.get('/site-info')).rejects.toThrow('Authentication failed');
  });

  it('refuses to construct a client with an http:// site URL', () => {
    expect(() => new PluginClient({ ...creds, siteUrl: 'http://example.com' })).toThrow();
  });
});
