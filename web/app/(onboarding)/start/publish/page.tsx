import type { Metadata } from 'next';
import { PublishScreen } from '../../../../src/onboarding/AuthScreens.tsx';

export const metadata: Metadata = { title: 'Publishing to your WordPress' };

export default function PublishPage() {
  return <PublishScreen />;
}
