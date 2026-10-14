import type { Metadata } from 'next';
import { SitesRoute } from '../../../src/sites/SitesRoute.tsx';
import type { SitesVariant } from '../../../src/sites/SitesScreen.tsx';

export const metadata: Metadata = { title: 'Sites' };

/** Sites. ?state=one|many|empty opens each moment; with none it shows the one site. */
export default async function SitesPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const { state } = await searchParams;
  const variant = (['one', 'many', 'empty'] as const).find((v) => v === state) ?? 'one';
  return <SitesRoute variant={variant satisfies SitesVariant} />;
}
