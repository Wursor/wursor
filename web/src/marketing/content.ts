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

/**
 * Plan names, prices and allowances are placeholders until decided (PRD D-HL-8, D-HL-14).
 * PX-13: the marketing site shows them only once they are approved. Flip this when they are.
 */
export const PRICING_CONFIRMED = false;

export type Plan = {
  name: string;
  price: string;
  allowance: string;
  featured?: boolean;
};

/** Draft numbers from the Figma design. Not shown while PRICING_CONFIRMED is false. */
export const PLANS: readonly Plan[] = [
  { name: 'Starter', price: '$19', allowance: '1 site · 50 changes a month' },
  { name: 'Studio', price: '$49', allowance: '5 sites · unlimited changes', featured: true },
  { name: 'Agency', price: '$149', allowance: '25 sites · team seats and client sharing' },
];

export const PLAN_FEATURES = [
  'Unlimited changes with approval',
  'Safe copy before every publish',
  'Proof for every change',
  'Undo for 30 days',
] as const;

export const EXAMPLES = [
  { title: 'Update the holiday hours', meta: 'Page · 2 min' },
  { title: 'Add a gluten-free menu', meta: 'Menu · 4 min' },
  { title: 'Fix the contact form', meta: 'Form · 3 min' },
  { title: 'Swap the homepage photo', meta: 'Media · 1 min' },
  { title: 'Publish a new blog post', meta: 'Post · 6 min' },
] as const;

/**
 * FAQ. The first answer is from the design. The rest are drafted from the PRD (sections 1.5, 2.2, 11.8 and 16)
 * for the product owner to review; they are not in the design yet.
 */
export const FAQ: ReadonlyArray<{ question: string; answer: string; open?: boolean }> = [
  {
    question: 'Will Wursor change my live site without asking?',
    answer: 'No. Every change is made on a safe copy first. Nothing goes live until you review the preview and approve it.',
    open: true,
  },
  {
    question: 'Do I need my own hosting?',
    answer:
      'No. You can start a new site on Wursor Cloud, connect a WordPress site you already have, or build here and publish to your own WordPress. You can move between them later.',
  },
  {
    question: 'Can I undo a change?',
    answer:
      'Yes. Every change has a way back, and the undo button stays in view after you publish. If a change cannot be fully undone, Wursor says so before you approve it.',
  },
  {
    question: 'Does it work with my theme and plugins?',
    answer:
      'Wursor works on a copy of your site, so anything unusual shows up in the preview and the checks, not on your live pages. It tells you what it could not check.',
  },
  {
    question: 'How is my site kept safe?',
    answer:
      'Changes are made on a copy, a backup is taken before anything is applied, and each approval is tied to the exact checks you saw. You can disconnect Wursor from your site at any time.',
  },
];
