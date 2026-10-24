'use client';

import { useRouter } from 'next/navigation';
import { BoardScreen } from './BoardScreen.tsx';

/** The board wired to the rest of the app: a change that starts now opens in the workspace; one added for later stays on the board. */
export function BoardRoute(props: Omit<React.ComponentProps<typeof BoardScreen>, 'onStart'>) {
  const router = useRouter();
  return <BoardScreen {...props} onStart={(c) => c.stage === 'working' && router.push('/workspace')} />;
}
