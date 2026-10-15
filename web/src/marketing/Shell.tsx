import type { ReactNode } from 'react';
import { Footer } from './Footer.tsx';
import { Nav } from './Nav.tsx';

/** Navigation, the page, and the footer. Every marketing page is wrapped in this. */
export function Shell({ children, page = false }: { children: ReactNode; /** Inner pages use a tighter rhythm than the home page. */ page?: boolean }) {
  return (
    <>
      <Nav />
      <main className={page ? 'm-page' : undefined}>{children}</main>
      <Footer />
    </>
  );
}
