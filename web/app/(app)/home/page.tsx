import type { Metadata } from 'next';
import type { HomeHost, HomeVariant } from '../../../src/home/HomeScreen.tsx';
import { HomeRoute } from '../../../src/home/HomeRoute.tsx';

export const metadata: Metadata = { title: 'Home' };

const pick = <T extends string>(v: string | undefined, all: readonly T[]): T | undefined => all.find((a) => a === v);

/** Home. ?state=first-run|active|caught-up|problem and ?host=wordpress|cloud open each moment; with none it shows an active day. */
export default async function HomePage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const q = await searchParams;
  const variant = pick<HomeVariant>(q.state, ['first-run', 'active', 'caught-up', 'problem']) ?? 'active';
  const host = pick<HomeHost>(q.host, ['wordpress', 'cloud']) ?? 'wordpress';
  return <HomeRoute variant={variant} host={host} part={variant === 'active' || variant === 'first-run' ? 'morning' : 'afternoon'} />;
}
