export type ToolResult = {
  result: string;
};

export interface ToolExecutor {
  execute(name: string, args: Record<string, string>): Promise<ToolResult>;
}
