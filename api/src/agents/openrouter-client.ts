import { generateToolSchemas } from './tool-schemas.ts';
import type { LlmClient, LlmMessage, LlmResponse } from './llm-client.ts';

export type OpenRouterOptions = {
  apiKey: string;
  model?: string;
};

export class OpenRouterLlmClient implements LlmClient {
  constructor(private readonly opts: OpenRouterOptions) {}

  async complete(messages: LlmMessage[]): Promise<LlmResponse> {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.opts.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://wursor.dev',
        'X-Title': 'Wursor',
      },
      body: JSON.stringify({
        model: this.opts.model ?? 'x-ai/grok-4.6',
        messages,
        tools: generateToolSchemas(),
      }),
    });
    if (!res.ok) {
      throw new Error(`LLM HTTP ${res.status}`);
    }
    return (await res.json()) as LlmResponse;
  }
}
