import type { Metadata } from 'next';
import type { Density } from '../../../src/product/ConversationPanel.tsx';
import type { PreviewView } from '../../../src/product/PreviewToolbar.tsx';
import { PHASES, type Phase } from '../../../src/workspace/scenario.ts';
import { WorkspaceApp } from '../../../src/workspace/WorkspaceApp.tsx';

export const metadata: Metadata = { title: 'Make phone number tappable' };

const pick = <T extends string>(v: string | undefined, all: readonly T[]): T | undefined => all.find((a) => a === v);

/**
 * The workspace. With no query it plays the whole life of a change from the plan.
 * ?phase=plan|working|needs-you|ready|publishing|published opens that moment, still;
 * ?density=headline|steps|everything and ?view=preview|compare|proof set the rest;
 * ?tour=1..4 opens the guided tour at that step.
 */
export default async function WorkspacePage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const q = await searchParams;
  const tour = pick(q.tour, ['1', '2', '3', '4'] as const);
  const phase = tour ? (tour === '4' ? 'ready' : 'working') : pick<Phase>(q.phase, PHASES);
  return (
    <WorkspaceApp
      initialPhase={phase ?? 'plan'}
      initialDensity={pick<Density>(q.density, ['headline', 'steps', 'everything']) ?? 'steps'}
      {...(pick<PreviewView>(q.view, ['preview', 'compare', 'proof']) ? { initialView: pick<PreviewView>(q.view, ['preview', 'compare', 'proof'])! } : {})}
      {...(tour ? { tourStep: Number(tour) as 1 | 2 | 3 | 4 } : {})}
      autoplay={!phase}
    />
  );
}
