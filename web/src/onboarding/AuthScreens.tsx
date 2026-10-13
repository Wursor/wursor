'use client';

import { useRouter } from 'next/navigation';
import { AuthFlow } from './AuthFlow.tsx';
import { WorkspaceStep } from './WorkspaceStep.tsx';

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

/** Where the setup steps go next. Skipping a step keeps what was typed out of the account but moves on. */
const NEXT_AFTER_WORKSPACE = '/start';

export function WorkspaceScreen() {
  const router = useRouter();
  const next = () => router.push(NEXT_AFTER_WORKSPACE);
  return <WorkspaceStep onContinue={next} onSkip={next} onBack={() => router.back()} onSaveAndExit={() => router.push('/')} />;
}
