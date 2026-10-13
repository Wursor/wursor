import type { Metadata } from 'next';
import { ConnectSiteScreen } from '../../../../src/onboarding/AuthScreens.tsx';

export const metadata: Metadata = { title: 'Connect your WordPress' };

export default async function BuildPage({ searchParams }: { searchParams: Promise<{ scenario?: string }> }) {
  const { scenario } = await searchParams;
  return <ConnectSiteScreen scenario={scenario} purpose="build" />;
}
