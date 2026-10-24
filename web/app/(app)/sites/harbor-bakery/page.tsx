import type { Metadata } from 'next';
import { SiteDetail, type DetailHost, type DetailTab } from '../../../../src/sites/SiteDetail.tsx';

export const metadata: Metadata = { title: 'Harbor Bakery' };

/** One site. ?tab=overview|changes|where|settings and ?host=wordpress|cloud|content|preview open each moment. */
export default async function SiteDetailPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const q = await searchParams;
  const tab = (['overview', 'changes', 'where', 'settings'] as const).find((t) => t === q.tab) ?? 'overview';
  const host = (['wordpress', 'cloud', 'content', 'preview'] as const).find((h) => h === q.host) ?? 'wordpress';
  return <SiteDetail tab={tab satisfies DetailTab} host={host satisfies DetailHost} />;
}
