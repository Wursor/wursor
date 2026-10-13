import type { Metadata } from 'next';
import { SignUpScreen } from '../../../src/onboarding/AuthScreens.tsx';

export const metadata: Metadata = { title: 'Create your account' };

export default function SignUpPage() {
  return <SignUpScreen />;
}
