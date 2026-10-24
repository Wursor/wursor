import type { Metadata } from 'next';
import { WordPressComScreen } from '../../../../../src/onboarding/AuthScreens.tsx';

export const metadata: Metadata = { title: 'Sign in with WordPress.com' };

export default async function WordPressComPage({ searchParams }: { searchParams: Promise<{ outcome?: string }> }) {
  const { outcome } = await searchParams;
  return <WordPressComScreen outcome={outcome === 'closed' ? 'closed' : 'approved'} />;
}
