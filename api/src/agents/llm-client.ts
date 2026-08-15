export type LlmToolCall = {
  id: string;
  type: 'function';
  function: { name: string; arguments: string };
};

export type LlmMessage = {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string | null;
  tool_calls?: LlmToolCall[];
  tool_call_id?: string;
  name?: string;
};

export type LlmResponse = {
  choices: Array<{
    message: { role: 'assistant'; content: string | null; tool_calls?: LlmToolCall[] };
  }>;
};

export interface LlmClient {
  complete(messages: LlmMessage[]): Promise<LlmResponse>;
}
