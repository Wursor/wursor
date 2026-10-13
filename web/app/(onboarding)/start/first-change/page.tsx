import type { Metadata } from 'next';
import { FirstChangeScreen } from '../../../../src/onboarding/AuthScreens.tsx';

export const metadata: Metadata = { title: 'Pick a first change' };

export default async function FirstChangePage({ searchParams }: { searchParams: Promise<{ access?: string }> }) {
  const { access } = await searchParams;
  return <FirstChangeScreen access={access === 'content' ? 'content' : 'full'} />;
}
