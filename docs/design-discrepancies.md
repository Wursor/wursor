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
| D1 | Section D, Connect your web address | Provider control "How to do this at" has GoDaddy, Namecheap and Cloudflare, with no instructions shown under it | Same: the control only changes the selected provider; no per-provider steps are invented | Awaiting designed copy for each provider |
| D2 | Section D, copy button | Icon only, no copied state | The icon swaps to a tick and the label reads "Copied" for two seconds | Confirms the copy worked, matching the pairing code Copy button |
| D3 | Section D, stand-in behaviour | DNS check, securing and the switch are all real in the product | Timed stand-ins (`?scenario=wrong-record` shows the wrong-record state) | Backend is out of scope for this pass |
| 5a | Sections 5 and 6, stand-in behaviour | The first scan and the changes it suggests come from the real site | Timed demo scan (`/start/look?access=content` for the Content only run) and fixed suggestions (`/start/first-change?access=content`); "Start this change" goes to `/workspace`, which is built with the workspace sections | Backend is out of scope for this pass |
| W1 | Workspace, board lanes (Wa, We) | Lane widths differ (154.7, 216, 154.7, 154.7): the Plan ready lane keeps the 216 px width of the Board Card's default | Four equal lanes, as in Wb and 7a; the strip is 21 px shorter in Wa and We | Looks like a component default leaking into the frame, not an intent |
| W2 | Workspace, mobile frames | No approval bar on the phone in Ready, Publishing or Published; the compare slider is clipped; proof photos are cropped | Publish sits in the conversation header as designed; the approval bar is hidden on a phone, so progress and Undo show only on desktop; the compare slider and proof photos are shown whole | A phone owner has no Undo; worth a designer's decision |
| W3 | Workspace, preview marker on a phone | A "Phone number" marker is drawn off the right edge of the stage | Not drawn; the marker follows the element it marks on desktop only | Looks like a stray copy of the desktop marker |
| W4 | Workspace, top bar on a phone | A 44 px status bar and a home indicator are part of each phone frame | Not drawn: the operating system supplies them | Device chrome, not product UI |
| W5 | Workspace, Plan card steps on a phone | Step numbers hug their width, so text starts 18 or 21 px in | Numbers have a fixed 14 px column, so text starts 26 px in on every row | One alignment on every row |
| W6 | Workspace, guided tour | The tour arrow on the "You decide" step floats 19 px below the card | The arrow touches the card | Cleaner; same position within 2 px |
| W7 | Workspace, stand-in behaviour | Everything is real | A timed demo: `/workspace` plays plan, working, a question, review, publishing, live. `?phase=` opens one moment; `?tour=1..4` opens the tour; `/workspace/site` is a new site ready to publish | Backend is out of scope for this pass |
