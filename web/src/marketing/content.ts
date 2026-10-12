export type NavLink = { label: string; mobileLabel?: string; href: string };

export const NAV_LINKS: readonly NavLink[] = [
  { label: 'Product', href: '/product' },
  { label: 'How it works', href: '/how-it-works' },
  { label: 'Trust', mobileLabel: 'Trust and safety', href: '/trust' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Docs', href: '/docs' },
];

export const ROUTES = {
  signUp: '/signup',
  signIn: '/signin',
} as const;

/** A footer item with no `href` is a page that is not built yet (PRD D-HL-17). */
export type FooterItem = { label: string; href?: string };
export type FooterColumn = { heading: string; items: readonly FooterItem[] };

export const FOOTER_COLUMNS: readonly FooterColumn[] = [
  {
    heading: 'Product',
    items: [
      { label: 'Overview', href: '/product' },
      { label: 'How it works', href: '/how-it-works' },
      { label: 'Trust and safety', href: '/trust' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Changelog' },
    ],
  },
  {
    heading: 'Company',
    items: [{ label: 'About' }, { label: 'Customers' }, { label: 'Careers' }, { label: 'Contact' }],
  },
  {
    heading: 'Resources',
    items: [{ label: 'Docs', href: '/docs' }, { label: 'Blog' }, { label: 'Examples' }, { label: 'Status' }],
  },
  {
    heading: 'Legal',
    items: [{ label: 'Terms' }, { label: 'Privacy' }, { label: 'Security' }, { label: 'Cookies' }],
  },
];

export const TAGLINE = 'Your website, handled.';
