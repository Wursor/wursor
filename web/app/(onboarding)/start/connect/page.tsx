import type { Metadata } from 'next';
import { ChoosePlatformScreen } from '../../../../src/onboarding/AuthScreens.tsx';

export const metadata: Metadata = { title: 'Where is your site?' };

export default function ConnectPage() {
  return <ChoosePlatformScreen />;
}
