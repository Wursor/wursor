'use client';

import { useRouter } from 'next/navigation';
import { SitesScreen, type SitesVariant } from './SitesScreen.tsx';

/** The sites list wired to the rest of the app: adding a site starts the set-up. */
export function SitesRoute({ variant }: { variant: SitesVariant }) {
  const router = useRouter();
  return <SitesScreen variant={variant} onAddSite={() => router.push('/start')} />;
}
