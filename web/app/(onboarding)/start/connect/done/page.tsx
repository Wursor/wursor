import type { Metadata } from 'next';
import { ConnectedScreen } from '../../../../../src/onboarding/AuthScreens.tsx';

export const metadata: Metadata = { title: 'You’re connected' };

export default function ConnectDonePage() {
  return <ConnectedScreen />;
}
