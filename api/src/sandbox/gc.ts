export type SandboxStatus = 'running' | 'paused' | 'destroyed';

export type SandboxState = {
  status: SandboxStatus;
  lastActiveAt: number;
  createdAt: number;
};

export type GcAction = 'keep' | 'pause' | 'destroy';

export type GcOptions = {
  idleMs: number;
  hardMs: number;
};

export function decideGc(state: SandboxState, now: number, opts: GcOptions): GcAction {
  if (state.status === 'destroyed') {
    return 'keep';
  }
  if (now - state.createdAt >= opts.hardMs) {
    return 'destroy';
  }
  if (state.status === 'running' && now - state.lastActiveAt >= opts.idleMs) {
    return 'pause';
  }
  return 'keep';
}
