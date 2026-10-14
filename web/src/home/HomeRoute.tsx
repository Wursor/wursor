'use client';

import { useRouter } from 'next/navigation';
import { HomeScreen, type HomeHost, type HomeVariant } from './HomeScreen.tsx';

/** Home wired to the rest of the app: each button goes where its label says. */
export function HomeRoute({ variant, host, part, sheet }: { variant: HomeVariant; host: HomeHost; part: 'morning' | 'afternoon'; sheet?: 'sites' | 'notifications' | undefined }) {
  const router = useRouter();
  const toWorkspace = () => router.push('/workspace');
  return (
    <HomeScreen
      variant={variant}
      host={host}
      part={part}
      sheet={sheet}
      onContinue={() => router.push(host === 'cloud' ? '/start/domain' : '/start/first-change')}
      onNewChange={toWorkspace}
      onAnswer={() => router.push('/workspace?phase=needs-you')}
      onLook={() => router.push('/workspace?phase=ready')}
      onFix={toWorkspace}
      onSeeAll={() => router.push('/board')}
      onOpenActivity={() => router.push('/activity')}
    />
  );
}
