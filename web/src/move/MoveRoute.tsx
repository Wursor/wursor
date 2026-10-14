'use client';

import { useRouter } from 'next/navigation';
import { MoveFlow, type MovePhase } from './MoveFlow.tsx';

type Props = { direction: 'out' | 'in'; scenario?: 'ok' | 'problem'; access?: 'full' | 'content'; initialPhase?: MovePhase };

/** Moving a site wired to the rest of the app: cancelling goes back to the site, finishing goes to its workspace. */
export function MoveRoute({ direction, scenario, access, initialPhase }: Props) {
  const router = useRouter();
  return (
    <MoveFlow
      direction={direction}
      {...(scenario ? { scenario } : {})}
      {...(access ? { access } : {})}
      {...(initialPhase ? { initialPhase } : {})}
      onDone={() => router.push('/workspace')}
      onCancel={() => router.push('/sites/harbor-bakery?tab=where&host=cloud')}
      onSaveAndExit={() => router.push('/home')}
    />
  );
}
