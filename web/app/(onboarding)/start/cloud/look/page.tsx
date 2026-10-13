import type { Metadata } from 'next';
import { PickLookScreen } from '../../../../../src/onboarding/AuthScreens.tsx';

export const metadata: Metadata = { title: 'Pick a look' };

export default function LookPage() {
  return <PickLookScreen />;
}
