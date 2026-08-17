import { describe, it, expect } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { buildApp } from '../../src/app.ts';
import type { LlmClient, LlmResponse } from '../../src/agents/llm-client.ts';
import type { ToolExecutor } from '../../src/agents/tool-executor.ts';

class FakeLlm implements LlmClient {
  async complete(): Promise<LlmResponse> {
    return { choices: [{ message: { role: 'assistant', content: 'Done', tool_calls: undefined } }] };
  }
}

class FakeExecutor implements ToolExecutor {
  async execute() {
    return { result: 'ok' };
  }
}

async function signup(app: FastifyInstance): Promise<string> {
  const res = await app.inject({
    method: 'POST',
    url: '/auth/signup',
    payload: { email: `a-${Date.now()}@example.com`, password: 'password123' },
  });
  return res.json().sessionToken as string;
}

describe('POST /chat', () => {
  it('requires a session', async () => {
    const app = await buildApp({ llmClient: new FakeLlm(), toolExecutor: new FakeExecutor() });
    const res = await app.inject({ method: 'POST', url: '/chat', payload: { message: 'hi' } });
    expect(res.statusCode).toBe(401);
  });

  it('runs the agent and returns the reply', async () => {
    const app = await buildApp({ llmClient: new FakeLlm(), toolExecutor: new FakeExecutor() });
    const token = await signup(app);

    const res = await app.inject({
      method: 'POST',
      url: '/chat',
      headers: { authorization: `Bearer ${token}` },
      payload: { message: 'Change the heading' },
    });

    expect(res.statusCode).toBe(200);
    expect(res.json().reply).toBe('Done');
  });

  it('returns 503 when the agent is not configured', async () => {
    const app = await buildApp();
    const token = await signup(app);

    const res = await app.inject({
      method: 'POST',
      url: '/chat',
      headers: { authorization: `Bearer ${token}` },
      payload: { message: 'hi' },
    });

    expect(res.statusCode).toBe(503);
  });

  it('returns 400 for an empty message', async () => {
    const app = await buildApp({ llmClient: new FakeLlm(), toolExecutor: new FakeExecutor() });
    const token = await signup(app);

    const res = await app.inject({
      method: 'POST',
      url: '/chat',
      headers: { authorization: `Bearer ${token}` },
      payload: { message: '   ' },
    });

    expect(res.statusCode).toBe(400);
  });
});
