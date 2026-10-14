import type { Metadata } from 'next';
import { MoreScreen } from '../../../src/mobile/MoreScreen.tsx';

export const metadata: Metadata = { title: 'More' };
export default function Page() {
  return <MoreScreen />;
}
