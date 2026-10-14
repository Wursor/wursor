'use client';

import { useRouter } from 'next/navigation';
import { BoardScreen } from './BoardScreen.tsx';

/** The board wired to the rest of the app: a started change opens in the workspace. */
export function BoardRoute(props: Omit<React.ComponentProps<typeof BoardScreen>, 'onStart'>) {
  const router = useRouter();
  return <BoardScreen {...props} onStart={() => router.push('/workspace')} />;
}
