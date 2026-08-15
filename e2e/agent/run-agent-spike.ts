import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { loadEnvFile } from 'node:process';
import { fileURLToPath } from 'node:url';
import { runAgent } from '../../api/src/agents/agent-loop.ts';
import { OpenRouterLlmClient } from '../../api/src/agents/openrouter-client.ts';
import { WpRestExecutor } from '../../api/src/agents/wp-executor.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
try {
  loadEnvFile(join(root, '.env'));
} catch {
  // no .env
}

const SYSTEM_PROMPT =
  'You are an expert WordPress agent working inside a sandboxed copy of the user\u2019s site. ' +
  'Use the provided tools to complete the request. Work step by step: read what you need, make the ' +
  'changes, and verify. Never touch anything outside the sandbox. When finished, reply with a one-line ' +
  'summary of what you changed.';

type Assert =
  | { type: 'option'; key: string; value: string }
  | { type: 'page_title_exists'; title: string }
  | { type: 'page_content_contains'; slug: string; text: string };

type Prompt = { id: string; prompt: string; asserts: Assert[] };

const base = process.env.WP_URL;
const username = process.env.WP_USER;
const appPassword = process.env.WP_APP_PASSWORD;
const apiKey = process.env.OPENROUTER_API_KEY;

if (base === undefined || username === undefined || appPassword === undefined || apiKey === undefined) {
  process.stderr.write('Missing env: WP_URL, WP_USER, WP_APP_PASSWORD, OPENROUTER_API_KEY\n');
  process.exit(1);
}

const executor = new WpRestExecutor({ baseUrl: base, username, appPassword });
const llm = new OpenRouterLlmClient({ apiKey, model: process.env.OPENROUTER_MODEL });
const auth = `Basic ${Buffer.from(`${username}:${appPassword}`).toString('base64')}`;

async function get(url: string): Promise<unknown> {
  const res = await fetch(`${base}${url}`, { headers: { Authorization: auth } });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${url}`);
  }
  return res.json();
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

async function check(a: Assert): Promise<boolean> {
  if (a.type === 'option') {
    const settings = (await get('/wp-json/wp/v2/settings')) as Record<string, string>;
    return settings[a.key] === a.value;
  }
  if (a.type === 'page_title_exists') {
    const pages = (await get(
      `/wp-json/wp/v2/pages?search=${encodeURIComponent(a.title)}&_fields=title`,
    )) as Array<{ title: { rendered: string } }>;
    return pages.some((p) => stripTags(p.title.rendered) === a.title);
  }
  const pages = (await get(
    `/wp-json/wp/v2/pages?slug=${encodeURIComponent(a.slug)}&_fields=content`,
  )) as Array<{ content: { rendered: string } }>;
  return stripTags(pages[0]?.content.rendered ?? '').includes(a.text);
}

const prompts = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'prompts.json'), 'utf8')) as Prompt[];

const report = {
  startedAt: new Date().toISOString(),
  results: [] as Array<{ id: string; elapsedMs: number; toolCalls: number; halted: boolean; assertions: Array<{ ok: boolean; assert: Assert }> }>,
};

for (const prompt of prompts) {
  const started = Date.now();
  const result = await runAgent(llm, executor, { systemPrompt: SYSTEM_PROMPT, userPrompt: prompt.prompt, maxRounds: 12 });
  const assertions = await Promise.all(prompt.asserts.map(async (assert) => ({ assert, ok: await check(assert) })));
  report.results.push({
    id: prompt.id,
    elapsedMs: Date.now() - started,
    toolCalls: result.toolCalls,
    halted: result.halted,
    assertions,
  });
}

const outDir = join(dirname(fileURLToPath(import.meta.url)), 'runs');
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'latest.json'), `${JSON.stringify(report, null, 2)}\n`);
process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
