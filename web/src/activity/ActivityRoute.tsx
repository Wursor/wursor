'use client';

import { useRouter } from 'next/navigation';
import { ActivityScreen } from './ActivityScreen.tsx';

/** Activity wired to the rest of the app: asking for a change opens the workspace. */
export function ActivityRoute(props: Omit<React.ComponentProps<typeof ActivityScreen>, 'onAskForChange'>) {
  const router = useRouter();
  return <ActivityScreen {...props} onAskForChange={() => router.push('/workspace')} />;
}
