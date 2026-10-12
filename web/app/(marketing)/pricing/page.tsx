import type { Metadata } from 'next';
import { PricingContent } from '../../../src/marketing/pages/PricingContent.tsx';
import { Shell } from '../../../src/marketing/Shell.tsx';

export const metadata: Metadata = { title: 'Pricing' };

export default function PricingPage() {
  return (
    <Shell page>
      <PricingContent />
    </Shell>
  );
}
