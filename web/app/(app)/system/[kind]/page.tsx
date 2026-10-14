import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SystemRoute } from '../../../../src/system/SystemRoute.tsx';
import type { SystemKind } from '../../../../src/system/SystemScreen.tsx';

export const metadata: Metadata = { title: 'System states' };
const KINDS: readonly SystemKind[] = ['content-only', 'error', 'limit', 'session', 'maintenance', 'not-found', 'unreachable', 'loading'];

/** Each unusual-moment screen, opened by name: /system/error, /system/limit, /system/session and so on. */
export default async function SystemPage({ params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params;
  const found = KINDS.find((k) => k === kind);
  if (!found) notFound();
  return <SystemRoute kind={found} />;
}
