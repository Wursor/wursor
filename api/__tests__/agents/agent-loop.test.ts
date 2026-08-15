import { describe, it, expect } from 'vitest';
import { runAgent } from '../../src/agents/agent-loop.ts';
import type { LlmClient, LlmResponse } from '../../src/agents/llm-client.ts';
import type { ToolExecutor } from '../../src/agents/tool-executor.ts';

class ScriptedLlm implements LlmClient {
  private i = 0;

  constructor(private readonly responses: LlmResponse[]) {}

  async complete(): Promise<LlmResponse> {
    const response = this.responses[Math.min(this.i, this.responses.length - 1)];
    this.i += 1;
    return response as LlmResponse;
  }
}

class RecordingExecutor implements ToolExecutor {
  calls: Array<{ name: string; args: Record<string, string> }> = [];

  async execute(name: string, args: Record<string, string>) {
    this.calls.push({ name, args });
    return { result: `ok:${name}` };
  }
}

function toolCall(id: string, name: string, args: Record<string, string>) {
  return { id, type: 'function', function: { name, arguments: JSON.stringify(args) } };
}

function callResp(calls: ReturnType<typeof toolCall>[]): LlmResponse {
  return { choices: [{ message: { role: 'assistant', content: null, tool_calls: calls } }] };
}

function doneResp(content: string): LlmResponse {
  return { choices: [{ message: { role: 'assistant', content, tool_calls: undefined } }] };
}

describe('runAgent', () => {
  it('executes multiple tool calls across rounds until the agent finishes', async () => {
    const llm = new ScriptedLlm([
      callResp([toolCall('1', 'read_page', { page: 'home' })]),
      callResp([toolCall('2', 'update_post', { page: 'home', title: 'New' })]),
      doneResp('Done'),
    ]);
    const executor = new RecordingExecutor();

    const result = await runAgent(llm, executor, { systemPrompt: 's', userPrompt: 'u', maxRounds: 5 });

    expect(executor.calls).toEqual([
      { name: 'read_page', args: { page: 'home' } },
      { name: 'update_post', args: { page: 'home', title: 'New' } },
    ]);
    expect(result.toolCalls).toBe(2);
    expect(result.finalContent).toBe('Done');
    expect(result.halted).toBe(false);
  });

  it('feeds tool results back to the model as tool messages', async () => {
    const llm = new ScriptedLlm([
      callResp([toolCall('1', 'read_page', { page: 'home' })]),
      doneResp('final'),
    ]);
    const executor = new RecordingExecutor();

    await runAgent(llm, executor, { systemPrompt: 's', userPrompt: 'u', maxRounds: 5 });
    expect(executor.calls).toHaveLength(1);
  });

  it('halts when the round budget is exhausted', async () => {
    const llm = new ScriptedLlm([callResp([toolCall('1', 'read_page', { page: 'home' })])]);
    const executor = new RecordingExecutor();

    const result = await runAgent(llm, executor, { systemPrompt: 's', userPrompt: 'u', maxRounds: 1 });
    expect(result.halted).toBe(true);
    expect(result.toolCalls).toBe(1);
  });
});
