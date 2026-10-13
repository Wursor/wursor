# Design discrepancies

Places where the Figma file ("Wursor - weown.net", page Product Design) and an existing decision or another frame disagree. Each says what the code does today, so a designer or product owner can settle it.

| # | Where | What the design shows | What the code does | Why |
|---|---|---|---|---|
| 1 | Tokens, secondary and tertiary text | `#6b675e` and `#8f8b80` (light), `#8f8b80` and `#6b675e` (dark) | `#5e5a52` and `#706c64` (light), `#aaa59a` and `#918d83` (dark) | ADR 0023 darkens them to pass WCAG AA (PX-12). Everything built from Figma uses the AA values, so text is slightly stronger than in the frames. |
| 2 | 1h · Sign in, sending code | Heading flips to "What's your email?" and "We'll send you a code. No password to remember." | "Welcome back" and "Enter your email and we'll send you a code to sign in." throughout sign in | 1f and 1g both say "Welcome back"; the copy changing on submit looks like a copy-and-paste slip. |
| 3 | 2h · Sign in, checking code | Omits "Entering it signs you in." | Shows that sentence on every sign-in code screen | 2g, 2i and 2j include it. |
| 4 | Code format | "eight-digit code", digit boxes | Digits only, numeric keyboard | PRD and ADR 0019 say "8-character code". If letters are allowed, the boxes and copy need to change. |
| 5 | Mobile frames | Include the phone status bar (44px) and home indicator | Not built; the header sits at the top of the page, below the device's own safe area | Those are device chrome, not page content. |
| 6 | Mobile buttons | Labels fill the button and sit left of centre | Same | Matches the frames; flagged because desktop centres them. |
| 7 | Settings T2 | A dark T2 frame (`62:8721`) sits inside the light Settings section | Counted as the dark version of T2 | Dark T2 also exists in the dark section. |
| 8 | Design-to-code export | Focus ring is a 2px spread in the Figma style "Focus/Ring"; the exported code drops the spread | 1px accent border plus a 2px ring | Matches the style, not the export. |
