'use client';

import { useRouter } from 'next/navigation';
import { SystemScreen, type SystemKind } from './SystemScreen.tsx';

const NEXT: Record<SystemKind, string> = {
  'content-only': '/sites/harbor-bakery',
  error: '/home',
  limit: '/settings/billing',
  session: '/signin',
  maintenance: '/system/maintenance',
  'not-found': '/home',
  unreachable: '/sites/harbor-bakery',
  loading: '/home',
};

/** A system screen whose button goes where its label says. */
export function SystemRoute({ kind }: { kind: SystemKind }) {
  const router = useRouter();
  return <SystemScreen kind={kind} onAction={() => router.push(NEXT[kind])} />;
}
