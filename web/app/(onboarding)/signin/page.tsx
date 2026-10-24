import type { Metadata } from 'next';
import { SignInScreen } from '../../../src/onboarding/AuthScreens.tsx';

export const metadata: Metadata = { title: 'Sign in' };

export default function SignInPage() {
  return <SignInScreen />;
}
