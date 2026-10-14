'use client';

import { useRouter } from 'next/navigation';
import { WorkspaceApp } from './WorkspaceApp.tsx';

/** The workspace at the moment a new site is ready; approving carries on into the publish screens. */
export function SiteReview() {
  const router = useRouter();
  return <WorkspaceApp variant="site" initialPhase="ready" initialView="preview" onApprove={() => router.push('/start/publish')} />;
}
