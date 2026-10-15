# 23. Product UI is built once at design size and reused; text contrast tokens meet AA

- **Status:** Accepted
- **Date:** 2026-10-12

## Context

The marketing site shows the product (conversation, preview, board, approval) in four large mockups. The same screens become the app (PRD sections 15 and 26, PX-11: one component library, no one-off controls). Figma's generated code is absolutely positioned and uses Tailwind classes, and the mockups are drawn at several scales (the hero at 0.76, the Surfaces windows at 1.27, 1.08 and 1.39). Separately, two pairs of Figma tokens fail WCAG AA for small text, which PX-10 requires: secondary and tertiary text, and white text on the accent orange.

## Decision

1. **Build each product component once, at its design size (1x),** in `web/src/product/`, with plain CSS in `src/styles/product.css` that uses only the design tokens. No Tailwind. Marketing scales whole components with `Fit` (follows the container width) or `Zoom` (fixed ratio), in `src/ui/`. The app uses them unscaled.
2. **Icons** are the exact Figma SVG exports in `public/icons`, drawn with a CSS mask so their colour comes from the theme token (`src/ui/Icon.tsx`). The brand mark and the Wursor avatar need separate light and dark files because they have two colours.
3. **Sample content** is one fictional site, Harbor Bakery (`harbor-bakery.ts`), as in the design. Real previews replace it in the app.
4. **Contrast.** `--color-text-secondary` and `--color-text-tertiary` are darker in light and lighter in dark than the Figma values, so every text pair is at least 4.5:1 (a test checks 24 pairs per theme). Chips and counters that carry text on the accent use a new `--color-accent-fill` (`#c24a08` in light) instead of `--color-accent-default` (`#e8590c`, white on it is 3.6:1). The dark link blue is lightened. The design file should adopt these values.
5. **Claims.** Plan names, prices and allowances stay out of the marketing site until decided (PRD D-HL-8, PX-13): `PRICING_CONFIRMED` is false and the pricing section says so. FAQ answers other than the first are drafted from the PRD and flagged in `content.ts` for review.

### Options considered

- **One component set at 1x, scaled where needed (chosen).** One source of truth for the marketing mockups and the app.
- **Convert Figma's generated code per mockup.** Fast, but each mockup becomes its own fixed-pixel copy, and the app would need a second build of every screen.
- **Export the mockups as images.** Smallest, and not reusable. Rejected because the components are needed for the app.
- **Keep Figma's contrast values.** Faithful to the file, but fails PX-10.

### Rejected

- Tailwind: not in the stack, and the Figma output depends on it only as a convenience.
- Recolouring icons by editing the SVG files: they must stay exactly as exported.

## Consequences

- The product components are a library for the app screens in `IMPLEMENTATION.md` step H, and need tests as they grow (about 90 exist).
- Only the states that are designed exist so far. Not built: Composer states other than working, risk levels other than Everyday, check results other than passed, approval states other than ready, the phone device frame. The components say so where it applies.
- `Fit` measures the container in the browser, so the mockups reflow once after load.
- The design file should adopt the contrast values, and the dark link blue, so design and code agree.
