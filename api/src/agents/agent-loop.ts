import type { LlmClient, LlmMessage } from './llm-client.ts';
import type { ToolExecutor } from './tool-executor.ts';

export type RunAgentOptions = {
  systemPrompt: string;
  userPrompt: string;
  maxRounds: number;
};

export type RunAgentResult = {
  rounds: number;
  toolCalls: number;
  finalContent: string | null;
  halted: boolean;
};

export async function runAgent(
  client: LlmClient,
  executor: ToolExecutor,
  opts: RunAgentOptions,
): Promise<RunAgentResult> {
  const messages: LlmMessage[] = [
    { role: 'system', content: opts.systemPrompt },
    { role: 'user', content: opts.userPrompt },
  ];
  let toolCalls = 0;

  for (let round = 0; round < opts.maxRounds; round += 1) {
    const response = await client.complete(messages);
    const message = response.choices[0]?.message;
    const calls = message?.tool_calls ?? [];

    if (calls.length === 0) {
      return { rounds: round + 1, toolCalls, finalContent: message?.content ?? null, halted: false };
    }

    messages.push({ role: 'assistant', content: message?.content ?? null, tool_calls: calls });

    for (const call of calls) {
      const args = JSON.parse(call.function.arguments) as Record<string, string>;
      const result = await executor.execute(call.function.name, args);
      toolCalls += 1;
      messages.push({ role: 'tool', content: result.result, tool_call_id: call.id, name: call.function.name });
    }
  }

  return { rounds: opts.maxRounds, toolCalls, finalContent: null, halted: true };
}
