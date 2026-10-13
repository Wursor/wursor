'use client';

import { useRouter } from 'next/navigation';
import { AuthFlow } from './AuthFlow.tsx';
import { useState } from 'react';
import { AboutSiteStep } from './AboutSiteStep.tsx';
import { ChoosePlatformStep } from './ChoosePlatformStep.tsx';
import { ChooseWpSiteStep } from './ChooseWpSiteStep.tsx';
import { ConnectProblemStep } from './ConnectProblemStep.tsx';
import { WpPermissionsStep } from './WpPermissionsStep.tsx';
import { WpWaitingStep } from './WpWaitingStep.tsx';
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

/** The connect path starts by asking where the site is: WordPress.com signs in; anywhere else enters an address. */
export function ChoosePlatformScreen() {
  const router = useRouter();
  return (
    <ChoosePlatformStep
      onContinue={(p) => router.push(p === 'wpcom' ? '/start/connect/wordpress-com' : '/start/connect/address')}
      onBack={() => router.back()}
      onSaveAndExit={() => router.push('/')}
    />
  );
}

/** Sites the stand-in "WordPress.com" account has. The real list comes from the sign-in. */
const DEMO_WP_SITES = [
  { id: 'harborbakery.com', name: 'harborbakery.com', detail: 'Business plan · Full access likely' },
  { id: 'harborbakery.wordpress.com', name: 'harborbakery.wordpress.com', detail: 'Free plan · Content only likely' },
  { id: 'bakeryclub.blog', name: 'bakeryclub.blog', detail: 'Personal plan · Content only likely' },
];

type WpPhase = 'permissions' | 'waiting' | 'choose' | 'closed';

/** Sign in with WordPress.com: permissions, the open window, choosing a site. `?outcome=closed` shows the closed-window problem. */
export function WordPressComScreen({ outcome = 'approved' }: { outcome?: 'approved' | 'closed' }) {
  const router = useRouter();
  const [phase, setPhase] = useState<WpPhase>('permissions');
  const exit = () => router.push('/');
  if (phase === 'permissions') return <WpPermissionsStep onContinue={() => setPhase('waiting')} onBack={() => router.back()} onSaveAndExit={exit} />;
  if (phase === 'waiting')
    return (
      <WpWaitingStep
        outcome={outcome}
        onApproved={() => setPhase('choose')}
        onClosed={() => setPhase('closed')}
        onBack={() => setPhase('permissions')}
        onSaveAndExit={exit}
      />
    );
  if (phase === 'closed')
    return (
      <ConnectProblemStep
        heading="We could not finish connecting"
        subheading="Nothing was connected and your site is unchanged."
        icon="lock"
        title="The WordPress.com window was closed"
        body="Nothing was connected and your site is unchanged. Try again and approve the permissions on WordPress.com."
        primary="Try again"
        onPrimary={() => setPhase('permissions')}
        secondary="Ask a person"
        onSecondary={() => router.push('/docs')}
        onSaveAndExit={exit}
      />
    );
  return <ChooseWpSiteStep sites={DEMO_WP_SITES} onContinue={() => router.push('/start/connect/done')} onBack={() => setPhase('waiting')} onSaveAndExit={exit} />;
}
