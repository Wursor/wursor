'use client';

import { useRouter } from 'next/navigation';
import { AuthFlow } from './AuthFlow.tsx';
import { AboutSiteStep } from './AboutSiteStep.tsx';
import { ForkStep, type Path } from './ForkStep.tsx';
import { PickLookStep } from './PickLookStep.tsx';
import { SetupStep } from './SetupStep.tsx';
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

/** Each starting path has its own run of steps (sections A, B0 and C of the design). */
const PATH_ROUTE: Record<Path, string> = { cloud: '/start/cloud', connect: '/start/connect', build: '/start/build' };

export function ForkScreen() {
  const router = useRouter();
  return <ForkStep onContinue={(p) => router.push(PATH_ROUTE[p])} onBack={() => router.back()} onSaveAndExit={() => router.push('/')} />;
}

/** The Cloud path: brief, pick a look, the first build (the workspace), then go live. */
export function AboutSiteScreen() {
  const router = useRouter();
  return <AboutSiteStep onContinue={() => router.push('/start/cloud/look')} onBack={() => router.back()} onSaveAndExit={() => router.push('/')} />;
}

export function PickLookScreen() {
  const router = useRouter();
  return <PickLookStep onContinue={() => router.push('/start/cloud/build')} onBack={() => router.back()} onSaveAndExit={() => router.push('/')} />;
}

export function SetupScreen() {
  const router = useRouter();
  return (
    <SetupStep
      siteName="Harbor Bakery"
      address="harborbakery.wursor.site"
      onConnectDomain={() => router.push('/start/domain')}
      onLater={() => router.push('/home')}
      onSaveAndExit={() => router.push('/')}
    />
  );
}
