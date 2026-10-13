'use client';

import { useRouter } from 'next/navigation';
import { AuthFlow } from './AuthFlow.tsx';

/** Where each flow goes once the visitor is in. New accounts name their workspace; returning users go straight to Home. */
const AFTER_SIGN_UP = '/signup/workspace';
const AFTER_SIGN_IN = '/home';

export function SignUpScreen() {
  const router = useRouter();
  const next = () => router.push(AFTER_SIGN_UP);
  return <AuthFlow mode="signup" onVerified={next} onGoogleDone={next} />;
}

export function SignInScreen() {
  const router = useRouter();
  const next = () => router.push(AFTER_SIGN_IN);
  return <AuthFlow mode="signin" onVerified={next} onGoogleDone={next} />;
}
