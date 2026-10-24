import type { Metadata } from 'next';
import { SiteReview } from '../../../../src/workspace/SiteReview.tsx';

export const metadata: Metadata = { title: 'Build your site' };

/** A new site, built and ready for the owner to look over before it is published to their WordPress. */
export default function SiteReviewPage() {
  return <SiteReview />;
}
