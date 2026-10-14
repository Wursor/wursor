import type { Metadata } from 'next';
import { ActivityRoute } from '../../../src/activity/ActivityRoute.tsx';
import type { ActivityState } from '../../../src/activity/ActivityScreen.tsx';
import type { Kind } from '../../../src/activity/data.ts';

export const metadata: Metadata = { title: 'Activity' };

const pick = <T extends string>(v: string | undefined, all: readonly T[]): T | undefined => all.find((a) => a === v);

/** Activity. ?state=feed|loading|empty|error|offline, ?scope=all, ?filter=published|checks|copies|moves|decisions, ?q=… and ?open=pub1 open each moment. */
export default async function ActivityPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const q = await searchParams;
  const filter = pick<Kind>(q.filter, ['published', 'checks', 'copies', 'moves', 'decisions']);
  return (
    <ActivityRoute
      state={pick<ActivityState>(q.state, ['feed', 'loading', 'empty', 'error', 'offline']) ?? 'feed'}
      scope={q.scope === 'all' ? 'all' : 'site'}
      {...(filter ? { initialFilter: filter } : {})}
      {...(q.q ? { initialQuery: q.q } : {})}
      {...(q.open ? { initialOpen: q.open } : {})}
    />
  );
}
