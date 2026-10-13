import type { Metadata } from 'next';
import { ScanScreen } from '../../../../src/onboarding/AuthScreens.tsx';

export const metadata: Metadata = { title: 'Wursor takes a look' };

export default async function LookPage({ searchParams }: { searchParams: Promise<{ access?: string }> }) {
  const { access } = await searchParams;
  return <ScanScreen access={access === 'content' ? 'content' : 'full'} />;
}
