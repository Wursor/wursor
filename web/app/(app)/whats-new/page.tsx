import type { Metadata } from 'next';
import { WhatsNewScreen } from '../../../src/help/HelpScreens.tsx';

export const metadata: Metadata = { title: 'What is new' };
export default function Page() {
  return <WhatsNewScreen />;
}
