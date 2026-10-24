import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { MovePhase } from '../../../../src/move/MoveFlow.tsx';
import { MoveRoute } from '../../../../src/move/MoveRoute.tsx';

export const metadata: Metadata = { title: 'Move your site' };

const PHASES: readonly MovePhase[] = ['choose', 'gate', 'what', 'copying', 'ready', 'review', 'moved', 'hosted', 'problem'];

/**
 * Moving a site. /move/out takes a Cloud site to your own WordPress; /move/in hosts a WordPress site on Wursor Cloud.
 * ?scenario=problem stops the copy before switching; ?access=content asks for full access first;
 * ?state=choose|gate|what|copying|ready|review|moved|hosted|problem opens one screen.
 */
export default async function MovePage({ params, searchParams }: { params: Promise<{ direction: string }>; searchParams: Promise<Record<string, string | undefined>> }) {
  const { direction } = await params;
  if (direction !== 'out' && direction !== 'in') notFound();
  const q = await searchParams;
  const initialPhase = PHASES.find((p) => p === q.state);
  return (
    <MoveRoute
      direction={direction}
      {...(q.scenario === 'problem' ? { scenario: 'problem' as const } : {})}
      {...(q.access === 'content' ? { access: 'content' as const } : {})}
      {...(initialPhase ? { initialPhase } : {})}
    />
  );
}
