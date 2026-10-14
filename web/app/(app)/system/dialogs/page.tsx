import type { Metadata } from 'next';
import { FeedbackSpec } from '../../../../src/system/Showcases.tsx';

export const metadata: Metadata = { title: 'Toasts and dialogs' };
export default function Page() {
  return <FeedbackSpec />;
}
