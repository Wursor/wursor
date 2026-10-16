import type { Metadata } from 'next';
import { SupportScreen } from '../../../src/help/HelpScreens.tsx';

export const metadata: Metadata = { title: 'Contact support' };
export default function Page() {
  return <SupportScreen />;
}
