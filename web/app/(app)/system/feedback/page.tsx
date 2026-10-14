import type { Metadata } from 'next';
import { MobileFeedbackSpec } from '../../../../src/system/Showcases.tsx';

export const metadata: Metadata = { title: 'Feedback on mobile' };
export default function Page() {
  return <MobileFeedbackSpec />;
}
