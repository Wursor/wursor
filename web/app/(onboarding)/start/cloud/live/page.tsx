import type { Metadata } from 'next';
import { SetupScreen } from '../../../../../src/onboarding/AuthScreens.tsx';

export const metadata: Metadata = { title: 'Setting up your site' };

export default function LivePage() {
  return <SetupScreen />;
}
