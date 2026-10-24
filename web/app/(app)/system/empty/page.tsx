import type { Metadata } from 'next';
import { EmptySpec } from '../../../../src/system/Showcases.tsx';

export const metadata: Metadata = { title: 'Empty states' };
export default function Page() {
  return <EmptySpec />;
}
