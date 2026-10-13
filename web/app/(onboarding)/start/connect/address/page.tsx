import type { Metadata } from 'next';
import { ConnectSiteScreen } from '../../../../../src/onboarding/AuthScreens.tsx';

export const metadata: Metadata = { title: 'Connect your site' };

export default async function ConnectAddressPage({ searchParams }: { searchParams: Promise<{ scenario?: string }> }) {
  const { scenario } = await searchParams;
  return <ConnectSiteScreen scenario={scenario} />;
}
