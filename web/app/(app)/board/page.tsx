import type { Metadata } from 'next';
import { BoardRoute } from '../../../src/board/BoardRoute.tsx';
import type { BoardState } from '../../../src/board/BoardScreen.tsx';

export const metadata: Metadata = { title: 'Board' };

const pick = <T extends string>(v: string | undefined, all: readonly T[]): T | undefined => all.find((a) => a === v);

/**
 * The board. ?state=board|empty|loading|offline|nothing-matches, ?scope=all, ?view=board|list|calendar,
 * ?open=phone opens a change, ?composer=1 opens the new-change dialog, ?drag=1 shows a card mid-drag.
 */
export default async function BoardPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const q = await searchParams;
  const view = pick(q.view, ['board', 'list', 'calendar'] as const);
  return (
    <BoardRoute
      state={pick<BoardState>(q.state, ['board', 'empty', 'loading', 'offline', 'nothing-matches']) ?? 'board'}
      scope={q.scope === 'all' ? 'all' : 'site'}
      {...(view ? { initialView: view } : {})}
      {...(q.open ? { initialOpen: q.open } : {})}
      {...(q.composer ? { initialComposer: true } : {})}
      {...(q.drag ? { dragDemo: true } : {})}
    />
  );
}
