export function mediaProxyTarget(origin: string, path: string): string {
  return `${origin}${path}`;
}

export function resolveMediaPath(origin: string, path: string, staged: ReadonlySet<string>): string {
  return staged.has(path) ? path : mediaProxyTarget(origin, path);
}

export function stageReplacement(_origin: string, path: string, _bytes: number): { copiedPaths: string[] } {
  return { copiedPaths: [path] };
}
