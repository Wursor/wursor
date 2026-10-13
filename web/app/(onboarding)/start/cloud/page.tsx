import type { Metadata } from 'next';
import { AboutSiteScreen } from '../../../../src/onboarding/AuthScreens.tsx';

export const metadata: Metadata = { title: 'Tell us about your site' };

export default function CloudPage() {
  return <AboutSiteScreen />;
}
