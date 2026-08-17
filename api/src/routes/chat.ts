import type { FastifyInstance } from 'fastify';
import { runAgent } from '../agents/agent-loop.ts';
import { AGENT_SYSTEM_PROMPT } from '../agents/system-prompt.ts';
import type { LlmClient } from '../agents/llm-client.ts';
import type { ToolExecutor } from '../agents/tool-executor.ts';
import { requireSession } from '../middleware/auth.ts';
import type { SessionStore } from '../services/session-store.ts';

export type ChatRoutesDeps = {
  sessionStore: SessionStore;
  llmClient?: LlmClient;
  toolExecutor?: ToolExecutor;
  maxRounds?: number;
};

type ChatBody = {
  message?: string;
};

export async function chatRoutes(app: FastifyInstance, deps: ChatRoutesDeps): Promise<void> {
  app.post('/chat', { preHandler: requireSession(deps.sessionStore) }, async (request, reply) => {
    if (deps.llmClient === undefined || deps.toolExecutor === undefined) {
      return reply.status(503).send({ error: 'agent_not_configured' });
    }
    const { message } = request.body as ChatBody;
    if (message === undefined || message.trim() === '') {
      return reply.status(400).send({ error: 'invalid_message' });
    }

    const result = await runAgent(deps.llmClient, deps.toolExecutor, {
      systemPrompt: AGENT_SYSTEM_PROMPT,
      userPrompt: message,
      maxRounds: deps.maxRounds ?? 12,
    });

    return reply.send({ reply: result.finalContent, toolCalls: result.toolCalls, halted: result.halted });
  });
}
