import type { Metadata } from 'next';
import { ForkScreen } from '../../../src/onboarding/AuthScreens.tsx';

export const metadata: Metadata = { title: 'Where should your site live?' };

export default function StartPage() {
  return <ForkScreen />;
}
