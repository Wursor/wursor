import type { Metadata } from 'next';
import { DomainScreen } from '../../../../src/onboarding/AuthScreens.tsx';
import type { DomainScenario } from '../../../../src/onboarding/DomainFlow.tsx';

export const metadata: Metadata = { title: 'Connect your web address' };

export default async function DomainPage({ searchParams }: { searchParams: Promise<{ scenario?: string }> }) {
  const { scenario } = await searchParams;
  return <DomainScreen scenario={scenario === 'wrong-record' ? ('wrong-record' satisfies DomainScenario) : undefined} />;
}
